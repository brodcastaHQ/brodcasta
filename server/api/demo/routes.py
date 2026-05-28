import time
from nexios.http import Request, Response
from nexios.routing import Router
from nexios.websockets import WebSocket
from nexios.websockets.base import WebSocketDisconnect
from app.core.logging import get_logger

logger = get_logger("DemoRoutes")

router = Router(prefix="/demo", tags=["demo"])

# In-memory store of connected demo WebSocket clients
_connected_clients: set[WebSocket] = set()


@router.post("/echo")
async def demo_echo(request: Request, response: Response):
    """Public demo endpoint — call via curl to broadcast a message to the landing page."""
    try:
        data = await request.json
    except Exception:
        return response.json({"error": "Invalid JSON body"}, status_code=400)

    message = data.get("message", "").strip()
    if not message:
        return response.json({"error": "message field is required"}, status_code=400)

    payload = {
        "event": "demo.message",
        "data": {
            "message": message,
            "timestamp": time.time(),
        },
    }

    # Broadcast to all connected demo WebSocket clients
    dead: list[WebSocket] = []
    for client in _connected_clients:
        try:
            await client.send_json(payload)
        except Exception:
            dead.append(client)

    for client in dead:
        _connected_clients.discard(client)

    logger.info("Demo echo: %r (broadcast to %d clients)", message, len(_connected_clients))
    return response.json({"status": "ok", "broadcasted_to": len(_connected_clients)})


@router.ws_route("/listen")
async def demo_listen(websocket: WebSocket):
    """Public demo WebSocket — landing page connects here to receive live messages."""
    await websocket.accept()
    _connected_clients.add(websocket)
    client_id = id(websocket)
    logger.info("Demo client connected (total: %d)", len(_connected_clients))

    try:
        # Keep the connection open, handle pings / close
        while True:
            data = await websocket.receive_json()
            # Accept any incoming data as a keep-alive
            if data.get("event") == "ping":
                await websocket.send_json({"event": "pong"})
    except WebSocketDisconnect:
        pass
    except Exception as exc:
        logger.debug("Demo client disconnected (%s)", exc)
    finally:
        _connected_clients.discard(websocket)
        logger.info("Demo client disconnected (total: %d)", len(_connected_clients))
