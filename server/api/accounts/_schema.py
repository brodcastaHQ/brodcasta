from pydantic import BaseModel, EmailStr
from typing import Optional, List
from models.accounts import Role


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[Role] = Role.MEMBER


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: Role
    created_at: str
    
    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[Role] = None
    password: Optional[str] = None


class AdminUserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Role = Role.MEMBER


class UsersListResponse(BaseModel):
    users: List[UserResponse]
    total: int
    page: int
    per_page: int


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
