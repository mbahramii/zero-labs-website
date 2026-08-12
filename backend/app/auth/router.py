"""Authentication endpoints."""

from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import service
from app.auth.dependencies import get_current_user
from app.auth.models import User
from app.auth.schemas import (
    LoginRequest,
    MessageResponse,
    OtpResponse,
    RefreshRequest,
    RegisterRequest,
    RegisterVerifyRequest,
    ResetConfirmRequest,
    ResetRequest,
    TokenResponse,
    UserOut,
)
from app.core.config import get_settings
from app.core.database import get_db

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()


def _device(request: Request) -> str | None:
    """Extract the client user-agent as device info."""
    return request.headers.get("user-agent")


def _ip(request: Request) -> str | None:
    """Extract the client IP address."""
    return request.client.host if request.client else None


@router.post("/register/request", response_model=OtpResponse)
async def register_request(
    payload: RegisterRequest, request: Request, db: AsyncSession = Depends(get_db)
) -> OtpResponse:
    """Send a registration OTP to the given phone number."""
    code = await service.request_register(
        db, payload.phone, ip_address=_ip(request), honeypot=payload.website
    )
    return OtpResponse(
        message="کد تأیید ارسال شد.",
        dev_otp_code=code if settings.debug else None,
    )


@router.post("/register/verify", response_model=TokenResponse)
async def register_verify(
    payload: RegisterVerifyRequest, request: Request, db: AsyncSession = Depends(get_db)
) -> TokenResponse:
    """Verify the OTP, create the account, and return tokens."""
    return await service.verify_register(
        db, payload.phone, payload.code, payload.password,
        payload.display_name, _device(request), ip_address=_ip(request),
    )


@router.post("/login", response_model=TokenResponse)
async def login(
    payload: LoginRequest, request: Request, db: AsyncSession = Depends(get_db)
) -> TokenResponse:
    """Authenticate with phone and password."""
    return await service.login(
        db, payload.phone, payload.password, _device(request), ip_address=_ip(request)
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    payload: RefreshRequest, request: Request, db: AsyncSession = Depends(get_db)
) -> TokenResponse:
    """Rotate the refresh token and issue a new access token."""
    return await service.refresh(db, payload.refresh_token, _device(request))


@router.post("/logout", response_model=MessageResponse)
async def logout(payload: RefreshRequest, db: AsyncSession = Depends(get_db)) -> MessageResponse:
    """Revoke the presented refresh token."""
    await service.logout(db, payload.refresh_token)
    return MessageResponse(message="خروج انجام شد.")


@router.post("/password-reset/request", response_model=OtpResponse)
async def password_reset_request(
    payload: ResetRequest, request: Request, db: AsyncSession = Depends(get_db)
) -> OtpResponse:
    """Send a reset OTP without leaking account existence."""
    code = await service.request_reset(db, payload.phone, ip_address=_ip(request))
    return OtpResponse(
        message="اگر شماره ثبت شده باشد، کد ارسال شد.",
        dev_otp_code=code if (settings.debug and code) else None,
    )


@router.post("/password-reset/confirm", response_model=MessageResponse)
async def password_reset_confirm(
    payload: ResetConfirmRequest, request: Request, db: AsyncSession = Depends(get_db)
) -> MessageResponse:
    """Set a new password and invalidate all sessions."""
    await service.confirm_reset(
        db, payload.phone, payload.code, payload.new_password, ip_address=_ip(request)
    )
    return MessageResponse(message="رمز عبور تغییر کرد؛ دوباره وارد شوید.")


@router.get("/me", response_model=UserOut)
async def me(user: User = Depends(get_current_user)) -> UserOut:
    """Return the authenticated user's profile."""
    return UserOut(
        id=user.id,
        phone_number=user.phone_number,
        display_name=user.display_name,
        is_verified=user.is_verified,
    )