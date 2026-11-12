# Public Menu API: Requirements and Threat Model (Draft)

**Status:** This remains a partial requirements/threat-model draft. The owner agreed that unsupported categories and repeated `category` parameters should return `400 Bad Request` (2026-10-26). After the Laylah database and role rename, the API-to-database path was verified locally: health returned `ok` and the menu endpoint returned five records. `backend/migrations/001_create_menu_items.sql` now captures the initial schema and seed data for fresh databases; it must not be run against the populated `laylah_dev` database. Local dev servers are currently stopped after the project folder move. Remaining contract and architecture decisions are open. See `backend/app.js` and `backend/database.js`.

## 1. Feature goal

Expose Laylah's current restaurant menu through a public, read-only HTTP API. The frontend fetches the menu from Express, and the Express route queries PostgreSQL.

### In scope

- `GET /api/v1/menu` returns menu items.
- Optional category filtering supports the categories visible in the current frontend: `Indian`, `Arabian`, and `Drinks`.
- The menu is public and read-only. Authentication is not required.
- JSON response and predictable client errors are defined before implementation.

### Out of scope for this feature

- Menu administration, staff accounts, authentication, authorization, or session cookies.
- Orders, payments, reservations, customer data, inventory, and personalized results.
- Deployment to a public environment.

## 2. Current product facts

The menu started as five static client entries with numeric IDs, names, one of three categories, descriptions, and prices denominated in rupees. The current client fetches entries from the local Express API and filters them in the browser; the API also supports category filtering. The owner created and seeded the local database, schema `app`, and table `app.menu_items`; the database and role were renamed to Laylah identifiers and the menu read path was verified afterward. The ignored `.env` uses the renamed identifiers. No tracked schema migration exists.

## 3. Proposed requirements

### Functional requirements

1. A request without a filter returns all stored menu entries. The local database was seeded with five sample entries.
2. A request with a supported category returns only entries in that category.
3. A successful response contains JSON with an `items` array. Each item has `id`, `name`, `category`, `description`, and `price`.
4. `price` is represented as a JSON number in INR, matching current client data. Before production use, evaluate integer paise representation to avoid floating-point money errors; current whole-rupee sample values do not force that decision.
5. The frontend can consume the response and preserve the current category-filter experience.

### Proposed request and response contract

```http
GET /api/v1/menu
GET /api/v1/menu?category=Indian
```

```json
{
  "items": [
    {
      "id": 1,
      "name": "Chicken Dum Biryani",
      "category": "Indian",
      "description": "Fragrant basmati rice layered with slow-cooked spices.",
      "price": 249
    }
  ]
}
```

This example shows the response shape returned by the locally verified PostgreSQL-backed endpoint.

### Proposed input/error behavior

- No `category` parameter: current implementation returns all items.
- Supported exact category value: current implementation returns matching items; an empty result is a successful response with `"items": []` if no stored item matches.
- Unsupported value or malformed category parameter: return `400 Bad Request` with a small JSON error object; do not echo unsafe/unbounded input into the response. **Decision confirmed:** unsupported category values return `400`.
- Repeated `category` parameters: current implementation rejects with `400` rather than silently selecting one. **Decision confirmed.**
- The route reads no request body. Current implementation ignores unrelated query parameters; this behavior is implemented but not separately owner-reviewed as a long-term API policy.
- If the menu query fails, the route returns a generic HTTP 500 JSON response and logs the error code on the server. Broader logging and framework error behavior remain unreviewed.

Suggested error shape, pending review:

```json
{
  "error": {
    "code": "INVALID_CATEGORY",
    "message": "Unsupported menu category."
  }
}
```

## 4. Assets, actors, and trust boundaries

| Item | Description |
|---|---|
| Menu availability and integrity | Guests rely on accurate public menu data. |
| API availability | The endpoint should not be trivially exhausted by abusive request volume. |
| Public menu data | Names, categories, descriptions, and prices; no personal or secret data is intended. |
| Anonymous visitor | Can request menu data and supply query parameters. Treat all input as untrusted. |
| Browser frontend | A client of the API; it is not a trusted enforcement boundary. |
| API server | Express application on loopback port 3000; validates the category parameter and shapes menu responses. |
| Database | Local PostgreSQL stores menu records in `app.menu_items`. Express reads through the `laylah_app` role, which has SELECT access to that table. |

