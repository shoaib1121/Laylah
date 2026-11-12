# Laylah Development Log

This file is a concise project handoff and milestone record, not a replacement for Git history. Check repository status and source before treating an entry as current implementation evidence.

## Git history

Selected project commits through the Cloud handoff checkpoint on `main` (before the 2026-11-12 status-doc update):

| Commit | Summary |
|---|---|
| `4eeee4e` | Update Laylah Cloud handoff status; latest commit used by the verified Cloud checkout |
| `48de0dd` | Prepare Laylah project for cloud development; initial push to GitHub `main` |
| `561e55d` | Add local menu API and frontend integration |
| `fb5284d` | Update Laylah UI, dev config, and context |
| `53ffe31` | Add interactive menu category filters |
| `3f39326` | Initial Laylah restaurant homepage |

The complete project was first pushed as `48de0dd` to the public repository `shoaib1121/Laylah`; its default branch is `main`. The ignored local `backend/.env` was not uploaded. The Cloud checkout described below was verified separately on branch `work` at `4eeee4e`. This status refresh and roadmap are committed in the current main-branch history; check GitHub for the exact current head.

## Milestones

### Restaurant frontend prototype

- Created a React/Vite single-page restaurant landing page with Indian/Arabian positioning, a menu, story section, and responsive styling.
- Added menu category filters and frontend loading/error states as the menu moved to the local API.
- The temporary CSS plate illustration remains; a suitable restaurant image/product asset is still an open task.

### Local menu API and security baseline

- Added an Express API with health and public read-only menu routes, category filtering, and deterministic 400 responses for invalid/repeated categories.
- Extracted the app into `backend/app.js`; `backend/server.js` starts the loopback listener.
- Disabled Express's `X-Powered-By` response header.
- Added five API tests using Node's built-in test runner and Supertest.
- Drafted feature requirements and threat model in `docs/security/menu-api-requirements-threat-model.md`.

### Verification recorded on 2026-11-02

- `frontend/`: `npm run lint` passed; `npm run build` passed.
- `backend/`: `npm test` passed (5 tests).
- `git diff --check` passed; Git emitted line-ending conversion warnings for some files.
- These results were reported from that session and have not been rerun during the documentation restructuring.

### Verification recorded on 2026-11-10

- Frontend lint and production build passed. `git diff --check` passed with line-ending conversion warnings.
- `npm test` hit `EACCES` on Supertest's loopback connections before the tests could check API responses.
- `backend/.env` was absent at that time, so this session did not verify a live API-to-database path. A later check after the database and role rename is recorded below.

## Current milestone and working tree

Current application milestone: the React/Vite restaurant UI consumes a public Express menu API backed by PostgreSQL. On 2026-11-11, after the Laylah database and role rename, the health endpoint returned `ok`, the menu endpoint returned five records, and the browser displayed all five dishes. Authentication, authorization, orders, CI/CD, configured AppSec scanning, and deployment remain unimplemented.

At closeout on 2026-11-11:

- Branch before the cloud setup checkpoint: `master`; previous application commit: `561e55d`.
- Root project docs and backend API/test files were included in the initial GitHub checkpoint.
- `backend/.env` is ignored by Git and uses the Laylah database and role identifiers. The local PostgreSQL objects have been renamed and the API has since been verified against them.
- Local database state (not stored in Git): database `laylah_dev`, role `laylah_app`, schema `app`, table `app.menu_items`, and five menu rows. `laylah_app` has CONNECT, schema USAGE, and table SELECT only.
- The API source and tests changed after the last recorded test pass. No tests or frontend lint/build were run during this session. `git diff --check` passed, with Git line-ending conversion warnings.
- The local API and frontend servers are currently stopped after the project folder move. Start them from the new path to resume the app.
- The complete project was committed and pushed as `48de0dd` after the owner requested migration to GitHub. The current environment status is recorded below.

## Laylah rebrand and setup checkpoint (2026-11-11)

- Updated project-facing names across application source, page metadata, documentation, and AI context files.
- The local PostgreSQL database and app role were renamed to `laylah_dev` and `laylah_app`; the ignored local environment file uses those names and remains excluded by Git.
- The API restarted successfully after the rename. Health and menu endpoints passed direct checks, and the browser showed five menu dishes with Laylah branding.
- The local project folder was moved to `C:\Users\Admin\OneDrive\Laylah`. The local API and frontend processes are currently stopped after that move and should be started from the new path.
- At this 2026-11-11 checkpoint, Cloud setup and publication were still pending. The status was superseded on 2026-11-12, as recorded below.
- No migration was created or run. The next application development task remains capturing the existing schema and seed data in a tracked migration; notify the owner before starting it.

## Cloud development and closeout checkpoint (2026-11-12)

