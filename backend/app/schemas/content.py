"""Pydantic schemas for the content creation API."""

from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class ContentStatus(StrEnum):
    """Lifecycle status of a content job."""

    queued = "queued"
    processing = "processing"
    published = "published"
    failed = "failed"
    scheduled = "scheduled"


class ContentRequest(BaseModel):
    """Payload for creating a new content generation request."""

    platform_code: str = Field(pattern=r"^[a-z0-9_-]{2,50}$")
    description: str = Field(min_length=10, max_length=5000)
    idempotency_key: str | None = Field(
        default=None,max_length=36, description="Client-generated unique key to prevent duplicate job creation."
    )
    scheduled_at: datetime | None = Field(
        default=None, description="Scheduled time for the content job."
    )


class ContentResponse(BaseModel):
    """Data returned to the client after a content job is created."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    status: ContentStatus
    platform_code: str 
    idempotency_key: str | None = None
    created_at: datetime
    scheduled_at: datetime | None = None