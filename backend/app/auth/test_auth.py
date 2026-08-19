"""Unit tests for auth helpers (no database required)."""

import pytest

from app.auth.security import (
    create_access_token,
    decode_access_token,
    generate_otp_code,
    hash_otp_code,
    hash_password,
    verify_password,
    normalize_phone_number,
)

def test_password_roundtrip() -> None:
    """Hashed password verifies correctly."""
    hashed = hash_password("S3curePass!")
    assert verify_password("S3curePass!", hashed)


def test_password_wrong_rejected() -> None:
    """Wrong password fails verification."""
    hashed = hash_password("S3curePass!")
    assert not verify_password("wrong-pass", hashed)


def test_otp_format() -> None:
    """OTP is exactly six digits."""
    code = generate_otp_code()
    assert len(code) == 6 and code.isdigit()


def test_otp_hash_deterministic() -> None:
    """Same code hashes to the same value."""
    assert hash_otp_code("123456") == hash_otp_code("123456")


def test_phone_normalize_iranian() -> None:
    """Local format normalizes to E.164."""
    assert normalize_phone_number("09123456789") == "+989123456789"


def test_phone_invalid_raises() -> None:
    """Invalid numbers raise ValueError."""
    with pytest.raises(Exception):
        normalize_phone_number("09123")


def test_jwt_roundtrip() -> None:
    """Access token decodes back to the same user id."""
    token = create_access_token(42)
    assert decode_access_token(token) == 42