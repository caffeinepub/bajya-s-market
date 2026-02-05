# Specification

## Summary
**Goal:** Generate a downloadable Android debug APK (Bubblewrap Trusted Web Activity wrapper) for the currently deployed PWA and document how to reproduce the build.

**Planned changes:**
- Build a Bubblewrap TWA debug APK for the live PWA manifest URL and provide the resulting `app-debug.apk` as a downloadable build artifact (or clearly indicate where to retrieve it from build outputs).
- Verify/update PWA manifest icon assets so the required icon files exist at `frontend/public/assets/generated/` (192x192, 512x512, 512x512 maskable) and that manifest `src` paths resolve without 404s when deployed.
- Add/update an English repo-local guide with the exact commands to generate the debug APK, the manifest URL used, the expected output path, and a brief `adb install` note.

**User-visible outcome:** The user can download and install `app-debug.apk` on an Android device/emulator; launching it opens the PWA in a TWA without browser UI chrome, and developers can follow documented steps to rebuild the APK.
