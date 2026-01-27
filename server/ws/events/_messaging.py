from .emitter import emitter
from nexios.websockets import WebSocket
from app.core.redis_publisher import redis_publisher


@emitter.on("message.send")
async def handle_message_send(websocket: WebSocket, project_id: str, data: dict[str, str]):
    """Handle sending a message to a room"""
    if not data:
        await websocket.send_json({
            "event_type": "message.send.error", 
            "message": "Invalid data"
        })
        return
    
    room_id = data.get("room_id")
    message_content = data.get("message")
    
    if not room_id or not message_content:
        await websocket.send_json({
            "event_type": "message.send.error", 
            "message": "room_id and message are required"
        })
        return
    
    try:
        # Create message payload
        payload = {
            "event_type": "message.received",
            "data": {
                "room_id": room_id,
                "message": message_content,
                "sender_id": str(websocket.channel.uuid)
            }
        }
        
        # Publish to Redis - fanout will handle actual delivery
        await redis_publisher.publish_room_message(project_id, room_id, payload)
        
        await websocket.send_json({
            "event_type": "message.send.ok",
            "message": "Message sent successfully"
        })
        
    except Exception as e:
        await websocket.send_json({
            "event_type": "message.send.error",
            "message": f"Failed to send message: {str(e)}"
        })


@emitter.on("message.broadcast")
async def handle_message_broadcast(websocket: WebSocket, project_id: str, data: dict[str, str]):
    """Handle broadcasting a message to all clients in a tenant"""
    if not data:
        await websocket.send_json({
            "event_type": "message.broadcast.error", 
            "message": "Invalid data"
        })
        return
    
    message_content = data.get("message")
    
    if not message_content:
        await websocket.send_json({
            "event_type": "message.broadcast.error", 
            "message": "message is required"
        })
        return
    
    try:
        # Create broadcast payload
        payload = {
            "event_type": "broadcast.received",
            "data": {
                "message": message_content,
                "sender_id": str(websocket.channel.uuid)
            }
        }
        
        # Publish to Redis - fanout will handle actual delivery
        await redis_publisher.publish_broadcast(project_id, payload)
        
        await websocket.send_json({
            "event_type": "message.broadcast.ok",
            "message": "Broadcast sent successfully"
        })
        
    except Exception as e:
        await websocket.send_json({
            "event_type": "message.broadcast.error",
            "message": f"Failed to broadcast message: {str(e)}"
        })


@emitter.on("message.direct")
async def handle_message_direct(websocket: WebSocket, project_id: str, data: dict[str, str]):
    """Handle sending a direct message to a specific client"""
    if not data:
        await websocket.send_json({
            "event_type": "message.direct.error", 
            "message": "Invalid data"
        })
        return
    
    target_client_id = data.get("target_client_id")
    message_content = data.get("message")
    
    if not target_client_id or not message_content:
        await websocket.send_json({
            "event_type": "message.direct.error", 
            "message": "target_client_id and message are required"
        })
        return
    
    try:
        # Create direct message payload
        payload = {
            "event_type": "direct.received",
            "data": {
                "message": message_content,
                "sender_id": str(websocket.channel.uuid),
                "target_client_id": target_client_id
            }
        }
        
        # Publish to Redis - fanout will handle actual delivery
        await redis_publisher.publish_direct_message(project_id, payload)
        
        await websocket.send_json({
            "event_type": "message.direct.ok",
            "message": "Direct message sent successfully"
        })
        
    except Exception as e:
        await websocket.send_json({
            "event_type": "message.direct.error",
            "message": f"Failed to send direct message: {str(e)}"
        })
