# Specification

## Summary
**Goal:** Let admins manually sync products from a Shopify store into the existing catalog, importing key product details and keeping previously imported items updated.

**Planned changes:**
- Add an admin-only UI section to enter Shopify store domain and Storefront access token, test the connection, and run a “Sync now” import.
- Integrate with the Shopify Storefront GraphQL API to fetch products and map/import: title/name, description, price + currency, category/type (best-effort), main image URL, and in-stock status (best-effort).
- Extend the backend product model to store a stable external identifier and external source for Shopify-imported products, and add an admin-only bulk upsert endpoint to create/update products by that identifier.
- Ensure frontend canister interface typings and React Query hooks are updated to call the new backend methods without `any` or missing-method compile errors.
- Add a consistent product image fallback so missing/broken images render a local placeholder instead of a broken image.

**User-visible outcome:** Admin users can enter Shopify connection details and run a sync to import/update products into the app; non-admin users cannot access sync controls; admins see clear English success/error messages; products without valid images display a local placeholder.
