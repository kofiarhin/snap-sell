# Phase 8 — Business Logic Hardening

## Goal
Ensure all business rules from the spec are enforced consistently.

## Locked Rules (from spec)
1. Sold products are removed from public feed
2. Sold products remain in seller history
3. Sold products block new inquiries
4. Marking sold auto-closes open inquiries
5. Suspended sellers' products become inactive
6. Only active products appear in public queries
7. Inquiry requires email OR phone (at least one)

## Tasks

### 8.1 Sold workflow audit
**Files:** `server/services/product.service.js`, `server/services/inquiry.service.js`

- Verify `markSold()` sets status to `sold`
- Verify `markSold()` auto-closes all open inquiries for that product
- Verify `getPublicProducts()` excludes sold/archived/inactive products
- Verify `createInquiry()` rejects if product status is not `active`
- Verify `getBySlug()` (public) returns sold products but marks them as sold (or blocks entirely — clarify)

### 8.2 Suspension workflow audit
**Files:** `server/services/admin.service.js`

- Verify `suspendSeller()` sets all seller's active products to `inactive`
- Verify `activateSeller()` restores products to `active` (not sold/archived ones)
- Verify suspended seller can't create/update products (middleware or service check)
- Verify suspended seller can't login or gets logged out

### 8.3 Archive workflow audit
- Verify archived products are excluded from public
- Verify `reactivate()` only works on archived products
- Verify archived products don't accept new inquiries

### 8.4 Inquiry validation
- Verify inquiry creation requires `email` OR `phone` (not both, at least one)
- Verify inquiry is tied to correct seller (derived from product, not user input)
- Verify seller can only reply to their own inquiries
- Verify closed inquiries can't receive new replies

### 8.5 Product ownership checks
- Verify sellers can only edit/delete/manage their own products
- Verify `update`, `remove`, `markSold`, `archive`, `reactivate` all check `product.seller === req.user._id`

### 8.6 Edge cases
- What happens when a product's category is deactivated? Products should remain but category hidden from filters.
- Can a seller register with the same email as an existing account? (should be rejected)
- Can a seller create a product with 0 images? (spec requires image-first)

## Files to Audit/Modify
- `server/services/product.service.js`
- `server/services/inquiry.service.js`
- `server/services/admin.service.js`
- `server/services/auth.service.js`
- `server/controllers/product.controller.js`
- `server/middleware/auth.js`

## Acceptance Criteria
- All 7 locked rules pass manual testing
- Ownership checks prevent cross-seller mutations
- Suspension/activation cascades work correctly
- Edge cases handled with clear error messages
