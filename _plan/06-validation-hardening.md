# Phase 6 — Validation Hardening

## Goal
Audit and complete all request validation across backend and frontend.

## Current State
- Zod validators exist for auth, products, and inquiries on the backend
- `validate.js` middleware applies Zod schemas to `req.body`
- No param validation (`:id`, `:slug`, `:token` URL params)
- No query param validation (pagination, filters, search)

## Tasks

### 6.1 Add param validators
**File:** `server/validators/param.validators.js` (new)

- `mongoIdSchema` — validates MongoDB ObjectId format for `:id` params
- `slugSchema` — validates slug format for `:slug` params

### 6.2 Add query validators
**File:** `server/validators/query.validators.js` (new)

- `productQuerySchema` — page, limit, sort, search, category, status (with defaults and coercion)
- `sellerQuerySchema` — page, limit, search, status (for admin)
- `productAdminQuerySchema` — page, limit, search, category, status, seller

### 6.3 Update validate middleware
**File:** `server/middleware/validate.js`

Extend to support validating `req.params` and `req.query` in addition to `req.body`:
- `validate(bodySchema)` — current behavior
- `validateParams(paramSchema)`
- `validateQuery(querySchema)`

Or use a single `validate({ body, params, query })` signature.

### 6.4 Apply validators to all routes
Audit each route file and add param/query validation:
- `product.routes.js` — params on `:slug`, `:id`, `:sellerId`; query on `GET /`
- `inquiry.routes.js` — params on `:id`, `:productId`
- `admin.routes.js` — params on `:id`; query on `GET /sellers`, `GET /products`
- `auth.routes.js` — params on reset-password `:token`
- `upload.routes.js` — already minimal

### 6.5 Frontend form validation audit
Verify all forms use React Hook Form + Zod resolver:
- RegisterPage — all fields validated, image required
- LoginPage — email + password required
- CreateListingPage — title, description, price, category, images
- EditListingPage — same as create
- ProfilePage — name, email, optional image
- PasswordPage — current + new + confirm
- InquiryForm (on ProductDetailPage) — name, email/phone, message, optional offer

## Files Created
- `server/validators/param.validators.js`
- `server/validators/query.validators.js`

## Files Modified
- `server/middleware/validate.js`
- `server/routes/product.routes.js`
- `server/routes/inquiry.routes.js`
- `server/routes/admin.routes.js`
- `server/routes/auth.routes.js`
- Various frontend page components (if validation gaps found)

## Acceptance Criteria
- Invalid ObjectIds return 400, not 500 cast errors
- Query params are sanitized and defaulted
- All frontend forms show field-level errors
- No unvalidated user input reaches controllers
