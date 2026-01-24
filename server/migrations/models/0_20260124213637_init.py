from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "accounts" (
    "id" VARCHAR(26) NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "name" VARCHAR(100) NOT NULL,
    "company" VARCHAR(100),
    "plan" VARCHAR(10) NOT NULL DEFAULT 'free',
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL
);
COMMENT ON COLUMN "accounts"."plan" IS 'FREE: free\nBASIC: basic\nPRO: pro\nENTERPRISE: enterprise';
CREATE TABLE IF NOT EXISTS "aerich" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "version" VARCHAR(255) NOT NULL,
    "app" VARCHAR(100) NOT NULL,
    "content" JSONB NOT NULL
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        """


MODELS_STATE = (
    "eJztV21P2zAQ/itRPjGJIcgoIISQShdEp9GiNnsRL4pc220tHDs4zqBC/e+znaRJ05eRqi"
    "ug7VOb5+6cu+c5x75nO+AI02inDiGPmbSPrWebgQCrP2XTtmWDMMwNGpCgR40vSJwMCHqR"
    "FADqxfqARlhBCEdQkFASzhTKYko1yKFyJGyQQzEjDzH2JR9gOcRCGW7uFEwYwk84yh7De7"
    "9PMEVT2RKk321wX45CgzWGQJwbT/26ng85jQOWe4cjOeRs4q6y0egAMyyAxKhQgM4vrTWD"
    "klwVIEWMJ0miHEC4D2KqabBP+jGDunorJdXvgQjvnFAQ9BA4PbUrcAQ50/wSzbYmIABPPs"
    "VsIIfq0TkYJ6XmRCReOovv9U7jot7Zcg4+6BdyJVKiXiu1OMY0NksACZJFDO05z1BgzY0P"
    "5Czfn5VFkgDP53w6ssQ9SkN3sj+rKJEBuRR5A2ZaZMSuyLaqAbUZHaUyL2Hba166Xa9+ea"
    "UrCaLogRqK6p6rLY5BRyV0q6zMZBHrR9O7sPSjdd1uuYZBHsmBMG/M/bxrW+cEYsl9xh99"
    "gAodmaEZMcozFzYO0YrCTkf+F/ZVhU2Tz3VV3xu8mq7TkWvQNc12g7K+ExmzspduUPNb4Y"
    "zL/Ndzym1gC06dZHu7uy84ypTXwrPM2MZTFEIehICNqrBYCFmJyM33/AZ4DClg80l0WRwY"
    "IpsqJ8AgniE0i91cW9p9gfHsFcs+77iu8lfGW3ZW7zYbx5a6lhF4y6467WMrFPyWuS3P7V"
    "x1ml3liZnEIhQkSharLMSLdFgiQ1kFHABCq/TyJGBTF991NrJTq73kblurLb7calupkUEU"
    "PXJRaXYoxrzPb+vaqNTTWP++MCdooAfg/SMQyJ+xcIcv8p01BU5QRgADA0OPLlJXkI2oWB"
    "A4tOcNr4lle+nsmvu8mcm1yWSFwZUk43mx7dKt+Krbd6Df8tHZ2z/cP/p0sH+kXEwmE+Rw"
    "SRc2W94fJtFfWEQ6pQpbtxDyj+/c4kdQb40KJKbu75PAv3StVDcDNme++tJttxZdKychJS"
    "K/MVXgDSJQbluURPLubdK6hEVd9dRQlZG3dVn/Wea18bV9Vp6W9AJnr328jH8D7Em8KQ=="
)
