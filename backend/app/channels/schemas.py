"""Pydantic schemas for the channels feature."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ChannelCreate(BaseModel):
    """Payload to create a new channel."""

    platform_code: str = Field(min_length=1, max_length=50)
    title: str = Field(min_length=1, max_length=200)
    credentials: str = Field(min_length=1, max_length=5000)


class ChannelOut(BaseModel):
    """Public representation of a channel (credentials masked)."""

    id: int
    platform_code: str
    title: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)