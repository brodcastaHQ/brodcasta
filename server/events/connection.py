from nexios.websockets import WebSocket
from nexios.websockets.channels import Channel
from app.core.connection_store import ConnectionStore 
from .emitter import emitter
from app.core.connection_store import ConnectionStore
from app.core.channels.base import BaseChannel

@emitter.on("client.connected")
async def handle_client_connected(channel: BaseChannel, project_id: str):
    """Handle client connection"""
    try:
        # Add to default room if no specific room
        await ConnectionStore.add_channel_to_group(project_id, channel)
        
        await channel._send({
            "event_type": "connection.established",
            "data": {
                "connection_id": str(channel.uuid),
                "project_id": project_id
            }
        })
        
    except Exception as e:
        print(f"Error handling client connection: {e}")


@emitter.on("client.disconnected")
async def handle_client_disconnected(channel: BaseChannel, project_id: str):
    """Handle client disconnection"""
    try:
        await ConnectionStore.remove_channel(channel, project_id)
    except Exception as e:
        print(f"Error handling client disconnection: {e}")