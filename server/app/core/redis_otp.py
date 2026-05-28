import random
import os
from typing import Optional
import redis.asyncio as redis
from app.core.logging import get_logger

OTP_PREFIX = "otp:"
OTP_TTL_SECONDS = 15 * 60


class RedisOTP:
    def __init__(self):
        self.logger = get_logger("RedisOTP")
        self._redis: Optional[redis.Redis] = None

    async def connect(self, host="localhost", port=6379, db=0, password=None):
        self._redis = redis.Redis(
            host=host,
            port=port,
            db=db,
            password=password,
            decode_responses=True,
        )
        await self._redis.ping()
        self.logger.info("Redis OTP connected")

    async def disconnect(self):
        if self._redis:
            await self._redis.close()
            self.logger.info("Redis OTP disconnected")

    async def generate_and_store(self, email: str) -> str:
        """Generate a 6-digit OTP, store in Redis with TTL, return the OTP."""
        otp = f"{random.randint(100000, 999999)}"
        key = f"{OTP_PREFIX}{email.lower()}"
        await self._redis.set(key, otp, ex=OTP_TTL_SECONDS)
        return otp

    async def verify(self, email: str, otp: str) -> bool:
        """Verify OTP for the given email. Deletes OTP on successful verification."""
        key = f"{OTP_PREFIX}{email.lower()}"
        stored = await self._redis.get(key)
        if stored is None:
            return False
        if stored != otp:
            return False
        await self._redis.delete(key)
        return True

    async def delete(self, email: str):
        """Manually delete OTP for email."""
        key = f"{OTP_PREFIX}{email.lower()}"
        await self._redis.delete(key)


# Global instance
redis_otp = RedisOTP()
