try:
    import jwt
except ImportError:
    jwt = None
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional

from nexios.auth.model import AuthResult
from nexios.config import get_config
from nexios.http import Request, Response
from nexios.auth.backends.base import AuthenticationBackend
from utils.auth import verify_token


class JWTAuthBackend(AuthenticationBackend):
    def __init__(self, identifier: str = "sub"):  # type:ignore
        self.identifier = identifier

    async def authenticate(
        self, request: Request, response: Response
    ) -> Any:  # type:ignore
        app_config = get_config()
        self.secret = app_config.secret_key
        self.algorithms = app_config.jwt_algorithms or ["HS256"]

        token = request.cookies.get("access_token")
        if not token:
            return AuthResult(success=False, identity="", scope="")

        try:
            payload = verify_token(token)
        except ValueError as _:
            return AuthResult(success=False, identity="", scope="")

        return AuthResult(
            success=True, identity=payload.get(self.identifier, ""), scope="jwt"
        )
