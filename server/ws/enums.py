from enum import Enum


class ClientEvent(str, Enum):
    CONNECT = "connect"
    DISCONNECT = "disconnect"

    AUTH = "auth"
    AUTH_OK = "auth.ok"
    AUTH_ERROR = "auth.error"

    JOIN_CHANNEL = "channel.join"
    LEAVE_CHANNEL = "channel.leave"

    PRESENCE_JOIN = "presence.join"
    PRESENCE_LEAVE = "presence.leave"

    PUBLISH = "message.publish"
    MESSAGE = "message"

    ACK = "ack"
    ERROR = "error"

    PING = "ping"
    PONG = "pong"
