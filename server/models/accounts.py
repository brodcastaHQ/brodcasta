from tortoise import fields
from ._base import BaseModel
import bcrypt
from enum import Enum
from nexios.auth.users.simple import SimpleUser
from typing import Optional

class Role(str, Enum):
    ADMIN = "ADMIN"
    MEMBER = "MEMBER"


class Account(BaseModel,SimpleUser):
    name = fields.CharField(max_length=100)
    email = fields.CharField(max_length=255, unique=True)
    password = fields.CharField(max_length=255)
    role = fields.CharEnumField(Role,max_length=10,default=Role.ADMIN)
    class Meta:
        table = "accounts"

    @classmethod
    async def create_user(cls, name: str, email: str, password: str, role: Role = Role.MEMBER):
        hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        return await cls.create(
            name=name,
            email=email,
            password=hashed_pw.decode("utf-8"),
            role=role
        )

    @classmethod
    async def get_by_id(cls, account_id: str):
        return await cls.get_or_none(id=account_id)

    async def check_password(self, password: str) -> bool:
        return bcrypt.checkpw(password.encode("utf-8"), self.password.encode("utf-8"))

    async def set_password(self, new_password: str):
        hashed_pw = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())
        self.password = hashed_pw.decode("utf-8")
        await self.save()
    @classmethod
    async def load_user(cls, identity: str):
        return await cls.get_or_none(id=identity)

    @property
    def display_name(self):
        return self.name

    @property
    def identity(self):
        return self.id