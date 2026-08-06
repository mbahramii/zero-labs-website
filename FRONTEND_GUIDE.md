# Frontend Developer Guide

This repository is a monorepo:

- **Frontend** (Next.js + TypeScript) lives at the repository root (`src/`, `next.config.ts`).
- **Backend** (FastAPI) lives in `backend/`.

This guide explains how to run the frontend, connect it to the backend,
and stay in sync with the API contract.

---

## 1. Prerequisites

- Node.js 20+
- Python 3.13+ and Docker Desktop (only if you need the backend locally)

---

## 2. Run the frontend

```bash
npm install
npm run dev
```

The app runs at: http://localhost:3000

Create a `.env.local` file at the repository root:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

---

## 3. Run the backend locally (optional)

Only needed if you want a real API on your machine.

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install fastapi "uvicorn[standard]" "sqlalchemy[asyncio]" asyncpg pydantic-settings
docker run -d --name social_publish_db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=social_publish -p 5434:5432 postgres:16
copy .env.example .env
uvicorn app.main:app --reload
```

Notes:

- API base URL: `http://127.0.0.1:8000`
- Interactive API docs (Swagger UI): `http://127.0.0.1:8000/docs`
- The database uses host port **5434** on purpose (a local Windows Postgres may occupy 5432).
- In development, CORS already allows `http://localhost:3000`.

---

## 4. API contract (source of truth)

The **OpenAPI schema** is the single source of truth for the API:

- Human-readable docs: `http://127.0.0.1:8000/docs`
- Machine-readable schema: `http://127.0.0.1:8000/openapi.json`

Do **not** hand-write API types. Generate TypeScript types from the schema:

```bash
npx openapi-typescript http://127.0.0.1:8000/openapi.json -o src/lib/api/schema.d.ts
```

Re-run this command whenever the backend team announces an API change.

---

## 5. Current endpoints (Phase 0)

### `GET /healthz`

Liveness probe. Response `200`:

```json
{ "status": "ok" }
```

### `POST /api/v1/content`

Create a content job. Request body:

```json
{
  "description": "A short product description (10-500 chars)",
  "platform_code": "telegram",
  "tone": "casual"
}
```

- `description` — required, 10..500 characters
- `platform_code` — required, one of the platform codes below
- `tone` — optional, defaults to `"casual"`

Response `201`:

```json
{
  "id": 1,
  "status": "queued",
  "platform_code": "telegram",
  "created_at": "2026-08-04T22:26:36.774188Z"
}
```

### `GET /api/v1/content/{id}`

Current state of a job. Response `200`: same shape as above.
`status` is one of: `queued`, `processing`, `published`, `failed`.

---

## 6. Platform codes (v1)

| code | platform |
|---|---|
| `telegram` | Telegram |
| `whatsapp` | WhatsApp |
| `instagram` | Instagram |
| `facebook` | Facebook |
| `eitaa` | Eitaa (Iranian) |
| `rubika` | Rubika (Iranian) |
| `bale` | Bale (Iranian) |

A platform may exist but be disabled server-side; see `409` below.

---

## 7. Status codes the UI must handle

| code | meaning | suggested UI behavior |
|---|---|---|
| `200` / `201` | success | continue |
| `404` | unknown platform / job not found | show "not found" state |
| `409` | platform currently disabled | show "coming soon" state |
| `422` | validation error | render `detail` for the user |

---

## 8. Git workflow

- Branches: `main` (protected), `mohammad` (frontend), `mahdi` (backend)
- Never push directly to `main`; open a PR and get a review.
- Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`

---

## 9. Need more backend context?

Ask Mahdi directly.