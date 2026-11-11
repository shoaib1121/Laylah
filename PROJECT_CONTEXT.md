# Laylah — Project Context for AI Tools

## Project purpose

Laylah is both (1) a restaurant application for an Indian and Arabian food concept and (2) an end-to-end Application Security (AppSec) portfolio project. The restaurant product is the realistic setting for learning and demonstrating AppSec; Laylah should be developed as a secure application, not as a collection of intentionally vulnerable production features.

The owner wants to understand every important line of code and technical decision. Work incrementally, use small steps, and explain what each change does, why it is needed, and its security trade-offs. Avoid large unexplained code dumps. Do not claim planned technology or controls are implemented. When guiding the owner manually, give clear step-by-step instructions and wait for their result before proceeding.

## Current state at a glance

- The frontend is React/JSX with Vite and CSS. Its one-page restaurant site fetches menu data from the local API and filters it by category.
- The backend is a local Express 5 API. After the database and role were renamed, its public, read-only menu endpoint was verified: health returned `ok` and the menu returned five records. The browser displayed all five dishes under Laylah branding.
- Five backend API tests use Node's built-in test runner and Supertest with a test double for PostgreSQL. The November 10 run was blocked by loopback permissions before it could check API responses. Frontend lint and build passed on November 10, 2026. No tests were rerun after the rebrand.
- Local PostgreSQL 18.6 runs on port 5433. The database is `laylah_dev`, role `laylah_app`, schema `app`, and table `app.menu_items`, with five menu records. The role has CONNECT, schema USAGE, and table SELECT.
- `backend/.env.example` and ignored `backend/.env` use the Laylah database and role identifiers. The database and role rename is complete. The SQL setup has not been captured as a tracked migration.
- No authentication, authorization, CI/CD, AppSec scan configuration, or deployment is implemented.
- The project folder is now `C:\Users\Admin\OneDrive\Laylah`. Branch `master` is at `561e55d`; working changes and new documentation remain uncommitted. There is no Git remote or GitHub repository yet. No Codex Cloud environment is configured; the ChatGPT project named Laylah exists, but the local Codex project entry still points to the old folder path.
- The local API and Vite development server are currently stopped after the folder move. Start them from the new Laylah path to resume the app.

## Document map

- [`README.md`](README.md): product introduction, prerequisites, and run commands.
- [`ARCHITECTURE.md`](ARCHITECTURE.md): verified current architecture and clearly labeled future direction.
- [`SECURITY.md`](SECURITY.md): current security behavior, AppSec lifecycle, planned controls, and open questions.
- [`DEVELOPMENT_LOG.md`](DEVELOPMENT_LOG.md): commit history, milestone record, verification notes, and next work.
- [`docs/security/menu-api-requirements-threat-model.md`](docs/security/menu-api-requirements-threat-model.md): feature-level requirements and threat-model draft for the public menu API.

## Working rules

1. Treat repository files and Git history as the source of truth for implementation status. If a fact may have changed, inspect the files before repeating it.
2. Keep implemented behavior, agreed decisions, recommendations, and undecided proposals visibly distinct.
3. Preserve existing files and uncommitted work. Do not stage or commit unless explicitly asked.
4. Follow the AppSec lifecycle in `SECURITY.md` for meaningful features.
5. Keep documentation focused: update the relevant dedicated file when its subject changes, and update this file only when the project-wide handoff or navigation changes.

## Immediate continuation point

The current setup task is to create a private GitHub repository for the complete Laylah project and prepare a reusable Codex Cloud environment from it. Keep ignored `backend/.env` out of Git. The next application milestone is a tracked SQL migration for the existing schema and sample data; tell the owner before starting that migration.

The `psql` executable is not on `PATH`; the user verified it at:

```powershell
& 'C:\Program Files\PostgreSQL\18\bin\psql.exe' -h 127.0.0.1 -p 5433 -U postgres -d postgres
```

The user should enter database passwords only in local prompts or ignored local configuration, never in chat or tracked files. See `DEVELOPMENT_LOG.md` for the session handoff and remaining work.
