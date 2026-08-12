"""Stateless security primitives for the auth feature."""

import hashlib
import secrets
from datetime import datetime, timedelta, timezone

import jwt
import phonenumbers
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

from app.core.config import get_settings

_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    """Hash a plaintext password with argon2id."""
    return _hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """Return True when the password matches the stored hash."""
    try:
        return _hasher.verify(password_hash, password)
    except VerifyMismatchError:
        return False


def generate_otp_code() -> str:
    """Generate a six-digit one-time code."""
    return f"{secrets.randbelow(1_000_000):06d}"


def hash_otp_code(code: str) -> str:
    """Hash an OTP code for at-rest storage."""
    return hashlib.sha256(code.encode("utf-8")).hexdigest()


def hash_token(raw: str) -> str:
    """SHA-256 hash for opaque tokens stored at rest."""
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def normalize_phone_number(raw: str) -> str:
    """Normalize raw input to E.164; raise ValueError when invalid."""
    parsed = phonenumbers.parse(raw.strip(), "IR")
    if not phonenumbers.is_valid_number(parsed):
        raise ValueError("Invalid phone number")
    return phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)


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
    if payload.get("type") != "access":
        raise jwt.InvalidTokenError("نوع توکن اشتباه است.")
    return int(payload["sub"])