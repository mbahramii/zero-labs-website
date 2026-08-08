"""OTP generation and hashing helpers."""

import hashlib
import secrets


def generate_otp_code() -> str:
    """Generate a six-digit one-time code."""
    return f"{secrets.randbelow(1_000_000):06d}"


def hash_otp_code(code: str) -> str:
    """Hash an OTP code for at-rest storage."""
    return hashlib.sha256(code.encode("utf-8")).hexdigest()