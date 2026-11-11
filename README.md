# Laylah

Laylah is a restaurant web application for an Indian and Arabian food concept, and an end-to-end Application Security (AppSec) portfolio project. It is being built incrementally so each product and security decision can be understood and demonstrated.

## Current implementation

- A React/Vite restaurant landing page with an API-backed menu and category filters.
- A local Express REST API with health and public menu endpoints. The menu endpoint reads from PostgreSQL, where five sample dishes have been seeded. After the Laylah database and role rename, the health and menu endpoints were verified; the menu returned five dishes.
- Backend API tests using Node's built-in test runner and Supertest.

The tracked database migration is still outstanding. Authentication, authorization, ordering, CI/CD, security scanning, and deployment are planned.

## Current status — 2026-11-11

The local app and API were verified after the rebrand. Their dev servers are currently stopped following the project folder move; start them using the instructions below. The local Git repository has no remote yet, and no Codex Cloud environment is configured.

## Documentation

- [Project context for AI tools](PROJECT_CONTEXT.md)
- [Architecture and design](ARCHITECTURE.md)
- [Security requirements and learning lifecycle](SECURITY.md)
- [Development history and next steps](DEVELOPMENT_LOG.md)
- [Menu API requirements and threat model](docs/security/menu-api-requirements-threat-model.md)

## Development environment

Use Windows PowerShell with Node.js and npm. There is currently no root `package.json`; install dependencies in each application folder if needed.

### Frontend

From `frontend/`:

```powershell
npm install
npm run dev
```

Other available commands from that folder:

```powershell
npm run lint
npm run build
npm run preview
```

Vite is configured for local access at `127.0.0.1` and proxies `/api` requests to the local backend at `http://127.0.0.1:3000`.

### Backend

From `backend/`:

```powershell
npm install
Copy-Item .env.example .env
notepad .env
npm start
```

Before starting, replace the `PGPASSWORD` placeholder in `.env` with the local `laylah_app` password. Keep `.env` private; Git ignores it. The API listens on `http://127.0.0.1:3000`. Run its tests in another PowerShell window from `backend/`:

```powershell
npm test
```

Current endpoints:

- `GET /api/v1/health`
- `GET /api/v1/menu`
- `GET /api/v1/menu?category=Indian` (also `Arabian` or `Drinks`)

See `ARCHITECTURE.md` for verified implementation details and `SECURITY.md` for current controls and limitations.
