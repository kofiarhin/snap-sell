# SnapSell Production Readiness — Execution Plan (from v1 spec)

## Objective
Ship SnapSell to production by hardening security, reliability, validation, testing, and deployment while preserving existing feature behavior.

## Success Criteria
- Application boots consistently in local + production-like environments.
- Cookie-based auth works for seller and admin with hardened controls.
- Cloudinary media handling is secure and lifecycle-safe.
- Pagination is implemented wherever list growth can impact performance.
- API responses follow a consistent success/error contract.
- Backend + frontend test suites pass in CI.
- Logs and health checks provide production observability.

---

## Phase 0 — Baseline & Gap Audit (Day 1)
1. Confirm current behavior against the v1 spec sections:
   - Auth, products, inquiries, categories, admin flows.
   - Frontend provider bootstrap/runtime status.
2. Inventory all routes and classify by risk:
   - Public, authenticated seller, admin.
3. Produce a gap checklist tied to code owners/modules.

**Deliverables**
- Updated gap matrix in `_plan/00-overview.md`.
- Route risk inventory document.

---

## Phase 1 — Config & Environment Hardening (Day 1–2)
### Backend
- Centralize all env access through `server/config/env.js` only.
- Enforce startup validation for required keys:
  `NODE_ENV, PORT, MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN, CLIENT_URL, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET`.
- Fail fast on missing/invalid values.

### Frontend
- Validate required runtime vars:
  `VITE_API_URL, VITE_CLOUDINARY_CLOUD_NAME`.
- Ensure providers are bootstrapped at app root (TanStack Query + auth context if present).

### Deployment Prep
- Verify `.env.example` parity with actual runtime requirements.

**Deliverables**
- Strict env validator (backend + frontend).
- Provider bootstrap fix merged.
- `.env.example` synchronized.

---

## Phase 2 — Security Middleware & Auth Hardening (Day 2–4)
### Cross-cutting security
- Add/verify `helmet` globally.
- Add global API rate limiting and tighter limits on auth/inquiry endpoints.
- Define CSRF strategy for cookie auth.

### Authentication
- Add brute-force protection on login (IP + identifier window).
- Add robust token validation/expiry handling middleware.
- Enforce required profile image during registration validation.

### Authorization
- Verify role checks on every admin/seller mutation route.
- Add tests for privilege escalation attempts.

**Deliverables**
- Security middleware stack committed.
- Auth brute-force and token validation hardening.
- CSRF decision doc.

---

## Phase 3 — Validation & API Contract Standardization (Day 3–5)
- Expand request validation coverage for all mutating endpoints.
- Enforce strict payload schemas.
- Normalize controller responses.
- Map domain errors to stable API error codes.

**Deliverables**
- Full-route validation matrix.
- Unified response helpers.

---

## Phase 4 — Media Pipeline Integrity (Day 4–6)
- Validate image metadata.
- Verify Cloudinary signature flow.
- Delete obsolete assets on replace/delete.
- Add cleanup strategy.

**Deliverables**
- Media validation guards.
- Cleanup strategy.

---

## Phase 5 — Domain Logic & Pagination (Day 5–7)
### Products
- Add pagination.
- Ensure slug uniqueness.
- Enforce image requirement.

### Inquiries
- Add pagination.
- Add validation + rate limiting.
- Auto-close on sold.

### Categories/Admin
- DB-driven categories.
- Add admin moderation tools.

**Deliverables**
- Paginated APIs.
- Inquiry protections.
- Admin tools.

---

## Phase 6 — Testing Implementation (Day 6–9)
### Backend (Jest)
- Auth, product, inquiry tests.

### Frontend (Vitest)
- Routes, auth, product UI.

### Quality Gates
- Add coverage thresholds.

**Deliverables**
- Passing test suites.

---

## Phase 7 — Observability, Performance & Deployment (Day 8–10)
### Observability
- Structured logging.
- Request ID correlation.

### Performance
- Mongo indexes.
- Validate pagination.

### Deployment
- Health checks.
- CI pipeline.
- Deploy docs.

**Deliverables**
- Logging.
- CI workflows.
- Health endpoints.

---

## Exit Checklist
- [ ] App boots cleanly
- [ ] Auth works
- [ ] Security middleware active
- [ ] Validation complete
- [ ] Media secure
- [ ] Pagination done
- [ ] Tests passing
- [ ] Logging active
- [ ] Deployment ready

---

## Work Breakdown
- Track A: Backend Security
- Track B: Media + Domain
- Track C: Frontend + Tests
- Track D: DevOps

