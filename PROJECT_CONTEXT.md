# Lamp Project Context

## Purpose

Lamp has two connected purposes:

1. **Restaurant application:** a digital home for a restaurant concept bringing Indian and Arabian food traditions together.
2. **End-to-end AppSec portfolio project:** a practical project for learning and demonstrating application security skills that employers expect. The restaurant product is the context for the security work; Lamp should be built as a secure application, not as a collection of intentionally vulnerable production features.

The owner wants to develop these skills incrementally: web application and API security; source-code review; secure development and threat modeling; Burp/ZAP and security-tool triage; programming and scripting; SAST, DAST, and SCA; CI/CD and supply-chain security; cloud and containers; and deployment hardening. Mobile security is role-dependent, while AI/LLM security is an emerging area to consider if it fits a later feature.

## Product and visual direction

The current copy describes Lamp as “Indian soul. Arabian spirit.” and presents biryanis, grills, Indian tradition, Arabian warmth, and food that brings people together.

The design uses cream backgrounds, olive accents, charcoal text, serif display headings, sans-serif body copy, generous spacing, thin borders, and responsive layouts. The introductory section is called `intro-*` in the current React/CSS source. It currently includes a CSS-drawn temporary plate illustration labeled as a placeholder for a future food photo.

`frontend/src/assets/hero.png` is an existing abstract purple graphic. It is not used by the page and should not be treated as restaurant photography.

## Verified development environment and commands

Repository path: `C:\Users\Admin\OneDrive\Lamp`.

- Windows with PowerShell.
- Node.js `v24.14.1`; npm `11.11.0`.
- The frontend dependencies are present in `frontend/node_modules` and `frontend/package-lock.json`; backend dependencies are in `backend/node_modules` and `backend/package-lock.json`.
- There is no root `package.json`; run frontend commands from `frontend/` and backend commands from `backend/`.
- The package manifest declares React/React DOM `^19.3.1`, Vite `^8.3.4`, ESLint `^10.13.0`, and associated Vite/React lint plugins. These are declared ranges, not a claim about exact installed versions.
- Backend dependency: Express `^5.3.0` (resolved version observed as `5.3.0`); backend package currently uses CommonJS.

| Purpose | Command from `frontend/` |
|---|---|
| Development server | `npm run dev` |
| Lint | `npm run lint` |
| Production build | `npm run build` |
| Preview build | `npm run preview` |

| Purpose | Command from `backend/` |
|---|---|
| Start local API | `node server.js` |
| Test script | `npm test` is still npm-init's placeholder; no backend test suite exists. |

End-of-session verification on 2026-10-27: `npm run lint` passed (exit 0, no diagnostics), `npm run build` passed (Vite 8.3.4, 17 modules transformed), and `git diff --check` passed. Commands ran from `frontend/` or repository root as appropriate. `frontend/dist/` and `backend/node_modules/` are ignored by Git.

## Current repository structure

```text
Lamp/
├── .gitignore
├── PROJECT_CONTEXT.md
├── docs/
│   └── security/
│       └── menu-api-requirements-threat-model.md
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
└── frontend/
    ├── .gitignore
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    └── src/
        ├── App.css
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        └── assets/
            └── hero.png
```

`frontend/index.html` mounts `src/main.jsx`; `main.jsx` renders `App` inside React Strict Mode. Vite uses the React plugin and binds locally to `127.0.0.1`; its `/api` development proxy targets `http://127.0.0.1:3000`. Express runs separately on `127.0.0.1:3000`. There is no database, automated test suite, CI workflow, security-tool configuration, or deployment configuration.

## Implemented features and current status

In `frontend/src/App.jsx` and `frontend/src/App.css`:

- Single-page restaurant landing page with navigation anchors, intro copy and calls to action, menu, story section, and footer.
- Five menu entries are currently held in an in-memory array in `backend/server.js`:
  - Chicken Dum Biryani — Indian — ₹249.
  - Mutton Dum Biryani — Indian — ₹349.
  - Chicken Mandi — Arabian — ₹299.
  - Chicken Grill — Arabian — ₹279.
  - Mint Lime — Drinks — ₹79.
- `App.jsx` fetches menu data from `/api/v1/menu` on initial render through the Vite proxy. It shows loading and generic error states and stores the received list in React state.
- Client-side category filters for All, Indian, Arabian, and Drinks. React `useState` stores the selected category and filters the API response in the browser.
- Filter buttons expose their pressed/selected state with `aria-pressed`.
- A visible result count updates with the filter and uses `aria-live="polite"`.
- Menu cards show category, name, description, and price.
- A temporary, CSS-only plate/food illustration in the intro area; it is not a photo.
- Responsive CSS, keyboard focus-visible styling, and a reduced-motion preference rule.