- The reusable Codex Cloud environment was published from the web setup flow.
- The Cloud workspace verified its repository root as `/workspace/Laylah`, remote `https://github.com/shoaib1121/Laylah.git`, branch `work`, and checked-out commit `4eeee4ec7a443f71f39913e23158dbc9591de1eb`. At the time of that check, GitHub `main` was also at `4eeee4e`.
- The setup session reported dependencies installed, PostgreSQL/API/frontend running, all five API tests passing, frontend lint and production build passing, and live menu/category-filter checks passing. These were reported for that setup session; they are not CI results or a promise of continuing process uptime.
- The repository's tracked files remained unchanged during the Cloud setup run. This closeout updates the project handoff notes and adds the roadmap image.
- The Cloud database was a local development fixture. The manually created schema and seed data still need a reviewed, tracked migration; production deployment does not exist. Cloud development availability does not mean the customer-facing application is deployed.
- The main branch remains the project source of truth; the Cloud task's `work` branch was the verified checkout. The roadmap is [`docs/roadmap/Laylah_Project_Roadmap.svg`](docs/roadmap/Laylah_Project_Roadmap.svg).

## Environment notes

- Windows PowerShell; Node.js `v24.14.1`, npm `11.11.0` were recorded in the prior context inspection.
- PostgreSQL Windows services 15 and 18 were observed running; v15 uses port 5432 and v18.6 uses port 5433.
- `psql` is not on `PATH`; the user verified `C:\Program Files\PostgreSQL\18\bin\psql.exe --version` returns 18.6.
- The owner successfully connected to PostgreSQL 18.6, created the Laylah database objects, and verified the five menu rows as `laylah_app`.
- The owner started the local API process in an earlier session; do not assume it has stopped. No process information could be inspected due to a Windows CIM access restriction; the assistant did not start a server today.

## Recommended next application work

1. Design and review a tracked SQL migration for the existing schema, constraints, least-privilege grants, and five seed dishes. Do not run it against the populated database until the reconciliation/safety plan has been reviewed with the owner.
2. Add PostgreSQL integration coverage alongside the existing API test-double checks, then resolve remaining API contract questions.
3. Decide the restaurant product scope and user journeys before introducing authentication, roles, or ordering workflows.
4. Add CI and AppSec automation after the core data and API contracts are reproducible.
5. Choose production hosting and operations only after scope and cost review.

Do not proceed to authentication until the first feature that needs protected access is defined; the agreed cookie-based direction is recorded in `SECURITY.md` and `ARCHITECTURE.md`.

## GitHub-first workflow setup (2026-11-12)

### Completed and verified locally

- Started with a clean cloud checkout; verified GitHub default branch main at `7c7e7cac1f783bbd7aab24787fe5cce29d212f60` and fetched it before creating `chore/github-first-workflow`.
- Added AGENTS.md, a PR template, and CI for frontend lint/build/existing tests, backend tests, and independent dependency audits on PRs to main and main pushes. No deployment or application/UI behavior changed.
- Added three meaningful API regression tests: generic database errors, parameterized category queries, and rejection before database access. All eight backend tests passed in Linux with Supertest loopback access.
- Both `npm ci` installs passed; frontend lint and Vite production build passed. No frontend test script exists; `npm run test --if-present` succeeds without running tests.
- Backend lockfile audit: zero vulnerabilities. Frontend audit: four moderate findings from minimatch (GHSA-g3hv-75wg-m249) and its ESLint dependency chain. Both passed the configured high/critical severity gate. No packages or lockfiles were changed.
- Cloud environment status reported connected; origin matches the requested repository. Development checks do not require the owner's Windows laptop. Existing fixture startup instructions were inspected, but no live database/API verification was performed in this task.
- Updated README, project context, and security handoff; ARCHITECTURE.md records the new delivery validation jobs while preserving application architecture. Earlier cloud commits and five-test results above are historical checkpoints, not the current workflow verification.

### Pending and known limitations

- Main is currently unprotected with no rulesets. The connector provides no protection mutation tool; shell `gh api` returned `Forbidden`. Follow exact README settings after CI check names become available. Administrative recovery remains available to the solo owner.
- actionlint 1.7.7 validated the Actions workflow syntax and expressions successfully; `git diff --check` passed.
- GitHub-hosted Actions results must be checked on the PR; local passes alone do not establish remote CI success. This setup remains on the feature branch until explicit approval and merge.
- Moderate frontend advisory remediation needs review; do not apply the suggested breaking ESLint major change automatically. SAST, DAST, and automated secret scanning remain pending.
- Versioned PostgreSQL migration and database integration tests remain the next application milestone. No authentication, authorization, ordering, or production deployment exists. Cloud fixture helpers are outside Git; fresh environment restoration was not tested here.

### Remote verification

- Opened PR #1: https://github.com/shoaib1121/Laylah/pull/1 targeting main; left unmerged.
- GitHub Actions run https://github.com/shoaib1121/Laylah/actions/runs/43162258123 verified all four jobs successful for implementation commit `f0fde3bfd342293aa1cf6825da863ea61941b5ce`: Frontend checks, Backend tests, Dependency audit (frontend), Dependency audit (backend).
- Staged path/diff review and secret-pattern checks passed; no environment files or credentials committed. Main protection remains a manual owner action as described above.
