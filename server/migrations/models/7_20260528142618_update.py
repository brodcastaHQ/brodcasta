from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "subscriptions" (
    "id" VARCHAR(26) NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "plan_type" VARCHAR(20) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "paystack_reference" VARCHAR(255) UNIQUE,
    "amount" INT NOT NULL DEFAULT 0,
    "start_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMPTZ,
    "account_id" VARCHAR(26) NOT NULL REFERENCES "accounts" ("id") ON DELETE CASCADE
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "subscriptions";"""


MODELS_STATE = (
    "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"
)
