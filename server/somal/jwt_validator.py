"""
JWT Token Validator for SOMAL module

Handles JWT token validation using project secret keys.
"""

import jwt
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from models.projects import Project


class JWTValidationError(Exception):
    """Custom exception for JWT validation errors"""
    pass


class JWTValidator:
    """JWT token validator for brodcasta projects"""
    
    def __init__(self):
        self.algorithm = "HS256"
    
    async def validate_token(self, token: str, project: Project) -> Dict[str, Any]:
        """
        Validate JWT token and return payload
        
        Args:
            token: JWT token string
            project_id: Project ID to get secret key
            
        Returns:
            Dict containing decoded payload
            
        Raises:
            JWTValidationError: If token is invalid or expired
        """
        # Get project to retrieve secret key
     
        
        secret_key = project.project_secret
        
        try:
            # Decode and validate token
            payload = jwt.decode(
                token,
                secret_key,
                algorithms=[self.algorithm]
            )
            
            # Check expiration
            if 'exp' in payload:
                exp_timestamp = payload['exp']
                if datetime.fromtimestamp(exp_timestamp, timezone.utc) < datetime.now(timezone.utc):
                    raise JWTValidationError("Token has expired")
            
            # Validate required fields
            if 'project_id' not in payload:
                raise JWTValidationError("Missing project_id in token")
            
            if payload['project_id'] != project.id:
                raise JWTValidationError("Token project_id mismatch")
            
            # Validate rooms structure
            if 'rooms' not in payload:
                raise JWTValidationError("Missing rooms configuration in token")
            
            rooms = payload['rooms']
            if not isinstance(rooms, dict):
                raise JWTValidationError("Invalid rooms configuration")
            
            # Validate each room configuration
            for room_pattern, permissions in rooms.items():
                if not isinstance(permissions, dict):
                    raise JWTValidationError(f"Invalid permissions for room: {room_pattern}")
                
                if 'publish' not in permissions or 'subscribe' not in permissions:
                    raise JWTValidationError(f"Missing publish/subscribe permissions for room: {room_pattern}")
                
                if not isinstance(permissions['publish'], bool) or not isinstance(permissions['subscribe'], bool):
                    raise JWTValidationError(f"Invalid permission types for room: {room_pattern}")
            
            return payload
            
        except jwt.ExpiredSignatureError:
            raise JWTValidationError("Token has expired")
        except jwt.InvalidTokenError as e:
            raise JWTValidationError(f"Invalid token: {str(e)}")
        except Exception as e:
            raise JWTValidationError(f"Token validation failed: {str(e)}")
    
    def create_token(self, project_id: str, rooms: Dict[str, Dict[str, bool]], 
                    expires_in: int = 3600, secret_key: Optional[str] = None) -> str:
        """
        Create JWT token for testing purposes
        
        Args:
            project_id: Project ID
            rooms: Room permissions configuration
            expires_in: Token expiration time in seconds
            secret_key: Project secret key (if None, uses provided project_id to fetch)
            
        Returns:
            JWT token string
        """
        if secret_key is None:
            raise JWTValidationError("Secret key is required for token creation")
        
        # Create payload
        payload = {
            "project_id": project_id,
            "rooms": rooms,
            "exp": int(datetime.now(timezone.utc).timestamp()) + expires_in
        }
        
        # Create token
        token = jwt.encode(payload, secret_key, algorithm=self.algorithm)
        return token
