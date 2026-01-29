import asyncio
import json
import time
from typing import Optional, AsyncGenerator
from nexios.http import Response
from .base import BaseChannel

class SSEChannel(BaseChannel):
    def __init__(self, response: Response, payload_type: str = "json", expires: Optional[int] = None):
        self.response = response
        self.payload_type = payload_type
        self.expires = expires

        self._event_queue = asyncio.Queue()
        self._closed = False
        self.created = time.time()
        super().__init__(payload_type, expires)

    async def stream_events(self) -> AsyncGenerator[str, None]:
        """
        Stream SSE events to the client.
        This replaces wait_and_send() from HTTP polling.
        """
        # Set SSE headers
        self.response.status(200)
        self.response.set_header("Content-Type", "text/event-stream")
        self.response.set_header("Cache-Control", "no-cache")
        self.response.set_header("Connection", "keep-alive")
        self.response.set_header("Access-Control-Allow-Origin", "*")

        # Send initial connection event
        yield "event: connect\ndata: {\"status\": \"connected\"}\n\n"

        try:
            while not self._closed and not self.is_expired():
                try:
                    # Wait for event with timeout
                    payload = await asyncio.wait_for(
                        self._event_queue.get(), 
                        timeout=1.0  # Check expiration every second
                    )
                    
                    # Format as SSE event
                    event_data = self._format_sse_event(payload)
                    if event_data:
                        yield event_data
                        
                except asyncio.TimeoutError:
                    # Send heartbeat to keep connection alive
                    yield ": heartbeat\n\n"
                    continue
                except Exception as e:
                    yield f"event: error\ndata: {{\"error\": \"{str(e)}\"}}\n\n"
                    break

        except asyncio.CancelledError:
            pass
        finally:
            self._closed = True
            yield "event: disconnect\ndata: {\"status\": \"disconnected\"}\n\n"

    def _format_sse_event(self, payload: dict) -> Optional[str]:
        """Format payload as SSE event."""
        if not payload or "event_type" not in payload:
            return None
            
        # Filter for message events like the original HTTP polling
        if "message" not in payload.get("event_type", ""):
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
            
        try:
            await self._event_queue.put(payload)
        except asyncio.QueueFull:
            # Queue is full, skip this event
            pass

    def close(self):
        """Close the SSE connection."""
        self._closed = True
