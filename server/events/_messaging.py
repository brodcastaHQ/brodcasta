from .emitter import emitter
from app.core.redis_publisher import redis_publisher
from models import Message


@emitter.on("message.send")
async def handle_message_send(channel, project_id: str, data: dict[str, str], persist: bool = None):
    """Handle sending a message to a room"""
    if not data:
        await channel._send({
            "event_type": "message.send.error", 
            "message": "Invalid data"
        })
        return
    
    # Check if persistence is enabled from project settings
    if persist is None and hasattr(channel, 'project') and channel.project:
        persist = channel.project.history_enabled
    elif persist is None:
        persist = False  # Default to False if no project available
    
    room_id = data.get("room_id")
    message_content = data.get("message")
    
    if not room_id or not message_content:
        await channel._send({
            "event_type": "message.send.error", 
            "message": "room_id and message are required"
        })
        return
    
    try:
        # Persist message if requested
        if persist:
            message_data = {
                "message": message_content
            }
            await Message.create_message(
                project_id, 
                room_id, 
                message_data,
                sender_id=str(channel.uuid),
                message_type="room_message"
            )
        
        # Create message payload
        payload = {
            "event_type": "message.received",
            "data": {
                "room_id": room_id,
                "message": message_content,
                "sender_id": str(channel.uuid)
            }
        }
        
        # Publish to Redis - fanout will handle actual delivery
        await redis_publisher.publish_room_message(project_id, room_id, payload)
        
        await channel._send({
            "event_type": "message.send.ok",
            "message": "Message sent successfully"
        })
        
    except Exception as e:
        await channel._send({
            "event_type": "message.send.error",
            "message": f"Failed to send message: {str(e)}"
        })


@emitter.on("message.broadcast")
async def handle_message_broadcast(channel, project_id: str, data: dict[str, str], persist: bool = None):
    """Handle broadcasting a message to all clients in a tenant"""
    if not data:
        await channel._send({
            "event_type": "message.broadcast.error", 
            "message": "Invalid data"
        })
        return
    
    # Check if persistence is enabled from project settings
    if persist is None and hasattr(channel, 'project') and channel.project:
        persist = channel.project.history_enabled
    elif persist is None:
        persist = False  # Default to False if no project available
    
    message_content = data.get("message")
    
    if not message_content:
        await channel._send({
            "event_type": "message.broadcast.error", 
            "message": "message is required"
        })
        return
    
    try:
        # Persist message if requested
        if persist:
            message_data = {
                "message": message_content
            }
            await Message.create_message(
                project_id, 
                "broadcast", 
                message_data,
                sender_id=str(channel.uuid),
                message_type="broadcast_message"
            )
        
        # Create broadcast payload
        payload = {
            "event_type": "broadcast.received",
            "data": {
                "message": message_content,
                "sender_id": str(channel.uuid)
            }
        }
        
        # Publish to Redis - fanout will handle actual delivery
        await redis_publisher.publish_broadcast(project_id, payload)
        
        await channel._send({
            "event_type": "message.broadcast.ok",
            "message": "Broadcast sent successfully"
        })
        
    except Exception as e:
        await channel._send({
            "event_type": "message.broadcast.error",
            "message": f"Failed to broadcast message: {str(e)}"
        })


@emitter.on("message.direct")
async def handle_message_direct(channel, project_id: str, data: dict[str, str], persist: bool = None):
    """Handle sending a direct message to a specific client"""
    if not data:
        await channel._send({
            "event_type": "message.direct.error", 
            "message": "Invalid data"
        })
        return
    
    # Check if persistence is enabled from project settings
    if persist is None and hasattr(channel, 'project') and channel.project:
        persist = channel.project.history_enabled
    elif persist is None:
        persist = False  # Default to False if no project available
    
    target_client_id = data.get("target_client_id")
    message_content = data.get("message")
    
    if not target_client_id or not message_content:
        await channel._send({
            "event_type": "message.direct.error", 
            "message": "target_client_id and message are required"
        })
        return
    
    try:
        # Persist message if requested
        if persist:
            message_data = {
                "message": message_content,
                "target_client_id": target_client_id
            }
            await Message.create_message(
                project_id, 
                f"direct_{target_client_id}", 
                message_data,
                sender_id=str(channel.uuid),
                message_type="direct_message"
            )
        
        # Create direct message payload
        payload = {
            "event_type": "direct.received",
            "data": {
                "message": message_content,
                "sender_id": str(channel.uuid),
                "target_client_id": target_client_id
            }
        }
        
        # Publish to Redis - fanout will handle actual delivery
        await redis_publisher.publish_direct_message(project_id, payload)
        
        await channel._send({
            "event_type": "message.direct.ok",
            "message": "Direct message sent successfully"
        })
        
    except Exception as e:
        await channel._send({
            "event_type": "message.direct.error",
            "message": f"Failed to send direct message: {str(e)}"
        })
