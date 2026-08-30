"""Database engine, session factory, and declarative base configuration."""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import get_settings

settings = get_settings()

engine = create_async_engine(
    settings.database_url,
    echo=settings.debug,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,  
    pool_recycle=1800,    
)

AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    """Base class every ORM model inherits from."""


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Yield a request-scoped session; commit on success, rollback on error."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise

async def get_redis():
    """Return the Redis connection pool from app.state (if available)."""
    try:
        from app.main import app
        return getattr(app.state, "redis", None)
    except Exception:
        return None