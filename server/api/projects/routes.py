from nexios import status
from nexios.http import Request, Response
from nexios.routing import Router
from nexios.auth.decorator import auth
from ._schema import ProjectCreate, ProjectUpdate, ProjectResponse, SecretResponse
from models.projects import Project, AuthType


router = Router(prefix="/projects", tags=["projects"])


@router.post("/", 
            summary="Create a new project",
            request_model=ProjectCreate,
            responses=ProjectResponse,
            status_code=status.HTTP_201_CREATED)
@auth()
async def create_project(request: Request, response: Response):
    """Create a new project for the authenticated user"""
    data = await request.json
    project_data = ProjectCreate(**data)
    
    # Create project with authenticated user's account
    project = await Project.create_project(
        name=project_data.name,
        account_id=request.user.identity,
        history_enabled=project_data.history_enabled,
        auth_type=project_data.auth_type
    )
    
    return ProjectResponse(
        id=str(project.id),
        name=project.name,
        history_enabled=project.history_enabled,
        auth_type=project.auth_type,
        created_at=project.created_at.isoformat(),
        updated_at=project.updated_at.isoformat()
    )


@router.get("/", 
           summary="Get all projects for user",
           responses=list[ProjectResponse])
@auth()
async def get_user_projects(request: Request, response: Response):
    """Get all projects belonging to the authenticated user"""
    projects = await Project.filter(account_id=request.user.identity, deleted_at__isnull=True)
    
    return [
        await project.detail()
        for project in projects
    ]


@router.get("/{project_id}", 
           summary="Get project by ID",
           responses=ProjectResponse)
@auth()
async def get_project(request: Request, response: Response):
    """Get a specific project by ID"""
    project_id = request.path_params.project_id
    
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
    
    return await project.detail()


@router.put("/{project_id}", 
           summary="Update project",
           request_model=ProjectUpdate,
           responses=ProjectResponse)
@auth()
async def update_project(request: Request, response: Response):
    """Update a project"""
    project_id = request.path_params.project_id
    data = await request.json
    update_data = ProjectUpdate(**data)
    
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
    
    # Update only provided fields
    if update_data.name is not None:
        project.name = update_data.name
    if update_data.history_enabled is not None:
        project.history_enabled = update_data.history_enabled
    if update_data.auth_type is not None:
        project.auth_type = update_data.auth_type
    
    await project.save()
    
    return await project.detail()


@router.delete("/{project_id}", 
              summary="Delete project",
              status_code=status.HTTP_204_NO_CONTENT)
@auth()
async def delete_project(request: Request, response: Response):
    """Soft delete a project"""
    project_id = request.path_params.project_id
    
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
    
    await project.soft_delete()
    
    return response.status(status.HTTP_204_NO_CONTENT)


@router.post("/{project_id}/rotate-secret", 
            summary="Rotate project secret",
            responses=SecretResponse)
@auth()
async def rotate_project_secret(request: Request, response: Response):
    """Generate a new project secret"""
    project_id = request.path_params.project_id
    
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
    
    new_secret = await project.regenerate_secret()
    
    return SecretResponse(
        project_secret=new_secret,
        message="Project secret rotated successfully"
    )


@router.get("/{project_id}/secret", 
           summary="Get project secret",
           responses=SecretResponse)
@auth()
async def get_project_secret(request: Request, response: Response):
    """Get the current project secret (show only once)"""
    project_id = request.path_params.project_id
    
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
    
    return SecretResponse(
        project_secret=project.project_secret,
        message="This is your project secret. Store it securely."
    )
