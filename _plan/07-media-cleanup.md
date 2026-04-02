# Phase 7 — Media Cleanup

## Goal
Ensure Cloudinary assets are properly cleaned up when images are replaced or deleted.

## Current State
- `upload.service.js` has `deleteAsset()` and `deleteMultipleAssets()` functions
- `product.service.js` calls `deleteMultipleAssets` on product delete
- Profile image and product image replacement cleanup needs audit

## Tasks

### 7.1 Audit product image cleanup
- **Product delete:** Verify all product images are deleted from Cloudinary
- **Product update (image replace):** When images are changed, old images not in the new set must be deleted
- **Product sold/archive:** Images should NOT be deleted (still viewable in history)

### 7.2 Audit profile image cleanup
- **Profile update (image replace):** When a seller changes their profile image, the old one must be deleted from Cloudinary
- Check `auth.service.js` → `updateProfile()` for cleanup logic

### 7.3 Audit admin product delete
- **Admin deletes product:** Verify Cloudinary cleanup happens through `admin.service.js`

### 7.4 Audit seller account suspension
- **Seller suspended:** Products go inactive but images should NOT be deleted
- **Seller activated:** Products return to previous state

### 7.5 Handle orphaned images
Add cleanup logic for edge cases:
- Upload succeeds but form submission fails (orphaned Cloudinary assets)
- Consider: frontend could track uploaded publicIds and send cleanup request on cancel/abandon

## Files to Audit/Modify
- `server/services/product.service.js` (update, remove)
- `server/services/auth.service.js` (updateProfile)
- `server/services/admin.service.js` (removeProduct)
- `server/services/upload.service.js` (verify delete functions work)
- `client/src/hooks/useUpload.js` (cleanup on cancel)

## Acceptance Criteria
- Replacing a product image deletes the old one from Cloudinary
- Replacing a profile image deletes the old one from Cloudinary
- Deleting a product deletes all its images from Cloudinary
- No orphaned images accumulate in Cloudinary
