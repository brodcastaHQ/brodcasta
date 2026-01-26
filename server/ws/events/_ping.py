from .emitter import emitter
from nexios.websockets import WebSocket

@emitter.on("client.ping")
async def handle_ping(websocket: WebSocket):
    print("Pong sent")
    await websocket.send_json({"event_type": "pong"})