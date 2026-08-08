"""Access-token helpers (HS256 JWT)."""

from datetime import datetime, timedelta, timezone

import jwt

from app.core.config import get_settings


def create_access_token(user_id: int) -> str:
    """Issue a short-lived HS256 access token."""
    settings = get_settings()
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "type": "access",
        "iat": now,
        "exp": now + timedelta(minutes=settings.access_token_ttl_minutes),
    }
    return jwt.encode(payload, settings.secret_key, algorithm="HS256")


def decode_access_token(token: str) -> int:
    """Return the user id from a valid access token; raise on invalid."""
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
    except jwt.ExpiredSignatureError as exc:
        raise jwt.InvalidTokenError("توکن منقضی شده؛ دوباره وارد شوید.") from exc
    except jwt.InvalidTokenError as exc:
        raise jwt.InvalidTokenError("توکن معتبر نیست.") from exc
    if payload.get("type") != "access":
        raise jwt.InvalidTokenError("نوع توکن اشتباه است.")
    return int(payload["sub"])
