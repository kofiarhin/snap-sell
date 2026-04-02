# SnapSell Production Readiness Plan — Overview

## Current State (Updated)

The MVP has strong foundations with key hardening work now in progress:
- **Backend:** Models/controllers/services/routes are implemented with auth, validation, and error handling. Security controls now include global/request-level rate limiting, CSRF origin protection, request IDs, and structured request/error logs.
- **Frontend:** Public + seller/admin dashboards exist, and app providers are now bootstrapped at the root to ensure Redux, TanStack Query, and routing contexts initialize correctly.
- **Remaining gaps:** automated backend/frontend tests, CI workflows, deeper admin moderation surface, and production monitoring integrations.

## Execution Phases (11 total)

| # | Phase | Effort | Status |
|---|-------|--------|--------|
| 1 | Routing + App Shell | Medium | Not started |
| 2 | Fix Register Upload Flow | Small | Needs audit |
| 3 | Admin Screens | Medium | Not started |
| 4 | Category Page | Small | Not started |
| 5 | Auth Extras (Forgot/Reset Password) | Medium | Not started (backend + frontend) |
| 6 | Validation Hardening | Small | Partial (Zod exists, need audit) |
| 7 | Media Cleanup | Small | Needs audit |
| 8 | Business Logic Hardening | Medium | Needs audit |
| 9 | Security (Rate Limiting, Sanitization) | Medium | Not started |
| 10 | Testing | Large | Not started |
| 11 | CI + Deploy | Medium | Not started |

## Key Risks
- Phase 5 (forgot/reset password) requires new backend routes, a password reset token model/field, and email sending — no email service is configured yet.
- Phase 9 (security) needs `express-rate-limit` and `express-mongo-sanitize` added as dependencies.
- Phase 10 (testing) is the largest effort — no test infrastructure is set up yet.
