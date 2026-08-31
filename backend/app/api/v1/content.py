"""Content job endpoints."""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.exceptions import InvalidInputError
from app.auth.dependencies import TeamContext, require
from app.models.content import ContentJob
from app.models.platform import Platform
from app.schemas.content import ContentRequest, ContentResponse



router = APIRouter(prefix="/content", tags=["content"])


@router.post("", response_model=ContentResponse, status_code=status.HTTP_201_CREATED)
async def create_content_job(
    payload: ContentRequest,
    request: Request,
    team: TeamContext = Depends(require("content:create")),
    db: AsyncSession = Depends(get_db),
) -> ContentResponse:
    """Queue a content job (immediately or scheduled) after validating the target platform."""

    # 1) Idempotency guard
    if payload.idempotency_key is not None:
        result = await db.execute(
            select(ContentJob).where(
                ContentJob.client_idempotency_key == payload.idempotency_key
            )
        )
        existing = result.scalar_one_or_none()
        if existing is not None:
            plat = await db.execute(select(Platform).where(Platform.id == existing.platform_id))
            return JSONResponse(
                status_code=200,
                content={
                    "id": existing.id,
                    "status": existing.status,
                    "platform_code": plat.scalar_one().code,
                    "created_at": existing.created_at.isoformat(),
                    "scheduled_at": (
                        existing.scheduled_at.isoformat()
                        if existing.scheduled_at is not None
                        else None
                    ),
                },
            )

    # 2) Resolve platform
    result = await db.execute(
        select(Platform).where(Platform.code == payload.platform_code)
    )
    platform = result.scalar_one_or_none()
    if platform is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Unknown platform code.")
    if not platform.is_active:
        raise HTTPException(status.HTTP_409_CONFLICT, "Platform is currently disabled.")

    # 3) Validate scheduled_at
    now = datetime.now(timezone.utc)
    if payload.scheduled_at is not None:
        # Make sure the incoming datetime is tz-aware for a fair comparison
        scheduled = payload.scheduled_at
        if scheduled.tzinfo is None:
            scheduled = scheduled.replace(tzinfo=timezone.utc)
        if scheduled <= now:
            raise HTTPException(
                status.HTTP_422_UNPROCESSABLE_CONTENT,
                "scheduled_at must be in the future.",
            )

    # 4) Decide initial status based on schedule
    job_status_value = "scheduled" if payload.scheduled_at is not None else "queued"

    # 5) Create the job
    job = ContentJob(
        description=payload.description,
        platform_id=platform.id,
        status=job_status_value,
        scheduled_at=payload.scheduled_at,
        client_idempotency_key=payload.idempotency_key,
        created_by=team.current_user.id,
    )
    db.add(job)
    await db.flush()

    # 6) Snapshot before commit (attributes detach after commit)
    job_id = job.id
    job_status = job.status
    job_created_at = job.created_at
    job_scheduled_at = job.scheduled_at

    await db.commit()

    # 7) Only enqueue immediate jobs; scheduled jobs wait for the cron
    if job_status == "queued":
        await request.app.state.redis.enqueue_job("publish_content", job_id)

    return ContentResponse(
        id=job_id,
        status=job_status,
        platform_code=platform.code,
        created_at=job_created_at,
        scheduled_at=job_scheduled_at,
    )


@router.get("/{job_id}", response_model=ContentResponse)
async def get_content_job(job_id: int, db: AsyncSession = Depends(get_db)) -> ContentResponse:
    """Return the current state of a content job."""
    result = await db.execute(
        select(ContentJob)
        .options(selectinload(ContentJob.platform))  # async: no implicit lazy loading
        .where(ContentJob.id == job_id)
    )
    job = result.scalar_one_or_none()
    if job is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Job not found.")
    return ContentResponse(
        id=job.id,
        status=job.status,
        platform_code=job.platform.code,
        created_at=job.created_at,
    )