# Specification

## Summary
**Goal:** Convert the existing web app into an installable Progressive Web App (PWA) with reliable offline behavior and clear install/update user flows.

**Planned changes:**
- Validate and, if needed, update the PWA manifest and HTML metadata so browsers detect the app as installable (including required fields, icons, and Apple install meta tags).
- Register and harden the service worker to support offline navigation fallback and safe caching behavior that does not interfere with non-GET or non-http(s) requests.
- Add an in-app update notification that prompts users when a new version is available and provides a “Refresh” action to activate it.
- Add an in-app “Install App” entry point using `beforeinstallprompt` when available, hide it when already installed, and show clear fallback install instructions when the prompt is unavailable.

**User-visible outcome:** Users can install the app on mobile/desktop as a standalone PWA, see an offline-friendly fallback when disconnected, get prompted when an update is available with a refresh action, and use an in-app “Install App” control (with guidance when install prompting isn’t available).