Local data flow: browser → Vite development server on port 5173 → `/api` proxy → Express on loopback port 3000 → Laylah PostgreSQL database, schema `app`, table `menu_items` → JSON response. This flow was verified after the project identifiers were changed. The Vite proxy is for local development only. HTTPS and production deployment controls are not configured.

## 5. Threats and planned mitigations

| Threat / abuse case | Impact | Proposed design or verification |
|---|---|---|
| Unexpected or oversized query input | Parsing errors, excessive work, confusing behavior | Allowlist category values; reject repeated/invalid values; bound request handling at the server/framework layer. |
| Injection in menu database query | Data disclosure or modification if query construction is unsafe | The current category value is passed through a `$1` parameter. Verify the live query and add database integration/security regression coverage; keep identifiers allowlisted if dynamic sorting is later added. |
| Sensitive fields accidentally exposed as the model grows | Internal data leakage | Select/map an explicit public response shape rather than serializing database rows wholesale; add response-contract tests. |
| Cross-origin browser access is too broad | Other sites can read public data; risk increases if credentials are later enabled | Decide whether cross-origin browser clients are needed. Avoid permissive credentialed CORS. For a public read-only endpoint, CORS is not authentication or authorization. |
| Request flooding | Degraded availability/cost | Keep route cheap and bounded; add rate controls at an appropriate layer if exposure/hosting warrants it; monitor once deployed. |
| Error response leaks internals | Reveals paths, stack, queries, or configuration | Return generic client errors; keep diagnostic details in controlled server logs. |
| Stale or tampered menu content | Incorrect restaurant information | PostgreSQL stores the menu, and the public endpoint is read-only. Define update ownership when menu administration is designed. |
| Express fingerprinting through default response header | Reveals framework details to a requester | `app.disable('x-powered-by')` is implemented in `backend/app.js`, and an API test checks for the header's absence. |
| Authentication mistakenly added to public menu | Unnecessary friction and confused security model | Explicitly treat this endpoint as public; future cookie authentication is only for protected features and requires CSRF defenses for state-changing requests. |

## 6. Security acceptance criteria (proposed)

- Anonymous requests can retrieve the menu; no session or cookie is required.
- Only the documented response fields are returned.
- Category values are validated server-side against the allowlist.
- Invalid and repeated category inputs have deterministic documented responses.
- The API response omits the `X-Powered-By` header.
- Responses do not contain stack traces, filesystem paths, secrets, or database details.
- Filtered PostgreSQL reads use parameterized query values. Integration tests should verify filtering and hostile input handling against the live database.
- Automated API tests cover success, category filtering, empty result behavior (if supported by data evolution), malformed/repeated parameters, and generic error behavior.
- Security regression tests are added alongside any fixed vulnerability found during the learning lifecycle.
- The feature remains read-only; methods other than `GET` do not mutate menu data.

## 7. Questions to resolve before implementation

1. **Resolved:** unsupported categories return `400 Bad Request`.
2. **Resolved:** duplicate `category` parameters return `400 Bad Request`.
3. Current code ignores unknown query parameters; should this remain the documented API policy?
4. Should money use integer INR values for this prototype or integer paise for future payment accuracy?
5. The owner renamed the local PostgreSQL database and role, restarted the API, and verified health plus all five menu rows. The tracked initial migration is for fresh databases; reconcile the existing database before adopting a migration runner.
6. Local development currently uses separate Vite/Express ports with a Vite proxy. Production topology remains undecided.
7. Should rate limiting be included in the local API, or deferred until deployment/abuse testing demonstrates the need?

## 8. Suggested implementation sequence after review

1. Review remaining requirements and threat-model questions; update the contract as decisions are made.
2. Create the ignored backend `.env` locally and verify the API connects and returns the database-backed menu.
3. Capture the existing schema, constraints, grants, and seed data in a tracked migration; avoid rerunning it against the populated database unless designed to be safe.
4. Add database integration/security regression tests and revisit this model when menu editing, authentication, orders, or deployment are introduced.
