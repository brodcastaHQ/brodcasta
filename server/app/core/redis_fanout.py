import json
import asyncio
import logging
from typing import Optional
import redis.asyncio as redis
from app.core.connection_store import ConnectionStore


class RedisFanoutLogger:
    LOGGER_NAME = "RedisFanout"
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


class RedisFanout:
    def __init__(self):
        self.logger = RedisFanoutLogger.get_logger()
        self._redis: Optional[redis.Redis] = None
        self._pubsub: Optional[redis.client.PubSub] = None
        self._listener_task: Optional[asyncio.Task] = None
        self._running = False
        self._channel_prefix = "brodcasta_events"
    
    # -------------------- CONNECTION --------------------
    
    async def connect(self, host, port, db, password=None):
        print("Connecting to Redis...",host)
        self._redis = redis.Redis(
            host=host,
            port=port,
            db=db,
            password=password,
            decode_responses=True
        )

        await self._redis.ping()
        self._pubsub = self._redis.pubsub()

        self.logger.info("Redis fanout connected")

    async def disconnect(self):
        self._running = False

        if self._listener_task:
            self._listener_task.cancel()
            try:
                await self._listener_task
            except asyncio.CancelledError:
                pass

        if self._pubsub:
            await self._pubsub.close()

        if self._redis:
            await self._redis.close()

        self.logger.info("Redis fanout disconnected")
    
    # -------------------- LISTENER --------------------
    
    async def start_listening(self):
        if not self._redis or not self._pubsub:
            raise RuntimeError("Redis not connected")

        pattern = f"{self._channel_prefix}:*"
        await self._pubsub.psubscribe(pattern)

        self.logger.info(f"Subscribed to Redis pattern: {pattern}")
        self._running = True

        try:
            async for message in self._pubsub.listen():
                if not self._running:
                    break

                if message["type"] != "pmessage":
                    continue
                await self._handle_message(message)

        except asyncio.CancelledError:
            self.logger.info("Redis fanout listener cancelled")
        except Exception as e:
            self.logger.error(f"Redis fanout listener crashed: {e}")
    
    # -------------------- MESSAGE HANDLING --------------------
    
    async def _handle_message(self, message: dict):
        try:
            channel = message["channel"]
            raw_data = message["data"]

            parts = channel.split(":")
            if len(parts) < 4 or parts[0] != self._channel_prefix:
                return

            tenant_id = parts[1]
            room_id = parts[2]
            event_type = parts[3]

            try:
                data = json.loads(raw_data)
            except Exception:
                data = raw_data
            
            self.logger.debug(
                f"Event [{event_type}] tenant={tenant_id} room={room_id}"
            )

            if event_type == "room_message":
                await self._handle_room_message(tenant_id, room_id, data)
            elif event_type == "broadcast":
                await self._handle_broadcast(tenant_id, data)
            elif event_type == "direct_message":
                await self._handle_direct_message(tenant_id, data)
            else:
                self.logger.warning(f"Unknown event type: {event_type}")

        except Exception as e:
            self.logger.error(f"Error handling message: {e}")
    
    async def _handle_room_message(self, tenant_id: str, room_id: str, data):
        await ConnectionStore.group_send(
            tenant_id = tenant_id,
            room_id = room_id,
            payload = data,
            save_history=True
        )
    
    async def _handle_broadcast(self, tenant_id: str, data):
        tenant_rooms = ConnectionStore.CHANNEL_GROUPS.get(tenant_id, {})

        for room_id in tenant_rooms.keys():
            await ConnectionStore.group_send(
                tenant_id,
                room_id,
                data,
                save_history=False
            )
    
    async def _handle_direct_message(self, tenant_id: str, data):
        target_client_id = data.get("target_client_id")
        if not target_client_id:
            return

        connections = await ConnectionStore.get_connections_in_tenant(tenant_id)

        for connection in connections:
            if str(connection.uuid) == target_client_id:
                await connection._send(data)
                break


# Global instance
redis_fanout = RedisFanout()
