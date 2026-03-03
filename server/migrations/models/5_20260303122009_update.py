from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "messages" (
    "id" VARCHAR(26) NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "room_id" VARCHAR(255) NOT NULL,
    "data" JSONB NOT NULL,
    "project_id" VARCHAR(26) NOT NULL REFERENCES "projects" ("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "idx_messages_room_id_07b171" ON "messages" ("room_id");
CREATE INDEX IF NOT EXISTS "idx_messages_project_f0d35c" ON "messages" ("project_id", "room_id", "created_at");
COMMENT ON TABLE "messages" IS 'Model for persisting user messages (not system events)';"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "messages";"""


MODELS_STATE = (
    "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"
    "lDRUV2dnq1tfhHZm3e5/Jy9z8cycAl"
)
