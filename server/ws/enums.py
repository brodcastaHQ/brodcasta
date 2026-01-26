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

    ACK = "ack"
    ERROR = "error"

    PING = "ping"
    PONG = "pong"
