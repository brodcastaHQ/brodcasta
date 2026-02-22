from tortoise import fields
from ._base import BaseModel
from enum import Enum
from datetime import datetime, date


class EventType(str, Enum):
    MESSAGE_SENT = "message_sent"
    MESSAGE_RECEIVED = "message_received"
    BROADCAST_SENT = "broadcast_sent"
    BROADCAST_RECEIVED = "broadcast_received"
    DIRECT_SENT = "direct_sent"
    DIRECT_RECEIVED = "direct_received"
    CLIENT_CONNECTED = "client_connected"
    CLIENT_DISCONNECTED = "client_disconnected"
    ROOM_JOINED = "room_joined"
    ROOM_LEFT = "room_left"


class ConnectionType(str, Enum):
    WEBSOCKET = "websocket"
    SSE = "sse"


class ProjectAnalytics(BaseModel):
    """Single analytics model for all project events with filtering capabilities"""
    project = fields.ForeignKeyField("models.Project", related_name="analytics", on_delete=fields.CASCADE)
    event_type = fields.CharEnumField(EventType)
    connection_type = fields.CharEnumField(ConnectionType, null=True)
    room_id = fields.CharField(max_length=255, null=True)
    client_id = fields.CharField(max_length=255, null=True)
    message_size = fields.IntField(null=True)  # Size in bytes
    event_data = fields.JSONField(default=dict)  # Additional event metadata
    
    # Timestamps for filtering
    created_at = fields.DatetimeField(auto_now_add=True)
    event_date = fields.DateField(default=date.today)
    event_hour = fields.IntField(default=lambda: datetime.now().hour)  # 0-23
    event_day_of_week = fields.IntField(default=lambda: datetime.now().weekday())  # 0-6 (Monday=0)
    event_week = fields.IntField(default=lambda: datetime.now().isocalendar()[1])  # ISO week
    event_month = fields.IntField(default=lambda: datetime.now().month)
    event_year = fields.IntField(default=lambda: datetime.now().year)
    
    class Meta:
        table = "project_analytics"
        indexes = [
            ("project_id", "created_at"),
            ("project_id", "event_date"),
            ("project_id", "event_type"),
            ("project_id", "event_date", "event_hour"),
            ("project_id", "event_week"),
            ("project_id", "event_month", "event_year"),
            ("event_date", "event_type"),
            ("event_hour",),
            ("event_day_of_week",),
        ]
    
    @classmethod
    async def track_event(
        cls,
        project_id: str,
        event_type: EventType,
        connection_type: ConnectionType = None,
        room_id: str = None,
        client_id: str = None,
        message_size: int = None,
        event_data: dict = None
    ):
        """Track an analytics event"""
        now = datetime.now()
        return await cls.create(
            project_id=project_id,
            event_type=event_type,
            connection_type=connection_type,
            room_id=room_id,
            client_id=client_id,
            message_size=message_size,
            event_data=event_data or {},
            event_date=now.date(),
            event_hour=now.hour,
            event_day_of_week=now.weekday(),
            event_week=now.isocalendar()[1],
            event_month=now.month,
            event_year=now.year
        )
    
    @classmethod
    async def get_filtered(
        cls,
        project_id: str,
        filter_type: str = "all",  # "hour", "day", "week", "month", "all"
        start_date: date = None,
        end_date: date = None,
        event_types: list[EventType] = None,
        room_id: str = None
    ):
        """Get analytics with filtering"""
        query = cls.filter(project_id=project_id)
        
        # Time-based filtering
        now = datetime.now()
        
        if filter_type == "hour":
            query = query.filter(event_date=now.date(), event_hour=now.hour)
        elif filter_type == "day":
            query = query.filter(event_date=now.date())
        elif filter_type == "week":
            query = query.filter(event_week=now.isocalendar()[1], event_year=now.year)
        elif filter_type == "month":
            query = query.filter(event_month=now.month, event_year=now.year)
        # "all" case - no time filtering applied
        
        # Custom date range
        if start_date:
            query = query.filter(event_date__gte=start_date)
        if end_date:
            query = query.filter(event_date__lte=end_date)
        
        # Event type filtering
        if event_types:
            query = query.filter(event_type__in=event_types)
        
        # Room filtering
        if room_id:
            query = query.filter(room_id=room_id)
        
        return await query.order_by('-created_at').limit(1000)
    
    @classmethod
    async def get_aggregated_stats(
        cls,
        project_id: str,
        filter_type: str = "day",
        start_date: date = None,
        end_date: date = None
    ):
        """Get aggregated statistics for charts"""
        query = cls.filter(project_id=project_id)
        
        # Apply time filtering
        now = datetime.now()
        if filter_type == "hour":
            query = query.filter(event_date=now.date(), event_hour=now.hour)
        elif filter_type == "day":
            query = query.filter(event_date=now.date())
        elif filter_type == "week":
            query = query.filter(event_week=now.isocalendar()[1], event_year=now.year)
        elif filter_type == "month":
            query = query.filter(event_month=now.month, event_year=now.year)
        # "all" case - no time filtering applied
        
        if start_date:
            query = query.filter(event_date__gte=start_date)
        if end_date:
            query = query.filter(event_date__lte=end_date)
        
        # Get aggregated counts
        events = await query.all()
        
        stats = {
            'total_events': len(events),
            'messages_sent': len([e for e in events if e.event_type == EventType.MESSAGE_SENT]),
            'messages_received': len([e for e in events if e.event_type == EventType.MESSAGE_RECEIVED]),
            'broadcasts_sent': len([e for e in events if e.event_type == EventType.BROADCAST_SENT]),
            'broadcasts_received': len([e for e in events if e.event_type == EventType.BROADCAST_RECEIVED]),
            'direct_sent': len([e for e in events if e.event_type == EventType.DIRECT_SENT]),
            'direct_received': len([e for e in events if e.event_type == EventType.DIRECT_RECEIVED]),
            'connections': len([e for e in events if e.event_type == EventType.CLIENT_CONNECTED]),
            'disconnections': len([e for e in events if e.event_type == EventType.CLIENT_DISCONNECTED]),
            'rooms_joined': len([e for e in events if e.event_type == EventType.ROOM_JOINED]),
            'rooms_left': len([e for e in events if e.event_type == EventType.ROOM_LEFT]),
            'websocket_connections': len([e for e in events if e.connection_type == ConnectionType.WEBSOCKET]),
            'sse_connections': len([e for e in events if e.connection_type == ConnectionType.SSE]),
            'total_message_size': sum(e.message_size or 0 for e in events),
            'avg_message_size': 0,
        }
        
        # Calculate average message size
        message_events = [e for e in events if e.message_size is not None]
        if message_events:
            stats['avg_message_size'] = sum(e.message_size for e in message_events) / len(message_events)
        
        return stats
