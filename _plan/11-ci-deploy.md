# Phase 11 — CI + Deploy

## Goal
Set up CI pipeline and ensure the project is deployable with documentation.

## Tasks

### 11.1 Environment files
Verify `.env.example` files exist and are complete:
- `server/.env.example` — all required vars documented
- `client/.env.example` — `VITE_API_URL`

### 11.2 Seed scripts
Verify seed scripts work:
- `server/seeds/seed.js` — seeds categories
- Add admin user seed (or document manual creation)
- Add `npm run seed` script

### 11.3 GitHub Actions CI
**File:** `.github/workflows/ci.yml`

```yaml
- Trigger: push to main, PR to main
- Jobs:
  1. Backend tests: install deps → run Jest
  2. Frontend tests: install deps → run Vitest
  3. Frontend build: install deps → build (verify no build errors)
```

### 11.4 Deployment documentation
**File:** `DEPLOY.md` (or section in README)

Document:
- Required env vars for server (MongoDB URI, JWT secret, Cloudinary keys, email config, client URL)
- Required env vars for client (VITE_API_URL)
- How to seed the database
- How to create admin account
- Recommended platforms (e.g., Render/Railway for backend, Vercel for frontend)
- CORS configuration for separated deployments

### 11.5 Production build verification
- `cd client && npm run build` succeeds
- Server starts in production mode
- Health check endpoint responds
- Frontend can reach backend API

### 11.6 Database indexes
Verify all necessary indexes are defined in models:
- `User.email` (unique)
- `Product.slug` (unique)
- `Product.status` + `category.slug` + `createdAt` (compound)
- `Category.value` (unique), `Category.slug` (unique)
- `Inquiry.product`, `Inquiry.seller`, `Inquiry.status`

## Files Created
- `.github/workflows/ci.yml`
- `DEPLOY.md` (if not using README)

## Files Modified
- `package.json` (add seed script)
- `server/seeds/seed.js` (add admin seed option)
- `server/.env.example` (complete audit)
- `client/.env.example` (complete audit)

## Acceptance Criteria
- CI passes on a clean checkout
- `npm run seed` populates categories and optionally admin
- Deployment docs are clear and complete
- Production build compiles without errors
- All indexes are defined for query performance
