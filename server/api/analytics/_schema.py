from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import date, datetime
from models.analytics import EventType, ConnectionType


class AnalyticsFilterParams(BaseModel):
    filter_type: str = Field("day", description="Filter type: hour, day, week, month, all")
    start_date: Optional[date] = Field(None, description="Start date for custom range")
    end_date: Optional[date] = Field(None, description="End date for custom range")
    event_types: Optional[List[EventType]] = Field(None, description="Filter by event types")
    room_id: Optional[str] = Field(None, description="Filter by specific room")


class AnalyticsEventResponse(BaseModel):
    id: str
    event_type: EventType
    connection_type: Optional[ConnectionType] = None
    room_id: Optional[str] = None
    client_id: Optional[str] = None
    message_size: Optional[int] = None
    event_data: Dict[str, Any]
    created_at: datetime
    event_date: date
    event_hour: int

    class Config:
        from_attributes = True


class AnalyticsStatsResponse(BaseModel):
    total_events: int
    messages_sent: int
    messages_received: int
    broadcasts_sent: int
    broadcasts_received: int
    direct_sent: int
    direct_received: int
    connections: int
    disconnections: int
    rooms_joined: int
    rooms_left: int
    websocket_connections: int
    sse_connections: int
    total_message_size: int
    avg_message_size: float


class ChartDataResponse(BaseModel):
    labels: List[str]
    datasets: Dict[str, List[int]]


class AnalyticsOverviewResponse(BaseModel):
    current_stats: AnalyticsStatsResponse
    hourly_chart: ChartDataResponse
    daily_chart: ChartDataResponse
    event_type_chart: ChartDataResponse
    connection_type_chart: ChartDataResponse
