"""Phone number normalization helpers."""

import phonenumbers


def normalize_phone_number(raw: str) -> str:
    """Normalize raw input to E.164; raise ValueError when invalid."""
    parsed = phonenumbers.parse(raw.strip(), "IR")
    if not phonenumbers.is_valid_number(parsed):
        raise ValueError("Invalid phone number")
    return phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)