from nexios.http import Request, Response
from nexios.routing import Router
import json
import asyncio
from app.core.channels.sse import SSEChannel
from app.core.connection_store import ConnectionStore
from models import Project
from events import emitter
from utils.client_token import validate_hmac_token


router = Router(prefix="/sse", tags=["poll"])


@router.get("/{project_id}/connect")
async def poll_connect(request: Request, response: Response):
    """Start a long-polling connection"""
    project_id = request.path_params["project_id"]
    secret = request.query_params.get("secret")
    
    # Validate project
    project = await Project.get_or_none(id=project_id)
    if not project or project.project_secret != secret:
        response.status(401)
        return {"error": "Invalid credentials"}
    
    # Create HTTP channel for long polling
    channel = SSEChannel(response, payload_type="json",project=project)
    
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
    secret = request.query_params.get("secret")
    
    # Validate project
    project = await Project.get_or_none(id=project_id)
    if not project or project.project_secret != secret:
        response.status(401)
        return {"error": "Invalid credentials"}
    
    try:
        data = await request.json
        client_token = data.get("client_token")
        event_type = data.get("event_type")
        event_data = data.get("data")
        
        if not client_token:
            response.status(401)
            return {"error": "client_token required"}

        if not event_type:
            response.status_code = 400
            return {"error": "event_type required"}

        # Validate token and get client_id
        try:
            client_id = validate_hmac_token(client_token)
        except ValueError:
            response.status_code = 401
            return {"error": "Invalid client_token"}

        # Get the actual channel from connection store
        channel = await ConnectionStore.get_channel_by_id(project_id, client_id)
        if not channel:
            response.status(404)
            return {"error": "Client session not found"}
        
        # Emit the event using the REAL channel
        emitter.emit(event_type, channel, project_id, event_data)
        
        return {"status": "sent", "event_type": event_type}
        
    except Exception as e:
        print(f"Poll send error: {e}")
        response.status(500)
        return {"error": "Send failed"}


@router.get("/{project_id}/stats")
async def get_poll_stats(request: Request, response: Response):
    """Get connection statistics"""
    project_id = request.path_params["project_id"]
    secret = request.query_params.get("secret")
    
    # Validate project
    project = await Project.get_or_none(id=project_id)
    if not project or project.project_secret != secret:
        response.status_code = 401
        return {"error": "Invalid credentials"}
    
    # Get connection stats
    total_connections = await ConnectionStore.count_connections_in_tenant(project_id)
    
    # Get room breakdown
    room_stats = {}
    tenant_rooms = ConnectionStore.CHANNEL_GROUPS.get(project_id, {})
    for room_id, channels in tenant_rooms.items():
        room_stats[room_id] = len(channels)
    
    return {
        "project_id": project_id,
        "total_connections": total_connections,
        "rooms": room_stats,
        "transport": "long_poll"
    }
