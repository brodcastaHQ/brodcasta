from nexios.websockets import WebSocket
from nexios.websockets.channels import Channel
from app.core.connection_store import ConnectionStore 
from .emitter import emitter
from app.core.connection_store import ConnectionStore
from app.core.channels.base import BaseChannel
from utils.client_token import generate_hmac_token

@emitter.on("client.connected")
async def handle_client_connected(channel: BaseChannel, project_id: str):
    """Handle client connection"""
    try:
        # Add to default room if no specific room
        await ConnectionStore.add_channel_to_group(project_id, channel)
        
        # Emit presence.joined for default room
        emitter.emit("presence.joined", channel, project_id, {"room_id": ConnectionStore.DEFAULT_ROOM})

        await channel._send({
            "event_type": "client.identity",
            "data": {
                "client_token": generate_hmac_token(str(channel.uuid)),
                "client_id": str(channel.uuid)
            }
        })
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
        # Find all rooms the channel is in
        rooms = await ConnectionStore.get_rooms_for_channel(project_id, channel)
        
        # Notify all rooms of the departure
        for room_id in rooms:
            emitter.emit("presence.leave", channel, project_id, {"room_id": room_id})

        await ConnectionStore.remove_channel(channel, project_id)
    except Exception as e:
        print(f"Error handling client disconnection: {e}")