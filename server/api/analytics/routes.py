from typing import Optional, List
from nexios import status
from nexios.http import Request, Response
from nexios.routing import Router
from nexios.auth.decorator import auth
from ._schema import (
    AnalyticsFilterParams,
    AnalyticsEventResponse,
    AnalyticsStatsResponse,
    ChartDataResponse,
    AnalyticsOverviewResponse
)
from models.analytics import ProjectAnalytics, EventType, ConnectionType
from models.projects import Project
from datetime import datetime, date, timedelta
from collections import defaultdict


router = Router(prefix="/analytics", tags=["analytics"])


@router.get("/projects/{project_id}/overview",
           summary="Get project analytics overview",
           responses=AnalyticsOverviewResponse)
@auth()
async def get_analytics_overview(request: Request, response: Response):
    """Get comprehensive analytics overview for a project"""
    project_id = request.path_params.project_id
    
    # Verify project ownership
    project = await Project.get_or_none(
        id=project_id,
        account_id=request.user.identity,
        deleted_at__isnull=True
    )
    
    if not project:
        return response.json(
            {"detail": "Project not found"},
            status_code=status.HTTP_404_NOT_FOUND
        )
    
    # Parse query parameters
    query_params = request.query_params
    filter_params = AnalyticsFilterParams(
        filter_type=query_params.get('filter_type', 'day'),
        start_date=_parse_date(query_params.get('start_date')),
        end_date=_parse_date(query_params.get('end_date')),
        room_id=query_params.get('room_id'),
        event_types=_parse_event_types(query_params.get('event_types'))
    )
    
    # Get current stats based on filter
    current_stats = await ProjectAnalytics.get_aggregated_stats(
        project_id=project_id,
        filter_type=filter_params.filter_type,
        start_date=filter_params.start_date,
        end_date=filter_params.end_date
    )
    
    # Get hourly data based on filter
    hourly_events = await ProjectAnalytics.get_filtered(
        project_id=project_id,
        filter_type=filter_params.filter_type,
        start_date=filter_params.start_date,
        end_date=filter_params.end_date
    )
    
    hourly_chart_data = _generate_hourly_chart(hourly_events)
    
    # Get daily data for last 7 days (or custom range)
    if filter_params.start_date and filter_params.end_date:
        daily_events = await ProjectAnalytics.get_filtered(
            project_id=project_id,
            start_date=filter_params.start_date,
            end_date=filter_params.end_date
        )
    else:
        daily_events = await ProjectAnalytics.get_filtered(
            project_id=project_id,
            start_date=date.today() - timedelta(days=7),
            end_date=date.today()
        )
    
    daily_chart_data = _generate_daily_chart(daily_events)
    
    # Get event type distribution
    event_type_chart_data = _generate_event_type_chart(hourly_events)
    
    # Get connection type distribution
    connection_type_chart_data = _generate_connection_type_chart(hourly_events)
    
    return AnalyticsOverviewResponse(
        current_stats=AnalyticsStatsResponse(**current_stats),
        hourly_chart=ChartDataResponse(**hourly_chart_data),
        daily_chart=ChartDataResponse(**daily_chart_data),
        event_type_chart=ChartDataResponse(**event_type_chart_data),
        connection_type_chart=ChartDataResponse(**connection_type_chart_data)
    )


@router.get("/projects/{project_id}/events",
           summary="Get project analytics events",
           responses=list[AnalyticsEventResponse])
@auth()
async def get_analytics_events(request: Request, response: Response):
    """Get analytics events for a project with filtering"""
    project_id = request.path_params.project_id
    
    # Verify project ownership
    project = await Project.get_or_none(
        id=project_id,
        account_id=request.user.identity,
        deleted_at__isnull=True
    )
    
    if not project:
        return response.json(
            {"detail": "Project not found"},
            status_code=status.HTTP_404_NOT_FOUND
        )
    
    # Parse query parameters
    query_params = request.query_params
    filter_params = AnalyticsFilterParams(
        filter_type=query_params.get('filter_type', 'day'),
        start_date=_parse_date(query_params.get('start_date')),
        end_date=_parse_date(query_params.get('end_date')),
        room_id=query_params.get('room_id'),
        event_types=_parse_event_types(query_params.get('event_types'))
    )
    
    # Get filtered events
    events = await ProjectAnalytics.get_filtered(
        project_id=project_id,
        filter_type=filter_params.filter_type,
        start_date=filter_params.start_date,
        end_date=filter_params.end_date,
        event_types=filter_params.event_types,
        room_id=filter_params.room_id
    )
    
    return [
        AnalyticsEventResponse(
            id=str(event.id),
            event_type=event.event_type,
            connection_type=event.connection_type,
            room_id=event.room_id,
            client_id=event.client_id,
            message_size=event.message_size,
            event_data=event.event_data,
            created_at=event.created_at,
            event_date=event.event_date,
            event_hour=event.event_hour
        )
        for event in events
    ]


@router.get("/projects/{project_id}/stats",
           summary="Get project analytics statistics",
           responses=AnalyticsStatsResponse)
