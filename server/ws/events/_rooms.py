from .emitter import emitter
from nexios.websockets import WebSocket
from app.core.connection_store import ConnectionStore
from app.core.channels.base import BaseChannel

@emitter.on("room.subscribe")
async def handle_room_subscribe(channel: BaseChannel,project_id:str,data:dict[str,str]):
    if not data:
        await channel._send({"event_type": "room.subscribe.error","message": "Invalid data"})
        return
    
    room_id = data.get("room_id")
    if not room_id:
        await channel._send({"event_type": "room.subscribe.error","message": "room_id is required"})
        return
    await ConnectionStore.add_channel_to_group(project_id, channel, room_id)
    await channel._send({"event_type": "room.subscribe.ok","message": "Subscribed to room"})


@emitter.on("room.unsubscribe")
async def handle_room_unsubscribe(channel: BaseChannel,project_id:str,data:dict[str,str]):
    if not data:
        await channel._send({"event_type": "room.subscribe.error","message": "Invalid data"})
        return
    
    room_id = data.get("room_id")
    if not room_id:
        await channel._send({"event_type": "room.subscribe.error","message": "room_id is required"})
        return
    await ConnectionStore.remove_channel(channel, project_id, room_id)
    await channel._send({"event_type": "room.subscribe.ok","message": "Unsubscribed from room"})
