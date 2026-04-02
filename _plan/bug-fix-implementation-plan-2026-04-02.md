# SnapSell Bug-Fix Implementation Plan

_Date: 2026-04-02_

## Goal
Ship a focused, low-risk set of fixes for the issues documented in `_bugs/potential-bugs-2026-04-02.md`, with priority on reliability regressions first, then behavior and UX hardening.

## Scope
This plan covers the 7 findings from the bug audit:
1. Zod v4 error handling path.
2. Frontend app bootstrap/provider wiring.
3. Public product detail visibility by status.
4. Pagination `limit=0` and invalid paging input.
5. Unbounded query parameters and unsanitized sort.
6. Product detail image fallback for empty image arrays.
7. Profile email update uniqueness flow.

---

## Execution Strategy

### Phase 1 — Reliability blockers (P0)

#### 1. Fix Zod error parsing in API error middleware
- **Files likely touched**: `server/middleware/errorHandler.js`
- **Changes**:
  - Replace usage of `err.errors` with Zod v4-compatible `err.issues`.
  - Keep backward compatibility guard (`err.issues || err.errors || []`) to avoid brittle behavior.
  - Ensure fallback message if no issue list exists.
- **Acceptance criteria**:
  - Invalid payload returns HTTP 400 with `VALIDATION_ERROR`.
  - `details` includes path + message entries.

#### 2. Restore frontend bootstrap wiring
- **Files likely touched**: `client/src/main.jsx`, `client/src/App.jsx`, possibly routing entry file if present.
- **Changes**:
  - Wrap app with `Providers` so Redux + Query + Router are active.
  - Replace placeholder app shell with actual route-driven app component.
- **Acceptance criteria**:
  - Auth route guards can render without runtime provider errors.
  - Navigating directly to app routes renders expected pages.

---

### Phase 2 — Public behavior correctness (P1)

#### 3. Restrict public slug access to intended statuses
- **Files likely touched**: `server/services/product.service.js`
- **Changes**:
  - Define product visibility rule for public detail endpoint (`active` only, unless explicit business exception).
  - Implement consistent filter logic between list endpoint and detail endpoint.
- **Acceptance criteria**:
  - Archived/sold/inactive product behavior matches product policy.
  - API returns 404/validation response for disallowed visibility cases.

#### 4. Harden pagination input parsing
- **Files likely touched**: `server/services/product.service.js`, `server/services/admin.service.js`.
- **Changes**:
  - Normalize `page` and `limit` via helper function.
  - Enforce minimums (`page >= 1`, `limit >= 1`) and sensible defaults on invalid values.
  - Prevent `pages: Infinity` and negative skips.
- **Acceptance criteria**:
  - `limit=0`, negative, or non-numeric values no longer break pagination metadata.

---

### Phase 3 — API abuse resistance and UX polish (P2)

#### 5. Add query bounds + sort allowlisting
- **Files likely touched**: `server/services/product.service.js`, `server/services/admin.service.js`.
- **Changes**:
  - Clamp `limit` to max (e.g., 50–100).
  - Allow only safe sort fields/directions.
  - Default to stable sort when invalid sort provided.
- **Acceptance criteria**:
  - Very large limits are constrained.
  - Unknown sort expressions do not pass directly to Mongo sort.

#### 6. Add product detail image fallback UI
- **Files likely touched**: `client/src/pages/ProductDetailPage.jsx`
- **Changes**:
  - Render placeholder block/image when `product.images` is missing or empty.
  - Guard thumbnail rendering with robust array checks.
- **Acceptance criteria**:
  - No broken image icon for empty image array.
  - Page remains usable with partial/corrupt data.

#### 7. Improve profile email update validation flow
- **Files likely touched**: `server/services/auth.service.js`
- **Changes**:
  - Before update, check for existing user with same email excluding current user.
  - Return consistent domain-level duplicate error before write.
- **Acceptance criteria**:
  - Duplicate email update returns clean, predictable conflict response.
  - Existing behavior preserved for other profile fields.

---

## Testing Plan

### Backend checks
- Add/adjust tests (or run API smoke checks) for:
  - Zod validation 400 path.
  - Product public detail visibility.
  - Pagination edge cases (`limit=0`, `page=-1`, huge `limit`).
  - Profile duplicate email update.

### Frontend checks
- Validate:
  - App starts with providers active.
  - Route navigation works for guest/protected paths.
  - Product detail handles empty `images` without runtime/UI break.

### Regression checks
- Run existing lint/tests for both server/client.
- Manual smoke test for login, listing browsing, create/edit product, inquiries.

---

## Delivery Breakdown (Suggested PR sequence)
1. **PR A (P0)**: Zod middleware fix + frontend provider/bootstrap wiring.
2. **PR B (P1)**: Public detail visibility + pagination normalization.
3. **PR C (P2)**: Query bounds/sort allowlist + image fallback + email pre-check.

This sequencing reduces risk by shipping critical correctness first and isolates behavior changes for easier review.
