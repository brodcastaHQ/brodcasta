"""
SOMAL Middleware for WebSocket and SSE connections

Integrates JWT validation and permission management with connection channels.
"""

from typing import Optional, Dict, Any
from app.core.channels.base import BaseChannel
from app.core.channels.websocket import WebSocketChannel
from app.core.channels.sse import SSEChannel
from .jwt_validator import JWTValidator, JWTValidationError
from .permissions import PermissionManager
from models.projects import Project, AuthType


class SomalMiddleware:
    """
    Middleware to handle JWT validation and attach permissions to channels
    """
    
    def __init__(self):
        self.jwt_validator = JWTValidator()
    
    async def authenticate_channel(self, channel: BaseChannel, 
                                 token: str, project: Project) -> bool:
        """
        Authenticate channel using JWT token and attach permissions
        
        Args:
            channel: WebSocket or SSE channel
            token: JWT token string (can be None for auth_type=NONE)
            project: Project instance (already fetched)
            
        Returns:
            True if authentication successful, False otherwise
        """
       
        try:
            # Handle different auth types
            if project.auth_type == AuthType.NONE.value:
                # No authentication required - allow all operations
                self._attach_no_auth_permissions(channel, project)
                return True
            
            elif project.auth_type == AuthType.PUBLISHING_ONLY.value:
                # Publishing requires auth, subscribing is free for all
                if token:
                    # If token provided, validate and attach permissions
                    payload = await self.jwt_validator.validate_token(token, project)
                    permission_manager = PermissionManager(payload)
                    self._attach_publishing_only_permissions(channel, permission_manager, payload, project)
                else:
                    # No token - allow subscribe only
                    self._attach_publishing_only_permissions(channel, None, None, project)
                return True
            
            elif project.auth_type == AuthType.ALL.value:
                # Both publishing and subscribing require authentication
                if not token:
                    print(f"Token required for auth_type=ALL: {project.id}")
                    return False
                
                payload = await self.jwt_validator.validate_token(token, project)
                permission_manager = PermissionManager(payload)
                self._attach_permissions(channel, permission_manager, payload)
                return True
            
            else:
                print(f"Unknown auth_type: {project.auth_type}")
                return False
            
        except JWTValidationError as e:
            print(f"JWT validation failed: {e}")
            return False
        except Exception as e:
            print(f"Authentication error: {e}")
            return False
    
    def _attach_permissions(self, channel: BaseChannel, 
                          permission_manager: PermissionManager, 
                          payload: Dict[str, Any]):
        """
        Attach permission manager and JWT payload to channel
        
        Args:
            channel: Channel instance
            permission_manager: Permission manager instance
            payload: JWT payload
        """
        # Store permission manager on channel
        channel.somal_permissions = permission_manager
        channel.somal_payload = payload
        channel.somal_authenticated = True
        channel.somal_auth_type = AuthType.ALL
    
    def _attach_no_auth_permissions(self, channel: BaseChannel, project: Project):
        """
        Attach permissions for auth_type=NONE (no authentication required)
        
        Args:
            channel: Channel instance
            project: Project instance
        """
        # Create a permission manager that allows everything
        class NoAuthPermissionManager:
            def can_publish(self, room_name: str) -> bool:
                return True
            
            def can_subscribe(self, room_name: str) -> bool:
                return True
            
            def get_permissions_summary(self) -> Dict:
                return {
                    "project_id": str(project.id),
                    "auth_type": AuthType.NONE,
                    "permissions": "unrestricted"
                }
        
        channel.somal_permissions = NoAuthPermissionManager()
        channel.somal_payload = {"project_id": str(project.id)}
        channel.somal_authenticated = True
        channel.somal_auth_type = AuthType.NONE
    
    def _attach_publishing_only_permissions(self, channel: BaseChannel, 
                                          permission_manager: Optional[PermissionManager], 
                                          payload: Optional[Dict[str, Any]], 
                                          project: Project):
        """
        Attach permissions for auth_type=PUBLISHING_ONLY
        
        Args:
            channel: Channel instance
            permission_manager: Permission manager (may be None)
            payload: JWT payload (may be None)
            project: Project instance
        """
        class PublishingOnlyPermissionManager:
            def __init__(self, pm: Optional[PermissionManager]):
                self.permission_manager = pm
                self.project_id = str(project.id)
            
            def can_publish(self, room_name: str) -> bool:
                # Publishing requires valid permissions from JWT
                if self.permission_manager:
                    return self.permission_manager.can_publish(room_name)
                return False  # No token = no publishing rights
            
            def can_subscribe(self, room_name: str) -> bool:
                # Subscribing is free for all
                return True
            
            def get_permissions_summary(self) -> Dict:
                if self.permission_manager:
                    summary = self.permission_manager.get_permissions_summary()
                    summary["auth_type"] = AuthType.PUBLISHING_ONLY
                    summary["subscribe_policy"] = "unrestricted"
                    return summary
                else:
                    return {
                        "project_id": self.project_id,
                        "auth_type": AuthType.PUBLISHING_ONLY,
                        "publish_policy": "token_required",
                        "subscribe_policy": "unrestricted",
                        "permissions": "subscribe_only"
                    }
        
        channel.somal_permissions = PublishingOnlyPermissionManager(permission_manager)
        channel.somal_payload = payload or {"project_id": str(project.id)}
        channel.somal_authenticated = True
        channel.somal_auth_type = AuthType.PUBLISHING_ONLY
    
    async def check_room_permission(self, channel: BaseChannel, 
                                   room_name: str, action: str) -> bool:
        """
        Check if channel has permission for specific room and action
        
        Args:
            channel: Channel instance
            room_name: Room name
            action: 'publish' or 'subscribe'
            
        Returns:
            True if permission granted, False otherwise
        """
        # Check if channel is authenticated
        if not getattr(channel, 'somal_authenticated', False):
            return False
        
        # Get permission manager
        permission_manager = getattr(channel, 'somal_permissions', None)
        if not permission_manager:
            return False
        
        # Check specific permission
        if action == 'publish':
            return permission_manager.can_publish(room_name)
        elif action == 'subscribe':
            return permission_manager.can_subscribe(room_name)
        else:
            return False
    
    def get_channel_permissions(self, channel: BaseChannel) -> Optional[Dict]:
        """
        Get permission summary for channel
        
        Args:
            channel: Channel instance
            
        Returns:
            Permission summary dict or None if not authenticated
        """
        if not getattr(channel, 'somal_authenticated', False):
            return None
        
        permission_manager = getattr(channel, 'somal_permissions', None)
        if not permission_manager:
            return None
        
        return permission_manager.get_permissions_summary()
    
    def is_channel_authenticated(self, channel: BaseChannel) -> bool:
        """
        Check if channel is authenticated with SOMAL
        
        Args:
            channel: Channel instance
            
        Returns:
            True if authenticated, False otherwise
        """
        return getattr(channel, 'somal_authenticated', False)


# Global middleware instance
somal_middleware = SomalMiddleware()
