from nexios.events import AsyncEventEmitter
from nexios.websockets import WebSocket
from nexios.websockets.channels import Channel
from app.core.connection_store import ConnectionStore 

emitter = AsyncEventEmitter()


@emitter.on("client.connected")
async def handle_client_connected(websocket: WebSocket,project_id: str):
    await ConnectionStore.add_channel_to_group(
        project_id,
        Channel(websocket,payload_type="json",expires=86400)
    )

@emitter.on("client.disconnected")
async def handle_client_disconnected(websocket: WebSocket,project_id: str):
    channel = Channel(websocket,payload_type="json",expires=86400)
    await ConnectionStore.remove_channel(channel,project_id,"pingly_default")