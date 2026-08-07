"""Database model for content generation jobs."""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.platform import Platform


class ContentJob(Base):
    """A single content generation and publishing job."""

    __tablename__ = "content_jobs"

    id: Mapped[int] = mapped_column(primary_key=True)
    description: Mapped[str] = mapped_column(String(500))
    platform_id: Mapped[int] = mapped_column(ForeignKey("platforms.id", ondelete="RESTRICT"), index=True)
    platform: Mapped[Platform] = relationship()
    status: Mapped[str] = mapped_column(String(20), default="queued", index=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )