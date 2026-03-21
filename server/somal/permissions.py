"""
Room Permission Management for SOMAL module

Handles room-based permission validation and management.
"""

import re
from typing import Dict, List, Optional, Set
from dataclasses import dataclass


@dataclass
class RoomPermission:
    """Room permission configuration"""
    pattern: str
    publish: bool
    subscribe: bool
    is_regex: bool = False
    
    def __post_init__(self):
        """Initialize regex pattern if needed"""
        if self.pattern.startswith('^') or self.pattern.endswith('$') or any(c in self.pattern for c in '.*+?[]{}()|\\'):
            self.is_regex = True
            try:
                self.regex = re.compile(self.pattern)
            except re.error:
                # If regex is invalid, treat as literal string
                self.is_regex = False
                self.regex = None
        else:
            self.regex = None


class PermissionManager:
    """Manages room permissions based on JWT token payload"""
    
    def __init__(self, jwt_payload: Dict):
        """
        Initialize permission manager with JWT payload
        
        Args:
            jwt_payload: Decoded JWT token payload containing rooms configuration
        """
        self.jwt_payload = jwt_payload
        self.project_id = jwt_payload.get('project_id')
        self.room_permissions: List[RoomPermission] = []
        self._parse_rooms()
    
    def _parse_rooms(self):
        """Parse rooms configuration from JWT payload"""
        rooms_config = self.jwt_payload.get('rooms', {})
        
        for pattern, permissions in rooms_config.items():
            try:
                room_perm = RoomPermission(
                    pattern=pattern,
                    publish=permissions.get('publish', False),
                    subscribe=permissions.get('subscribe', False)
                )
                self.room_permissions.append(room_perm)
            except Exception as e:
                print(f"Error parsing room permission for pattern '{pattern}': {e}")
    
    def can_publish(self, room_name: str) -> bool:
        """
        Check if client can publish to the specified room
        
        Args:
            room_name: Name of the room to check
            
        Returns:
            True if publishing is allowed, False otherwise
        """
        return self._check_permission(room_name, 'publish')
    
    def can_subscribe(self, room_name: str) -> bool:
        """
        Check if client can subscribe to the specified room
        
        Args:
            room_name: Name of the room to check
            
        Returns:
            True if subscribing is allowed, False otherwise
        """
        return self._check_permission(room_name, 'subscribe')
    
    def _check_permission(self, room_name: str, action: str) -> bool:
        """
        Check permission for a specific room and action
        
        Args:
            room_name: Name of the room
            action: 'publish' or 'subscribe'
            
        Returns:
            True if action is allowed, False otherwise
        """
        # Check each room permission rule
        for room_perm in self.room_permissions:
            if room_perm.is_regex:
                # Regex pattern matching
                if room_perm.regex and room_perm.regex.match(room_name):
                    return getattr(room_perm, action, False)
            else:
                # Literal string matching
                if room_perm.pattern == room_name:
                    return getattr(room_perm, action, False)
                elif room_perm.pattern == ".*":  # Wildcard pattern
                    return getattr(room_perm, action, False)
        
        # Default: deny if no matching rule found
        return False
    
    def get_allowed_rooms(self, action: str) -> Set[str]:
        """
        Get all rooms where the specified action is allowed
        
        Args:
            action: 'publish' or 'subscribe'
            
        Returns:
            Set of room names where action is allowed
        """
        allowed_rooms = set()
        
        for room_perm in self.room_permissions:
            if getattr(room_perm, action, False):
                if room_perm.is_regex:
                    # For regex patterns, we can't easily determine all matching room names
                    # So we add the pattern itself as a reference
                    allowed_rooms.add(f"regex:{room_perm.pattern}")
                else:
                    allowed_rooms.add(room_perm.pattern)
        
        return allowed_rooms
    
    def get_permissions_summary(self) -> Dict:
        """
        Get a summary of all permissions
        
        Returns:
            Dict containing permission summary
        """
        summary = {
            "project_id": self.project_id,
            "permissions": []
        }
        
        for room_perm in self.room_permissions:
            perm_info = {
                "pattern": room_perm.pattern,
                "is_regex": room_perm.is_regex,
                "publish": room_perm.publish,
                "subscribe": room_perm.subscribe
            }
            summary["permissions"].append(perm_info)
        
        return summary
