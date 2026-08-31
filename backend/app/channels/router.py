"""Channel management endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import TeamContext, require
from app.channels.schemas import ChannelCreate, ChannelOut
from app.channels.service import create_channel, delete_channel, list_channels
from app.core.database import get_db

router = APIRouter(prefix="/channels", tags=["channels"])


@router.get("", response_model=list[ChannelOut])
async def list_channels_endpoint(
    team: TeamContext = Depends(require("channels:view")),
    db: AsyncSession = Depends(get_db),
) -> list[ChannelOut]:
    """List channels visible to the current user."""
    rows = await list_channels(db, team)
    return [
        ChannelOut(
            id=channel.id,
            platform_code=platform.code,
            title=channel.title,
            created_at=channel.created_at,
        )
        for channel, platform in rows
    ]


@router.post("", response_model=ChannelOut, status_code=201)
async def create_channel_endpoint(
    payload: ChannelCreate,
    team: TeamContext = Depends(require("channels:manage")),
    db: AsyncSession = Depends(get_db),
) -> ChannelOut:
    """Create a new channel with encrypted credentials."""
    channel = await create_channel(
        db, team, payload.platform_code, payload.title, payload.credentials
    )
    # Fetch platform code
    from sqlalchemy import select
    from app.models.platform import Platform

    result = await db.execute(select(Platform).where(Platform.id == channel.platform_id))
    platform = result.scalar_one()
    return ChannelOut(
        id=channel.id,
        platform_code=platform.code,
        title=channel.title,
        created_at=channel.created_at,
    )


@router.delete("/{channel_id}", status_code=204)
async def delete_channel_endpoint(
    channel_id: int,
    team: TeamContext = Depends(require("channels:manage")),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a channel."""
    await delete_channel(db, team, channel_id)