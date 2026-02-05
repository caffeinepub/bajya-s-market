# Specification

## Summary
**Goal:** Make the store installable as an Android-ready PWA and add clear repo documentation for packaging/publishing to Google Play via a Trusted Web Activity (TWA).

**Planned changes:**
- Add a web app manifest served by the app (e.g., `/manifest.webmanifest`) with required fields (name, short_name, start_url, scope, display=standalone, background_color, theme_color) and icon entries including at least one maskable icon.
- Update `frontend/index.html` to reference the manifest and set the theme-color meta tag to match the manifest.
- Add required PWA icon assets and ensure all manifest icon URLs resolve (no 404s).
- Add a service worker (e.g., `/sw.js`) plus registration from an editable frontend file (not `frontend/src/main.tsx`) to provide basic offline resilience for the app shell and an offline fallback response/UI.
- Add an in-app “Install App” flow that triggers the native install prompt when available, and otherwise shows English instructions for installing via the browser menu; ensure it works on desktop and mobile layouts.
- Add an English, step-by-step guide in the repo explaining how to produce an Android APK/AAB using TWA tooling (Android Studio + Bubblewrap) for `https://bajyasmarketshop.icp0.io`, including package name guidance, versioning, icon usage, signing keystore, and Play Console upload steps (noting Play typically requires an AAB).

**User-visible outcome:** Users can install the site on Android via “Add to Home screen”, get basic offline behavior, see an in-app install guide/button, and developers have a clear documented path to package the PWA into a TWA for Play Store submission.
