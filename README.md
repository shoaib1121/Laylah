# Laylah

Laylah is a restaurant web application for an Indian and Arabian food concept, and an end-to-end Application Security (AppSec) portfolio project. It is being built incrementally so each product and security decision can be understood and demonstrated.

## Current implementation

- A React/Vite restaurant landing page with an API-backed menu and category filters.
- A local Express REST API with health and public menu endpoints. The menu endpoint reads from PostgreSQL, where five sample dishes have been seeded. After the Laylah database and role rename, the health and menu endpoints were verified; the menu returned five dishes.
- Backend API tests using Node's built-in test runner and Supertest.

The initial database migration is tracked for fresh databases. Authentication, authorization, ordering, and deployment remain planned. GitHub Actions validation and dependency auditing are configured; current results and limitations are in DEVELOPMENT_LOG.md.

## Current status — 2026-11-12

The project is published in the public GitHub repository [shoaib1121/Laylah](https://github.com/shoaib1121/Laylah), whose default branch is `main`. A reusable Codex Cloud environment has been published. The Cloud workspace was confirmed at `/workspace/Laylah` with this repository as its remote, on branch `work` at commit `4eeee4e`.

The Cloud setup session reported that it installed dependencies, started PostgreSQL, the API, and the frontend, and passed all five API tests, frontend lint/build, and live menu/category-filter checks. Those are results reported by that setup session, not a CI run or a guarantee that its processes are still running. The database was a development fixture; the tracked migration has not been applied there, and production deployment remains outstanding. Local Windows server status was not checked during this closeout.

## Documentation

- [Project context for AI tools](PROJECT_CONTEXT.md)
- [Architecture and design](ARCHITECTURE.md)
- [Security requirements and learning lifecycle](SECURITY.md)
- [Development history and next steps](DEVELOPMENT_LOG.md)
- [Application roadmap](docs/roadmap/Laylah_Project_Roadmap.svg)
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

## GitHub-first development

Follow [AGENTS.md](AGENTS.md). Inspect the working tree, fetch GitHub's default branch (`main`), and create one descriptive feature branch from its latest commit. Preserve existing work, commit reviewed task files with meaningful messages, push normally, and open a PR using the template. Never force-push or merge without the owner's explicit approval.

CI runs on PRs targeting main and pushes to main, using Node 24 and separate frontend/backend jobs. Frontend runs `npm ci`, `npm run lint`, `npm run build`, and `npm run test --if-present` (no frontend test script currently exists). Backend runs `npm ci` and `npm test`; its eight API tests use a database double, so CI needs no database password or live PostgreSQL. Independent dependency jobs run `npm audit --package-lock-only --audit-level=high` for both lockfiles, including development dependencies. High/critical findings and audit service failures fail the job; moderate findings remain visible for triage. Read failing step logs in the PR Checks tab. No deployment is configured.

### Main protection: manual setup

Protection could not be written through this session's available tools: the GitHub connector exposes no protection mutation, and the shell API route returned `Forbidden`. At inspection, main was unprotected and no rulesets existed.

After CI has run, open repository **Settings → Branches → Add classic branch protection rule** (or **Add rule**):

1. Set branch name pattern to `main`.
2. Enable **Require a pull request before merging**. For this solo-owner repository, leave required approving reviews off so the owner can maintain it; explicit owner permission to merge remains the agent rule.
3. Enable **Require status checks to pass before merging** and select `Frontend checks`, `Backend tests`, `Dependency audit (frontend)`, and `Dependency audit (backend)` from this PR's CI run. Require branches up to date if desired.
4. Leave **Allow force pushes** and **Allow deletions** unchecked. Leave lock-branch, signed-commit, linear-history, and administrator-bypass restrictions off unless you deliberately want them.
5. Save and verify the protection settings. Administrative bypass remains an owner recovery option; agents must still follow the PR and approval rules.

### Cloud development without Windows

The existing workspace is `/workspace/Laylah`, with origin `https://github.com/shoaib1121/Laylah.git`. Node 24/npm run both installs and all checks in Linux without the Windows laptop. Do not recreate the environment. Install dependencies using `npm ci` in each component.

In separate cloud terminals:

```sh
cd /workspace/Laylah/backend
npm start
```

```sh
cd /workspace/Laylah/frontend
npm run dev -- --strictPort
```

The backend needs a reachable PostgreSQL database and a private ignored `backend/.env` containing the variables listed in `backend/.env.example`. Never paste credentials into chat or commit them. `backend/migrations/001_create_menu_items.sql` provisions the initial schema, menu data, and read-only app grants for a fresh database whose `laylah_app` role already exists. Do not run it against the populated `laylah_dev` database. In the current prepared environment, `/workspace/laylah-setup/START.md` describes existing fixture helpers; these are environment-local, not versioned migrations or guaranteed files in a fresh environment. Review that guide before using helpers and preserve its database volume. Do not bind to public interfaces or publish application ports.

### Inspecting with ChatGPT

Enable the GitHub integration with access to `shoaib1121/Laylah`. Ask ChatGPT to read the latest `main` (or the specific PR branch), PROJECT_CONTEXT.md, and its document map before answering. Remote commits are shared evidence; Codex workspace edits, local database state, running processes, and conversation history are not automatically shared. No duplicate status file or production deployment is needed.
