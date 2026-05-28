from nexios import NexiosApp, MakeConfig
from nexios_contrib.tortoise import init_tortoise
from nexios_contrib.mail import setup_mail, MailConfig
from nexios.routing.grouping import Group
import config
from api.accounts.routes import router as auth_router
from api.projects.routes import router as projects_router
from api.analytics.routes import router as analytics_router
from api.messages.routes import router as messages_router
from api.public.routes import router as public_router
from api.payments.routes import router as payments_router
from ws.gateway import router as ws_router
from sse.routes import router as sse_router
from nexios.middleware.cors import CORSMiddleware, CorsConfig
from app.core.auth_backend import JWTAuthBackend
from nexios.auth.middleware import AuthenticationMiddleware
from models.accounts import Account
from app.core.redis_fanout import redis_fanout
from app.core.redis_publisher import redis_publisher
from app.core.redis_otp import redis_otp
from app.core.logging import get_logger
import asyncio
from events import emitter as emitter
from services.analytics_tracker import AnalyticsTracker
from scripts.create_superuser import create_superuser
import os

logger = get_logger("Brodcasta")

# Initialize global config before creating the app
_config = MakeConfig(
    secret_key=config.SECRET_KEY,
)

app = NexiosApp(
    title="Brodcasta",
    version="0.1.0",
    description="""
    Brodcasta
    """,
    routes=[
        Group(
            "/api",
            routes=[
                Group(auth_router.prefix, auth_router),
                Group(projects_router.prefix, projects_router),
                Group(analytics_router.prefix, analytics_router),
                Group(messages_router.prefix, messages_router),
                Group(public_router.prefix, public_router),
                Group(payments_router.prefix, payments_router),
            ],
        ),
        Group(sse_router.prefix, sse_router),
        Group("/ws", routes=[Group(ws_router.prefix, ws_router)]),
    ],
)

init_tortoise(
    app,
    db_url=config.DB_URL,
    modules={"models": ["models", "aerich.models"]},
    add_exception_handlers=True,
    generate_schemas=True,
)
# Set up mail client
mail_client = setup_mail(
    app,
    config=MailConfig(
        smtp_host=os.getenv("SMTP_HOST", "smtp.gmail.com"),
        smtp_port=int(os.getenv("SMTP_PORT", "587")),
        smtp_username=os.getenv("SMTP_USERNAME", ""),
        smtp_password=os.getenv("SMTP_PASSWORD", ""),
        use_tls=os.getenv("SMTP_USE_TLS", "true").lower() == "true",
        default_from=os.getenv("MAIL_FROM", "noreply@brodcasta.com"),
    ),
)

# Expose mail client to routes via module-level import
import api.accounts.routes as accounts_routes

accounts_routes.mail_client = mail_client

app.add_middleware(
    CORSMiddleware(
        config=CorsConfig(
            allow_origins=["*"],
            allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allow_headers=["*"],
            allow_credentials=True,
        )
    )
)
app.add_middleware(
    AuthenticationMiddleware(
        backend=JWTAuthBackend(secret=os.getenv("JWT_SECRET")), user_model=Account
    )
)


# Initialize Redis services
@app.on_startup
async def startup():
    # Connect Redis fanout (listener)
    await redis_fanout.connect(
        host=os.getenv("REDIS_HOST", "localhost"),
        port=int(os.getenv("REDIS_PORT", 6379)),
        db=int(os.getenv("REDIS_DB", 0)),
    )
    redis_fanout._listener_task = asyncio.create_task(redis_fanout.start_listening())

    # Connect Redis publisher
    await redis_publisher.connect(
        host=os.getenv("REDIS_HOST", "localhost"),
        port=int(os.getenv("REDIS_PORT", 6379)),
        db=int(os.getenv("REDIS_DB", 0)),
    )

    # Connect Redis OTP store
    await redis_otp.connect(
        host=os.getenv("REDIS_HOST", "localhost"),
        port=int(os.getenv("REDIS_PORT", 6379)),
        db=int(os.getenv("REDIS_DB", 0)),
    )

    logger.info("Redis services started")
    await create_superuser()


@app.on_shutdown
async def shutdown():
    await redis_fanout.disconnect()
    await redis_publisher.disconnect()
    await redis_otp.disconnect()
    logger.info("Redis services stopped")


# Initialize analytics tracker
analytics_tracker = AnalyticsTracker()
