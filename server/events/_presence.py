from .emitter import emitter
from app.core.redis_publisher import redis_publisher
from app.core.channels.base import BaseChannel
@emitter.on("presence.joined")
async def handle_presence_joined(channel: BaseChannel, project_id: str, data: dict):
    """Publish joined event to Redis"""
    room_id = data.get("room_id")
    if not room_id:
        return
    
    await redis_publisher.publish_room_message(
        project_id, 
        room_id,
        {
            "event_type": "presence.joined",
            "data": {
                "client_id": str(channel.uuid),
                "room_id": room_id
            }
        }
    )


@emitter.on("presence.leave")
async def handle_presence_leave(channel: BaseChannel, project_id: str, data: dict):
    """Publish leave event to Redis"""
    room_id = data.get("room_id")
    if not room_id:
        return
    
    await redis_publisher.publish_room_message(
        project_id, 
        room_id,
        {
            "event_type": "presence.leave",
            "data": {
                "client_id": str(channel.uuid),
                "room_id": room_id
            }
        }
    )
