"""
Centralized logging configuration for Brodcasta server.

Provides a consistent, modern logging interface across the backend
using Rich for colored structured terminal logs.

Usage:
    from app.core.logging import get_logger

    logger = get_logger("MyModule")
    logger.info("Server started on port %s", 7012)
"""

import os
import logging
from typing import Optional

from rich.console import Console
from rich.logging import RichHandler

_LOGGERS: dict[str, logging.Logger] = {}

console = Console()


def _get_level(level: Optional[int] = None) -> int:
    if level is not None:
        return level
    return getattr(
        logging,
        os.getenv("BRODCASTA_LOG_LEVEL", "INFO").upper(),
        logging.INFO,
    )


def _create_handler() -> RichHandler:
    return RichHandler(
        console=console,
        rich_tracebacks=True,
        show_time=True,
        show_level=True,
        show_path=False,
        markup=True,
        log_time_format="%Y-%m-%d %H:%M:%S",
    )


def get_logger(name: str, level: Optional[int] = None) -> logging.Logger:
    if name in _LOGGERS:
        return _LOGGERS[name]

    logger = logging.Logger(name)
    logger.setLevel(_get_level(level))

    if not logger.handlers:
        handler = _create_handler()
        formatter = logging.Formatter("%(message)s")
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    logger.propagate = False
    _LOGGERS[name] = logger
    return logger


def configure_uvicorn_logging(level: Optional[int] = None) -> None:
    resolved_level = _get_level(level)

    for logger_name in ("uvicorn", "uvicorn.error", "uvicorn.access"):
        logger = logging.getLogger(logger_name)
        logger.handlers.clear()
        logger.setLevel(resolved_level)

        handler = _create_handler()
        formatter = logging.Formatter("%(message)s")
        handler.setFormatter(formatter)

        logger.addHandler(handler)
        logger.propagate = False
