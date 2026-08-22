"""Symmetric encryption for sensitive data (channel credentials)."""

from cryptography.fernet import Fernet, InvalidToken

from app.core.config import get_settings


def encrypt(plaintext: str) -> str:
    """Encrypt a string with Fernet; return base64-encoded ciphertext."""
    f = Fernet(get_settings().encryption_key)
    return f.encrypt(plaintext.encode("utf-8")).decode("utf-8")


def decrypt(ciphertext: str) -> str:
    """Decrypt a Fernet-encrypted string."""
    f = Fernet(get_settings().encryption_key)
    try:
        return f.decrypt(ciphertext.encode("utf-8")).decode("utf-8")
    except InvalidToken as exc:
        raise ValueError("Failed to decrypt: invalid token or key") from exc