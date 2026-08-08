"""Shared security helpers."""

import hashlib


def hash_token(raw: str) -> str:
    """SHA-256 hash for opaque tokens stored at rest."""
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()