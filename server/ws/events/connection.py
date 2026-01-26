from nexios.websockets import WebSocket
from nexios.websockets.channels import Channel
from app.core.connection_store import ConnectionStore 
from .emitter import emitter


@emitter.on("client.connected")
async def handle_client_connected(websocket: WebSocket,project_id: str):
    channel = Channel(websocket,payload_type="json")
    websocket.channel = channel
    await ConnectionStore.add_channel_to_group(
        project_id,
        channel,
        "pingly_default"
    )

@emitter.on("client.disconnected")
async def handle_client_disconnected(websocket: WebSocket,project_id: str):
    channel = websocket.channel
    await ConnectionStore.remove_channel(channel,project_id,"pingly_default")