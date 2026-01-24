import ulid
from tortoise import fields, models
from datetime import datetime

class BaseModel(models.Model):
    id = fields.CharField(pk=True, max_length=26, default=lambda: str(ulid.new()))
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)
    deleted_at = fields.DatetimeField(null=True, default=None)  # optional soft delete
    
    class Meta:
        abstract = True

    async def soft_delete(self):
        self.deleted_at = datetime.utcnow()
        await self.save()

    async def restore(self):
        self.deleted_at = None
        await self.save()

    @property
    def is_deleted(self):
        return self.deleted_at is not None
