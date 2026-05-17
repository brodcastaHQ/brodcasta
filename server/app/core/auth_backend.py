from typing import Any, List, Optional

from nexios.auth.model import AuthResult
from nexios.http import Request
from nexios.auth.backends.base import AuthenticationBackend
from utils.auth import verify_token


class JWTAuthBackend(AuthenticationBackend):
    def __init__(
        self,
        identifier: str = "sub",
        secret: Optional[str] = None,
        algorithms: List[str] = ["HS256"],
    ):
        self.identifier = identifier
        self.secret = secret
        self.algorithms = algorithms

    async def authenticate(self, request: Request) -> Any:
        self.algorithms = self.algorithms

        token = request.cookies.get("access_token")
        if not token:
            return AuthResult(success=False, identity="", scope="")

        try:
            payload = verify_token(token)
        except ValueError as _:
            return AuthResult(success=False, identity="", scope="")
        if not payload:
            return AuthResult(success=False, identity="", scope="")

        return AuthResult(
            success=True, identity=payload.get(self.identifier, ""), scope="jwt"
        )
