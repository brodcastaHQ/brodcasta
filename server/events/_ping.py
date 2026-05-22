from app.core.logging import get_logger
from .emitter import emitter
from app.core.channels.base import BaseChannel

logger = get_logger("Events.Ping")

@emitter.on("client.ping")
async def handle_client_ping(channel: BaseChannel, project_id: str, data: dict[str, str]):
    """Handle client ping"""
    try:
        await channel._send({
            "event_type": "client.pong",
            "data": {
                "timestamp": __import__('time').time(),
                "connection_id": str(channel.uuid)
            }
        })
    except Exception as e:
        logger.error("Error handling ping: %s", e)