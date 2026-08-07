"""Application entry point: creates the FastAPI app and manages its lifespan."""

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.content import router as content_router
from app.core.config import get_settings

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Schema is managed by Alembic (run `alembic upgrade head`)."""
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(content_router, prefix="/api/v1")


@app.get("/healthz", tags=["meta"])
async def healthcheck() -> dict[str, str]:
    """Liveness probe for orchestrators and uptime monitors."""
    return {"status": "ok"}