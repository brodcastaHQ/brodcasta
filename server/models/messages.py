from tortoise import fields
from ._base import BaseModel
from typing import Dict, Any


class Message(BaseModel):
    """Model for persisting user messages (not system events)"""
    
    # Core message fields
    project = fields.ForeignKeyField("models.Project", related_name="messages", on_delete=fields.CASCADE)
    room_id = fields.CharField(max_length=255, index=True)
    
    # Message content - just the actual message data
    data = fields.JSONField(default=dict)
    
    # Optional message metadata
    sender_id = fields.CharField(max_length=255, null=True, index=True)
    message_type = fields.CharField(max_length=50, null=True, index=True)  # room_message, broadcast_message, direct_message
    
    class Meta:
        table = "messages"
        indexes = [
            ("project_id", "room_id", "created_at"),
            ("project_id", "sender_id", "created_at"),
            ("project_id", "message_type", "created_at"),
        ]
    
    @classmethod
    async def create_message(
        cls,
        project_id: str,
        room_id: str,
        data: Dict[str, Any],
        sender_id: str = None,
        message_type: str = None
    ):
        """Create a new message record from user message data"""
        return await cls.create(
            project_id=project_id,
            room_id=room_id,
            data=data,
            sender_id=sender_id,
            message_type=message_type
        )
    
    @classmethod
    async def get_room_messages(
        cls, 
        project_id: str, 
        room_id: str, 
        limit: int = 50, 
        offset: int = 0
    ):
        """Get messages for a specific room"""
        return await cls.filter(
            project_id=project_id,
            room_id=room_id
        ).order_by("-created_at").offset(offset).limit(limit)
    
    @classmethod
    async def get_project_stats(cls, project_id: str):
        """Get message statistics for a project"""
        total_messages = await cls.filter(project_id=project_id).count()
        
        return {
            "total_messages": total_messages
        }
    
    async def to_dict(self) -> Dict[str, Any]:
        """Convert message to dictionary representation"""
        return {
            "id": str(self.id),
            "project_id": str(self.project_id),
            "room_id": self.room_id,
            "data": self.data,
            "sender_id": self.sender_id,
            "message_type": self.message_type,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }
    
    async def to_response_dict(self) -> Dict[str, Any]:
        """Convert to response dictionary"""
        return {
            "id": str(self.id),
            "room_id": self.room_id,
            "data": self.data,
            "sender_id": self.sender_id,
            "message_type": self.message_type,
            "created_at": self.created_at.isoformat()
        }
