"""Content job endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.content import ContentJob
from app.models.platform import Platform
from app.schemas.content import ContentRequest, ContentResponse

router = APIRouter(prefix="/content", tags=["content"])


@router.post("", response_model=ContentResponse, status_code=status.HTTP_201_CREATED)
async def create_content_job(
    payload: ContentRequest, db: AsyncSession = Depends(get_db)
) -> ContentResponse:
    """Queue a content job after validating the target platform is active."""
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
                },
            )
    result = await db.execute(
        select(Platform).where(Platform.code == payload.platform_code)
    )
    platform = result.scalar_one_or_none()
    if platform is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Unknown platform code.")
    if not platform.is_active:
        raise HTTPException(status.HTTP_409_CONFLICT, "Platform is currently disabled.")

    job = ContentJob(description=payload.description, platform_id=platform.id, client_idempotency_key=payload.idempotency_key)
    db.add(job)
    await db.flush()  # assign id + fetch server defaults without committing
    return ContentResponse(
        id=job.id,
        status=job.status,
        platform_code=platform.code,
        created_at=job.created_at,
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