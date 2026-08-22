"""Content publishing endpoints with team scope enforcement."""

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import TeamContext, require
from app.auth.models import User
from app.core.database import get_db
from app.core.exceptions import AuthorizationError, ConflictError, NotFoundError
from app.models.content import ContentJob
from app.models.platform import Platform
from app.schemas.content import ContentRequest, ContentResponse

router = APIRouter(prefix="/content", tags=["content"])


def _allowed_platform_ids(team: TeamContext) -> set[int] | None:
    """Return allowed platform ids from scope; None means unlimited (owner)."""
    if not team.scope:
        return None
    return {int(item["id"]) for item in team.scope if item.get("t") == "p"}


async def _team_user_ids(db: AsyncSession, team: TeamContext) -> list[int]:
    """Return ids of the owner plus all team members."""
    result = await db.execute(
        select(User.id).where(User.owner_user_id == team.owner.id)
    )
    return [team.owner.id] + [row[0] for row in result.all()]


@router.post("", response_model=ContentResponse, status_code=201)
async def create_content_job(
    payload: ContentRequest,
    team: TeamContext = Depends(require("content:create")),
    db: AsyncSession = Depends(get_db),
):
    """Create a content job, enforcing platform scope and idempotency."""
    result = await db.execute(
        select(Platform).where(Platform.code == payload.platform_code)
    )
    platform = result.scalar_one_or_none()
    if platform is None:
        raise NotFoundError("پلتفرم یافت نشد.")
    if not platform.is_active:
        raise ConflictError("این پلتفرم غیرفعال است.")

    allowed = _allowed_platform_ids(team)
    if allowed is not None and platform.id not in allowed:
        raise AuthorizationError(f"دسترسی به پلتفرم {platform.code} ندارید.")

    if payload.idempotency_key is not None:
        dup = await db.execute(
            select(ContentJob).where(
                ContentJob.client_idempotency_key == payload.idempotency_key
            )
        )
        existing = dup.scalar_one_or_none()
        if existing is not None:
            return JSONResponse(
                status_code=200,
                content={
                    "id": existing.id,
                    "status": existing.status,
                    "platform_code": platform.code,
                    "created_at": existing.created_at.isoformat(),
                },
            )

    job = ContentJob(
        description=payload.description,
        platform_id=platform.id,
        status="queued",
        client_idempotency_key=payload.idempotency_key,
        created_by=team.current_user.id,
    )
    db.add(job)
    await db.flush()
    return ContentResponse(
        id=job.id,
        status=job.status,
        platform_code=platform.code,
        created_at=job.created_at,
    )


@router.get("", response_model=list[ContentResponse])
async def list_content_jobs(
    team: TeamContext = Depends(require("content:view")),
    db: AsyncSession = Depends(get_db),
) -> list[ContentResponse]:
    """List team content jobs, filtered by platform scope."""
    ids = await _team_user_ids(db, team)
    condition = ContentJob.created_by.in_(ids)
    if team.role is None:
        condition = condition | ContentJob.created_by.is_(None)
    result = await db.execute(
        select(ContentJob, Platform)
        .join(Platform, Platform.id == ContentJob.platform_id)
        .where(condition)
        .order_by(ContentJob.created_at.desc())
    )
    allowed = _allowed_platform_ids(team)
    out = []
    for job, platform in result.all():
        if allowed is not None and platform.id not in allowed:
            continue
        out.append(
            ContentResponse(
                id=job.id,
                status=job.status,
                platform_code=platform.code,
                created_at=job.created_at,
            )
        )
    return out


@router.get("/{job_id}", response_model=ContentResponse)
async def get_content_job(
    job_id: int,
    team: TeamContext = Depends(require("content:view")),
    db: AsyncSession = Depends(get_db),
) -> ContentResponse:
    """Return one team content job, respecting scope."""
    result = await db.execute(
        select(ContentJob, Platform)
        .join(Platform, Platform.id == ContentJob.platform_id)
        .where(ContentJob.id == job_id)
    )
    row = result.one_or_none()
    if row is None:
        raise NotFoundError("محتوا یافت نشد.")
    job, platform = row
    ids = await _team_user_ids(db, team)
    owns = job.created_by in ids or (team.role is None and job.created_by is None)
    if not owns:
        raise NotFoundError("محتوا یافت نشد.")
    allowed = _allowed_platform_ids(team)
    if allowed is not None and platform.id not in allowed:
        raise NotFoundError("محتوا یافت نشد.")
    return ContentResponse(
        id=job.id,
        status=job.status,
        platform_code=platform.code,
        created_at=job.created_at,
    )