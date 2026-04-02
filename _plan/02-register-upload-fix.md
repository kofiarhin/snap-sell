# Phase 2 — Fix Register Upload Flow

## Goal
Ensure registration with profile image works end-to-end using the signed Cloudinary upload flow.

## Current State
- `uploadService.js` has `getSignature()` and direct Cloudinary upload logic
- `useUpload.js` hook wraps the upload flow
- `ImageUpload.jsx` component exists
- `RegisterPage.jsx` uses React Hook Form
- Upload signature endpoint (`POST /api/uploads/sign`) requires auth — but registration is pre-auth

## Problem
The upload signature endpoint requires authentication. A user registering doesn't have a token yet, so they can't get a Cloudinary signature to upload their profile image.

## Tasks

### 2.1 Audit the current upload sign endpoint
**File:** `server/routes/upload.routes.js`
Check if `/sign` is behind `authenticate` middleware. If yes, need a public-safe variant.

### 2.2 Create public upload signature route
Add `POST /api/uploads/sign-public` that:
- Does NOT require auth
- Only allows profile image uploads (restrict to specific folder/transformation)
- Has rate limiting to prevent abuse
- Returns signature for a limited upload preset

### 2.3 Update uploadService.js
Add a `getPublicSignature()` function for the registration flow.

### 2.4 Update useUpload.js hook
Accept a `public` flag to use the public signature endpoint during registration.

### 2.5 Audit RegisterPage.jsx
- Verify image upload triggers before form submit
- Verify uploaded `{ url, publicId }` is included in register payload
- Verify error handling if upload fails
- Verify preview works

### 2.6 Audit ImageUpload.jsx
- Preview display works
- Remove/replace image works
- Loading state during upload

## Files Changed
- `server/routes/upload.routes.js` (add public route)
- `server/controllers/upload.controller.js` (add public handler)
- `server/services/upload.service.js` (add public signature logic)
- `client/src/services/uploadService.js` (add public variant)
- `client/src/hooks/useUpload.js` (support public flag)
- `client/src/pages/RegisterPage.jsx` (audit/fix)
- `client/src/components/ImageUpload.jsx` (audit/fix)

## Acceptance Criteria
- New user can register with a profile image without being logged in
- Public signature endpoint is rate-limited
- Image preview shows before submission
- Registration fails gracefully if image upload fails
