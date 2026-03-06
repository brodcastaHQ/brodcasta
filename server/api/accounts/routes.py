import os
from nexios import status
from nexios.http import Request, Response
from nexios.routing import Router
from tortoise.exceptions import IntegrityError
from ._schema import UserCreate, UserLogin, UserResponse, TokenResponse, UserUpdate, AdminUserCreate, UsersListResponse
from models.accounts import Account, Role
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
        role=user_data.role
    )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    
    # Create refresh token
    refresh_token = create_refresh_token(data={"sub": str(user.id), "email": user.email})
    
    user_response = UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        role=user.role,
        created_at=user.created_at.isoformat()
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
        return response.json(
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
        role=user.role,
        created_at=user.created_at.isoformat()
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
        role=user.role,
        created_at=user.created_at.isoformat()
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

 
@router.get("/me", summary="Get user details")
async def get_user(request: Request,response: Response):
    """Get user details"""
    user = request.user
    print(user)
    if not user.is_authenticated:
        return response.json(
            {"detail": "User not found"},
            status_code=status.HTTP_404_NOT_FOUND
        )
    user_response = UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        role=user.role,
        created_at=user.created_at.isoformat()
    )
    return user_response


# Admin Management Routes

@router.get("/admin/users", 
            summary="Get all users (Admin only)",
            responses=UsersListResponse)
async def get_all_users(request: Request, response: Response):
    """Get all users with pagination (Admin only)"""
    user = request.user
    
    # Check if user is admin
    if not user.is_authenticated or user.role != Role.ADMIN:
        return response.json(
            {"detail": "Admin access required"},
            status_code=status.HTTP_403_FORBIDDEN
        )
    
    # Get pagination parameters
    page = int(request.query_params.get("page", 1))
    per_page = int(request.query_params.get("per_page", 10))
    
    # Get users with pagination
    offset = (page - 1) * per_page
    users = await Account.all().order_by("-created_at").offset(offset).limit(per_page)
    total = await Account.all().count()
    
    user_responses = [
        UserResponse(
            id=str(user.id),
            name=user.name,
            email=user.email,
            role=user.role,
            created_at=user.created_at.isoformat()
        )
        for user in users
    ]
    
    return UsersListResponse(
        users=user_responses,
        total=total,
        page=page,
        per_page=per_page
    )


@router.post("/admin/users",
            summary="Create user (Admin only)",
            request_model=AdminUserCreate,
            responses=UserResponse,
            status_code=status.HTTP_201_CREATED)
