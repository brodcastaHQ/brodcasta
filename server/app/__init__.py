from nexios import NexiosApp
from nexios_contrib.tortoise import init_tortoise
from nexios.routing.grouping import Group
import config
from api.accounts.routes import router as auth_router
app = NexiosApp(
    title="Pingly",
    version="0.1.0",
    description="""
    Pingly
    """,
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

# Include auth routes
