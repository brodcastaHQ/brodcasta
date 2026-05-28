from nexios.http import Request, Response
from nexios.routing import Router
from app.core.redis_publisher import redis_publisher
from app.core.logging import get_logger

logger = get_logger("PublicRoutes")

router = Router(prefix="/public", tags=["public"])


@router.post("/{project_id}/messages")
async def send_public_message(request: Request, response: Response, project_id: str):
    if project_id != "demo-client":
        logger.info("NOt found")
        return response.json({"error": "Not found"}, status_code=404)

    try:
        data = await request.json
    except Exception:
        return response.json({"error": "Invalid JSON body"}, status_code=400)

    room_id = data.get("room_id", "").strip()
    message = data.get("message", "").strip()

    if not room_id or not message:
        return response.json({"error": "room_id and message are required"}, status_code=400)

    payload = {
        "event_type": "message.received",
        "data": {
            "room_id": room_id,
            "message": message,
            "sender_id": "demo-curl",
        },
    }

    await redis_publisher.publish_room_message(project_id, room_id, payload)
    logger.info("Public message: %r → room %s (project %s)", message, room_id, project_id)

    return response.json({"status": "ok"})
