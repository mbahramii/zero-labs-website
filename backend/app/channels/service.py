"""Channel business logic with encryption and scope enforcement."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import TeamContext
from app.channels.models import Channel
from app.core.encryption import encrypt
from app.core.exceptions import AuthorizationError, ConflictError, NotFoundError
from app.models.platform import Platform


async def create_channel(
    db: AsyncSession, team: TeamContext, platform_code: str, title: str, credentials: str
) -> Channel:
    """Create a new channel with encrypted credentials."""
    result = await db.execute(select(Platform).where(Platform.code == platform_code))
    platform = result.scalar_one_or_none()
    if platform is None:
        raise NotFoundError("پلتفرم یافت نشد.")
    if not platform.is_active:
        raise ConflictError("این پلتفرم غیرفعال است.")

    # Scope enforcement: check if platform is allowed
    allowed = _allowed_platform_ids(team)
    if allowed is not None and platform.id not in allowed:
        raise AuthorizationError(f"دسترسی به پلتفرم {platform_code} ندارید.")

    encrypted = encrypt(credentials)
    channel = Channel(
        owner_id=team.owner.id,
        platform_id=platform.id,
        title=title,
        credentials_encrypted=encrypted,
    )
    db.add(channel)
    await db.flush()
    return channel


async def list_channels(
    db: AsyncSession, team: TeamContext
) -> list[tuple[Channel, Platform]]:
    """List channels visible to the current user based on scope."""
    result = await db.execute(
        select(Channel, Platform)
        .join(Platform, Platform.id == Channel.platform_id)
        .where(Channel.owner_id == team.owner.id)
        .order_by(Channel.created_at.desc())
    )
    rows = result.all()

    # Filter by channel scope (if any c-items in scope)
    channel_scope_ids = _channel_scope_ids(team)
    if channel_scope_ids is not None:
        rows = [(ch, p) for ch, p in rows if ch.id in channel_scope_ids]

    # Filter by platform scope
    platform_scope_ids = _allowed_platform_ids(team)
    if platform_scope_ids is not None:
        rows = [(ch, p) for ch, p in rows if p.id in platform_scope_ids]

    return rows


async def delete_channel(db: AsyncSession, team: TeamContext, channel_id: int) -> None:
    """Delete a channel (owner-only or channels:manage permission)."""
    result = await db.execute(
        select(Channel).where(
            Channel.id == channel_id, Channel.owner_id == team.owner.id
        )
    )
    channel = result.scalar_one_or_none()
    if channel is None:
        raise NotFoundError("کانال یافت نشد.")

    # Scope enforcement: check if this channel is accessible
    channel_scope_ids = _channel_scope_ids(team)
    if channel_scope_ids is not None and channel.id not in channel_scope_ids:
        raise NotFoundError("کانال یافت نشد.")

    await db.delete(channel)


def _allowed_platform_ids(team: TeamContext) -> set[int] | None:
    """Return allowed platform ids from scope; None means unlimited."""
    if not team.scope:
        return None
    return {int(item["id"]) for item in team.scope if item.get("t") == "p"}


def _channel_scope_ids(team: TeamContext) -> set[int] | None:
    """Return allowed channel ids from scope; None means no channel restriction."""
    if not team.scope:
        return None
    ids = {int(item["id"]) for item in team.scope if item.get("t") == "c"}
    return ids if ids else None