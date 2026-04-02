# SnapSell — Production Readiness Spec (v2)

## Objective
Deliver a fully functional, production-ready SnapSell marketplace.

## Canonical Rules
- Roles: admin, seller
- Buyers are public
- JWT via HTTP-only cookies
- Cloudinary signed uploads
- DB-backed categories
- Inquiry threads
- Sold items removed from public, remain in history, block inquiries

---

## Screens

### Public
- / (Home)
- /products
- /category/:slug
- /products/:slug
- /seller/:sellerId
- /login
- /register
- /forgot-password
- /reset-password/:token
- * (Not Found)

### Seller (/dashboard)
- Overview
- Listings
- Create/Edit Listing
- Sold
- Archived
- Inquiries
- Inquiry Detail
- Profile
- Password

### Admin (/admin)
- Overview
- Sellers
- Seller Detail
- Products
- Product Detail/Edit

---

## Routing
- Public routes
- Seller protected routes
- Admin protected routes

---

## Backend Requirements
- Env validation (Zod)
- Signed upload (public-safe for register)
- Param + query validation
- Profile image cleanup
- Product lifecycle rules
- Inquiry validation (email OR phone)
- Admin logic must respect business rules

---

## Cloudinary
- Signed uploads only
- Store url + publicId
- Cleanup on replace/delete

---

## Security
- Rate limiting (auth + inquiries)
- Sanitization
- Secure cookies
- No secrets in logs

---

## Testing
- Backend: Jest
- Frontend: Vitest
- Cover auth, products, inquiries, admin, routes

---

## Database
- users, products, categories, inquiries
- indexes: email, slug, category

---

## Deployment
- .env.example
- CI (test + build)
- Seed scripts (categories + admin)

---

## Production Ready Definition
- All screens implemented + routed
- Seller + admin flows working
- Validation complete
- Tests passing
- Rate limiting enabled
- Deployable with docs

---

## Execution Order
1. Routing + app shell
2. Fix register upload flow
3. Admin screens
4. Category page
5. Auth extras (forgot/reset)
6. Validation
7. Media cleanup
8. Business logic hardening
9. Security
10. Testing
11. CI + deploy