async def admin_create_user(request: Request, response: Response):
    """Create a new user (Admin only)"""
    user = request.user
    
    # Check if user is admin
    if not user.is_authenticated or user.role != Role.ADMIN:
        return response.json(
            {"detail": "Admin access required"},
            status_code=status.HTTP_403_FORBIDDEN
        )
    
    data = await request.json
    user_data = AdminUserCreate(**data)
    
    # Check if user already exists
    existing_user = await Account.get_or_none(email=user_data.email)
    if existing_user:
        return response.json(
            {"detail": "Email already registered"},
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    # Create new user
    new_user = await Account.create_user(
        name=user_data.name,
        email=user_data.email,
        password=user_data.password,
        role=user_data.role
    )
    
    user_response = UserResponse(
        id=str(new_user.id),
        name=new_user.name,
        email=new_user.email,
        role=new_user.role,
        created_at=new_user.created_at.isoformat()
    )
    
    return response.json(
        user_response.dict(),
        status_code=status.HTTP_201_CREATED
    )


@router.put("/admin/users/{user_id}",
            summary="Update user (Admin only)",
            request_model=UserUpdate,
            responses=UserResponse)
async def admin_update_user(request: Request, response: Response, user_id: str):
    """Update user details (Admin only)"""
    user = request.user
    
    # Check if user is admin
    if not user.is_authenticated or user.role != Role.ADMIN:
        return response.json(
            {"detail": "Admin access required"},
            status_code=status.HTTP_403_FORBIDDEN
        )
    
    # Find user to update
    target_user = await Account.get_or_none(id=user_id)
    if not target_user:
        return response.json(
            {"detail": "User not found"},
            status_code=status.HTTP_404_NOT_FOUND
        )
    
    data = await request.json
    update_data = UserUpdate(**data)
    
    # Update user fields
    if update_data.name is not None:
        target_user.name = update_data.name
    if update_data.email is not None:
        # Check if email is already taken
        existing_user = await Account.get_or_none(email=update_data.email)
        if existing_user and existing_user.id != target_user.id:
            return response.json(
                {"detail": "Email already registered"},
                status_code=status.HTTP_400_BAD_REQUEST
            )
        target_user.email = update_data.email
    if update_data.role is not None:
        target_user.role = update_data.role
    if update_data.password is not None:
        target_user.password = update_data.password  # Will be hashed in save
    
    await target_user.save()
    
    user_response = UserResponse(
        id=str(target_user.id),
        name=target_user.name,
        email=target_user.email,
        role=target_user.role,
        created_at=target_user.created_at.isoformat()
    )
    
    return user_response


@router.delete("/admin/users/{user_id}",
               summary="Delete user (Admin only)",
               status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_user(request: Request, response: Response, user_id: str):
    """Delete user (Admin only)"""
    user = request.user
    
    # Check if user is admin
    if not user.is_authenticated or user.role != Role.ADMIN:
        return response.json(
            {"detail": "Admin access required"},
            status_code=status.HTTP_403_FORBIDDEN
        )
    
    # Find user to delete
    target_user = await Account.get_or_none(id=user_id)
    if not target_user:
        return response.json(
            {"detail": "User not found"},
            status_code=status.HTTP_404_NOT_FOUND
        )
    
    # Prevent admin from deleting themselves
    if str(target_user.id) == str(user.id):
        return response.json(
            {"detail": "Cannot delete yourself"},
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    await target_user.delete()
    
    return response.json(
        {"message": "User deleted successfully"},
        status_code=status.HTTP_204_NO_CONTENT
    )


@router.get("/admin/users/{user_id}",
            summary="Get user details (Admin only)",
            responses=UserResponse)
async def admin_get_user(request: Request, response: Response, user_id: str):
    """Get specific user details (Admin only)"""
    user = request.user
    
    # Check if user is admin
    if not user.is_authenticated or user.role != Role.ADMIN:
        return response.json(
            {"detail": "Admin access required"},
            status_code=status.HTTP_403_FORBIDDEN
        )
    
    # Find user
    target_user = await Account.get_or_none(id=user_id)
    if not target_user:
        return response.json(
            {"detail": "User not found"},
            status_code=status.HTTP_404_NOT_FOUND
        )
    
    user_response = UserResponse(
        id=str(target_user.id),
        name=target_user.name,
        email=target_user.email,
        role=target_user.role,
        created_at=target_user.created_at.isoformat()
    )
    
    return user_response


# Personal Account Management Routes

@router.put("/account", 
            summary="Update current user account",
            request_model=UserUpdate,
            response_model=UserResponse)
async def update_account(request: Request, response: Response):
    """Update current user account"""
    user = request.user
    
    if not user.is_authenticated:
        return response.json(
            {"detail": "User not authenticated"},
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    
    data = await request.json
    update_data = UserUpdate(**data)
    
    # Update user fields
    if update_data.name is not None:
        user.name = update_data.name
    if update_data.email is not None:
        # Check if email is already taken by another user
        existing_user = await Account.get_or_none(email=update_data.email)
        if existing_user and existing_user.id != user.id:
            return response.json(
                {"detail": "Email already registered"},
                status_code=status.HTTP_400_BAD_REQUEST
            )
        user.email = update_data.email
    if update_data.password is not None:
        user.password = update_data.password  # Will be hashed in save
    
    await user.save()
    
    user_response = UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        role=user.role,
        created_at=user.created_at.isoformat()
    )
    
    return user_response


@router.delete("/account", 
               summary="Delete current user account",
               status_code=status.HTTP_204_NO_CONTENT)
async def delete_account(request: Request, response: Response):
    """Delete current user account"""
    user = request.user
    
    if not user.is_authenticated:
        return response.json(
            {"detail": "User not authenticated"},
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    
    await user.delete()
    
    # Clear cookies
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    
    return response.json(
        {"message": "Account deleted successfully"},
        status_code=status.HTTP_204_NO_CONTENT
    )


