from nexios.http import Request, Response
from nexios.routing import Router
import json
import asyncio
from app.core.channels.sse import SSEChannel
from app.core.connection_store import ConnectionStore
from models import Project
from models.projects import AuthType
from events import emitter
from utils.client_token import validate_hmac_token
from somal.middleware import somal_middleware


router = Router(prefix="/sse", tags=["poll"])


@router.get("/{project_id}/connect")
async def poll_connect(request: Request, response: Response):
    """Start a long-polling connection"""
    project_id = request.path_params["project_id"]
    # Get JWT token from query params (optional for some auth types)
    token = request.query_params.get("token")
    
    # Validate project
    project = await Project.get_or_none(id=project_id)
    if not project:
        return response.json({"error": "project not found"}, status_code=404)
    
    # Create HTTP channel for long polling
    channel = SSEChannel(response, payload_type="json", project=project)
    
    # Authenticate channel with SOMAL (handles different auth types)
    authenticated = await somal_middleware.authenticate_channel(channel, token, project)
    if not authenticated:
        return response.json({"error": "Authentication failed"}, status_code=403)
    
    # Add to connection store
    await ConnectionStore.add_channel_to_group(project_id, channel)
    
    # Emit connection event
    emitter.emit("client.connected", channel, project_id)
    
    try:
        # Wait for messages or timeout
        await channel.wait_and_send()
    except Exception as e:
        print(f"Long poll error: {e}")
    # finally:
    #     # Clean up connection
    #     await ConnectionStore.remove_channel(channel, project_id)
    #     emitter.emit("client.disconnected", channel, project_id)


@router.post("/{project_id}/send")
async def poll_send(request: Request, response: Response):
    """Send message via HTTP (for long-polling clients)"""
    project_id = request.path_params["project_id"]
    # Get JWT token from query params for authentication (optional for some auth types)
    token = request.query_params.get("token")
    
    # Validate project
    project = await Project.get_or_none(id=project_id)
    if not project:
        return response.json({"error": "Project not found"}, status_code=404)
    
    try:
        data = await request.json
        client_token = data.get("client_token")
        event_type = data.get("event_type")
        event_data = data.get("data")
        
        if not client_token:
            return response.json({"error": "client_token required"}, status_code=401)

        if not event_type:
            return response.json({"error": "event_type required"}, status_code=400)

        # Validate token and get client_id
        try:
            client_id = validate_hmac_token(client_token)
        except ValueError:
            return response.json({"error": "Invalid client_token"}, status_code=401)

        # Get the actual channel from connection store
        channel = await ConnectionStore.get_channel_by_id(project_id, client_id)
        if not channel:
            return response.json({"error": "Client session not found"}, status_code=404)
        
        # Check if channel is authenticated with SOMAL permissions
        if not somal_middleware.is_channel_authenticated(channel):
            return response.json({"error": "Channel not authenticated with SOMAL"}, status_code=403)
        
        # Check room permissions for publishing if room is specified
        room_name = event_data.get("room") if event_data else None
        if room_name:
            # For PUBLISHING_ONLY auth type, check if token was provided for publishing
            if project.auth_type == AuthType.PUBLISHING_ONLY and not token:
                return response.json({"error": "Token required for publishing"}, status_code=403)
            
            if not await somal_middleware.check_room_permission(channel, room_name, "publish"):
                return response.json({"error": f"Permission denied for room: {room_name}"}, status_code=403)
        
        # Emit the event using the REAL channel
        emitter.emit(event_type, channel, project_id, event_data)
        
        return response.json({"status": "sent", "event_type": event_type})
        
    except Exception as e:
        print(f"Poll send error: {e}")
        return response.json({"error": "Send failed"}, status_code=500)


@router.get("/{project_id}/stats")
async def get_poll_stats(request: Request, response: Response):
    """Get connection statistics"""
    project_id = request.path_params["project_id"]
    # Make secret optional for now - will be used for JWT authentication later
    secret = request.query_params.get("secret")
    
    # Validate project
    project = await Project.get_or_none(id=project_id)
    if not project:
        return response.json({"error": "Project not found"},status_code=404)
    
    # Optional secret validation - will be replaced with JWT token validation
    if secret and project.project_secret != secret:
        return response.json({"error": "Invalid credentials"},status_code=401)
    
    # Get connection stats
    total_connections = await ConnectionStore.count_connections_in_tenant(project_id)
    
    # Get room breakdown
    room_stats = {}
    tenant_rooms = ConnectionStore.CHANNEL_GROUPS.get(project_id, {})
    for room_id, channels in tenant_rooms.items():
        room_stats[room_id] = len(channels)
    
    return response.json({
        "project_id": project_id,
        "total_connections": total_connections,
        "rooms": room_stats,
        "transport": "long_poll"
    })
