from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "projects" (
    "id" VARCHAR(26) NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "name" VARCHAR(100) NOT NULL,
    "project_secret" VARCHAR(64) NOT NULL UNIQUE,
    "history_enabled" BOOL NOT NULL DEFAULT True,
    "auth_type" VARCHAR(15) NOT NULL DEFAULT 'none',
    "account_id" VARCHAR(26) NOT NULL REFERENCES "accounts" ("id") ON DELETE CASCADE
);
COMMENT ON COLUMN "projects"."auth_type" IS 'NONE: none\nPUBLISHING_ONLY: publishing_only\nALL: all';"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "projects";"""


MODELS_STATE = (
    "eJztme1v2jgYwP+VKJ86qVetHO0mNE0KLL3mRgEB3d1tTJFJDOTq2JnjXIcm/veznYS8cw"
    "RRBjo+QZ4Xv/yeJ7Yf54fqEhsi/0qzLBJgpraUHyoGLuR/8qpLRQWelyiEgIEpkrYgNJJC"
    "MPUZBZZobAaQD7nIhr5FHY85BHMpDhASQmJxQwfPE1GAnW8BNBmZQ7aAlCu+fOViB9vwO/"
    "TjR+/JnDkQ2ZnROrboW8pNtvSkrLMA9E5aiu6mpkVQ4OLE2luyBcFrcz4aIZ1DDClg0E5N"
    "QIwvmmssCsfKBYwGcD1IOxHYcAYCJDCo72YBtsTslQiqOQU+vHqHgDu1wfv3ag1GFsGCry"
    "NoCwAu+G4iiOdswR8bt6twqgmI0EqM4pM27Nxrw4vG7SvRIeFBCqPXizQNqVrJJgADYSMS"
    "e8LZolCwMQEr8v7ANcxxYTnzrGeOvR25XsV/dolELEhCkSRgHIsY7I60+RzsPkbLKMwbaI"
    "+NB3001h4GYiau739DEpE21oWmIaXLnPQiH5l1I8ofxvheEY/K535PlwSJz+ZU9pjYjT+r"
    "YkwgYMTE5NkEdiojY2kMhlsmgQ08e8fAZj3Pgf2pgY0Gn8SVrzdwt7hmPfcQ12i0BwzriY"
    "QxnvbGF1T+1tjjYvv97HIHeAUzO9n169dbbGXcqnIvk7pVBqFFXA/gZR2KKZedQB4+5w/A"
    "0UMAl0PUceBKkAYfE8AWLACNfQ+XluqMQlg8Yql3Q13n9lw5wW1tZHRaCj+WOdYED4b9lu"
    "JRMsF6b6wPB0NjxC0hZpB61PHDxmoHYqs4bAhDPgrQBQ6qk8trh0MdfPeZyI2bm23Otjc3"
    "1YdbocslMvD9Z0Jr1Q5pn9NcW/eGUlRjs6dUnSAEU2A9PQNqmxlNijklf0MrrBWzzNuR59"
    "3HIURAzrHIOKqgBmErx4l7FedMLI0PZoIPaZAqYkWV23DzEoDBXI5a9C16yhEpqeFTsKpr"
    "+HRczjX8uYY/1/BHVSOca/j/TWDPNfy5hj/X8FW1Z3hMMX3IN6OS92HDwb3geYp10G1zC6"
    "a3zUqkQpUlunB8RujShFjMsOQM1iYEQYDLqZZ457BOuftLpesa9b6Xlna/382sKm1jnEP6"
    "+NDWefpK0tzIYVJs9MY5vnxFWIQwSpP1v69MMg0c8N4EE1x2b9LjiyMnypUTPHhsd43Rvd"
    "H7zez3un+1FC+YIsdfcOom4VvxBGvdbksBCO10Z7JNnXpdXaZeFwr+6EOlWa/UyHqd5mK8"
    "n7KiUPEX0Ba53hEKnTn+CJeFNC+v7VOfnI+PalVtz8UUPK+r2lzO8EmGRzGZaNqoo33Q1V"
    "X1dclLXhRokDrWQi371h9qLjd+6k9sjuaSwMCsxh2BU0ytKIA/dZefi15+aVw33zTf/nrb"
    "fMtN5EjWkjcbXuB416ku+v+B1I9u1LZd9lIuJ7rmvcSdsXg16uwdoflpAnyhr3CYwbKN4v"
    "dRv1f1FW7tkgP5iPkEv9iOxS4VfvBgX48T6waKYtaZk2YM7+JB+zPPtdPtt/OFqWigXe82"
    "fv/by+pfIkZI1g=="
)
