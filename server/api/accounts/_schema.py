from pydantic import BaseModel, EmailStr
from typing import Optional
from models.accounts import Plan


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    company: Optional[str] = None
    plan: Plan = Plan.FREE


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    company: Optional[str] = None
    plan: Plan
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
