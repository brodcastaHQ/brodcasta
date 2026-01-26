from nexios import NexiosApp
from nexios_contrib.tortoise import init_tortoise
from nexios.routing.grouping import Group
import config
from api.accounts.routes import router as auth_router
from api.projects.routes import router as projects_router
from ws.gateway import router as ws_router
from nexios import MakeConfig
from nexios.middleware.cors import CORSMiddleware,CorsConfig
from app.core.auth_backend import JWTAuthBackend
from nexios.auth.middleware import AuthenticationMiddleware
from models.accounts import Account
from socketify import ASGI
from app.core.redis_service import redis_service
import asyncio

app = NexiosApp(
    title="Pingly",
    version="0.1.0",
    description="""
    Pingly
    """,
    
    config=MakeConfig(
        secret_key=config.SECRET_KEY,
        cors = CorsConfig(
            allow_origins="*",
            allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allow_headers=["*"],
            allow_credentials=True,
        )
        
    ),
    routes=[
        Group("/api", routes=[
            Group(auth_router.prefix,auth_router),
            Group(projects_router.prefix, projects_router)
        ]),
        Group("/ws", routes=[
            Group(ws_router.prefix, ws_router)
        ])
    ]
)

init_tortoise(app, 
        db_url=config.DB_URL, 
        modules={"models": ["models","aerich.models"]},
        add_exception_handlers=True,
        generate_schemas=True
    )
app.add_middleware(CORSMiddleware())
app.add_middleware(AuthenticationMiddleware(
    backend=JWTAuthBackend(),
    user_model=Account
))

# Initialize Redis service
@app.on_startup
async def startup():
    await redis_service.connect()
    redis_service._listener_task = asyncio.create_task(
        redis_service.start_listening()
    )
        # Continue without Redis - events will fail gracefully

@app.on_shutdown
async def shutdown_event():
    """Cleanup Redis connections on shutdown"""
    try:
        await redis_service.disconnect()
        print("✅ Redis service stopped")
    except Exception as e:
        print(f"❌ Error stopping Redis service: {e}")