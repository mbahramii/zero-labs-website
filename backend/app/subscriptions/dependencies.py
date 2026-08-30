"""FastAPI dependencies for subscription enforcement."""

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import TeamContext, get_current_team
from app.core.database import get_db
from app.core.exceptions import AuthorizationError
from app.subscriptions.models import Plan
from app.subscriptions.service import get_current_subscription, get_monthly_usage


async def require_active_subscription(
    team: TeamContext = Depends(get_current_team),
    db: AsyncSession = Depends(get_db),
) -> TeamContext:
    """Ensure the team owner has an active subscription with remaining quota."""
    sub = await get_current_subscription(db, team.owner.id)
    if sub is None:
        raise AuthorizationError(
            "برای ایجاد محتوا نیاز به اشتراک فعال دارید. از بخش پلن‌ها یک اشتراک تهیه کنید."
        )

    result = await db.execute(select(Plan).where(Plan.id == sub.plan_id))
    plan = result.scalar_one()

    if plan.monthly_quota > 0:
        usage = await get_monthly_usage(db, team.owner.id)
        if usage >= plan.monthly_quota:
            raise AuthorizationError(
                f"سهمیه ماهانه شما ({plan.monthly_quota} پست) به پایان رسیده. "
                "لطفاً پلن خود را ارتقا دهید."
            )

    return team