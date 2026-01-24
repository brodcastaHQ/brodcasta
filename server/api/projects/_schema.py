from pydantic import BaseModel
from typing import Optional
from models.projects import AuthType


class ProjectCreate(BaseModel):
    name: str
    history_enabled: Optional[bool] = True
    auth_type: Optional[AuthType] = AuthType.NONE


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    history_enabled: Optional[bool] = None
    auth_type: Optional[AuthType] = None


class ProjectResponse(BaseModel):
    id: str
    name: str
    history_enabled: bool
    auth_type: AuthType
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


class SecretResponse(BaseModel):
    project_secret: str
    message: str
