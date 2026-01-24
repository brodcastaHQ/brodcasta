import os
from nexios import status
from nexios.http import Request, Response
from nexios.routing import Router
from tortoise.exceptions import IntegrityError
from ._schema import UserCreate, UserLogin, UserResponse, TokenResponse
from models.accounts import Account
from utils.auth import create_access_token, create_refresh_token, verify_token


router = Router(prefix="/accounts", tags=["authentication"])


@router.post("/signup", 
            summary="Create a new user account",
            request_model=UserCreate,
            responses=TokenResponse,
            status_code=status.HTTP_201_CREATED)
async def signup(request: Request,response: Response):
    """Create a new user account"""
    data = await request.json
    user_data = UserCreate(**data)
    
    # Check if user already exists
    existing_user = await Account.get_or_none(email=user_data.email)
    if existing_user:
        return response.json(
            {"detail": "Email already registered"},
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    # Create new user
    user = await Account.create_user(
        name=user_data.name,
        email=user_data.email,
        password=user_data.password,
        company=user_data.company,
        plan=user_data.plan
    )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    
    # Create refresh token
    refresh_token = create_refresh_token(data={"sub": str(user.id), "email": user.email})
    
    user_response = UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        company=user.company,
        plan=user.plan
    )

    response.set_cookie(
        "access_token", 
        access_token, 
        max_age=3600, 
        httponly=os.getenv("ENV") == "production",
        secure=os.getenv("ENV") == "production",
        samesite="lax"
    )
    
    response.set_cookie(
        "refresh_token", 
        refresh_token, 
        max_age=7 * 24 * 3600,  # 7 days
        httponly=True,
        secure=os.getenv("ENV") == "production",
        samesite="strict"
    )
    

    return {
        "user": user_response,
        "message": "Account created successfully"
        }
      
    
  


@router.post("/login",  
            summary="Authenticate user and return access token",
            request_model=UserLogin,
            responses=TokenResponse)
async def login(request: Request,response: Response):
    """Authenticate user and return access token"""
    data = await request.json
    login_data = UserLogin(**data)
    
    # Find user by email
    user = await Account.get_or_none(email=login_data.email)
    if not user:
        return Response.json(
            {"detail": "Invalid credentials"},
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    
    # Check password
    if not await user.check_password(login_data.password):
        return Response.json(
            {"detail": "Invalid credentials"},
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    
    # Create refresh token
    refresh_token = create_refresh_token(data={"sub": str(user.id), "email": user.email})
    
    user_response = UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        company=user.company,
        plan=user.plan
    )
    
    response.set_cookie(
        "access_token", 
        access_token, 
        max_age=3600, 
        httponly=os.getenv("ENV") == "production",
        secure=os.getenv("ENV") == "production",
        samesite="lax"
    )
    
    response.set_cookie(
        "refresh_token", 
        refresh_token, 
        max_age=7 * 24 * 3600,  # 7 days
        httponly=True,
        secure=os.getenv("ENV") == "production",
        samesite="strict"
    )
    
    return {
        "user": user_response,
        "message": "Login successful"
        }
    
        

@router.post("/refresh", 
            summary="Refresh access token using refresh token",
            responses=TokenResponse)
async def refresh_token(request: Request, response: Response):
    """Refresh access token using refresh token from cookie"""
    refresh_token_cookie = request.cookies.get("refresh_token")
    
    if not refresh_token_cookie:
        return response.json(
            {"detail": "Refresh token not found"},
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    
    # Verify refresh token
    payload = verify_token(refresh_token_cookie)
    if not payload or payload.get("type") != "refresh":
        return response.json(
            {"detail": "Invalid refresh token"},
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    
    # Get user from database
    user = await Account.get_or_none(id=payload.get("sub"))
    if not user:
        return response.json(
            {"detail": "User not found"},
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    
    # Create new access token
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    
    user_response = UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        company=user.company,
        plan=user.plan
    )
    
    response.set_cookie(
        "access_token", 
        access_token, 
        max_age=3600, 
        httponly=os.getenv("ENV") == "production",
        secure=os.getenv("ENV") == "production",
        samesite="lax"
    )
    
    return {
        "user": user_response,
        "message": "Token refreshed successfully"
    }

 
