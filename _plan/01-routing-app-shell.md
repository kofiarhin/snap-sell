# Phase 1 — Routing + App Shell

## Goal
Wire up all routes in App.jsx so every screen is reachable and protected correctly.

## Current State
- `App.jsx` is a placeholder (fetches server status, renders an h1)
- `Providers.jsx` already wraps Redux, TanStack Query, Router, and Toast
- `ProtectedRoute` and `GuestRoute` components exist
- `DashboardLayout` with sidebar + Outlet exists
- All 15 page components exist (5 public + 10 dashboard), but no admin pages yet

## Tasks

### 1.1 Create route definition file
**File:** `client/src/routes/AppRoutes.jsx`

Define all routes using React Router v7:

**Public routes (no layout guard):**
- `/` → `HomePage`
- `/products` → `ProductsPage`
- `/products/:slug` → `ProductDetailPage`
- `/category/:slug` → `CategoryPage` (Phase 4, placeholder for now)
- `/seller/:sellerId` → `SellerPage` (new page needed)
- `*` → `NotFoundPage` (new page needed)

**Guest-only routes (redirect to dashboard if logged in):**
- `/login` → `LoginPage`
- `/register` → `RegisterPage`
- `/forgot-password` → `ForgotPasswordPage` (Phase 5, placeholder)
- `/reset-password/:token` → `ResetPasswordPage` (Phase 5, placeholder)

**Seller protected routes (require auth + seller role):**
- `/dashboard` → `DashboardLayout` as parent with:
  - index → `OverviewPage`
  - `listings` → `MyListingsPage`
  - `listings/new` → `CreateListingPage`
  - `listings/:id/edit` → `EditListingPage`
  - `sold` → `SoldItemsPage`
  - `archived` → `ArchivedPage`
  - `inquiries` → `InquiriesPage`
  - `inquiries/:id` → `InquiryDetailPage`
  - `profile` → `ProfilePage`
  - `password` → `PasswordPage`

**Admin protected routes (require auth + admin role):**
- `/admin` → `DashboardLayout` (admin variant) as parent with:
  - index → `AdminOverviewPage` (Phase 3)
  - `sellers` → `AdminSellersPage` (Phase 3)
  - `sellers/:id` → `AdminSellerDetailPage` (Phase 3)
  - `products` → `AdminProductsPage` (Phase 3)
  - `products/:id` → `AdminProductDetailPage` (Phase 3)

### 1.2 Update App.jsx
Replace placeholder content with `<AppRoutes />` inside the main layout (Navbar + Footer wrapper).

### 1.3 Create public layout wrapper
**File:** `client/src/components/PublicLayout.jsx`

Wraps public pages with Navbar + Footer + `<Outlet />`.

### 1.4 Create missing page stubs
- `client/src/pages/SellerPage.jsx` — public seller profile + their listings
- `client/src/pages/NotFoundPage.jsx` — 404 page
- `client/src/pages/ForgotPasswordPage.jsx` — placeholder "Coming soon"
- `client/src/pages/ResetPasswordPage.jsx` — placeholder "Coming soon"

### 1.5 Update ProtectedRoute
Verify it checks role correctly and redirects:
- Unauthenticated → `/login`
- Wrong role → `/` or `/dashboard`

### 1.6 Update DashboardLayout
Ensure it renders different sidebar links based on role (seller vs admin).

## Files Changed
- `client/src/App.jsx` (rewrite)
- `client/src/routes/AppRoutes.jsx` (new)
- `client/src/components/PublicLayout.jsx` (new)
- `client/src/pages/SellerPage.jsx` (new)
- `client/src/pages/NotFoundPage.jsx` (new)
- `client/src/pages/ForgotPasswordPage.jsx` (new stub)
- `client/src/pages/ResetPasswordPage.jsx` (new stub)
- `client/src/components/ProtectedRoute.jsx` (audit/update)
- `client/src/components/DashboardLayout.jsx` (audit/update)

## Acceptance Criteria
- Every spec screen has a route
- Navigation between pages works
- Auth guards redirect correctly
- Dashboard sidebar shows correct links per role
