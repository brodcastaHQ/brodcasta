from nexios import status
from nexios.http import Request, Response
from nexios.routing import Router
from nexios.auth.decorator import auth
from tortoise.exceptions import DoesNotExist
from typing import Optional
import logging

from models import Message, Project
from models.accounts import Account

router = Router(prefix="/messages", tags=["messages"])
logger = logging.getLogger(__name__)


@router.get("/project/{project_id}", 
           summary="Get messages for a project",
           responses=dict)
@auth()
async def get_project_messages(request: Request, response: Response, project_id: str):
    """Get messages for a specific project"""
    try:
        # Get query parameters
        room_id = request.query_params.get("room_id")
        message_type = request.query_params.get("message_type")
        limit = int(request.query_params.get("limit", 50))
        offset = int(request.query_params.get("offset", 0))
        
        # Validate limit
        if limit < 1 or limit > 1000:
            return response.json(
                {"detail": "Limit must be between 1 and 1000"},
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify project belongs to current user
        project = await Project.get_or_none(id=project_id, account_id=request.user.identity)
        if not project:
            return response.json(
                {"detail": "Project not found"},
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        # Build query
        query = Message.filter(project_id=project_id)
        
        # Apply filters
        if room_id:
            query = query.filter(room_id=room_id)
        if message_type:
            query = query.filter(message_type=message_type)
        
        # Get messages with pagination
        messages = await query.order_by("-created_at").offset(offset).limit(limit)
        
        # Convert to response format
        message_list = []
        for message in messages:
            message_dict = await message.to_response_dict()
            message_list.append(message_dict)
        
        # Get total count
        total_count = await query.count()
        
        return response.json({
            "messages": message_list,
            "pagination": {
                "total": total_count,
                "limit": limit,
                "offset": offset,
                "has_more": offset + limit < total_count
            }
        })
        
    except ValueError as e:
        return response.json(
            {"detail": f"Invalid parameter: {str(e)}"},
            status_code=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Error fetching messages for project {project_id}: {str(e)}")
        return response.json(
            {"detail": "Internal server error"},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@router.get("/project/{project_id}/rooms", 
           summary="Get rooms for a project",
           responses=dict)
@auth()
async def get_project_rooms(request: Request, response: Response, project_id: str):
    """Get all unique rooms for a project"""
    try:
        # Verify project belongs to current user
        project = await Project.get_or_none(id=project_id, account_id=request.user.identity)
        if not project:
            return response.json(
                {"detail": "Project not found"},
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        # Get unique room_ids
        rooms = await Message.filter(project_id=project_id).distinct().values_list("room_id", flat=True)
        
        return response.json({
            "rooms": list(rooms)
        })
        
    except Exception as e:
        logger.error(f"Error fetching rooms for project {project_id}: {str(e)}")
        return response.json(
            {"detail": "Internal server error"},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@router.delete("/project/{project_id}", 
           summary="Delete messages for a project",
           responses=dict)
@auth()
async def delete_project_messages(request: Request, response: Response, project_id: str):
    """Delete messages for a project (or specific room)"""
    try:
        # Get query parameters
        room_id = request.query_params.get("room_id")
        
        # Verify project belongs to current user
        project = await Project.get_or_none(id=project_id, account_id=request.user.identity)
        if not project:
            return response.json(
                {"detail": "Project not found"},
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        # Build delete query
        query = Message.filter(project_id=project_id)
        if room_id:
            query = query.filter(room_id=room_id)
        
        # Delete messages
        deleted_count = await query.count()
        await query.delete()
        
        return response.json({
            "message": f"Deleted {deleted_count} messages successfully",
            "deleted_count": deleted_count
        })
        
    except Exception as e:
        logger.error(f"Error deleting messages for project {project_id}: {str(e)}")
        return response.json(
            {"detail": "Internal server error"},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
