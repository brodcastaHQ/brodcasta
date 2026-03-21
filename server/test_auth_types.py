#!/usr/bin/env python3
"""
Test script for SOMAL module with different auth types

This script demonstrates how the SOMAL module handles different project auth types:
- NONE: No authentication required, all operations allowed
- PUBLISHING_ONLY: Publishing requires auth, subscribing is free for all
- ALL: Both publishing and subscribing require authentication
"""

import asyncio
import sys
import os

# Add the server directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

from somal.jwt_validator import JWTValidator, JWTValidationError
from somal.permissions import PermissionManager
from somal.middleware import somal_middleware
from models.projects import Project, AuthType


async def test_auth_types():
    """Test different auth types"""
    print("=== Testing Different Auth Types ===")
    
    try:
        from models.accounts import Account
        from tortoise import Tortoise
        
        # Initialize Tortoise ORM
        await Tortoise.init(
            db_url='sqlite://:memory:',
            modules={'models': ['models.accounts', 'models.projects']}
        )
        await Tortoise.generate_schemas()
        
        # Create test account
        account = await Account.create(
            email="test@example.com",
            api_key="test_api_key"
        )
        
        # Create projects with different auth types
        projects = {}
        
        for auth_type in AuthType:
            project = await Project.create_project(
                name=f"Test {auth_type.value} Project",
                account_id=str(account.id),
                auth_type=auth_type
            )
            projects[auth_type.value] = project
            print(f"Created {auth_type.value} project: {project.id}")
        
        # Test JWT validator
        validator = JWTValidator()
        
        # Create test payload with room permissions
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
        
        # Create JWT token for authenticated tests
        token = validator.create_token(
            project_id=str(projects[AuthType.ALL.value].id),
            rooms=rooms_config,
            expires_in=3600,
            secret_key=projects[AuthType.ALL.value].project_secret
        )
        
        print(f"\nGenerated JWT token: {token}")
        
        # Test each auth type
        for auth_type_name, project in projects.items():
            print(f"\n--- Testing {auth_type_name.upper()} Auth Type ---")
            
            # Create mock channel
            from app.core.channels.sse import SSEChannel
            
            class MockResponse:
                def __init__(self):
                    self.headers = {}
                def set_header(self, name, value):
                    self.headers[name] = value
            
            mock_response = MockResponse()
            channel = SSEChannel(mock_response, payload_type="json", project=project)
            
            # Test authentication with token
            print("  With token:")
            authenticated = await somal_middleware.authenticate_channel(
                channel, token, str(project.id)
            )
            print(f"    Authenticated: {authenticated}")
            
            if authenticated:
                # Test permissions
                can_publish = await somal_middleware.check_room_permission(
                    channel, "general-room", "publish"
                )
                can_subscribe = await somal_middleware.check_room_permission(
                    channel, "general-room", "subscribe"
                )
                can_publish_main = await somal_middleware.check_room_permission(
                    channel, "main-room", "publish"
                )
                can_subscribe_main = await somal_middleware.check_room_permission(
                    channel, "main-room", "subscribe"
                )
                
                print(f"    Can publish to general-room: {can_publish}")
                print(f"    Can subscribe to general-room: {can_subscribe}")
                print(f"    Can publish to main-room: {can_publish_main}")
                print(f"    Can subscribe to main-room: {can_subscribe_main}")
            
            # Create new channel for no token test
            channel_no_token = SSEChannel(mock_response, payload_type="json", project=project)
            
            # Test authentication without token
            print("  Without token:")
            authenticated_no_token = await somal_middleware.authenticate_channel(
                channel_no_token, None, str(project.id)
            )
            print(f"    Authenticated: {authenticated_no_token}")
            
            if authenticated_no_token:
                # Test permissions without token
                can_publish_no_token = await somal_middleware.check_room_permission(
                    channel_no_token, "general-room", "publish"
                )
                can_subscribe_no_token = await somal_middleware.check_room_permission(
                    channel_no_token, "general-room", "subscribe"
                )
                
                print(f"    Can publish to general-room: {can_publish_no_token}")
                print(f"    Can subscribe to general-room: {can_subscribe_no_token}")
                
                # Get permission summary
                channel_perms = somal_middleware.get_channel_permissions(channel_no_token)
                print(f"    Permission summary: {channel_perms}")
        
        await Tortoise.close_connections()
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


async def test_permission_scenarios():
    """Test specific permission scenarios"""
    print("\n=== Testing Permission Scenarios ===")
    
    scenarios = [
        {
            "name": "Auth Type NONE - No token required",
            "auth_type": AuthType.NONE,
            "token": None,
            "expected_publish": True,
            "expected_subscribe": True
        },
        {
            "name": "Auth Type PUBLISHING_ONLY - With token",
            "auth_type": AuthType.PUBLISHING_ONLY,
            "token": "valid_token",
            "expected_publish": True,  # Depends on JWT permissions
            "expected_subscribe": True  # Always allowed
        },
        {
            "name": "Auth Type PUBLISHING_ONLY - Without token",
            "auth_type": AuthType.PUBLISHING_ONLY,
            "token": None,
            "expected_publish": False,  # Token required for publishing
            "expected_subscribe": True  # Free for all
        },
        {
            "name": "Auth Type ALL - With token",
            "auth_type": AuthType.ALL,
            "token": "valid_token",
            "expected_publish": True,  # Depends on JWT permissions
            "expected_subscribe": True  # Depends on JWT permissions
        },
        {
            "name": "Auth Type ALL - Without token",
            "auth_type": AuthType.ALL,
            "token": None,
            "expected_publish": False,  # Authentication required
            "expected_subscribe": False  # Authentication required
        }
    ]
    
    for scenario in scenarios:
        print(f"\n--- {scenario['name']} ---")
        print(f"  Expected publish: {scenario['expected_publish']}")
        print(f"  Expected subscribe: {scenario['expected_subscribe']}")
        print(f"  Token: {scenario['token']}")
        print(f"  Auth type: {scenario['auth_type'].value}")


async def main():
    """Run all tests"""
    print("SOMAL Auth Types Test Suite")
    print("==========================")
    
    # Test permission scenarios
    await test_permission_scenarios()
    
    # Test full auth type functionality
    print("\n" + "="*50)
    await test_auth_types()
    
    print("\n=== Auth Type Test Complete ===")
    print("\nSummary:")
    print("- NONE: No authentication required, all operations allowed")
    print("- PUBLISHING_ONLY: Publishing requires JWT, subscribing is free for all")
    print("- ALL: Both publishing and subscribing require JWT authentication")


if __name__ == "__main__":
    asyncio.run(main())
