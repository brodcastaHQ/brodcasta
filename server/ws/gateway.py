from nexios.routing import Router
from nexios.websockets import WebSocket
from models import Project
from nexios.logging import create_logger

from app.core.channels.websocket import WebSocketChannel
from events import emitter
from nexios.websockets.base import WebSocketDisconnect
from .enums import ClientEvent
from somal.middleware import somal_middleware

router = Router(prefix="", tags=["websocket"])


logger = create_logger(__name__)
@router.ws_route("/{project_id}")
async def ws_gateway(websocket: WebSocket):
    project_id = websocket.path_params["project_id"]
    # Get JWT token from query params (optional for some auth types)
    token = websocket.query_params.get("token")
    
    project = await Project.get_or_none(id=project_id)
    if not project:
        logger.error(f"Project not found: {project_id}")
        await websocket.close(code=4004, reason="Project not found")
        return
    
    await websocket.accept()
    channel = WebSocketChannel(websocket, payload_type="json", project=project)
    
    # Authenticate channel with SOMAL (handles different auth types)
    authenticated = await somal_middleware.authenticate_channel(channel, token, project)
    if not authenticated:
        logger.error(f"Authentication failed for project: {project_id}")
        await websocket.close(code=4003, reason="Authentication failed")
        return
    
    logger.info(f"Client connected for project: {project_id} (auth_type: {project.auth_type})")
    emitter.emit("client.connected", channel, project_id)
    
    try:
        while True:
            data = await websocket.receive_json()
            if "event_type" not in data:
                continue
            
            event_type = data.get("event_type")
            try:
                event_type = ClientEvent(event_type)
            except ValueError:
                continue
            
            event_data = data.get("data")
            
            # Check room permissions before emitting events
            room_name = event_data.get("room") if event_data else None
            if room_name and event_type in [ClientEvent.JOIN_ROOM, ClientEvent.LEAVE_ROOM]:
                # For room events, check subscribe permission
                if not await somal_middleware.check_room_permission(channel, room_name, "subscribe"):
                    logger.warning(f"Permission denied for room: {room_name}")
                    continue
            
            # For publishing events, check publish permission
            if event_type == ClientEvent.PUBLISH_MESSAGE and room_name:
                if not await somal_middleware.check_room_permission(channel, room_name, "publish"):
                    logger.warning(f"Publish permission denied for room: {room_name}")
                    continue
            
            emitter.emit(event_type.value, channel, project_id, event_data)
            
    except WebSocketDisconnect:
        emitter.emit("client.disconnected", channel, project_id)