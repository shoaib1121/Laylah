# Public Menu API: Requirements and Threat Model (Draft)

**Status:** Initial local implementation exists; this document remains a partial requirements/threat-model draft. The owner agreed that unsupported categories and repeated `category` parameters should return `400 Bad Request` (2026-10-26). The implementation uses in-memory menu data, ignores unrelated query parameters, and is not deployed. Remaining contract and architecture decisions are open. See `backend/server.js` for implementation; this document does not claim unimplemented controls exist.

## 1. Feature goal

Expose Lamp's current restaurant menu through a public, read-only HTTP API. This is the first backend learning feature; the former client-side list is now held in a server-side in-memory fixture and can later move to persistent storage.

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

The menu started as five static client entries with numeric IDs, names, one of three categories, descriptions, and prices denominated in rupees. The current client fetches the five entries from the local Express API and filters them in the browser. The API also supports category filtering. Data remains in-memory; there is no persistence/database.

## 3. Proposed requirements

### Functional requirements

1. A request without a filter returns all five menu entries.
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

These examples match the current local API response. The contract may evolve after the remaining questions are resolved.

### Proposed input/error behavior

- No `category` parameter: current implementation returns all items.
- Supported exact category value: current implementation returns matching items; an empty result is a successful response with `"items": []` if no stored item matches.
- Unsupported value or malformed category parameter: return `400 Bad Request` with a small JSON error object; do not echo unsafe/unbounded input into the response. **Decision confirmed:** unsupported category values return `400`.
- Repeated `category` parameters: current implementation rejects with `400` rather than silently selecting one. **Decision confirmed.**
- The route reads no request body. Current implementation ignores unrelated query parameters; this behavior is implemented but not separately owner-reviewed as a long-term API policy.
- No explicit server error handler or logging policy has been added. Framework-default error behavior has not been security-validated.

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
| Database | Planned future persistence boundary; not present in the current project. |

Local data flow: browser → Vite development server on port 5173 → `/api` proxy → Express on loopback port 3000 → in-memory menu array → JSON response. The Vite proxy is for local development only. HTTPS and production deployment controls are not configured.

## 5. Threats and planned mitigations

| Threat / abuse case | Impact | Proposed design or verification |
|---|---|---|
| Unexpected or oversized query input | Parsing errors, excessive work, confusing behavior | Allowlist category values; reject repeated/invalid values; bound request handling at the server/framework layer. |
| Injection when menu data later comes from PostgreSQL | Data disclosure or modification if query construction is unsafe | Use parameterized SQL for values; keep sort/column identifiers allowlisted; test malicious-looking input. No database query exists yet. |
| Sensitive fields accidentally exposed as the model grows | Internal data leakage | Select/map an explicit public response shape rather than serializing database rows wholesale; add response-contract tests. |
| Cross-origin browser access is too broad | Other sites can read public data; risk increases if credentials are later enabled | Decide whether cross-origin browser clients are needed. Avoid permissive credentialed CORS. For a public read-only endpoint, CORS is not authentication or authorization. |
| Request flooding | Degraded availability/cost | Keep route cheap and bounded; add rate controls at an appropriate layer if exposure/hosting warrants it; monitor once deployed. |
| Error response leaks internals | Reveals paths, stack, queries, or configuration | Return generic client errors; keep diagnostic details in controlled server logs. |
| Stale or tampered menu content | Incorrect restaurant information | Define source-of-truth and update ownership when persistence/admin workflows are designed; this first endpoint is read-only. |
| Express fingerprinting through default response header | Reveals framework details to a requester | The current Burp response showed `X-Powered-By: Express`; consider disabling this before deployment. Header removal alone is not a security boundary. |
| Authentication mistakenly added to public menu | Unnecessary friction and confused security model | Explicitly treat this endpoint as public; future cookie authentication is only for protected features and requires CSRF defenses for state-changing requests. |

## 6. Security acceptance criteria (proposed)

- Anonymous requests can retrieve the menu; no session or cookie is required.
- Only the documented response fields are returned.
- Category values are validated server-side against the allowlist.
- Invalid and repeated category inputs have deterministic documented responses.
- Responses do not contain stack traces, filesystem paths, secrets, or database details.
- If PostgreSQL is used, menu reads use parameterized query values and integration tests verify filtering and hostile input handling.
- Automated API tests cover success, category filtering, empty result behavior (if supported by data evolution), malformed/repeated parameters, and generic error behavior.
- Security regression tests are added alongside any fixed vulnerability found during the learning lifecycle.
- The feature remains read-only; methods other than `GET` do not mutate menu data.

## 7. Questions to resolve before implementation

1. **Resolved:** unsupported categories return `400 Bad Request`.
2. **Resolved:** duplicate `category` parameters return `400 Bad Request`.
3. Current code ignores unknown query parameters; should this remain the documented API policy?
4. Should money use integer INR values for this prototype or integer paise for future payment accuracy?
5. The first implementation uses a server-side in-memory fixture. PostgreSQL and persistence are planned but not yet selected/configured in code.
6. Local development currently uses separate Vite/Express ports with a Vite proxy. Production topology remains undecided.
7. Should rate limiting be included in the local API, or deferred until deployment/abuse testing demonstrates the need?

## 8. Suggested implementation sequence after review

1. Review remaining requirements and threat-model questions; update the contract as decisions are made.
2. Extract the Express app/routes from `app.listen()` so automated tests can import the app without binding a port.
3. Add automated API and security regression tests for success, filtering, response shape, unsupported/repeated values, and error handling.
4. Add a database only after agreeing on the schema, migration approach, and local PostgreSQL setup.
5. Revisit threat model and requirements when menu editing, authentication, orders, or deployment are introduced.
