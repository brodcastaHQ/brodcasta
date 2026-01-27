from nexios.websockets import WebSocket
from nexios.websockets.channels import Channel
from app.core.connection_store import ConnectionStore 
from .emitter import emitter
from app.core.channels.base import BaseChannel

@emitter.on("client.connected")
async def handle_client_connected(channel: BaseChannel,project_id: str):
    await ConnectionStore.add_channel_to_group(
        project_id,
        channel,
        "pingly_default"
    )

@emitter.on("client.disconnected")
async def handle_client_disconnected(channel: BaseChannel,project_id: str):
    await ConnectionStore.remove_channel(channel,project_id,"pingly_default")