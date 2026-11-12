# Laylah — Project Context for AI Tools

## Project purpose

Laylah is both (1) a restaurant application for an Indian and Arabian food concept and (2) an end-to-end Application Security (AppSec) portfolio project. The restaurant product is the realistic setting for learning and demonstrating AppSec; Laylah should be developed as a secure application, not as a collection of intentionally vulnerable production features.

The owner wants to understand every important line of code and technical decision. Work incrementally, use small steps, and explain what each change does, why it is needed, and its security trade-offs. Avoid large unexplained code dumps. Do not claim planned technology or controls are implemented. When guiding the owner manually, give clear step-by-step instructions and wait for their result before proceeding.

## Current state at a glance

- The frontend is React/JSX with Vite and CSS. Its one-page restaurant site fetches menu data from the local API and filters it by category.
- The backend is a local Express 5 API. After the database and role were renamed, its public, read-only menu endpoint was verified: health returned `ok` and the menu returned five records. The browser displayed all five dishes under Laylah branding.
- Eight backend API tests now cover the original five cases plus generic database errors, parameterized category queries, and rejection before database access. They use Node's built-in test runner and Supertest with a test double for PostgreSQL. An earlier November 10 local test run was blocked by loopback permissions before it could check API responses. The 2026-11-12 Codex Cloud setup session reported all five API tests, frontend lint/build, and live menu/category-filter checks passed; this was reported by that setup session rather than a CI pipeline.
- Local PostgreSQL 18.6 runs on port 5433. The database is `laylah_dev`, role `laylah_app`, schema `app`, and table `app.menu_items`, with five menu records. The role has CONNECT, schema USAGE, and table SELECT.
- `backend/.env.example` and ignored `backend/.env` use the Laylah database and role identifiers. The database and role rename is complete. `backend/migrations/001_create_menu_items.sql` captures the initial schema, seed data, and read-only grants for fresh databases only.
- GitHub Actions CI is configured for PRs targeting `main` and pushes to `main`: frontend lint/build, backend tests, and lockfile dependency audits. See DEVELOPMENT_LOG.md for observed verification and pending protection settings. Authentication, authorization, production deployment, SAST, and DAST automation remain unimplemented.
- The project folder is `C:\Users\Admin\OneDrive\Laylah`. The public GitHub repository is `shoaib1121/Laylah`, with `main` as its default branch; the ignored local password file `backend/.env` is not in the repository. A reusable Codex Cloud environment was published. Its workspace was confirmed at `/workspace/Laylah`, remote `https://github.com/shoaib1121/Laylah.git`, branch `work`, commit `4eeee4e`. Cloud is a development workspace, not a production deployment.
- The local API and Vite development server are currently stopped after the folder move. Start them from the new Laylah path to resume the app.

## Document map

- [`README.md`](README.md): product introduction, prerequisites, and run commands.
- [`ARCHITECTURE.md`](ARCHITECTURE.md): verified current architecture and clearly labeled future direction.
- [`SECURITY.md`](SECURITY.md): current security behavior, AppSec lifecycle, planned controls, and open questions.
- [`DEVELOPMENT_LOG.md`](DEVELOPMENT_LOG.md): commit history, milestone record, verification notes, and next work.
- [`docs/roadmap/Laylah_Project_Roadmap.svg`](docs/roadmap/Laylah_Project_Roadmap.svg): current status and proposed major development stages.
- [`docs/security/menu-api-requirements-threat-model.md`](docs/security/menu-api-requirements-threat-model.md): feature-level requirements and threat-model draft for the public menu API.

## Working rules

1. Treat the latest GitHub default branch (`main`) as the authoritative source of truth for implementation status; read AGENTS.md for the branch/PR workflow. If a fact may have changed, inspect the files before repeating it.
2. Keep implemented behavior, agreed decisions, recommendations, and undecided proposals visibly distinct.
3. Preserve existing files and uncommitted work. Authorized development tasks use a fresh feature branch from GitHub main, checks, meaningful commits, normal pushes, and a PR. Never merge without explicit owner approval.
4. Follow the AppSec lifecycle in `SECURITY.md` for meaningful features.
5. Keep documentation focused: update the relevant dedicated file when its subject changes, and update this file only when the project-wide handoff or navigation changes.

## Immediate continuation point

The GitHub repository and reusable Codex Cloud development environment are set up. Keep ignored `backend/.env` out of Git. The initial tracked migration is ready for review; do not run it against the populated local database until its reconciliation/safety plan is reviewed.

The `psql` executable is not on `PATH`; the user verified it at:

```powershell
& 'C:\Program Files\PostgreSQL\18\bin\psql.exe' -h 127.0.0.1 -p 5433 -U postgres -d postgres
```

The user should enter database passwords only in local prompts or ignored local configuration, never in chat or tracked files. See `DEVELOPMENT_LOG.md` for the session handoff and remaining work.

## GitHub and ChatGPT handoff

Read the latest requested GitHub branch and these linked documents before answering. ChatGPT GitHub integration can inspect pushed commits when repository access is enabled; it does not share Codex live workspace state or automatically monitor updates. Unmerged work is visible on its PR branch, not main. The cloud workflow and manual protection steps are in README.md.
