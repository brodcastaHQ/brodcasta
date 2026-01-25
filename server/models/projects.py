from tortoise import fields
from ._base import BaseModel
from enum import Enum
import secrets


class AuthType(str, Enum):
    NONE = "none"
    PUBLISHING_ONLY = "publishing_only"
    ALL = "all"


class Project(BaseModel):
    name = fields.CharField(max_length=100)
    project_secret = fields.CharField(max_length=64, unique=True, index=True)
    account = fields.ForeignKeyField("models.Account", related_name="projects", on_delete=fields.CASCADE)
    history_enabled = fields.BooleanField(default=True)
    auth_type = fields.CharEnumField(AuthType, default=AuthType.NONE)

    class Meta:
        table = "projects"

    @classmethod
    async def create_project(
        cls,
        name: str,
        account_id: str,
        history_enabled: bool = True,
        auth_type: AuthType = AuthType.NONE
    ):
        project_secret = secrets.token_urlsafe(32)
        return await cls.create(
            name=name,
            project_secret=project_secret,
            account_id=account_id,
            history_enabled=history_enabled,
            auth_type=auth_type
        )

    @classmethod
    async def get_by_id(cls, project_id: str):
        return await cls.get_or_none(id=project_id)

    @classmethod
    async def get_by_secret(cls, secret: str):
        return await cls.get_or_none(project_secret=secret)

    async def regenerate_secret(self):
        self.project_secret = secrets.token_urlsafe(32)
        await self.save(update_fields=["project_secret"])
        return self.project_secret

    async def detail(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "project_secret": self.project_secret,
            "account_id": str(self.account_id),
            "history_enabled": self.history_enabled,
            "auth_type": self.auth_type,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }
