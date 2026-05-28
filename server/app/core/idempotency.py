import json
from typing import Optional, Any
import redis.asyncio as redis
from app.core.logging import get_logger

IDEMPOTENCY_TTL = {  # seconds
    "payment_init": 1800,   # 30 min — covers the Paystack payment window
    "payment_verify": 86400,  # 24h — never re-verify the same reference
}


class IdempotencyStore:
    """Redis-backed idempotency guard for payment operations.

    Uses SETNX to atomically claim a key. If the key already exists,
    the operation is a duplicate and should be skipped (or the cached
    result returned).
    """

    def __init__(self):
        self.logger = get_logger("IdempotencyStore")
        self._redis: Optional[redis.Redis] = None

    async def _conn(self) -> redis.Redis:
        if self._redis is None:
            import config as app_config

            self._redis = redis.Redis(
                host=app_config.REDIS_HOST,
                port=app_config.REDIS_PORT,
                db=app_config.REDIS_DB,
                password=app_config.REDIS_PASSWORD,
                decode_responses=True,
            )
            await self._redis.ping()
            self.logger.info("Idempotency store connected to Redis")
        return self._redis

    async def try_lock(self, key: str, ttl: int = 300) -> bool:
        """Atomically claim *key* for *ttl* seconds.

        Returns ``True`` if the caller won the lock (first to claim it).
        Returns ``False`` if the lock is already held by another request.
        """
        r = await self._conn()
        acquired = await r.setnx(f"idempotency:{key}", "1")
        if acquired:
            await r.expire(f"idempotency:{key}", ttl)
        return bool(acquired)

    async def get_cached(self, key: str) -> Optional[Any]:
        """Return previously cached JSON-decoded value for *key*."""
        r = await self._conn()
        raw = await r.get(f"idempotency:{key}")
        if raw is None:
            return None
        try:
            return json.loads(raw)
        except (json.JSONDecodeError, TypeError):
            return raw

    async def cache_result(self, key: str, value: Any, ttl: int = 86400):
        """Store *value* (JSON-encoded) under *key* with *ttl* seconds."""
        r = await self._conn()
        await r.setex(f"idempotency:{key}", ttl, json.dumps(value))

    async def release(self, key: str):
        """Explicitly remove *key* (not normally needed — TTL handles it)."""
        r = await self._conn()
        await r.delete(f"idempotency:{key}")


idempotency = IdempotencyStore()
