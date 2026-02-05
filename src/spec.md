# Specification

## Summary
**Goal:** Fix the live Internet Computer deployment so the public URL loads the app (not the “Canister ID Not Resolved” gateway error) and the frontend can reach the correct backend canister using runtime configuration.

**Planned changes:**
- Repair production deployment configuration so the deployed frontend resolves via a valid canister URL/domain and points to the correct backend canister.
- Ensure the deployed frontend serves a valid `/env.json` at runtime containing the correct backend canister ID (non-placeholder) and `DFX_NETWORK`, and that the app uses these values when initializing the backend actor.
- Add a clear, English, user-facing error state when `/env.json` is missing/invalid or the canister ID is not set, with actionable next steps.
- Redeploy the fixed build to the live environment and perform a basic smoke check from the live URL (app loads; backend calls like product listing work).

**User-visible outcome:** Visiting the live/public URL loads the React app successfully, the app can load data from the backend in production, and misconfiguration shows a clear on-screen error message instead of failing silently.
