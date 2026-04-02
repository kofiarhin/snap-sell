# SnapSell Production Readiness Plan — Overview

## Current State

The MVP has solid foundations:
- **Backend:** Fully built — all models (User, Product, Category, Inquiry), controllers, services, routes, middleware (auth, validation, error handling), Zod validators, Cloudinary integration, and seed scripts.
- **Frontend:** Pages exist for public (Home, Products, ProductDetail, Login, Register) and seller dashboard (all 10 pages). Components (Navbar, Footer, ProductCard, DashboardLayout, ImageUpload, Pagination, LoadingSpinner, EmptyState, ProtectedRoute, GuestRoute). Services, hooks (queries + mutations), Redux auth slice, and Providers are all wired up.
- **What's NOT wired:** App.jsx has no routes — it's a placeholder. No admin pages exist. No forgot/reset password flow. No `/category/:slug` or `/seller/:sellerId` public pages. No `NotFoundPage`. No tests. No rate limiting. No CI config.

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
