from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "messages" ADD "message_type" VARCHAR(50);
        ALTER TABLE "messages" ADD "sender_id" VARCHAR(255);
        CREATE INDEX IF NOT EXISTS "idx_messages_project_8e165c" ON "messages" ("project_id", "message_type", "created_at");
        CREATE INDEX IF NOT EXISTS "idx_messages_project_142870" ON "messages" ("project_id", "sender_id", "created_at");
        CREATE INDEX IF NOT EXISTS "idx_messages_message_e6071c" ON "messages" ("message_type");
        CREATE INDEX IF NOT EXISTS "idx_messages_sender__0cb83e" ON "messages" ("sender_id");"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP INDEX IF EXISTS "idx_messages_sender__0cb83e";
        DROP INDEX IF EXISTS "idx_messages_message_e6071c";
        DROP INDEX IF EXISTS "idx_messages_project_142870";
        DROP INDEX IF EXISTS "idx_messages_project_8e165c";
        ALTER TABLE "messages" DROP COLUMN "message_type";
        ALTER TABLE "messages" DROP COLUMN "sender_id";"""


MODELS_STATE = (
    "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"
    "b682xn9kzuZdHi93/wMyrLMm"
)
