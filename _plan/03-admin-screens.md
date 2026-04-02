# Phase 3 — Admin Screens

## Goal
Build all admin dashboard pages. Backend is already complete (admin controller, service, routes all exist).

## Current State
- Backend: Admin routes, controller, and service fully implemented (sellers CRUD, products CRUD, suspend/activate)
- Frontend: `useAdmin.js` query hooks and `useAdminMutations.js` mutation hooks exist
- Frontend: `adminService.js` with all API calls exists
- Frontend: No admin page components exist
- `DashboardLayout` exists but may need admin sidebar variant

## Tasks

### 3.1 Admin Overview Page
**File:** `client/src/pages/admin/OverviewPage.jsx`

Dashboard showing:
- Total sellers count (active/suspended)
- Total products count (by status)
- Recent activity summary
- Quick links to sellers/products management

### 3.2 Admin Sellers Page
**File:** `client/src/pages/admin/SellersPage.jsx`

- Table/list of all sellers
- Show: name, email, status (active/suspended), product count, join date
- Actions: view details, suspend/activate toggle
- Search/filter by name, email, status

### 3.3 Admin Seller Detail Page
**File:** `client/src/pages/admin/SellerDetailPage.jsx`

- Seller profile info (name, email, image, status, join date)
- Seller's products list
- Suspend/activate button
- Stats: total products, active, sold, inquiries received

### 3.4 Admin Products Page
**File:** `client/src/pages/admin/ProductsPage.jsx`

- Table/list of all products (across all sellers)
- Show: title, seller name, price, status, category, date
- Actions: view/edit, delete
- Filter by status, category, seller
- Search by title

### 3.5 Admin Product Detail/Edit Page
**File:** `client/src/pages/admin/ProductDetailPage.jsx`

- View product details
- Edit form (title, description, price, category, status)
- Delete button with confirmation
- Link to seller profile

### 3.6 Update DashboardLayout for admin
Ensure sidebar renders admin-specific links when user role is admin:
- Overview, Sellers, Products (not listings/inquiries/sold/archived)

## Files Created
- `client/src/pages/admin/OverviewPage.jsx`
- `client/src/pages/admin/SellersPage.jsx`
- `client/src/pages/admin/SellerDetailPage.jsx`
- `client/src/pages/admin/ProductsPage.jsx`
- `client/src/pages/admin/ProductDetailPage.jsx`

## Files Modified
- `client/src/components/DashboardLayout.jsx` (admin sidebar links)
- `client/src/routes/AppRoutes.jsx` (wire admin routes with real components)

## Acceptance Criteria
- Admin can view all sellers and their details
- Admin can suspend/activate sellers
- Admin can view/edit/delete any product
- Admin sidebar shows correct navigation
- All admin routes protected (admin role only)