Implemented backend/API: `backend/server.js` creates an Express 5 app, listens on loopback port 3000, returns `{ status: "ok" }` at `GET /api/v1/health`, and serves five in-memory menu entries from public, read-only `GET /api/v1/menu`. The menu route returns `{ items: [...] }`; it accepts exact category values `Indian`, `Arabian`, and `Drinks`, returns HTTP 400 for unsupported or repeated `category` parameters, and currently ignores unrelated query parameters. It does not use a database, authentication, or authorization. The server process is started with `node server.js`; app construction and listening are not yet split into separate modules.

The requirements/threat model is drafted in `docs/security/menu-api-requirements-threat-model.md`. Unsupported and repeated category parameters returning 400 are owner-confirmed decisions. Other draft questions are unresolved; the document is design guidance, not evidence of implemented controls.

Not implemented: PostgreSQL or any persistence/migrations, automated frontend/backend/API/security tests, authentication/session handling, authorization, orders/cart/payments/reservations, staff/admin tools, CI/CD, configured AppSec scans, hosting, production monitoring, or deployment hardening. The backend `test` script remains the npm-init placeholder. The README remains generic React/Vite starter text.

Manual local checks today: health endpoint returned `ok`; unfiltered menu returned five entries; `category=Indian` returned two; unsupported and repeated category parameters returned HTTP 400; owner confirmed the frontend displayed the API-fed data and all four category filters worked. In Burp Repeater, a request carrying `If-None-Match` received `304 Not Modified` with no body; this is normal conditional-cache behavior. Removing `If-None-Match` should return the full response. The Express response currently exposes the default `X-Powered-By` header; consider disabling it before production deployment. These are manual checks, not automated test coverage. Do not assume development servers are stopped; the owner started the local API process.

## Git history and current working state

- Branch: `master`.
- Baseline latest commit before today's work: `fb5284d` — Update Lamp UI, dev config, and context.
- Earlier commits: `53ffe31` — Add interactive menu category filters; `3f39326` — Initial Lamp restaurant homepage.
- No Git remote is configured.
- Today's commit contains the API, frontend integration, proxy, and design/context documentation; use live `git status` and `git log -1 --oneline` for the resulting checkpoint.

Current milestone: local full-stack prototype where a React/Vite restaurant UI consumes a public Express menu API backed by in-memory data. Menu filters, selected state, result count, loading/error UI, local API input validation, and a draft threat model exist. This is not a production deployment or a claim of comprehensive security.

## Recommended full-stack direction (planned; not implemented or fully finalized)

The following is a coherent recommendation based on the learning goals. It is not evidence that any component exists or that every choice is finalized.

- **Frontend — confirmed:** keep React, JavaScript/JSX, Vite, and CSS.
- **Backend — now implemented for the local prototype:** Node.js with Express 5.3.0. The backend package currently uses CommonJS; converting module style is not required for the current milestone.
- **Database — recommended, pending final stack confirmation:** PostgreSQL. Initially use the `pg` driver, parameterized SQL, and versioned schema migrations so query safety and data changes remain visible for learning.
- **API — recommended, pending final stack confirmation:** REST/JSON routes under a versioned prefix such as `/api/v1`, documented with OpenAPI and validated at the server boundary.
- **Authentication — current planned direction, not implemented:** cookie-based authentication for the browser application and browser-facing APIs. Prefer opaque server-managed sessions with secure cookie settings and server-side expiration, renewal, and revocation. Add CSRF defenses to state-changing cookie-authenticated requests. The exact session store, account lifecycle, and managed identity-provider decision remain open. Revisit the model if mobile or third-party API clients become a requirement.
- **Authorization — planned:** enforce least-privilege access on every protected server operation. Role checks and future object ownership checks must happen server-side; hiding UI controls is not an authorization control.
- **Testing — recommended:** Vitest for frontend/backend tests, React Testing Library for component behavior, Supertest for HTTP/API integration tests, and Playwright for browser end-to-end flows. Exercise database behavior against PostgreSQL for integration coverage.
- **AppSec tooling — recommended:** Burp Suite Professional for authorized manual DAST if the license is available; add SAST (CodeQL or Semgrep), dependency scanning (npm audit plus Dependabot or an equivalent), secret scanning, and later container scanning. Use findings as evidence for triage, not as proof that the app is secure.
- **CI/CD — recommended:** GitHub Actions if the repository is hosted on GitHub; otherwise use the equivalent CI for the chosen host. Include lint, tests, build, SAST, dependency, and secret checks. Prefer short-lived OIDC cloud credentials over long-lived keys where supported. No remote or CI is configured now.
- **Deployment — recommended for later, subject to cost and scope:** Docker Compose for local services, then consider AWS ECS Fargate with PostgreSQL on RDS, HTTPS at a load balancer, a private database network, secrets in AWS Secrets Manager, and operational logs/alerts. A managed platform such as Render may be a simpler/lower-operations alternative; AWS better supports the cloud/container learning goal. Estimate costs before provisioning.

