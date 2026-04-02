# SnapSell CSRF Strategy (Cookie Auth)

## Chosen Strategy
Origin validation for state-changing requests (`POST`, `PUT`, `PATCH`, `DELETE`) when an auth cookie is present.

## Enforcement Rules
1. If request method is safe (`GET`, `HEAD`, `OPTIONS`) → allow.
2. If no auth cookie exists → allow (public endpoints).
3. If auth cookie exists:
   - Require `Origin` header.
   - Require `Origin` to exactly match `CLIENT_URL`.
   - Reject mismatches with `403 CSRF_BLOCKED`.

## Why this works for v1
- API uses HTTP-only cookies for auth, which are vulnerable to cross-site request forgery without additional checks.
- Strict origin matching provides a lightweight and reliable browser-enforced mitigation aligned with the single-client architecture.
- Works without exposing JWT to JavaScript.

## Future Upgrade Path
If multi-origin clients are introduced, evolve to a double-submit CSRF token pattern with rotating per-session nonces.
