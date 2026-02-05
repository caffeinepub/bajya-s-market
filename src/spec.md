# Specification

## Summary
**Goal:** Package the existing live PWA (https://bajyasmarketshop.icp0.io) into a downloadable Android debug APK using a Bubblewrap Trusted Web Activity (TWA) workflow.

**Planned changes:**
- Add/confirm a script-based Bubblewrap build flow that produces a debug APK via `cd frontend/scripts && ./twa-build-apk-debug.sh`.
- Ensure the debug APK build output is copied to `frontend/artifacts/app-debug.apk` as the downloadable artifact.
- Ensure PWA icon assets referenced by `frontend/public/manifest.webmanifest` exist under `frontend/public/assets/generated/` with the required dimensions so the TWA build does not fail.
- Add/update repo-local English documentation describing the command(s) to build the debug APK and the expected output path, plus high-level prerequisites (Bubblewrap CLI, Java/JDK, Android SDK).

**User-visible outcome:** A debug Android APK is available at `frontend/artifacts/app-debug.apk` that installs on Android and launches into the wrapped PWA domain (`bajyasmarketshop.icp0.io`).