### First backend feature status

The public, read-only `GET /api/v1/menu` has been implemented with in-memory data and category filtering. Requirements/threat-model draft: `docs/security/menu-api-requirements-threat-model.md`. It is unauthenticated by design because the menu is public. Add protected staff/customer features only when product scope requires them.

## AppSec learning lifecycle

For each meaningful feature, work through and document:

1. **Requirements:** identify assets, users, data, trust boundaries, privacy needs, abuse cases, and security acceptance criteria.
2. **Threat modeling:** map data flows and entry points; assess threats, attacker capability, impact, and mitigations; revisit after scope or architecture changes.
3. **Secure design:** choose safe defaults and controls before coding, including validation boundaries, identity/access behavior, data minimization, errors, and logging.
4. **Development:** make small, understandable changes, use secure coding practices, and keep secrets out of source control.
5. **Source review and security testing:** trace code paths and root causes; use suitable automated checks and manual review alongside functional tests; record tool coverage and limits.
6. **Controlled vulnerability reproduction:** when useful for learning, reproduce only in an isolated, authorized local environment with synthetic data and bounded steps. Keep lab-only vulnerable examples separate from production code.
7. **Remediation:** fix the root cause and explain how the control prevents the issue.
8. **Regression testing:** add or update checks that fail for the vulnerable behavior and pass after the fix; rerun relevant security checks.
9. **CI/CD and supply-chain security:** protect workflows, review dependencies and secrets, and add suitable security gates and artifact checks.
10. **Deployment hardening:** review TLS, production configuration, secrets, dependencies/build hygiene, least privilege, database access/backups, security headers, suitable rate limits, monitoring, and rollback/incident procedures.

This lifecycle is the intended learning plan, not a claim that any activity or control has already been completed.

## Collaboration and learning preferences

The owner wants to understand every line of code and prefers incremental development with explanations. Make small, reviewable changes. Explain what each part does, why it is needed, and how it connects to the product and AppSec goals. Avoid large unexplained code drops. Distinguish confirmed requirements, current recommendations, and implemented features. Explain security trade-offs plainly.

## Open decisions and limitations

- Whether Lamp will support ordering, payment, reservations, delivery/pickup, or remain an informational restaurant site.
- Which users and roles are needed; staff/admin and customer accounts are not yet implemented.
- PostgreSQL, schema/migration tooling, test framework, and API documentation tooling remain undecided/not implemented. Express and the first REST/JSON routes are in use locally.
- Session persistence strategy, account recovery, and whether identity should be managed in-app or delegated to an OIDC provider.
- Privacy, retention, accessibility, browser support, content management, and product acceptance criteria.
- Whether and when to configure a Git remote, CI, and a production-like deployment.
- Cost and operational appetite for AWS versus a managed platform.
- Existing `hero.png` is unused and visually unrelated to the restaurant concept.

## Prioritized next steps

1. Split Express app construction/routes from `app.listen()` so tests can import the app without binding a port; keep behavior unchanged.
2. Add focused automated API tests for health, all menu entries, category filtering, invalid/repeated category requests, and response shape. Select a small test approach (Node's built-in test runner plus Supertest is a candidate) before adding dependencies.
3. Review remaining open questions in the requirements/threat-model draft, including unknown query parameters, money representation, and rate limiting.
4. Confirm PostgreSQL setup and migration approach before replacing in-memory menu data with persistence.
5. Add AppSec scanning and CI when a remote repository and CI provider are chosen.
6. Add authentication only with the first protected feature; design cookie/session and CSRF controls before coding it.
7. Plan production-like deployment and hardening after application behavior and security requirements are established.

### Session handoff — 2026-10-27

- Added Express `backend/server.js`, installed Express 5.3.0, and connected the React menu to the local API via a Vite `/api` proxy.
- Corrected a JSX placement error during integration; final frontend lint and production build passed.
- Owner manually verified the UI and filters; direct API tests confirmed success/filtering and 400 behavior for unsupported/repeated categories. Burp Repeater showed a normal conditional `304` response for a request containing `If-None-Match`.
- Added the API requirements/threat-model draft and updated this context with actual implementation status, decisions, verification, and remaining work.
- No database, authentication, automated tests, CI, or deployment was added. The backend test script is still a placeholder.
- Next task: extract the Express app from the listener, then add automated API regression tests.
- Do not stop the API server when closing this session unless the owner asks; the owner started it.

Update this document at each milestone. For status claims, inspect current files and Git history rather than treating this plan as evidence of implementation.
