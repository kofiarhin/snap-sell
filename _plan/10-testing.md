# Phase 10 — Testing

## Goal
Set up test infrastructure and write tests covering auth, products, inquiries, admin, and frontend routes.

## Current State
- No test files exist
- Jest listed as concept but not in dependencies yet
- Vitest not configured for frontend
- Supertest not in dependencies

## Tasks

### 10.1 Backend test setup
**New dependencies (dev):** `jest`, `supertest`, `mongodb-memory-server`

- Add Jest config to `package.json` or `jest.config.js`
- Create test helper: `server/tests/setup.js` — connect to in-memory MongoDB, seed data, cleanup
- Create test helper: `server/tests/helpers.js` — create test user, get auth cookie, create test product
- Add `npm run test:server` script

### 10.2 Auth tests
**File:** `server/tests/auth.test.js`

- POST /register — success, duplicate email, missing fields, invalid data
- POST /login — success, wrong password, non-existent user, suspended user
- POST /logout — clears cookie
- GET /me — returns user when authenticated, 401 when not
- PUT /profile — update name/email, upload new image
- PUT /password — change password, wrong current password

### 10.3 Product tests
**File:** `server/tests/product.test.js`

- GET / — returns public active products, pagination, search, category filter
- GET /:slug — returns product by slug, 404 for non-existent
- POST / — create product (auth), missing fields, unauthorized
- PUT /:id — update own product, can't update others
- DELETE /:id — delete own product, can't delete others
- PATCH /:id/sold — marks sold, auto-closes inquiries
- PATCH /:id/archive — archives product
- PATCH /:id/reactivate — reactivates archived product

### 10.4 Inquiry tests
**File:** `server/tests/inquiry.test.js`

- POST / — create inquiry (public), email or phone required, blocked for sold products
- GET /seller — returns seller's inquiries
- GET /product/:productId — returns product inquiries
- POST /:id/reply — seller replies, can't reply to others
- PATCH /:id/close — closes inquiry

### 10.5 Admin tests
**File:** `server/tests/admin.test.js`

- GET /sellers — list sellers (admin only), 403 for non-admin
- PATCH /sellers/:id/suspend — suspend seller, cascade to products
- PATCH /sellers/:id/activate — activate seller
- GET /products — list all products
- PUT /products/:id — admin update product
- DELETE /products/:id — admin delete product

### 10.6 Frontend test setup
**Dependencies already available:** Vitest (via Vite)
**New dependencies (dev):** `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `msw` (Mock Service Worker)

- Configure Vitest in `vite.config.js` or `vitest.config.js`
- Create test setup: `client/test/setup.js` — jsdom, cleanup, MSW handlers
- Add `npm run test:client` script

### 10.7 Frontend route tests
**File:** `client/test/routes.test.jsx`

- Public routes render correct pages
- Protected routes redirect to login when unauthenticated
- Admin routes redirect when non-admin
- Guest routes redirect to dashboard when authenticated

### 10.8 Frontend component tests
**Files:** `client/test/components/`

- `ProductCard.test.jsx` — renders title, price, image, links correctly
- `Pagination.test.jsx` — page navigation works
- `ImageUpload.test.jsx` — upload flow, preview, remove

### 10.9 Frontend page tests (key flows)
**Files:** `client/test/pages/`

- `LoginPage.test.jsx` — form submission, validation errors, redirect on success
- `RegisterPage.test.jsx` — form submission with image upload
- `CreateListingPage.test.jsx` — product creation flow

### 10.10 Add root test scripts
**File:** `package.json`

```json
"test": "npm run test:server && npm run test:client",
"test:server": "cd server && jest --forceExit --detectOpenHandles",
"test:client": "cd client && vitest run"
```

## New Dependencies
- Backend (dev): `jest`, `supertest`, `mongodb-memory-server`
- Frontend (dev): `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `msw`

## Files Created
- `server/tests/setup.js`
- `server/tests/helpers.js`
- `server/tests/auth.test.js`
- `server/tests/product.test.js`
- `server/tests/inquiry.test.js`
- `server/tests/admin.test.js`
- `client/test/setup.js`
- `client/test/routes.test.jsx`
- `client/test/components/*.test.jsx`
- `client/test/pages/*.test.jsx`
- `vitest.config.js` or update `vite.config.js`

## Acceptance Criteria
- All backend tests pass with in-memory MongoDB
- All frontend tests pass with MSW mocks
- `npm test` runs both suites
- Coverage for auth, products, inquiries, admin flows
