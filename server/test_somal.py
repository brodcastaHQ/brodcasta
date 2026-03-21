#!/usr/bin/env python3
"""
Test script for SOMAL module functionality

This script demonstrates JWT token creation and validation
with room permissions for the brodcasta system.
"""

import asyncio
import sys
import os

# Add the server directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

from somal.jwt_validator import JWTValidator, JWTValidationError
from somal.permissions import PermissionManager
from somal.middleware import somal_middleware
from models.projects import Project


async def test_jwt_validation():
    """Test JWT token validation functionality"""
    print("=== Testing JWT Validation ===")
    
    # Create a test project first
    try:
        # This would normally be done through the API
        from models.accounts import Account
        from tortoise import Tortoise
        
        # Initialize Tortoise ORM
        await Tortoise.init(
            db_url='sqlite://:memory:',
            modules={'models': ['models.accounts', 'models.projects']}
        )
        await Tortoise.generate_schemas()
        
        # Create test account and project
        account = await Account.create(
            email="test@example.com",
            api_key="test_api_key"
        )
        
        project = await Project.create_project(
            name="Test Project",
            account_id=str(account.id),
            auth_type="all"
        )
        
        print(f"Created test project: {project.id}")
        print(f"Project secret: {project.project_secret}")
        
        # Test JWT validator
        validator = JWTValidator()
        
        # Create test payload
        rooms_config = {
            ".*": {
                "publish": True,
                "subscribe": True
            },
            "^main-room$": {
                "publish": False,
                "subscribe": False
            },
            "private-.*": {
                "publish": True,
                "subscribe": False
            }
        }
        
        # Create JWT token
        token = validator.create_token(
            project_id=str(project.id),
            rooms=rooms_config,
            expires_in=3600,
            secret_key=project.project_secret
        )
        
        print(f"Generated JWT token: {token}")
        
        # Validate token
        try:
            payload = await validator.validate_token(token, str(project.id))
            print("✅ Token validation successful")
            print(f"Decoded payload: {payload}")
        except JWTValidationError as e:
            print(f"❌ Token validation failed: {e}")
            return False
        
        # Test permission manager
        print("\n=== Testing Permission Manager ===")
        permission_manager = PermissionManager(payload)
        
        # Test various room permissions
        test_cases = [
            ("general-room", "publish", True),
            ("general-room", "subscribe", True),
            ("main-room", "publish", False),
            ("main-room", "subscribe", False),
            ("private-chat", "publish", True),
            ("private-chat", "subscribe", False),
            ("nonexistent-room", "publish", False),
            ("nonexistent-room", "subscribe", False),
        ]
        
        for room_name, action, expected in test_cases:
            if action == "publish":
                result = permission_manager.can_publish(room_name)
            else:
                result = permission_manager.can_subscribe(room_name)
            
            status = "✅" if result == expected else "❌"
            print(f"{status} {room_name} - {action}: {result} (expected: {expected})")
        
        # Get permission summary
        summary = permission_manager.get_permissions_summary()
        print(f"\nPermission Summary: {summary}")
        
        print("\n=== Testing SOMAL Middleware ===")
        
        # Create mock channel for testing
        from app.core.channels.sse import SSEChannel
        
        # Mock response object
        class MockResponse:
            def __init__(self):
                self.headers = {}
            
            def set_header(self, name, value):
                self.headers[name] = value
        
        mock_response = MockResponse()
        channel = SSEChannel(mock_response, payload_type="json", project=project)
        
        # Test middleware authentication
        authenticated = await somal_middleware.authenticate_channel(
            channel, token, str(project.id)
        )
        
        if authenticated:
            print("✅ Channel authentication successful")
            
            # Test permission checking
            can_publish = await somal_middleware.check_room_permission(
                channel, "general-room", "publish"
            )
            can_subscribe = await somal_middleware.check_room_permission(
                channel, "main-room", "subscribe"
            )
            
            print(f"Can publish to general-room: {can_publish}")
            print(f"Can subscribe to main-room: {can_subscribe}")
            
            # Get channel permissions
            channel_perms = somal_middleware.get_channel_permissions(channel)
            print(f"Channel permissions: {channel_perms}")
            
        else:
            print("❌ Channel authentication failed")
        
        await Tortoise.close_connections()
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


async def test_token_examples():
    """Test with example tokens matching the user's requirements"""
    print("\n=== Testing Example Token Payload ===")
    
    # Example payload from user requirements
    example_payload = {
        "project_id": "test_project_id",
        "rooms": {
            ".*": {
                "publish": True,
                "subscribe": True
            },
            "^main-room$": {
                "publish": False,
                "subscribe": False
            }
        },
        "exp": 1408639878
    }
    
    print(f"Example payload: {example_payload}")
    
    # Test permission manager with example payload
    permission_manager = PermissionManager(example_payload)
    
    test_cases = [
        ("any-room", "publish", True),
        ("any-room", "subscribe", True),
        ("main-room", "publish", False),
        ("main-room", "subscribe", False),
    ]
    
    for room_name, action, expected in test_cases:
        if action == "publish":
            result = permission_manager.can_publish(room_name)
        else:
            result = permission_manager.can_subscribe(room_name)
        
        status = "✅" if result == expected else "❌"
        print(f"{status} {room_name} - {action}: {result} (expected: {expected})")


async def main():
    """Run all tests"""
    print("SOMAL Module Test Suite")
    print("======================")
    
    # Test token examples
    await test_token_examples()
    
    # Test full JWT validation (requires database)
    print("\n" + "="*50)
    await test_jwt_validation()
    
    print("\n=== Test Complete ===")


if __name__ == "__main__":
    asyncio.run(main())
