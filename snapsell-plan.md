# SnapSell — Updated Execution Plan

## 1. Project Objective
Build an image-first MERN marketplace where:
- sellers register with a required profile image
- sellers create and manage listings with multiple images
- buyers browse, filter, search, and send inquiries
- admins manage sellers, listings, platform operations, and category-readiness for future management
- sold items leave the public feed but remain in seller history
- categories are backend-controlled from a database-backed source of truth
- media is stored in Cloudinary using a production-safe signed upload flow

---

## 2. Product Alignment Summary
This execution plan is aligned to the SnapSell project brief and the technical specification.

### Locked product decisions
- **Authenticated roles:** admin, seller
- **Public marketplace users:** buyers/visitors without required accounts in v1
- **MVP communication model:** thread-based inquiry system, not real-time chat
- **Auth transport:** JWT in HTTP-only cookies
- **Category source of truth:** backend-controlled `categories` collection seeded at setup
- **Upload strategy:** frontend direct upload to Cloudinary via backend-issued signed upload parameters
- **Sold workflow:** sold items are removed from public listings, remain in seller history, and block new inquiries
- **State management:** TanStack Query for server state, Redux Toolkit for auth/UI-only global state
- **Validation:** Zod on backend inputs and environment variables

---

## 3. Delivery Strategy

### Phase A — Foundation
- Monorepo/repo structure
- Environment validation
- Database connection
- Cloudinary configuration
- Cookie-based auth skeleton
- Centralized axios client
- Error handling and API response standardization

### Phase B — Seller Core
- Seller registration/login/logout
- Required profile image upload flow
- Profile management
- Password change
- Seller dashboard shell

### Phase C — Listings Core
- Product CRUD
- Product image upload + replace + cleanup
- Category integration from backend
- Listing status workflow
- Seller ownership enforcement

### Phase D — Marketplace Experience
- Homepage feed
- Product listing page
- Category page
- Product details page
- Search, filtering, sorting, pagination

### Phase E — Inquiry System
- Buyer inquiry submission
- Seller inquiry inbox
- Inquiry thread detail
- Seller replies
- Inquiry closing rules
- Auto-close behavior when product becomes sold

### Phase F — Admin Core
- Admin auth/authorization
- Seller management
- Listing management
- Seller suspension/deactivation
- Category management readiness
- Moderation-ready structure

### Phase G — Hardening
- Jest backend tests
- Vitest frontend tests
- Rate limiting for inquiry endpoints
- Upload validation
- Audit-safe logging
- Deployment preparation

---

## 4. Milestones

### Milestone 1 — Setup and Configuration
- Project structure for `client/` and `server/`
- `.env.example` files for client and server
- Zod-based env validation in `server/config/env.js`
- DB connection bootstrap
- Cloudinary config bootstrap
- Shared API response helpers

### Milestone 2 — Backend Core
- Centralized error middleware
- Async handler strategy
- Request validation middleware
- Auth middleware
- Role/ownership middleware
- Cloudinary signed upload helpers

### Milestone 3 — Database Models
- User model
- Product model
- Inquiry model
- Category model
- Indexing strategy

### Milestone 4 — Authentication
- Seller registration
- Seller login/logout
- Admin login
- Current user endpoint
- Profile update
- Password change
- HTTP-only cookie auth flow

### Milestone 5 — Cloudinary Media Pipeline
- Signed upload signature endpoint(s)
- Profile image upload/replacement
- Product image upload/replacement
- Delete/replace cleanup via public IDs
- File size/type validation

### Milestone 6 — Categories
- Seed categories collection
- Categories API endpoint
- Frontend category query hook
- Seller product forms wired to backend categories only

### Milestone 7 — Products
- Create/update/delete listing
- Seller listings endpoint
- Public products endpoint
- Status transitions: `active`, `sold`, `archived`, `inactive`
- Slug generation and uniqueness handling
- Quantity-aware rules

### Milestone 8 — Public UI
- Home page
- Product listing page
- Category page
- Product detail page
- Related items
- Search/filter/sort/pagination UI

### Milestone 9 — Inquiries
- Create inquiry
- Seller inquiry list
- Inquiry detail thread
- Seller reply
- Close inquiry
- Block new inquiry on sold/inactive listings
- Auto-close open inquiries when listing becomes sold

### Milestone 10 — Seller Dashboard
- Overview stats
- My listings
- Sold items
- Archived/inactive items
- Messages/inquiries
- Profile settings
- Change password

### Milestone 11 — Admin Dashboard
- Overview
- Manage sellers
- Seller detail view
- Manage listings
- Suspend/deactivate seller
- Remove/edit listing
- Moderation-ready extensions

### Milestone 12 — Security and Integrity
- Input validation coverage
- Auth + authorization coverage
- Ownership enforcement
- Cookie security config
- Upload validation
- Duplicate key handling
- Sanitization

