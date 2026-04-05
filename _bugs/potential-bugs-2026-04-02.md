# Potential Bug Review — 2026-04-02

## 1) Request validation error handling likely broken with Zod v4
- **Where:** `server/middleware/errorHandler.js`
- **Why this looks buggy:** The Zod branch accesses `err.errors`, but the project uses **zod v4** (`package.json`), where error details are exposed on `error.issues`.
- **Probable impact:** Invalid request payloads may trigger the fallback 500 path (or throw inside error handler) instead of returning structured 400 validation details.
- **Repro idea:** Send an invalid payload to `POST /api/products` (e.g. missing title). Confirm whether response is a clean 400 with details or an internal server error.
- **Fix idea:** In the Zod branch, map over `err.issues` (and optionally support both properties for compatibility).

## 2) Frontend bootstrap bypasses app providers and routing
- **Where:** `client/src/main.jsx`, `client/src/app/Providers.jsx`, and `client/src/App.jsx`
- **Why this looks buggy:** `main.jsx` renders `<App />` directly and never wraps with `Providers` (Redux, React Query, BrowserRouter). The current `App.jsx` is also a minimal health-check component, so existing pages/routes/components are effectively unreachable.
- **Probable impact:** Auth/query state management and route guards cannot function in the running app.
- **Repro idea:** Start client and navigate to `/login` or `/products`; likely no route-based UI is mounted.
- **Fix idea:** Wrap app in `<Providers>` and mount a route tree (or top-level router component) instead of the placeholder app shell.

## 3) Public product detail endpoint appears to expose non-active listings
- **Where:** `server/services/product.service.js` (`getBySlug`)
- **Why this looks buggy:** Product listing (`getPublicProducts`) filters by `status: "active"`, but `getBySlug` does not. Archived/sold/inactive products can still be fetched by slug.
- **Probable impact:** Public users may access products that should no longer be visible.
- **Repro idea:** Archive/sell a product, then request `GET /api/products/:slug` using its slug.
- **Fix idea:** Add status filtering for public reads (e.g. `findOne({ slug, status: "active" })`) unless business rules explicitly require historical public visibility.

## 4) Query parameter `limit=0` can create invalid pagination values
- **Where:** `server/services/product.service.js` and `server/services/admin.service.js`
- **Why this looks buggy:** Pagination computes `pages: Math.ceil(total / Number(limit))` with no guard. A limit of `0` yields division by zero (`Infinity`) and could produce malformed responses.
- **Probable impact:** Bad pagination metadata and potential client-side crashes.
- **Repro idea:** Call `GET /api/products?limit=0` and inspect `pagination.pages`.
- **Fix idea:** Validate/coerce query params to a sane positive integer range before DB calls.

## 5) Unbounded query parameters can degrade API performance
- **Where:** `server/services/product.service.js`, `server/services/admin.service.js`
- **Why this looks risky:** `page`, `limit`, and `sort` come from query params without upper bounds or sort allowlisting. Large limits and arbitrary sort fields can increase DB load or cause slow queries.
- **Probable impact:** Performance degradation under abusive or accidental heavy requests.
- **Repro idea:** Request a very high limit (e.g. 100000) and compare response times / DB load.
- **Fix idea:** Clamp `limit` to a max (e.g. 50/100), sanitize `page`, and allowlist sort fields.

## 6) Product detail UI can render broken image src when image list is empty
- **Where:** `client/src/pages/ProductDetailPage.jsx`
- **Why this looks buggy:** Main image source uses `product.images[activeImage]?.url`. If data inconsistency yields empty images, `src` becomes `undefined` but component still renders image container.
- **Probable impact:** Broken image icon and poor UX for partially corrupted records.
- **Repro idea:** Open detail page for a product document with `images: []`.
- **Fix idea:** Add a fallback placeholder image or guard rendering when `images.length === 0`.

## 7) Email uniqueness update path is not pre-validated in profile updates
- **Where:** `server/services/auth.service.js` (`updateProfile`)
- **Why this looks risky:** Updating email uses `findByIdAndUpdate` directly. Duplicate emails rely on Mongo duplicate-key exception path rather than explicit business validation.
- **Probable impact:** Inconsistent user-facing errors and avoidable DB exception-driven flow.
- **Repro idea:** Attempt to update one account’s email to another existing user’s email.
- **Fix idea:** Pre-check for existing email (excluding self) and return a consistent domain error before update.

---

## Notes
- These are **potential** bugs based on static review; some may be intentional product choices.
- Prioritize fixing items **#1** and **#2** first, as they can broadly impact API reliability and app usability.
