import logging
from nexios.websockets import WebSocket

from .base import BaseChannel


class WebSocketChannel(BaseChannel):
    def __init__(
        self,
        websocket: WebSocket,
        payload_type: str,
        expires: int | None = None,
        project: any = None,
    ) -> None:
        assert isinstance(websocket, WebSocket)
        super().__init__(payload_type, expires, project)
        self.websocket = websocket

    async def _send(self, payload):
        try:
            if self.payload_type == "json":
                await self.websocket.send_json(payload)
            elif self.payload_type == "text":
                await self.websocket.send_text(payload)
            elif self.payload_type == "bytes":
                await self.websocket.send_bytes(payload)
            else:
                await self.websocket.send(payload)
        except RuntimeError as e:
            logging.debug(e)

        self.touch()
