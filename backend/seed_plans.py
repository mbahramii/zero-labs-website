"""Seed default subscription plans."""
import asyncio

from sqlalchemy import select

from app.core.database import AsyncSessionLocal
from app.subscriptions.models import Plan


async def seed() -> None:
    """Seed default subscription plans if they don't already exist."""
    async with AsyncSessionLocal() as db:
        existing = (await db.execute(select(Plan))).scalars().all()
        if existing:
            print(f"Already seeded with {len(existing)} plans.")
            return

        plans = [
            Plan(
                name="Free",
                slug="free",
                description="برای شروع و تست سرویس",
                prices={
                    "IRR": {"monthly": 0, "yearly": 0},
                    "USD": {"monthly": 0, "yearly": 0},
                },
                monthly_quota=10,
                features={
                    "platforms": ["telegram"],
                    "ai": False,
                    "scheduling": False,
                },
            ),
            Plan(
                name="Pro",
                slug="pro",
                description="برای کاربران حرفه‌ای",
                prices={
                    "IRR": {"monthly": 49000, "yearly": 490000},
                    "USD": {"monthly": 1.5, "yearly": 15},
                },
                monthly_quota=500,
                features={
                    "platforms": ["*"],
                    "ai": True,
                    "scheduling": True,
                },
            ),
            Plan(
                name="Business",
                slug="business",
                description="برای تیم‌ها و کسب‌وکارها",
                prices={
                    "IRR": {"monthly": 149000, "yearly": 1490000},
                    "USD": {"monthly": 5, "yearly": 50},
                },
                monthly_quota=0,  # unlimited
                features={
                    "platforms": ["*"],
                    "ai": "advanced",
                    "scheduling": True,
                    "team": True,
                },
            ),
        ]
        for p in plans:
            db.add(p)
        await db.commit()
        print(f"Seeded {len(plans)} plans.")


if __name__ == "__main__":
    asyncio.run(seed())