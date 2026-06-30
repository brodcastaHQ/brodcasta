import asyncio
import json
import time
from typing import Optional
from nexios.http import Response
from app.core.logging import get_logger
from app.core.connection_store import ConnectionStore
from events.emitter import emitter
from .base import BaseChannel

logger = get_logger("SSEChannel")


class SSEChannel(BaseChannel):
    def __init__(self, response: Response, payload_type: str = "json", expires: Optional[int] = None, project: any = None):
        self.response = response
        self.payload_type = payload_type
        self.expires = expires
        self.project = project  # Store the project instance

        self._event_queue = asyncio.Queue()
        self._closed = False
        self.created = time.time()
        super().__init__(payload_type, expires, project)

    @property
    def project_id(self) -> Optional[str]:
        return self.project.id if self.project else None

    async def _event_stream(self):
        """
        Async generator that yields SSE events.
        Connection lifecycle (register, cleanup) is managed here so it
        runs in sync with the actual SSE streaming session — not before it.
        """
        pid = self.project_id

        if pid:
            await ConnectionStore.add_channel_to_group(pid, self)
        emitter.emit("client.connected", self, pid)

        try:
            yield "event: connect\ndata: {\"status\": \"connected\"}\n\n"

            while not self._closed and not self.is_expired():
                try:
                    payload = await asyncio.wait_for(
                        self._event_queue.get(),
                        timeout=None
                    )
                    logger.debug("Received event: %s", payload)
                    event_data = self._format_sse_event(payload)
                    logger.debug("Formatted event: %s", event_data)
                    if event_data:
                        yield event_data

                except asyncio.TimeoutError:
                    yield ": heartbeat\n\n"
                    continue
                except Exception as e:
                    logger.error("Event stream error: %s", e)
                    yield f"event: error\ndata: {{\"error\": \"{str(e)}\"}}\n\n"
                    break

            # Normal exit — yield disconnect *before* cleanup
            yield "event: disconnect\ndata: {\"status\": \"disconnected\"}\n\n"

        except asyncio.CancelledError:
            logger.info("SSE connection cancelled")
            raise
        finally:
            self._closed = True
            # Cleanup — no yield here (unsafe during GeneratorExit)
            if pid:
                await ConnectionStore.remove_channel(self, pid)
            emitter.emit("client.disconnected", self, pid)

    async def wait_and_send(self):
        """
        Register the SSE event stream with the Nexios response.
        The actual streaming (and lifecycle) happens when the framework
        iterates the async generator after this handler returns.
        """
        self.response.status(200)
        self.response.set_header("Cache-Control", "no-cache")
        self.response.set_header("Connection", "keep-alive")

        self.response.stream(
            self._event_stream(),
            content_type="text/event-stream",
        )

    def _format_sse_event(self, payload: dict) -> Optional[str]:

        """Format payload as SSE event."""

        logger.debug("Formatting event: %s", payload)
        if not payload or "event_type" not in payload:
            return None
            
       

        event_type = payload.get("event_type", "message")
        data = payload.get("data", payload)

        if self.payload_type == "json":
            data_str = json.dumps(data)
        elif self.payload_type == "text":
            data_str = str(data)
        else:  # bytes
            data_str = data.decode('utf-8') if isinstance(data, bytes) else str(data)

        return f"event: {event_type}\ndata: {data_str}\n\n"

    async def _send(self, payload):
        """
        Queue payload for streaming instead of sending single response.
        """
        if self._closed:
            return
        logger.debug("Sending payload: %s", payload)
        try:
            await self._event_queue.put(payload)
        except asyncio.QueueFull:
            # Queue is full, skip this event
            pass

    def close(self):
        """Close the SSE connection."""
        self._closed = True
