import json
import logging
from typing import Optional
import redis.asyncio as redis


class RedisPublisherLogger:
    LOGGER_NAME = "RedisPublisher"
    _logger = None

    @classmethod
    def get_logger(cls):
        if cls._logger:
            return cls._logger
        
        logger = logging.getLogger(cls.LOGGER_NAME)
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            "[%(asctime)s] [%(levelname)s] %(name)s: %(message)s"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
        
        cls._logger = logger
        return logger


class RedisPublisher:
    def __init__(self):
        self.logger = RedisPublisherLogger.get_logger()
        self._redis: Optional[redis.Redis] = None
        self._channel_prefix = "brodcasta_events"
    
    # -------------------- CONNECTION --------------------
    
    async def connect(self, host="localhost", port=6379, db=0, password=None):
        self._redis = redis.Redis(
            host=host,
            port=port,
            db=db,
            password=password,
            decode_responses=True
        )

        await self._redis.ping()
        self.logger.info("Redis publisher connected")

    async def disconnect(self):
        if self._redis:
            await self._redis.close()
        self.logger.info("Redis publisher disconnected")
    
    # -------------------- PUBLISHERS --------------------
    
    async def publish_room_message(self, tenant_id: str, room_id: str, data: dict):
        if not self._redis:
            raise RuntimeError("Redis publisher not connected")
        
        channel = f"{self._channel_prefix}:{tenant_id}:{room_id}:room_message"
        payload = {
            **data,
            "tenant_id": tenant_id,
            "room_id": room_id
        }

        await self._redis.publish(channel, json.dumps(payload))
        self.logger.debug(f"Published room message to {channel}")
    
    async def publish_broadcast(self, tenant_id: str, data: dict):
        if not self._redis:
            raise RuntimeError("Redis publisher not connected")
        
        channel = f"{self._channel_prefix}:{tenant_id}:broadcast:broadcast"
        payload = {
            **data,
            "tenant_id": tenant_id
        }

        await self._redis.publish(channel, json.dumps(payload))
        self.logger.debug(f"Published broadcast to {channel}")
    
    async def publish_direct_message(self, tenant_id: str, data: dict):
        if not self._redis:
            raise RuntimeError("Redis publisher not connected")
        
        channel = f"{self._channel_prefix}:{tenant_id}:direct:direct_message"
        payload = {
            **data,
            "tenant_id": tenant_id
        }

        await self._redis.publish(channel, json.dumps(payload))
        self.logger.debug(f"Published direct message to {channel}")


# Global instance
redis_publisher = RedisPublisher()
