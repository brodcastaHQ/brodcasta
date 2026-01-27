# http_channel.py
import asyncio
import time
from nexios.http import Response

class HTTPChannel:
    def __init__(self, response: Response, payload_type: str = "json", expires: int = 30):
        self.response = response
        self.payload_type = payload_type
        self.expires = expires

        self._event = asyncio.Event()
        self._payload = None
        self._sent = False
        self.created = time.time()

    async def wait_and_send(self):
        """
        Hold the request until `send()` is called or timeout,
        then send the response automatically.
        """
        try:
            await asyncio.wait_for(self._event.wait(), timeout=self.expires)
        except asyncio.TimeoutError:
            if not self._sent:
                self.response.status(204)
        else:
            if not self._sent:
                if self.payload_type == "json":
                    self.response.media_type = "application/json"
                    self.response.json(self._payload)
                elif self.payload_type == "text":
                    self.response.text(str(self._payload))
                else:  # bytes
                    self.response.set_body(self._payload)
                self._sent = True

    async def _send(self, payload):
        """
        Event just calls this — the channel takes care of sending response.
        """
        if not self._sent:
            self._payload = payload
            self._event.set()
