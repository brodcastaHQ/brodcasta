from enum import Enum


class ClientEvent(str, Enum):
    CONNECT = "connect"
    DISCONNECT = "disconnect"

    AUTH = "auth"
    AUTH_OK = "auth.ok"
    AUTH_ERROR = "auth.error"

    SUBSCRIBE = "room.subscribe"
    UNSUBSCRIBE = "room.unsubscribe"

    JOIN = "room.join"
    LEAVE = "room.leave"

    PRESENCE_JOIN = "presence.join"
    PRESENCE_LEAVE = "presence.leave"

    PUBLISH = "message.publish"
    MESSAGE = "message"

    # Message events
    MESSAGE_SEND = "message.send"
    MESSAGE_BROADCAST = "message.broadcast"
    MESSAGE_DIRECT = "message.direct"

    ACK = "ack"
    ERROR = "error"

    PING = "client.ping"
    PONG = "client.pong"
