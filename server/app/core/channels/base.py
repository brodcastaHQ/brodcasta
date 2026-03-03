import time
import uuid
import typing
from abc import ABC, abstractmethod
from nexios.websockets.channels import WebSocket
from  nexios.websockets.channels import PayloadTypeEnum
class BaseChannel(ABC):
    def __init__(
        self,
        payload_type: str,
        expires: typing.Optional[int] = None,
        project: typing.Optional[any] = None,
    ) -> None:
        assert isinstance(payload_type, str)
        assert payload_type in {
            PayloadTypeEnum.JSON.value,
            PayloadTypeEnum.TEXT.value,
            PayloadTypeEnum.BYTES.value,
        }

        if expires:
            assert isinstance(expires, int)

        self.payload_type = payload_type
        self.expires = expires
        self.project = project  # Store the project instance
        self.uuid = uuid.uuid4()
        self.created = time.time()

    @abstractmethod
    async def _send(self, payload: typing.Any) -> None:
        ...

    def is_expired(self) -> bool:
        if not self.expires:
            return False
        return (self.created + self.expires) < time.time()

    def touch(self) -> None:
        self.created = time.time()

    def __repr__(self) -> str:
        return f"{self.__class__.__name__} {self.uuid=} {self.payload_type=} {self.expires=}"
