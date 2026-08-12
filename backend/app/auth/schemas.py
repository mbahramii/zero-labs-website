"""Pydantic schemas for the auth feature."""

from pydantic import BaseModel, Field , ConfigDict

class RegisterRequest(BaseModel):
    """Payload to request a registration OTP."""

    phone: str = Field(min_length=10, max_length=20)
    website: str | None = None 


class RegisterVerifyRequest(BaseModel):
    """Payload to verify the OTP and create the account."""

    phone: str = Field(min_length=10, max_length=20)
    code: str = Field(pattern=r"^\d{6}$")
    password: str = Field(min_length=8, max_length=128)
    display_name: str | None = Field(default=None, max_length=100)


class LoginRequest(BaseModel):
    """Payload for password login."""

    phone: str = Field(min_length=10, max_length=20)
    password: str = Field(min_length=1, max_length=128)


class RefreshRequest(BaseModel):
    """Payload carrying an opaque refresh token."""

    refresh_token: str


class ResetRequest(BaseModel):
    """Payload to request a password-reset OTP."""

    phone: str = Field(min_length=10, max_length=20)


class ResetConfirmRequest(BaseModel):
    """Payload to set a new password with a reset OTP."""

    phone: str = Field(min_length=10, max_length=20)
    code: str = Field(pattern=r"^\d{6}$")
    new_password: str = Field(min_length=8, max_length=128)


class TokenResponse(BaseModel):
    """Access/refresh token pair returned on successful auth."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class OtpResponse(BaseModel):
    """Result of an OTP request; dev_otp_code only in DEBUG mode."""

    message: str
    dev_otp_code: str | None = None


class MessageResponse(BaseModel):
    """Simple message envelope."""

    message: str
    
    
class UserOut(BaseModel):
    """Public profile of the authenticated user."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    phone_number: str
    display_name: str | None
    is_verified: bool