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
- Define CSRF strategy for cookie auth (double-submit token or same-site strict approach with documented rationale).

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
- CSRF decision doc in `_plan` or `/docs`.

---

## Phase 3 — Validation & API Contract Standardization (Day 3–5)
- Expand request validation coverage for all mutating endpoints:
  - Auth, products, inquiries, categories, admin actions.
- Enforce strict payload schemas to prevent field injection (especially media objects).
- Normalize controller responses to:
  - Success: `{ success, message, data }`
  - Error: `{ success: false, error: { code, message, details } }`
- Map domain/service errors to stable API error codes.

**Deliverables**
- Full-route validation matrix.
- Unified response helpers and updated controllers.

---

## Phase 4 — Media Pipeline Integrity (Day 4–6)
- Validate image metadata (type/size/allowed formats) before accepting persisted payloads.
- Verify Cloudinary signature flow server-side.
- On product image replace/delete:
  - Delete obsolete Cloudinary `publicId`s reliably.
- Add compensating cleanup strategy for partial failures (queue/retry or scheduled cleanup job).

**Deliverables**
- Media validation guards.
- Deterministic cleanup on replace/delete.
- Cleanup reconciliation task (script/cron-ready job).

---

## Phase 5 — Domain Logic & Pagination (Day 5–7)
### Products
- Add pagination for seller listings and ensure consistent query params (`page`, `limit`, optional sort/filter).
- Ensure slug uniqueness is race-safe (DB-level unique + graceful conflict handling).
- Keep invariant: at least one image.

### Inquiries
- Add pagination for inquiry threads/messages.
- Add contact validation.
- Add rate limiting for inquiry creation/reply routes.
- Ensure inquiries auto-close when product becomes sold/inactive.

### Categories/Admin
- Keep frontend category rendering DB-driven only.
- Add admin moderation tooling + category management endpoints/UI as required by spec.

**Deliverables**
- Paginated APIs + frontend integration.
- Inquiry protections complete.
- Admin moderation/category management scope finalized and implemented.

---

## Phase 6 — Testing Implementation (Day 6–9)
### Backend (Jest)
- Auth tests:
  - register/login/logout, role guards, invalid token cases.
- Product tests:
  - CRUD ownership rules, image requirement, status transitions.
- Inquiry tests:
  - active product constraint, seller-only replies, auto-close behavior.

### Frontend (Vitest + RTL)
- Route protection and navigation tests.
- Auth flow (cookie/session assumptions via mocked API).
- Product UI behavior (list, detail, create/edit validation states).

### Quality Gates
- Add minimum coverage thresholds (start pragmatic, then ratchet).

**Deliverables**
- Green test suites for backend/frontend.
- Coverage report artifacts.

---

## Phase 7 — Observability, Performance & Deployment (Day 8–10)
### Observability
- Add request logging and structured error logging (JSON logs).
- Add request ID correlation across middleware/controllers.

### Performance
- Add/verify Mongo indexes supporting:
  - product status/category/seller/slug lookups
  - inquiry product/thread lookups
- Validate paginated endpoints for stable response times.
- Ensure Cloudinary transformations/optimized delivery are used where applicable.

### Deployment
- Add health check endpoint(s) (liveness/readiness).
- Add CI pipeline:
  - lint
  - backend tests
  - frontend tests
  - build
- Add release/deploy notes and seed script verification.

**Deliverables**
- Structured logging in production format.
- CI workflow(s) committed.
- Health checks + deploy checklist.

---

## Exit Checklist (Must Pass Before Production)
- [ ] App boots cleanly with validated env vars.
- [ ] Cookie auth + roles function correctly in production mode.
- [ ] Helmet + rate limiting + CSRF strategy active.
- [ ] Validation coverage complete for all mutating endpoints.
- [ ] Cloudinary media lifecycle secured and cleanup guaranteed.
- [ ] Pagination implemented for products and inquiries.
- [ ] Backend and frontend tests passing in CI.
- [ ] Request/error logging active with structured output.
- [ ] Health checks and deployment pipeline operational.

---

## Recommended Work Breakdown (Parallelizable)
- **Track A (Backend Security):** Phases 1–3
- **Track B (Media + Domain):** Phases 4–5
- **Track C (Frontend + Tests):** Phases 1, 5, 6
- **Track D (DevOps/Observability):** Phase 7

Use a daily integration branch merge cadence to avoid long-running drift between tracks.
