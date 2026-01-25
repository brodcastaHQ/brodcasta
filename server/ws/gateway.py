from nexios.routing import Router
from nexios.websockets import WebSocket
from nexios.events import AsyncEventEmitter
from models import Project
from nexios.logging import create_logger
router = Router(prefix="", tags=["websocket"])

emitter = AsyncEventEmitter()

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
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")