### Milestone 13 — Performance and UX
- Pagination on public listings
- Indexed queries
- Image optimization via Cloudinary transformations
- Lazy loading images
- Empty/loading/error/retry UI states

### Milestone 14 — Testing
- Backend auth tests
- Backend product tests
- Backend inquiry tests
- Backend authorization tests
- Frontend route tests
- Frontend page/component tests
- Integration coverage for critical flows

### Milestone 15 — Deployment
- Production env setup
- Build scripts
- Deployment config for client and server
- Seed strategy for categories/admin
- Production readiness checklist

---

## 5. Sprint Plan

### Sprint 1 — Foundation
- Repo structure
- Env validation
- DB and Cloudinary config
- Response/error middleware
- Axios client + providers

### Sprint 2 — Auth + Profile
- Seller auth flow
- HTTP-only cookie sessions
- Signed profile image upload
- Profile update/password change

### Sprint 3 — Categories + Listings Core
- Category model/seed/API
- Product CRUD
- Product status logic
- Seller ownership checks

### Sprint 4 — Public Marketplace
- Home page
- Listing page
- Category page
- Product details page
- Search/filter/pagination

### Sprint 5 — Inquiry System
- Inquiry create flow
- Seller inbox
- Thread detail + reply
- Sold item inquiry blocking/closing

### Sprint 6 — Seller Dashboard
- Overview metrics
- Listing management pages
- Sold/archive views
- Profile settings

### Sprint 7 — Admin Panel
- Sellers list/detail
- Products management
- Suspension/deactivation actions

### Sprint 8 — Hardening + Deployment
- Tests
- Rate limiting
- Edge cases
- Production deployment prep

---

## 6. Acceptance Criteria

### Auth
- Seller profile image is required at registration
- Duplicate emails are blocked
- JWT auth uses HTTP-only cookies
- Protected routes enforce authentication and role checks
- Suspended/inactive sellers cannot access seller actions

### Media
- Frontend uploads to Cloudinary using backend-issued signed parameters
- DB stores `url` and `publicId`
- Old assets are deleted on replace/remove where applicable
- Invalid file type/size is rejected

### Listings
- Only authenticated sellers can create/manage their own listings
- Only the listing owner can edit/delete/update status
- Public feed shows only `active` listings
- Sold items are hidden from public feed and kept in seller history
- Archived/inactive items are excluded from public browsing

### Categories
- Categories come only from backend API
- Seller listing forms do not hard-code category values
- Category slugs are used for category pages and filtering

### Inquiries
- Inquiry is linked to product and seller
- Buyer must provide required contact details and message
- New inquiries are blocked when listing is not `active`
- Seller can reply within thread
- Open inquiries auto-close when product becomes `sold`

### Admin
- Admin can view/manage sellers and listings
- Admin can suspend/deactivate seller accounts
- Admin can remove or update problematic listings

### Quality
- Standardized API success/error responses
- Loading, empty, error, and retry states exist in frontend critical flows
- Core backend and frontend tests pass

---

## 7. Risks and Controls

### Risk: Cloudinary orphaned assets
**Control:** central media service + delete-on-replace/delete logic + publicId persistence

### Risk: Unauthorized listing mutation
**Control:** ownership middleware and server-side authorization checks

### Risk: Category drift between client and server
**Control:** DB-backed categories + frontend query hooks only

### Risk: Inquiry spam
**Control:** validation, throttling/rate limiting, and future abuse reporting hooks

### Risk: Sold-state inconsistencies
**Control:** centralized status transition service + inquiry auto-close on sold

### Risk: Hidden env/config failures in production
**Control:** fail-fast env validation on boot

---

## 8. MVP Definition
Ship v1 when all of the following are complete:
- Seller auth works with HTTP-only cookies
- Seller profile with required Cloudinary image works
- Product CRUD works with status transitions
- Categories are backend-driven from the database
- Public browsing works with search/filter/pagination
- Inquiry thread system works
- Seller dashboard works
- Admin seller/listing management basics work
- Sold workflow works end-to-end
- Core tests pass

---

## 9. Production Readiness Checklist
- Env validation implemented
- Secrets only in `.env`
- No raw `process.env` outside config layer
- No hard-coded API URLs in frontend
- Central axios client used everywhere
- Request validation on body, params, and query
- Centralized error handling
- Structured logging without secrets
- DB indexes in place
- Category seed script included
- Admin seed/bootstrap strategy defined
- Cloudinary cleanup paths tested
- Rate limiting enabled on inquiry/auth endpoints
- Tests green in CI

---

## 10. Immediate Build Order
1. Setup repo structure and config layer
2. Implement auth + signed Cloudinary upload
3. Implement categories + products
4. Implement marketplace pages
5. Implement inquiries
6. Implement seller dashboard
7. Implement admin panel
8. Harden, test, deploy
