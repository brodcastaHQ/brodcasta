from tortoise import fields
from ._base import BaseModel
from enum import Enum
import bcrypt

class Plan(str, Enum):
    FREE = "free"
    BASIC = "basic"
    PRO = "pro"
    ENTERPRISE = "enterprise"

class Account(BaseModel):
    name = fields.CharField(max_length=100)
    company = fields.CharField(max_length=100, null=True)
    plan = fields.CharEnumField(Plan, default=Plan.FREE)
    email = fields.CharField(max_length=255, unique=True)
    password = fields.CharField(max_length=255)

    class Meta:
        table = "accounts"

    @classmethod
    async def create_user(cls, name: str, email: str, password: str, company: str = None, plan: Plan = Plan.FREE):
        hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        return await cls.create(
            name=name,
            email=email,
            company=company,
            plan=plan,
            password=hashed_pw.decode("utf-8")
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
