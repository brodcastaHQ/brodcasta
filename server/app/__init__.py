from nexios import NexiosApp
from nexios_contrib.tortoise import init_tortoise
from nexios.routing.grouping import Group
import config
from api.accounts.routes import router as auth_router
from nexios import MakeConfig
from nexios.middleware.cors import CORSMiddleware,CorsConfig
from app.core.auth_backend import JWTAuthBackend
from nexios.auth.middleware import AuthenticationMiddleware
from models.accounts import Account
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
            Group(auth_router.prefix,auth_router)
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