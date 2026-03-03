from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "accounts" ADD "role" VARCHAR(10) NOT NULL DEFAULT 'ADMIN';
        COMMENT ON COLUMN "accounts"."role" IS 'ADMIN: ADMIN\nMEMBER: MEMBER';"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "accounts" DROP COLUMN "role";"""


MODELS_STATE = (
    "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"
)
