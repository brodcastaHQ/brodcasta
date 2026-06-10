import uvicorn
from app.core.logging import configure_uvicorn_logging

if __name__ == "__main__":
    configure_uvicorn_logging()
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=7012,
        reload=True,
        log_config=None,  # Use our colored logging config instead of uvicorn's default
    )
