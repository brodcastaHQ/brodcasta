from nexios.routing import Router
from nexios.websockets import WebSocket
from models import Project
from nexios.logging import create_logger

from app.core.channels.websocket import WebSocketChannel
from events import emitter
from nexios.websockets.base import WebSocketDisconnect
from .enums import ClientEvent

router = Router(prefix="", tags=["websocket"])


logger = create_logger(__name__)
@router.ws_route("/{project_id}")
async def ws_gateway(websocket: WebSocket):
    project_id = websocket.path_params["project_id"]
    secret = websocket.query_params.get("secret")
    project = await Project.get_or_none(id=project_id)
    if not project:
        logger.error(f"Project not found: {project_id}")
        await websocket.close()
        return
    if project.project_secret != secret:
        logger.error(f"Invalid secret for project: {project_id}")
        await websocket.close()
        return

    await websocket.accept()
    channel = WebSocketChannel(websocket,payload_type="json")
    emitter.emit("client.connected", channel,project_id)
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
            emitter.emit(event_type.value, channel,project_id,event_data)
            
    except WebSocketDisconnect:
        emitter.emit("client.disconnected", channel,project_id)