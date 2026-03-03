from nexios import NexiosApp
from nexios_contrib.tortoise import init_tortoise
from nexios.routing.grouping import Group
import config
from api.accounts.routes import router as auth_router
from api.projects.routes import router as projects_router
from api.analytics.routes import router as analytics_router 
from api.messages.routes import router as messages_router
from ws.gateway import router as ws_router
from sse.routes import router as sse_router
from nexios import MakeConfig
from nexios.middleware.cors import CORSMiddleware,CorsConfig
from app.core.auth_backend import JWTAuthBackend
from nexios.auth.middleware import AuthenticationMiddleware
from models.accounts import Account
from socketify import ASGI
from app.core.redis_fanout import redis_fanout
from app.core.redis_publisher import redis_publisher
import asyncio
from events import emitter as _
from services.analytics_tracker import AnalyticsTracker

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
            Group(projects_router.prefix, projects_router),
            Group(analytics_router.prefix, analytics_router),
            Group(messages_router.prefix, messages_router),
        ]),
        Group(sse_router.prefix, sse_router),
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


# Initialize Redis services
@app.on_startup
async def startup():
    # Connect Redis fanout (listener)
    await redis_fanout.connect()
    redis_fanout._listener_task = asyncio.create_task(
        redis_fanout.start_listening()
    )
    
    # Connect Redis publisher
    await redis_publisher.connect()
    
    print("✅ Redis services started")

@app.on_shutdown
async def shutdown():
    await redis_fanout.disconnect()
    await redis_publisher.disconnect()
    print("✅ Redis services stopped")

# Initialize analytics tracker
analytics_tracker = AnalyticsTracker()