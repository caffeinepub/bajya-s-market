# Specification

## Summary
**Goal:** Fix the production go-live deployment so the app can be promoted to live, ensure required PWA icon assets match the manifest, and verify the live PWA works at the expected production URL.

**Planned changes:**
- Identify and fix the root cause of the current production deployment/go-live failure so a production deployment completes successfully.
- Ensure all PWA icons referenced by `frontend/public/manifest.webmanifest` exist under `frontend/public/assets/generated/` with the exact required filenames and pixel dimensions (including a maskable-safe icon).
- After deploying, perform smoke-check verification at https://bajyasmarketshop.icp0.io for app load, routing (Home/Products/Product Details/404), backend product list loading, and service worker registration (no runtime errors).

**User-visible outcome:** The app is successfully live at https://bajyasmarketshop.icp0.io as a usable PWA, with working navigation and product loading, and no missing PWA icon requests.
