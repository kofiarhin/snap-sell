# Phase 4 — Category Page

## Goal
Build the `/category/:slug` public page that shows all active products in a specific category.

## Current State
- Backend: `GET /api/products?category=slug` already supports category filtering
- Frontend: `useCategories` hook fetches all categories
- Frontend: `useProducts` hook supports category filter param
- Frontend: No `CategoryPage` component exists

## Tasks

### 4.1 Create CategoryPage
**File:** `client/src/pages/CategoryPage.jsx`

- Read `:slug` from URL params
- Fetch category name from categories list (match by slug)
- Fetch products filtered by category slug
- Reuse `ProductCard` grid layout
- Include pagination
- Show category name as page title
- Show breadcrumb: Home > Categories > {Category Name}
- Handle empty state (no products in category)
- Handle invalid category slug (404 or redirect)

### 4.2 Update navigation
- Ensure Navbar or HomePage links to category pages use `/category/:slug` format
- Verify `HomePage` category filter links point to the right routes

## Files Created
- `client/src/pages/CategoryPage.jsx`

## Files Modified
- `client/src/routes/AppRoutes.jsx` (replace placeholder with real component)
- `client/src/components/Navbar.jsx` (add category links if appropriate)

## Acceptance Criteria
- `/category/electronics` shows only electronics products
- Pagination works within category
- Invalid slug shows appropriate fallback
- Category name displays correctly in header
