"""FastAPI dependencies for protected endpoints."""

import jwt as pyjwt
from fastapi import Depends, Header
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.jwt import decode_access_token
from app.auth.models import User
from app.core.database import get_db
from app.core.exceptions import AuthenticationError


async def get_current_user(
    db: AsyncSession = Depends(get_db),
    authorization: str | None = Header(default=None),
) -> User:
    """Resolve the authenticated user from a Bearer access token."""
    if authorization is None or not authorization.startswith("Bearer "):
        raise AuthenticationError("احراز هویت لازم است.")
    token = authorization.removeprefix("Bearer ").strip()
    try:
        user_id = decode_access_token(token)
    except pyjwt.InvalidTokenError as exc:
        raise AuthenticationError("توکن معتبر نیست.") from exc
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None or not user.is_active:
        raise AuthenticationError("کاربر معتبر نیست.")
    return user