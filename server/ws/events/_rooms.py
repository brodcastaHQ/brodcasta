from .emitter import emitter
from nexios.websockets import WebSocket
from nexios.websockets.channels import Channel
from app.core.connection_store import ConnectionStore

@emitter.on("room.subscribe")
async def handle_room_subscribe(websocket: WebSocket,project_id:str,data:dict[str,str]):
    if not data:
        await websocket.send_json({"event_type": "room.subscribe.error","message": "Invalid data"})
        return
    
    room_id = data.get("room_id")
    if not room_id:
        await websocket.send_json({"event_type": "room.subscribe.error","message": "room_id is required"})
        return
    await ConnectionStore.add_channel_to_group(project_id, websocket.channel, room_id)
    await websocket.send_json({"event_type": "room.subscribe.ok","message": "Subscribed to room"})


@emitter.on("room.unsubscribe")
async def handle_room_unsubscribe(websocket: WebSocket,project_id:str,data:dict[str,str]):
    if not data:
        await websocket.send_json({"event_type": "room.subscribe.error","message": "Invalid data"})
        return
    
    room_id = data.get("room_id")
    if not room_id:
        await websocket.send_json({"event_type": "room.subscribe.error","message": "room_id is required"})
        return
    await ConnectionStore.remove_channel(websocket.channel, project_id, room_id)
    await websocket.send_json({"event_type": "room.subscribe.ok","message": "Unsubscribed from room"})
