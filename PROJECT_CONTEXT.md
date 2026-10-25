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
- The frontend dependencies are present in `frontend/node_modules` and `frontend/package-lock.json`.
- There is no root `package.json`; run frontend commands from `frontend/`.
- The package manifest declares React/React DOM `^19.3.1`, Vite `^8.3.4`, ESLint `^10.13.0`, and associated Vite/React lint plugins. These are declared ranges, not a claim about exact installed versions.

| Purpose | Command from `frontend/` |
|---|---|
| Development server | `npm run dev` |
| Lint | `npm run lint` |
| Production build | `npm run build` |
| Preview build | `npm run preview` |

End-of-session verification on 2026-10-26: `npm run lint` passed (exit 0, no diagnostics). `npm run build` passed (Vite 8.3.4, 17 modules transformed, build completed successfully). Both commands were run from `frontend/` after the latest interface changes. The generated `frontend/dist/` output is ignored by Git.

## Current repository structure

```text
Lamp/
├── .gitignore
├── PROJECT_CONTEXT.md
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

`frontend/index.html` mounts `src/main.jsx`; `main.jsx` renders `App` inside React Strict Mode. Vite uses the React plugin. The current Vite config has a local host setting. No backend, database, API, test suite, CI workflow, security tooling configuration, or deployment configuration is implemented.

## Implemented features and current status

In `frontend/src/App.jsx` and `frontend/src/App.css`:

- Single-page restaurant landing page with navigation anchors, intro copy and calls to action, menu, story section, and footer.
- Five hard-coded menu entries:
  - Chicken Dum Biryani — Indian — ₹249.
  - Mutton Dum Biryani — Indian — ₹349.
  - Chicken Mandi — Arabian — ₹299.
  - Chicken Grill — Arabian — ₹279.
  - Mint Lime — Drinks — ₹79.
- Client-side category filters for All, Indian, Arabian, and Drinks. React `useState` stores the selected category and filters the in-memory array.
- Filter buttons expose their pressed/selected state with `aria-pressed`.
- A visible result count updates with the filter and uses `aria-live="polite"`.
- Menu cards show category, name, description, and price.
- A temporary, CSS-only plate/food illustration in the intro area; it is not a photo.
- Responsive CSS, keyboard focus-visible styling, and a reduced-motion preference rule.

Not implemented: server-backed or persistent menu data, backend/API, database/migrations, authentication/session handling, authorization, orders/cart/payments/reservations, staff/admin tools, automated tests, threat model records, security checks, CI/CD, hosting, production monitoring, or deployment hardening. The README remains generic React/Vite starter text.

The menu filters and temporary illustration were checked in the local browser. The count showed 5 for All and 2 for Indian. The local preview tab is closed and the development servers started for Lamp were stopped.

## Git history and current working state

- Branch: `master`.
- Last committed project history before the current session:
  - `53ffe31` — Add interactive menu category filters.
  - `3f39326` — Initial Lamp restaurant homepage.
- No Git remote is configured.
- End-of-session Git inspection on 2026-10-26: four modified tracked files—`PROJECT_CONTEXT.md`, `frontend/src/App.jsx`, `frontend/src/App.css`, and `frontend/vite.config.js`; no added, deleted, or untracked files; no staged changes. `git diff --check` passed. The Vite host setting is part of the local config change and should be preserved.
- The Git status above records the pre-commit review snapshot. Use `git status` for live working-tree state and `git log -1 --oneline` for the latest checkpoint.

Current milestone: frontend concept prototype with static menu data, interactive filters, accessible selected state and result count, and a temporary CSS illustration. This is a description of the present code, not a release claim.

## Recommended full-stack direction (planned; not implemented or fully finalized)

The following is a coherent recommendation based on the learning goals. It is not evidence that any component exists or that every choice is finalized.

- **Frontend — confirmed:** keep React, JavaScript/JSX, Vite, and CSS.
- **Backend — recommended, pending final stack confirmation:** Node.js with Express using a current maintained release, in JavaScript/ES modules to match the existing app.
- **Database — recommended, pending final stack confirmation:** PostgreSQL. Initially use the `pg` driver, parameterized SQL, and versioned schema migrations so query safety and data changes remain visible for learning.
- **API — recommended, pending final stack confirmation:** REST/JSON routes under a versioned prefix such as `/api/v1`, documented with OpenAPI and validated at the server boundary.
- **Authentication — current planned direction, not implemented:** cookie-based authentication for the browser application and browser-facing APIs. Prefer opaque server-managed sessions with secure cookie settings and server-side expiration, renewal, and revocation. Add CSRF defenses to state-changing cookie-authenticated requests. The exact session store, account lifecycle, and managed identity-provider decision remain open. Revisit the model if mobile or third-party API clients become a requirement.
- **Authorization — planned:** enforce least-privilege access on every protected server operation. Role checks and future object ownership checks must happen server-side; hiding UI controls is not an authorization control.
- **Testing — recommended:** Vitest for frontend/backend tests, React Testing Library for component behavior, Supertest for HTTP/API integration tests, and Playwright for browser end-to-end flows. Exercise database behavior against PostgreSQL for integration coverage.
- **AppSec tooling — recommended:** Burp Suite Professional for authorized manual DAST if the license is available; add SAST (CodeQL or Semgrep), dependency scanning (npm audit plus Dependabot or an equivalent), secret scanning, and later container scanning. Use findings as evidence for triage, not as proof that the app is secure.
- **CI/CD — recommended:** GitHub Actions if the repository is hosted on GitHub; otherwise use the equivalent CI for the chosen host. Include lint, tests, build, SAST, dependency, and secret checks. Prefer short-lived OIDC cloud credentials over long-lived keys where supported. No remote or CI is configured now.
- **Deployment — recommended for later, subject to cost and scope:** Docker Compose for local services, then consider AWS ECS Fargate with PostgreSQL on RDS, HTTPS at a load balancer, a private database network, secrets in AWS Secrets Manager, and operational logs/alerts. A managed platform such as Render may be a simpler/lower-operations alternative; AWS better supports the cloud/container learning goal. Estimate costs before provisioning.

### First backend feature proposal

Start with a public, read-only menu endpoint such as `GET /api/v1/menu`, returning the five existing menu items. It does not need authentication. Before implementation, define its requirements, input behavior, data contract, and threat model. Add protected staff/customer features only when product scope requires them.

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
- Final confirmation of Express/PostgreSQL/REST and exact package choices.
- Session persistence strategy, account recovery, and whether identity should be managed in-app or delegated to an OIDC provider.
- Privacy, retention, accessibility, browser support, content management, and product acceptance criteria.
- Whether and when to configure a Git remote, CI, and a production-like deployment.
- Cost and operational appetite for AWS versus a managed platform.
- Existing `hero.png` is unused and visually unrelated to the restaurant concept.

## Prioritized next steps

1. Before backend coding, write and review the requirements and threat model for public `GET /api/v1/menu`: define fields (`id`, `name`, `category`, `description`, `price`), optional category-filter behavior, validation/error responses, unauthenticated access, data-flow boundaries, abuse cases, and acceptance criteria.
2. Confirm the backend/database/API choices and local development arrangement before adding dependencies.
3. Walk through the implementation in small steps: server skeleton, database schema/migration, parameterized menu query, and API route.
4. Add backend/API tests and security regression tests as each behavior is introduced.
5. Add AppSec scanning and CI when a remote repository and CI provider are chosen.
6. Add authentication only with the first protected feature; design cookie/session and CSRF controls before coding it.
7. Plan production-like deployment and hardening after the application behavior and security requirements are established.

Update this document at each milestone. For status claims, inspect current files and Git history rather than treating this plan as evidence of implementation.
