# Laylah Architecture

## Status labels

- **Implemented** means verified in the current repository source.
- **Planned/recommended** means a future direction, not an existing component.
- **Undecided** means a product or design choice still needs review.

## Current architecture — implemented

```text
Browser
  └─ React application served by Vite (local port 5173)
       └─ /api proxy → Express app (127.0.0.1:3000)
                         ├─ GET /api/v1/health
                         └─ GET /api/v1/menu → PostgreSQL `app.menu_items`
```

### Frontend

- React with JavaScript/JSX, Vite, and CSS.
- `frontend/index.html` loads `frontend/src/main.jsx`, which renders `App` in React Strict Mode.
- `frontend/src/App.jsx` fetches `/api/v1/menu`, presents loading/error states, and filters the returned menu in the browser.
- `frontend/vite.config.js` binds Vite to `127.0.0.1` and proxies `/api` to `http://127.0.0.1:3000` for local development.
- Responsive styles, keyboard focus styling, reduced-motion behavior, and a temporary CSS-drawn plate illustration are present.

### Backend

- Node.js and Express 5, using CommonJS modules.
- `backend/app.js` creates the Express app and routes when given a database client; it disables the `X-Powered-By` response header.
- `backend/database.js` creates a `pg` connection pool from required environment settings.
- `backend/server.js` checks the database connection and then starts the app on `127.0.0.1:3000`.
- `GET /api/v1/health` returns `{ "status": "ok" }`.
- `GET /api/v1/menu` selects the public menu fields from PostgreSQL table `app.menu_items`. Optional `category` accepts `Indian`, `Arabian`, or `Drinks`; unsupported and repeated values return HTTP 400 with a JSON error. Category lookup uses a parameterized SQL value.
- Automated API tests are in `backend/test/app.test.js`, using Node's built-in `node:test`, strict assertions, and Supertest.

After the rebrand, the API-to-database path was verified locally: the health endpoint returned `ok`, and the menu endpoint returned five records. The local PostgreSQL database and role have been renamed to `laylah_dev` and `laylah_app`; ignored `backend/.env` uses those identifiers. The local dev servers are currently stopped after the project folder move. The SQL setup has not yet been captured as a tracked migration.

### Verified repository layout

```text
Laylah/
├── PROJECT_CONTEXT.md
├── README.md
├── ARCHITECTURE.md
├── SECURITY.md
├── DEVELOPMENT_LOG.md
├── docs/security/menu-api-requirements-threat-model.md
├── backend/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── test/app.test.js
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
```

Other files include lockfiles, lint configuration, HTML entry point, styles, and a currently unused `frontend/src/assets/hero.png`. The image is an abstract purple graphic, not restaurant photography.

## Remaining full-stack work — partly implemented

- **Database:** PostgreSQL 18.6 is configured locally on port 5433; the owner created and populated `laylah_dev` and verified read access as `laylah_app`.
- **Persistence:** the `pg` driver and parameterized menu query are implemented and were verified against the local PostgreSQL data. The database and role rename is complete; a versioned migration remains outstanding. A migration tool has not been selected.
- **API:** continue versioned REST/JSON under `/api/v1`; document the contract (for example with OpenAPI) after the product contract is settled.
- **Authentication:** the owner agreed to cookie-based authentication for the web application and its APIs as the starting direction. No authentication or session implementation exists. Prefer server-managed sessions for the first browser-focused product, then decide session storage and account lifecycle before coding.
- **Authorization:** server-enforced least privilege for protected operations; add roles and object ownership checks only when features require them. No authorization currently exists.
- **Testing:** backend API tests use a database test double. The November 10 run hit loopback permission errors before it could verify API responses. A direct API check after the rename confirmed health and five menu records; automated PostgreSQL integration coverage is still pending. Frontend component tests and browser end-to-end tests are future candidates.
- **Delivery and deployment:** CI, SAST/SCA/secrets checks, containers, hosting, HTTPS, production secrets, and operational monitoring are future work. The hosting provider is undecided.

## Open product and design decisions

- Whether Laylah will support ordering, payment, reservations, delivery/pickup, or remain informational.
- Which account types and roles are needed.
- Schema, money representation, migrations, and application database role details.
- Session store, account recovery, identity provider, and CSRF mechanism for future cookie-authenticated state changes.
- API policy for unknown query parameters, production topology, and rate limiting.
- CI provider, hosting choice, cloud cost, and operational scope.

Update this document when architecture changes; use `DEVELOPMENT_LOG.md` for chronological progress and `SECURITY.md` for security controls and lifecycle work.
