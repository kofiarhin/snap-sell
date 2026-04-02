# UI Redesign Migration Checklist

## Baseline capture (Phase 0)
- [x] Created branch: `redesign-dark-snapchat-theme`
- [ ] Baseline screenshots (home, products, detail, auth, seller/admin dashboards)
  - Note: browser_container screenshot tool was not available in this environment.
- [x] Theme drift audit executed:
  - `rg -n "indigo-|bg-white|text-gray-9|bg-gray-|border-gray-" client/src`
- [x] Shared layout hierarchy reviewed:
  - `PublicLayout -> Navbar/Footer`
  - `DashboardLayout -> seller/admin shells`

## Touched foundation files
- [x] `client/src/index.css`
- [x] `client/src/utils/ui.js`
- [x] `client/src/components/Navbar.jsx`
- [x] `client/src/components/Footer.jsx`
- [x] `client/src/components/PublicLayout.jsx`
- [x] `client/src/components/DashboardLayout.jsx`
- [x] `client/src/components/ProductCard.jsx`
- [x] `client/src/components/Pagination.jsx`
- [x] `client/src/components/LoadingSpinner.jsx`
- [x] `client/src/components/EmptyState.jsx`
- [x] `client/src/components/ImageUpload.jsx`

## Auth pages
- [x] `client/src/pages/LoginPage.jsx`
- [x] `client/src/pages/RegisterPage.jsx`
- [x] `client/src/pages/ForgotPasswordPage.jsx`
- [x] `client/src/pages/ResetPasswordPage.jsx`

## Dashboard status helper adoption
- [x] `client/src/pages/dashboard/MyListingsPage.jsx`
- [x] `client/src/pages/dashboard/InquiriesPage.jsx`

## Follow-up phases (remaining)
- [ ] Public marketplace page migration
- [ ] Seller dashboard page migration
- [ ] Admin page migration
- [ ] Repo-wide utility cleanup
- [ ] Edge-state + responsive QA
