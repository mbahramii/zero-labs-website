# Social Publish — Backend

API for the Social Publish platform: users create content jobs and the
system publishes them to connected social platforms.

This repository hosts the **website** project (Next.js frontend + this
FastAPI backend). Publisher bots live in the **main project repository**
and integrate through the Redis job queue and internal callback endpoints.

## Stack

- Python 3.13+, FastAPI (fully async)
- SQLAlchemy 2.0 async + asyncpg, PostgreSQL
- Alembic for database migrations
- Pydantic v2 + pydantic-settings (fail-fast configuration)
- Ruff (lint + format)

## Structure

- `app/main.py` — entry point, lifespan, CORS, router registration
- `app/api/v1/` — HTTP endpoints
- `app/core/` — settings + database engine/session factory
- `app/models/` — ORM models
- `app/schemas/` — request/response schemas
- `alembic/` — database migrations

## Local Setup

1. Python environment:

```bash
python -m venv venv
venv\Scripts\activate
pip install fastapi "uvicorn[standard]" "sqlalchemy[asyncio]" asyncpg pydantic-settings alembic
```

2. Postgres via Docker (host port **5434** to avoid clashing with any
   local Postgres on 5432):

```bash
docker run -d --name social_publish_db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=social_publish -p 5434:5432 postgres:16
```

3. Environment:

```bash
copy .env.example .env
```

4. Apply database migrations:

```bash
alembic upgrade head
```

5. Run:

```bash
uvicorn app.main:app --reload
```

API docs: http://127.0.0.1:8000/docs

6. Seed platforms (dev only):

```bash
docker exec -it social_publish_db psql -U postgres -d social_publish -c "INSERT INTO platforms (code, display_name, is_iranian, is_active) VALUES ('telegram','Telegram',false,true), ('whatsapp','WhatsApp',false,true), ('instagram','Instagram',false,true), ('facebook','Facebook',false,true), ('eitaa','Eitaa',true,true), ('rubika','Rubika',true,true), ('bale','Bale',true,true) ON CONFLICT (code) DO NOTHING;"
```

## Quality Gates

```bash
ruff check app/
ruff format app/
bandit -r app/ -ll
pip-audit
gitleaks detect --source="." --verbose
```

## Database Migrations

Schema changes are managed exclusively by Alembic (never `create_all`):

```bash
alembic revision --autogenerate -m "describe the change"
alembic upgrade head
```

## Git Workflow

- `main` is protected; personal branches: `mohammad` (frontend), `mahdi` (backend)
- Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`
- PR + review before merging into `main` (squash and merge)

## Roadmap

Auth (mobile + password + OTP) · Channels with encrypted credentials ·
Redis + arq job queue · Publisher callback API · AI layer (captions,
hashtags) · Media generation · Billing · Tests/CI.