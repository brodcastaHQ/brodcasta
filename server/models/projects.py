from tortoise import fields
from ._base import BaseModel
from enum import Enum
import secrets
import string


class AuthType(str, Enum):
    NONE = "none"
    PUBLISHING_ONLY = "publishing_only"
    ALL = "all"


class Project(BaseModel):
    name = fields.CharField(max_length=100)
    project_secret = fields.CharField(max_length=64, unique=True)
    account = fields.ForeignKeyField("models.Account", related_name="projects", on_delete=fields.CASCADE)
    history_enabled = fields.BooleanField(default=True)
    auth_type = fields.CharEnumField(AuthType, default=AuthType.NONE)

    class Meta:
        table = "projects"

    @classmethod
    async def create_project(cls, name: str, account_id: str, history_enabled: bool = True, auth_type: AuthType = AuthType.NONE):
        # Generate a secure project secret
        alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
        project_secret = ''.join(secrets.choice(alphabet) for _ in range(32))
        
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
        # Generate a new secure project secret
        alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
        new_secret = ''.join(secrets.choice(alphabet) for _ in range(32))
        self.project_secret = new_secret
        await self.save()
        return new_secret