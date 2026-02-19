from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "project_analytics" (
    "id" VARCHAR(26) NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "event_type" VARCHAR(19) NOT NULL,
    "connection_type" VARCHAR(9),
    "room_id" VARCHAR(255),
    "client_id" VARCHAR(255),
    "message_size" INT,
    "event_data" JSONB NOT NULL,
    "event_date" DATE NOT NULL,
    "event_hour" INT NOT NULL,
    "event_day_of_week" INT NOT NULL,
    "event_week" INT NOT NULL,
    "event_month" INT NOT NULL,
    "event_year" INT NOT NULL,
    "project_id" VARCHAR(26) NOT NULL REFERENCES "projects" ("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "idx_project_ana_project_f0065e" ON "project_analytics" ("project_id", "created_at");
CREATE INDEX IF NOT EXISTS "idx_project_ana_project_8e05ec" ON "project_analytics" ("project_id", "event_date");
CREATE INDEX IF NOT EXISTS "idx_project_ana_project_725c7b" ON "project_analytics" ("project_id", "event_type");
CREATE INDEX IF NOT EXISTS "idx_project_ana_project_2a844e" ON "project_analytics" ("project_id", "event_date", "event_hour");
CREATE INDEX IF NOT EXISTS "idx_project_ana_project_4d4252" ON "project_analytics" ("project_id", "event_week");
CREATE INDEX IF NOT EXISTS "idx_project_ana_project_6ad72f" ON "project_analytics" ("project_id", "event_month", "event_year");
CREATE INDEX IF NOT EXISTS "idx_project_ana_event_d_4063de" ON "project_analytics" ("event_date", "event_type");
CREATE INDEX IF NOT EXISTS "idx_project_ana_event_h_25acf2" ON "project_analytics" ("event_hour");
CREATE INDEX IF NOT EXISTS "idx_project_ana_event_d_378bae" ON "project_analytics" ("event_day_of_week");
COMMENT ON COLUMN "project_analytics"."event_type" IS 'MESSAGE_SENT: message_sent\nMESSAGE_RECEIVED: message_received\nBROADCAST_SENT: broadcast_sent\nBROADCAST_RECEIVED: broadcast_received\nDIRECT_SENT: direct_sent\nDIRECT_RECEIVED: direct_received\nCLIENT_CONNECTED: client_connected\nCLIENT_DISCONNECTED: client_disconnected\nROOM_JOINED: room_joined\nROOM_LEFT: room_left';
COMMENT ON COLUMN "project_analytics"."connection_type" IS 'WEBSOCKET: websocket\nSSE: sse';
COMMENT ON TABLE "project_analytics" IS 'Single analytics model for all project events with filtering capabilities';"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "project_analytics";"""


MODELS_STATE = (
    "eJztm21z0zgQgP+Kx5+4mV6H5toCHYYZJ3XBkNqdJMAdhPEotpKI2pKxZUJg+t9P8vtrGo"
    "ckbQZ/aq3dleRn17J2rfwSbWJCyzuWDIP4mIoXwi8RAxuyf4qiI0EEjpMKeAMFEyvQBaFS"
    "0AgmHnWBwTubAsuDrMmEnuEihyKCWSv2LYs3EoMpIjxLm3yMvvlQp2QG6Ry6TPD5C2tG2I"
    "Q/oBdfOrf6FEHLzM0WmXzsoF2nSydo682BexVo8uEmukEs38aptrOkc4ITdTYb3jqDGLqA"
    "QjNzA3x+0b3GTeFcWQN1fZhM0kwbTDgFvsUxiC+nPjb43QsRVH0CPHj80gL2xASvXokNGB"
    "kEc76I0+YAbPBDtyCe0Tm77Jzfhbeaggi1+Cw+SIPeG2nwpHP+Fx+QMCeF3lMjSScQ3QVd"
    "AArCTgLsKWfDhZyNDmiZ9yWTUGTDauZ5ywJ7MzI9jv/ZxBNxQ+qKNABjX8RgN6TN7sHUsL"
    "WM3LyC9ki5locj6fqG34nted+sAJE0krmkE7QuC61Pip5JOhE+KqM3Ar8UPmmqHBAkHp25"
    "wYip3uiTyOcEfEp0TBY6MDMRGbfGYJhm6ljfMTd0bN6ydeyDOjaafOpXtt7Azfyat9yCX6"
    "PZ7tGtB+LG+LZXPqDB3wbvuFh/O2+5PTyCuTfZydOna7zKmFbtuyyQ3eUQGsR2AF42oZgx"
    "2Qjk/mN+DxwdC+BqiDL27QCkwuYEsAFLQGPb/YWlOHUhLG+xxKuBLDN9JhzjrjRUehcC25"
    "YhY4xvBtqF4LhkjGV1JA9uBsqQaUJMoeu4yAs7a+yItfywwg1FL0AbIKtJLCcG+9r4bjOQ"
    "O2dn6+xtz87qN7dcVghk4HkL4jbKHbI2h7m2bg0lz8amt5k8gTdMgHG7AK6p5yQZ5i75Co"
    "0wV8wz70aWV+8G0ALBPZYZRxnUTdjL48R9F8dM3BpvzDgf0iF1xMoiu2MXWwAGs2DWfGw+"
    "UoFIRQ6fgVWfw2f90ubwbQ7f5vCPKkdoc/g/xrFtDt/m8G0OX5d7htsU3YPsZVTxPKzYuJ"
    "csDzEPOj9dg+n5aS1SLsoTnSOPEnepQ8zvsGIP1iXEggBXU62wLmCdMPNdhWuCettLS1fT"
    "+rlVpauMCkjfX3dlFr4BaaaEaNCsqKMCX7YizEMYlcF6f8kk18Ee6yaY4Kq6icoWR0aUCc"
    "f45n23rwzfKOprXVP7/10Ijj+xkDdn1HXCXsVjLPX7FwKwrI1qJuvkqSf1aepJKeGPPlTq"
    "zVKNvNVhLsbbSStKGX8JbZnrFXEhmuF3cFkK8+rcPvPJ+fFRrcvtWbMLFklWW4gZdpPhVi"
    "wINGnYky5l8W6dcglL960lRcZ26iVStrfDgbuPwkmKpr6CksN3bylFz/nu3pqKOGRoLCgk"
    "VmGlQZgSly+gQtSrAL9DhktYIDoXpsiikCMVDOCACWJvIQS94lq73Z7vr/B8TgiE0Z8pGz"
    "DNojQYVec5SL00iObVtsnVnPhuve4Cwtt6qU0wWy2TyyUEUVdVA6WTKg4cay91Mo1GbKte"
    "bdWrLY60Va/WsW3V6w+remXelpVvuvsz4HwPD5yAiYzIUHot60NZHV0INvQ8trHUPTbFMY"
    "5lA7knKx/ky1TuQgOi79Ac4+5Aky5ZEjCKepi4BJgG8GjURypPe0l10n4uFSaPOzGRGxa3"
    "eA+RJDWPpKltr68wM72nqSrT5CqGhThkFoeYqWZ0LpVhWc1EXkZzoGnX+ltNUbmGS4itfy"
    "UIJ5K+fDWK2i04pRuVAl6sUwp4UV8KeFE+DBRMH8WRtGFoVnTzsAeFxI9yd6j13skM+QJO"
    "PGLcQhYSQ36Exdvs7Mo67OvRl8gHgdBs25sxOchjWDs5vRI9is1I5oxalkmeH6/i6GfFUq"
    "BgWk2zaFYAitaqYj0A0Bkf5+/Oyemz0+f/nJ8+ZyrBVJKWZysQl0vcSXYMyuzeDjW15jxa"
    "zqqA7j1m9/TZRAY9Eizk0S87K3OnOe7ERxZF2Dvmw/5ObrsCHseR27jFYfnkWvq3GLG9vt"
    "Yt7sh4B906/hWxy7fK9/CvCt3cNnkP7FWC4TElJljuCDzfCldiC8o26z/yeaONHvjfZRXV"
    "YpJy3nbqMTtaE9IaWFPGBdsW9WrUGzFu4a4HNykMN6KbWLV4V+MNCu1N6cZGLdw6uPlPHE"
    "0PyrSfu1d87nbSM9W/+bn7II+yHxU+d+djpunn7l1+3pWgi4y5WPXT9lBytPKX7anOozkT"
    "X7ssVj6wFcth5MAHPdS2lZWu/mvfd+h60YGIdZe9jMmBrnm7KIzwR6MBxEj9MAHu6EenmM"
    "Kqc1H1hZGMyUNVRXb29Wpr9Y8GPz7b/uvl7n+lb1pK"
)
