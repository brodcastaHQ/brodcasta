import json
import asyncio
from typing import Optional, Dict, Any
from datetime import datetime
from events.emitter import emitter
from models.analytics import ProjectAnalytics, EventType, ConnectionType
from app.core.channels.base import BaseChannel


class AnalyticsTracker:
    """Background analytics tracker using existing Nexios event system"""
    
    def __init__(self):
        self._setup_event_handlers()
    
    def _setup_event_handlers(self):
        """Setup event handlers for analytics tracking using existing emitter"""
        
        # Listen to existing events
        emitter.on("client.connected", self._handle_client_connected)
        emitter.on("client.disconnected", self._handle_client_disconnected)
        emitter.on("presence.joined", self._handle_room_joined)
        emitter.on("presence.leave", self._handle_room_left)
        emitter.on("message.send", self._handle_message_send)
        emitter.on("message.broadcast", self._handle_message_broadcast)
        emitter.on("message.direct", self._handle_message_direct)
    
    async def _handle_client_connected(self, channel: BaseChannel, project_id: str):
        """Handle client connected event"""
        # Run in background task
        asyncio.create_task(self._track_client_connected(channel, project_id))
    
    async def _handle_client_disconnected(self, channel: BaseChannel, project_id: str):
        """Handle client disconnected event"""
        asyncio.create_task(self._track_client_disconnected(channel, project_id))
    
    async def _handle_room_joined(self, channel: BaseChannel, project_id: str, data: dict):
        """Handle room joined event"""
        asyncio.create_task(self._track_room_joined(channel, project_id, data))
    
    async def _handle_room_left(self, channel: BaseChannel, project_id: str, data: dict):
        """Handle room left event"""
        asyncio.create_task(self._track_room_left(channel, project_id, data))
    
    async def _handle_message_send(self, channel: BaseChannel, project_id: str, data: dict[str, str]):
        """Handle message send event"""
        asyncio.create_task(self._track_message_send(channel, project_id, data))
    
    async def _handle_message_broadcast(self, channel: BaseChannel, project_id: str, data: dict[str, str]):
        """Handle message broadcast event"""
        asyncio.create_task(self._track_message_broadcast(channel, project_id, data))
    
    async def _handle_message_direct(self, channel: BaseChannel, project_id: str, data: dict[str, str]):
        """Handle message direct event"""
        asyncio.create_task(self._track_message_direct(channel, project_id, data))
    
    # Background tracking methods
    async def _track_client_connected(self, channel: BaseChannel, project_id: str):
        """Track client connected in background"""
        try:
            connection_type = ConnectionType.WEBSOCKET if hasattr(channel, 'websocket') else ConnectionType.SSE
            
            await ProjectAnalytics.track_event(
                project_id=project_id,
                event_type=EventType.CLIENT_CONNECTED,
                connection_type=connection_type,
                client_id=str(channel.uuid),
                event_data={"connected_at": datetime.now().isoformat()}
            )
        except Exception as e:
            print(f"Analytics tracking error: {e}")
    
    async def _track_client_disconnected(self, channel: BaseChannel, project_id: str):
        """Track client disconnected in background"""
        try:
            connection_type = ConnectionType.WEBSOCKET if hasattr(channel, 'websocket') else ConnectionType.SSE
            
            await ProjectAnalytics.track_event(
                project_id=project_id,
                event_type=EventType.CLIENT_DISCONNECTED,
                connection_type=connection_type,
                client_id=str(channel.uuid),
                event_data={"disconnected_at": datetime.now().isoformat()}
            )
        except Exception as e:
            print(f"Analytics tracking error: {e}")
    
    async def _track_room_joined(self, channel: BaseChannel, project_id: str, data: dict):
        """Track room joined in background"""
        try:
            room_id = data.get("room_id")
            if not room_id:
                return
                
            connection_type = ConnectionType.WEBSOCKET if hasattr(channel, 'websocket') else ConnectionType.SSE
            
            await ProjectAnalytics.track_event(
                project_id=project_id,
                event_type=EventType.ROOM_JOINED,
                connection_type=connection_type,
                room_id=room_id,
                client_id=str(channel.uuid),
                event_data={"joined_at": datetime.now().isoformat()}
            )
        except Exception as e:
            print(f"Analytics tracking error: {e}")
    
    async def _track_room_left(self, channel: BaseChannel, project_id: str, data: dict):
        """Track room left in background"""
        try:
            room_id = data.get("room_id")
            if not room_id:
                return
                
            connection_type = ConnectionType.WEBSOCKET if hasattr(channel, 'websocket') else ConnectionType.SSE
            
            await ProjectAnalytics.track_event(
                project_id=project_id,
                event_type=EventType.ROOM_LEFT,
                connection_type=connection_type,
                room_id=room_id,
                client_id=str(channel.uuid),
                event_data={"left_at": datetime.now().isoformat()}
            )
        except Exception as e:
            print(f"Analytics tracking error: {e}")
    
    async def _track_message_send(self, channel: BaseChannel, project_id: str, data: dict[str, str]):
        """Track message send in background"""
        try:
            room_id = data.get("room_id")
            message_content = data.get("message")
            connection_type = ConnectionType.WEBSOCKET if hasattr(channel, 'websocket') else ConnectionType.SSE
            message_size = len(json.dumps(message_content).encode('utf-8')) if message_content else 0
            
            await ProjectAnalytics.track_event(
                project_id=project_id,
                event_type=EventType.MESSAGE_SENT,
                connection_type=connection_type,
                room_id=room_id,
                client_id=str(channel.uuid),
                message_size=message_size,
                event_data={"message_preview": str(message_content)[:100] if message_content else ""}
            )
        except Exception as e:
            print(f"Analytics tracking error: {e}")
    
    async def _track_message_broadcast(self, channel: BaseChannel, project_id: str, data: dict[str, str]):
        """Track message broadcast in background"""
        try:
            message_content = data.get("message")
            connection_type = ConnectionType.WEBSOCKET if hasattr(channel, 'websocket') else ConnectionType.SSE
            message_size = len(json.dumps(message_content).encode('utf-8')) if message_content else 0
            
            await ProjectAnalytics.track_event(
                project_id=project_id,
                event_type=EventType.BROADCAST_SENT,
                connection_type=connection_type,
                client_id=str(channel.uuid),
                message_size=message_size,
                event_data={"message_preview": str(message_content)[:100] if message_content else ""}
            )
        except Exception as e:
            print(f"Analytics tracking error: {e}")
    
    async def _track_message_direct(self, channel: BaseChannel, project_id: str, data: dict[str, str]):
        """Track message direct in background"""
        try:
            target_client_id = data.get("target_client_id")
            message_content = data.get("message")
            connection_type = ConnectionType.WEBSOCKET if hasattr(channel, 'websocket') else ConnectionType.SSE
            message_size = len(json.dumps(message_content).encode('utf-8')) if message_content else 0
            
            await ProjectAnalytics.track_event(
                project_id=project_id,
                event_type=EventType.DIRECT_SENT,
                connection_type=connection_type,
                client_id=str(channel.uuid),
                message_size=message_size,
                event_data={
                    "target_client_id": target_client_id,
                    "message_preview": str(message_content)[:100] if message_content else ""
                }
            )
        except Exception as e:
            print(f"Analytics tracking error: {e}")


# Global analytics tracker instance
analytics_tracker = AnalyticsTracker()
