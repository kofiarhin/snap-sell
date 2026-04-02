# SnapSell Route Risk Inventory

## Public Routes
- `POST /api/auth/register` — high abuse risk (account creation + media payload).
- `POST /api/auth/login` — high abuse risk (credential stuffing/brute-force).
- `POST /api/auth/forgot-password` — medium abuse risk (email flooding).
- `POST /api/auth/reset-password/:token` — medium abuse risk (token abuse).
- `GET /api/products` / `GET /api/products/:slug` — medium scraping risk.
- `GET /api/categories` — low risk.
- `POST /api/inquiries` — high spam risk.
- `POST /api/uploads/sign-public` — medium abuse risk.

## Seller Authenticated Routes
- `GET /api/auth/me` / `PUT /api/auth/profile` / `PUT /api/auth/password`.
- Product mutations: create, update, delete, sold/archive/reactivate.
- Inquiry moderation: seller inbox, replies, close thread.
- Upload signatures (`POST /api/uploads/sign`).

## Admin Authenticated Routes
- Seller state mutations and product moderation endpoints under `/api/admin/*`.
- Highest privilege surface; every route must enforce `authenticate + authorize("admin")`.

## Required Controls by Risk Class
- High-risk routes: route-level rate limits + strict schema validation.
- Auth/cookie write routes: CSRF origin checks.
- Mutation routes: role-based access and owner checks.
- All routes: request-id correlation and structured logging.
