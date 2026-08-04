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


class ContentRequest(BaseModel):
    """Payload for creating a new content generation request."""

    description: str = Field(min_length=10, max_length=500)
    # DB (platforms table) is the source of truth; validated in the endpoint.
    platform_code: str = Field(pattern=r"^[a-z0-9_-]{2,50}$")
    tone: str = "casual"


class ContentResponse(BaseModel):
    """Data returned to the client after a content job is created."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    status: ContentStatus
    platform_code: str
    created_at: datetime