@auth()
async def get_analytics_stats(request: Request, response: Response):
    """Get aggregated statistics for a project"""
    project_id = request.path_params.project_id
    
    # Verify project ownership
    project = await Project.get_or_none(
        id=project_id,
        account_id=request.user.identity,
        deleted_at__isnull=True
    )
    
    if not project:
        return response.json(
            {"detail": "Project not found"},
            status_code=status.HTTP_404_NOT_FOUND
        )
    
    # Parse query parameters
    query_params = request.query_params
    filter_type = query_params.get('filter_type', 'day')
    start_date = _parse_date(query_params.get('start_date'))
    end_date = _parse_date(query_params.get('end_date'))
    
    # Get aggregated stats
    stats = await ProjectAnalytics.get_aggregated_stats(
        project_id=project_id,
        filter_type=filter_type,
        start_date=start_date,
        end_date=end_date
    )
    
    return AnalyticsStatsResponse(**stats)


@router.get("/projects/{project_id}/charts/{chart_type}",
           summary="Get chart data for analytics",
           responses=ChartDataResponse)
@auth()
async def get_chart_data(request: Request, response: Response):
    """Get chart data for different analytics views"""
    project_id = request.path_params.project_id
    chart_type = request.path_params.chart_type
    
    # Verify project ownership
    project = await Project.get_or_none(
        id=project_id,
        account_id=request.user.identity,
        deleted_at__isnull=True
    )
    
    if not project:
        return response.json(
            {"detail": "Project not found"},
            status_code=status.HTTP_404_NOT_FOUND
        )
    
    # Parse query parameters
    query_params = request.query_params
    filter_type = query_params.get('filter_type', 'day')
    start_date = _parse_date(query_params.get('start_date'))
    end_date = _parse_date(query_params.get('end_date'))
    
    # Get events
    events = await ProjectAnalytics.get_filtered(
        project_id=project_id,
        filter_type=filter_type,
        start_date=start_date,
        end_date=end_date
    )
    
    # Generate chart data based on chart type
    if chart_type == "hourly":
        chart_data = _generate_hourly_chart(events)
    elif chart_type == "daily":
        chart_data = _generate_daily_chart(events)
    elif chart_type == "event_types":
        chart_data = _generate_event_type_chart(events)
    elif chart_type == "connection_types":
        chart_data = _generate_connection_type_chart(events)
    else:
        return response.json(
            {"detail": "Invalid chart type"},
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    return ChartDataResponse(**chart_data)


# Helper functions
def _parse_date(date_str: str) -> Optional[date]:
    """Parse date string to date object"""
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return None


def _parse_event_types(event_types_str: str) -> Optional[List[EventType]]:
    """Parse event types string to list"""
    if not event_types_str:
        return None
    try:
        types = event_types_str.split(',')
        return [EventType(t.strip()) for t in types if t.strip()]
    except ValueError:
        return None


def _generate_hourly_chart(events):
    """Generate hourly chart data"""
    hours = list(range(24))
    labels = [f"{h:02d}:00" for h in hours]
    
    datasets = defaultdict(list)
    
    for hour in hours:
        hour_events = [e for e in events if e.event_hour == hour]
        
        datasets['messages_sent'].append(
            len([e for e in hour_events if e.event_type == EventType.MESSAGE_SENT])
        )
        datasets['messages_received'].append(
            len([e for e in hour_events if e.event_type == EventType.MESSAGE_RECEIVED])
        )
        datasets['connections'].append(
            len([e for e in hour_events if e.event_type == EventType.CLIENT_CONNECTED])
        )
    
    return {
        "labels": labels,
        "datasets": dict(datasets)
    }


def _generate_daily_chart(events):
    """Generate daily chart data for last 7 days"""
    days = 7
    labels = []
    datasets = defaultdict(list)
    
    for i in range(days):
        day = date.today() - timedelta(days=days-1-i)
        labels.append(day.strftime("%a"))
        
        day_events = [e for e in events if e.event_date == day]
        
        datasets['messages_sent'].append(
            len([e for e in day_events if e.event_type == EventType.MESSAGE_SENT])
        )
        datasets['messages_received'].append(
            len([e for e in day_events if e.event_type == EventType.MESSAGE_RECEIVED])
        )
        datasets['connections'].append(
            len([e for e in day_events if e.event_type == EventType.CLIENT_CONNECTED])
        )
    
    return {
        "labels": labels,
        "datasets": dict(datasets)
    }


def _generate_event_type_chart(events):
    """Generate event type distribution chart"""
    event_counts = defaultdict(int)
    for event in events:
        event_counts[event.event_type.value] += 1
    
    return {
        "labels": list(event_counts.keys()),
        "datasets": {"count": list(event_counts.values())}
    }


def _generate_connection_type_chart(events):
    """Generate connection type distribution chart"""
    connection_counts = defaultdict(int)
    for event in events:
        if event.connection_type:
            connection_counts[event.connection_type.value] += 1
    
    return {
        "labels": list(connection_counts.keys()),
        "datasets": {"count": list(connection_counts.values())}
    }
