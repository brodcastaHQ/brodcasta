from nexios.routing import Router
from nexios.websockets import WebSocket
from models import Project
from nexios.logging import create_logger
from .events import emitter
from nexios.websockets.base import WebSocketDisconnect
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
    emitter.emit("client.connected", websocket,project_id)
    try:
        while True:
            data = await websocket.receive_json()
            if data.get("event_type") == "ping":
                print("Ping received")
                emitter.emit("client.ping", websocket)
            
    except WebSocketDisconnect:
        print("Client disconnected")
        emitter.emit("client.disconnected", websocket,project_id)