"""Analytics endpoints for the dashboard."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.analytics.schemas import (
    ByPlatformResponse,
    PlatformStats,
    RecentJobsResponse,
    RecentJob,
    SummaryResponse,
    TimelinePoint,
    TimelineResponse,
)
from app.analytics.service import (
    get_by_platform,
    get_recent_jobs,
    get_summary,
    get_timeline,
)
from app.auth.dependencies import TeamContext, require
from app.core.database import get_db

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary", response_model=SummaryResponse)
async def summary(
    team: TeamContext = Depends(require("analytics:view")),
    db: AsyncSession = Depends(get_db),
) -> SummaryResponse:
    """Top-level overview of content job activity."""
    data = await get_summary(db, team)
    return SummaryResponse(**data)


@router.get("/by-platform", response_model=ByPlatformResponse)
async def by_platform(
    team: TeamContext = Depends(require("analytics:view")),
    db: AsyncSession = Depends(get_db),
) -> ByPlatformResponse:
    """Per-platform breakdown of job activity."""
    rows = await get_by_platform(db, team)
    return ByPlatformResponse(platforms=[PlatformStats(**r) for r in rows])


@router.get("/timeline", response_model=TimelineResponse)
async def timeline(
    days: int = Query(default=30, ge=1, le=365),
    team: TeamContext = Depends(require("analytics:view")),
    db: AsyncSession = Depends(get_db),
) -> TimelineResponse:
    """Daily counts for the last N days (zero-filled)."""
    points = await get_timeline(db, team, days)
    return TimelineResponse(
        days=days,
        points=[TimelinePoint(**p) for p in points],
    )


@router.get("/recent", response_model=RecentJobsResponse)
async def recent(
    limit: int = Query(default=10, ge=1, le=50),
    team: TeamContext = Depends(require("analytics:view")),
    db: AsyncSession = Depends(get_db),
) -> RecentJobsResponse:
    """Most recent jobs for the team."""
    rows = await get_recent_jobs(db, team, limit)
    return RecentJobsResponse(jobs=[RecentJob(**r) for r in rows])