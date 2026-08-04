# Social Publish — Backend

API for the Social Publish platform: users create content jobs and the
system publishes them to connected social platforms.

This repository hosts the **website** project (Next.js frontend + this
FastAPI backend). Publisher bots live in the **main project repository**
and integrate through the Redis job queue and internal callback endpoints.

## Stack

- Python 3.13+, FastAPI (fully async)
- SQLAlchemy 2.0 async + asyncpg, PostgreSQL
- Pydantic v2 + pydantic-settings (fail-fast configuration)
- Ruff (lint + format)

## Structure

- `app/main.py` — entry point, lifespan, CORS, router registration
- `app/api/v1/` — HTTP endpoints
- `app/core/` — settings + database engine/session factory
- `app/models/` — ORM models
- `app/schemas/` — request/response schemas

## Local Setup

1. Python environment:

```bash
python -m venv venv
venv\Scripts\activate
pip install fastapi "uvicorn[standard]" "sqlalchemy[asyncio]" asyncpg pydantic-settings