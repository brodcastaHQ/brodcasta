import logging
from collections import deque
from nexios.events import AsyncEventEmitter
from nexios.websockets import WebSocket
from nexios.websockets.channels import ChannelBox, ChannelMessageDC, Channel, GroupSendStatusEnum

# ---------------- Logger ----------------
class ConnectionLogger:
    LOGGER_NAME = "ConnectionStore"
    _logger = None

    @classmethod
    def get_logger(cls):
        if cls._logger:
            return cls._logger
        cls._logger = logging.getLogger(cls.LOGGER_NAME)
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            "[%(asctime)s] [%(levelname)s] %(name)s: %(message)s"
        )
        handler.setFormatter(formatter)
        cls._logger.addHandler(handler)
        cls._logger.setLevel(logging.DEBUG)
        return cls._logger


# ---------------- Connection Store ----------------
class ConnectionStore(ChannelBox):
    CHANNEL_GROUPS: dict[str, dict[str, dict[Channel, ...]]] = {}
    CHANNEL_GROUPS_HISTORY: dict[str, dict[str, deque]] = {}
    MEMORY_HISTORY_SIZE = 100
    DEFAULT_ROOM = "pingly_default"

    store_message_hook = None
    get_history_hook = None
    flush_history_hook = None

    logger = ConnectionLogger.get_logger()

    @classmethod
    async def add_tenant(cls, tenant_id: str):
        cls.CHANNEL_GROUPS.setdefault(tenant_id, {})
        cls.CHANNEL_GROUPS_HISTORY.setdefault(tenant_id, {})
        cls.logger.debug(f"Tenant added/verified: {tenant_id}")

    @classmethod
    async def add_room(cls, tenant_id: str, room_id: str):
        await cls.add_tenant(tenant_id)
        cls.CHANNEL_GROUPS[tenant_id].setdefault(room_id, {})
        cls.CHANNEL_GROUPS_HISTORY[tenant_id].setdefault(
            room_id, deque(maxlen=cls.MEMORY_HISTORY_SIZE)
        )
        cls.logger.debug(f"Room added/verified: {tenant_id}/{room_id}")

    @classmethod
    async def add_channel_to_group(cls, tenant_id: str, channel: Channel, room_id: str = None):
        if not room_id:
            room_id = cls.DEFAULT_ROOM
        await cls.add_room(tenant_id, room_id)
        cls.CHANNEL_GROUPS[tenant_id][room_id][channel] = ...
        cls.logger.info(f"Channel {channel.uuid} added to {tenant_id}/{room_id}")

    @classmethod
    async def remove_channel(cls, channel: Channel, tenant_id: str, room_id: str = None):
        if tenant_id not in cls.CHANNEL_GROUPS:
            cls.logger.warning(f"Tried to remove channel from non-existent tenant {tenant_id}")
            return

        target_rooms = [room_id] if room_id else list(cls.CHANNEL_GROUPS[tenant_id].keys())
        for r in target_rooms:
            removed = cls.CHANNEL_GROUPS[tenant_id].get(r, {}).pop(channel, None)
            if removed:
                cls.logger.info(f"Channel {channel.uuid} removed from {tenant_id}/{r}")
            if not cls.CHANNEL_GROUPS[tenant_id].get(r):
                cls.CHANNEL_GROUPS[tenant_id].pop(r, None)
                cls.logger.debug(f"Room removed as empty: {tenant_id}/{r}")

        if not cls.CHANNEL_GROUPS.get(tenant_id):
            cls.CHANNEL_GROUPS.pop(tenant_id, None)
            cls.logger.debug(f"Tenant removed as empty: {tenant_id}")

    @classmethod
    async def group_send(cls, tenant_id: str, room_id: str, payload=None, save_history: bool = False) -> GroupSendStatusEnum:
        if payload is None:
            payload = {}

        if save_history:
            msg = ChannelMessageDC(payload=payload)
            if cls.store_message_hook:
                await cls.store_message_hook(tenant_id, room_id, msg)
            else:
                await cls.add_room(tenant_id, room_id)
                cls.CHANNEL_GROUPS_HISTORY[tenant_id][room_id].append(msg)
            cls.logger.debug(f"Message stored in history: {tenant_id}/{room_id} -> {payload}")

        status = GroupSendStatusEnum.NO_SUCH_GROUP
        for channel in cls.CHANNEL_GROUPS.get(tenant_id, {}).get(room_id, {}):
            await channel._send(payload)
            status = GroupSendStatusEnum.GROUP_SEND
        cls.logger.info(f"Message sent to group: {tenant_id}/{room_id} -> {payload}")
        return status

    @classmethod
    async def show_history(cls, tenant_id: str, room_id: str):
        if cls.get_history_hook:
            return await cls.get_history_hook(tenant_id, room_id)
        return list(cls.CHANNEL_GROUPS_HISTORY.get(tenant_id, {}).get(room_id, []))

    @classmethod
    async def flush_history(cls):
        if cls.flush_history_hook:
            await cls.flush_history_hook()
        else:
            cls.CHANNEL_GROUPS_HISTORY = {}
        cls.logger.info("All history flushed")

    @classmethod
    async def get_connections_in_tenant(cls, tenant_id: str):
        conns = []
        for room_channels in cls.CHANNEL_GROUPS.get(tenant_id, {}).values():
            conns.extend(list(room_channels.keys()))
        cls.logger.debug(f"Retrieved connections in tenant {tenant_id}: {len(conns)}")
        return conns

    @classmethod
    async def get_connections_in_tenant_room(cls, tenant_id: str, room_id: str):
        conns = list(cls.CHANNEL_GROUPS.get(tenant_id, {}).get(room_id, {}).keys())
        cls.logger.debug(f"Retrieved connections in room {tenant_id}/{room_id}: {len(conns)}")
        return conns

    @classmethod
    async def count_connections_in_tenant(cls, tenant_id: str):
        count = sum(len(channels) for channels in cls.CHANNEL_GROUPS.get(tenant_id, {}).values())
        cls.logger.debug(f"Count connections in tenant {tenant_id}: {count}")
        return count

    @classmethod
    async def count_connections_in_tenant_room(cls, tenant_id: str, room_id: str):
        count = len(cls.CHANNEL_GROUPS.get(tenant_id, {}).get(room_id, {}))
        cls.logger.debug(f"Count connections in room {tenant_id}/{room_id}: {count}")
        return count

    @classmethod
    async def close_all_connections(cls):
        for tenant_rooms in cls.CHANNEL_GROUPS.values():
            for room_channels in tenant_rooms.values():
                for channel in list(room_channels.keys()):
                    await channel.websocket.close()
                    cls.logger.info(f"Closed connection {channel.uuid}")
        cls.CHANNEL_GROUPS = {}
        cls.CHANNEL_GROUPS_HISTORY = {}
        cls.logger.info("All connections closed and cleared")



