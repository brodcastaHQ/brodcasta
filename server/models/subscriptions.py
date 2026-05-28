from tortoise import fields
from ._base import BaseModel


VALID_PLANS = frozenset({"starter", "pro", "enterprise"})
VALID_STATUSES = frozenset({"active", "inactive", "cancelled", "expired", "pending"})


class Subscription(BaseModel):
    plan_type = fields.CharField(max_length=20)
    status = fields.CharField(max_length=20, default="active")
    paystack_reference = fields.CharField(max_length=255, null=True, unique=True, default=None)
    amount = fields.IntField(default=0)
    start_date = fields.DatetimeField(auto_now_add=True)
    end_date = fields.DatetimeField(null=True, default=None)

    account = fields.ForeignKeyField("models.Account", related_name="subscriptions")

    class Meta:
        table = "subscriptions"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.account_id} - {self.plan_type} ({self.status})"
