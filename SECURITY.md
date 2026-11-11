# Laylah Security

## Security purpose

Laylah is intended to be a complete, end-to-end AppSec learning and portfolio project as well as a realistic restaurant application. The goal is to build the product securely and learn how to identify, reproduce safely, remediate, and prevent vulnerabilities throughout the lifecycle. Production code should not contain intentionally vulnerable features for demonstration.

## Current implemented security behavior

- Menu category input is validated on the server against the exact allowlist `Indian`, `Arabian`, and `Drinks`.
- Unsupported category values and repeated `category` parameters receive HTTP 400 JSON errors.
- The Express app disables `X-Powered-By`; an automated API test asserts the header is absent.
- The menu API is public and read-only. It has no account, session, or personal data behavior.
- Five automated API tests cover health response/header, menu shape/count, category filtering, unsupported categories, and repeated category parameters.
- The menu route uses a `$1` SQL parameter for category values; database errors return a generic JSON error. After the database and role rename, the running API returned health `ok` and five menu records.
- PostgreSQL role `laylah_app` is limited to connecting and reading `app.menu_items`; it has no table write or schema modification grants.

Current limitations include no versioned database migration, no rate limiting, no authentication/authorization, no CI security checks, no GitHub remote, and no deployed environment. The November 10 backend test run hit loopback permission errors before it could verify API responses. A later direct API check verified the renamed database connection and menu response. See the detailed [menu API requirements and threat model](docs/security/menu-api-requirements-threat-model.md).

## Agreed direction and proposals — not implemented

- The owner agreed to start with cookie-based authentication for the web app and its APIs when protected features are introduced.
- Recommended design: server-managed sessions, appropriately scoped `HttpOnly`, `Secure`, and `SameSite` cookies in production, server-side expiration/revocation, and CSRF defenses on state-changing requests. Exact session storage and identity/account lifecycle remain undecided.
- Authorization must be enforced by the server. Add least-privilege roles and object-level ownership checks when product features require them.
- PostgreSQL local persistence and a read-only runtime role are now set up and the API path was verified. Capture the schema in a migration. Preserve parameterized SQL and least-privilege access; add database integration/security regression tests.
- Burp Suite Professional is the preferred manual DAST tool if available. SAST, dependency scanning, secret scanning, and CI security checks are planned; no scan configuration or CI pipeline exists.
- Deployment hardening (HTTPS, secure configuration and secrets, security headers, access control, logging/monitoring, and recovery practices) is future work.

## AppSec learning lifecycle

Apply these steps incrementally for each significant feature:

1. **Requirements:** identify assets, users, sensitive data, trust boundaries, abuse cases, privacy needs, and security acceptance criteria.
2. **Threat modeling:** map data flows, entry points, attacker capabilities, impacts, and mitigations; update the model when architecture or scope changes.
3. **Secure design:** establish validation, identity/access rules, data minimization, error handling, logging, and safe defaults before implementation.
4. **Development:** make small understandable changes and keep secrets out of source control.
5. **Source review and security testing:** trace code paths to root causes; use manual review and appropriate automated tools, understanding their coverage and limits.
6. **Controlled vulnerability reproduction:** reproduce only in an isolated, authorized local environment with synthetic data and bounded steps. Keep lab-only vulnerable examples separate from production application code.
7. **Remediation:** fix the underlying cause and explain why the change works.
8. **Regression testing:** add checks that demonstrate the fixed behavior and rerun relevant functional and security checks.
9. **CI/CD and supply-chain security:** protect workflows, inspect dependencies and secrets, and add suitable quality/security gates.
10. **Deployment hardening:** review TLS, production settings, secrets, least privilege, database access/backups, headers, rate controls, monitoring, and rollback/incident processes.

This is the learning plan; steps are not complete merely because they are documented here.

## Security skills the project should exercise

Web and API security; access-control and business-logic testing; source-code review; secure development and threat modeling; Burp/ZAP and tool-result triage; programming/scripting; SAST, DAST, and SCA; CI/CD and supply-chain security; cloud/container security; and deployment hardening. Mobile and AI/LLM security are role- or feature-dependent future topics.

## Current security decisions still open

- Exact protected product features, actors, roles, and authorization rules.
- Session store, session lifetime/rotation/revocation, recovery flow, and identity-provider strategy.
- CSRF defense details and production cookie/domain topology.
- Unknown query parameter policy, money representation, rate-limiting thresholds, and operational logging/error policy.
- CI host, AppSec tool configuration, deployment platform, and cloud budget.
