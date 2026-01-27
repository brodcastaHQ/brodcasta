from .emitter import emitter
from nexios.websockets import WebSocket
from app.core.channels.base import BaseChannel

@emitter.on("client.ping")
async def handle_ping(channel: BaseChannel,*_):
    await channel._send({"event_type": "pong"})