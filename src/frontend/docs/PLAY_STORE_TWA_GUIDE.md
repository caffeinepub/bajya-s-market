# Publishing bajya's market to Google Play Store

This guide explains how to package your Progressive Web App (PWA) as a Trusted Web Activity (TWA) and publish it to the Google Play Store.

## Prerequisites

Before you begin, ensure:

1. ✅ Your PWA is live at: **https://bajyasmarketshop.icp0.io**
2. ✅ The web app manifest is accessible at: **https://bajyasmarketshop.icp0.io/manifest.webmanifest**
3. ✅ PWA icons are available:
   - `/assets/generated/pwa-icon-192.dim_192x192.png` (192×192)
   - `/assets/generated/pwa-icon-512.dim_512x512.png` (512×512)
   - `/assets/generated/pwa-icon-maskable-512.dim_512x512.png` (512×512, maskable)
4. ✅ Service worker is registered and working (`/sw.js`)
5. ✅ HTTPS is enabled (required for TWA)

## Important Limitation

⚠️ **This Internet Computer project does not directly generate APK/AAB files.** The IC deployment serves your web application. To publish to the Play Store, you must package the PWA externally using TWA tooling (described below).

## What is a Trusted Web Activity (TWA)?

A TWA is an Android app that wraps your PWA in a native Android container. It provides:
- Full-screen experience without browser UI
- Installation via Google Play Store
- Access to native Android features
- Automatic updates when your web app updates

## Required Configuration Values

When packaging your TWA, you'll need these values:

| Setting | Value | Notes |
|---------|-------|-------|
| **Domain** | `bajyasmarketshop.icp0.io` | Your live PWA domain |
| **Manifest URL** | `https://bajyasmarketshop.icp0.io/manifest.webmanifest` | Full manifest path |
| **Package Name** | `io.icp0.bajyasmarketshop` | Must be unique on Play Store; use reverse domain notation (lowercase, dots only) |
| **App Name** | `bajya's market` | Display name in Play Store |
| **Start URL** | `/` | Entry point of your app |
| **Theme Color** | `#ea580c` | Orange/amber primary color |
| **Background Color** | `#ffffff` | White background |
| **Icon (512×512)** | `/assets/generated/pwa-icon-512.dim_512x512.png` | High-res icon |
| **Maskable Icon** | `/assets/generated/pwa-icon-maskable-512.dim_512x512.png` | Adaptive icon |

**Important:** The package name must be globally unique on Google Play Store. If `io.icp0.bajyasmarketshop` is taken, use a different identifier (e.g., `com.yourcompany.bajyasmarket`).

---

## Step 1: Set Up Your Development Environment

### Install Required Tools

1. **Install Node.js** (v16 or higher)
   ```bash
   node --version  # Verify installation
   ```
   Download from: https://nodejs.org/

2. **Install Bubblewrap CLI** (Google's official TWA packaging tool)
   ```bash
   npm install -g @bubblewrap/cli
   bubblewrap --version  # Verify installation
   ```

3. **Install Java Development Kit (JDK)** (version 11 or higher)
   ```bash
   java -version  # Verify installation
   ```
   Download from: https://adoptium.net/

4. **Install Android SDK**
   - **Option A (Recommended):** Install Android Studio
     - Download: https://developer.android.com/studio
     - During setup, install Android SDK Platform 33+ and Build Tools
   - **Option B:** Install command-line tools only
     - Download: https://developer.android.com/studio#command-tools

5. **Set Environment Variables**
   ```bash
   # Add to ~/.bashrc or ~/.zshrc
   export ANDROID_HOME=$HOME/Android/Sdk  # Adjust path as needed
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
   ```

---

## Step 2: Initialize Your TWA Project

### Option A: Using Helper Scripts (Recommended)

This repository includes helper scripts in `frontend/scripts/` to streamline the process:

1. **Navigate to the scripts directory:**
   ```bash
   cd frontend/scripts
   ```

2. **Run the initialization script:**
   ```bash
   ./twa-init.sh
   ```

3. **Follow the prompts:**
   - Output directory: Press Enter to use default `bajyas-market-twa`
   - Package name: Press Enter to use default `io.icp0.bajyasmarketshop` (or provide your own unique identifier)

4. **The script will:**
   - Verify prerequisites (Bubblewrap CLI, Java)
   - Initialize a Bubblewrap project from the live manifest URL: `https://bajyasmarketshop.icp0.io/manifest.webmanifest`
   - Create a `twa-manifest.json` configuration file
   - Set up the Android project structure

### Option B: Manual Initialization

If you prefer to run Bubblewrap commands directly:

1. **Create a directory for your TWA project:**
   ```bash
   mkdir bajyas-market-twa
   cd bajyas-market-twa
   ```

2. **Initialize Bubblewrap with your manifest:**
   ```bash
   bubblewrap init --manifest https://bajyasmarketshop.icp0.io/manifest.webmanifest
   ```

3. **Follow the interactive prompts:**
   - Package name: `io.icp0.bajyasmarketshop` (or your unique identifier)
   - Accept defaults for other settings (they're pulled from your manifest)

---

## Step 3: Build a Debug APK for Testing

Before creating a release build for the Play Store, you should test your TWA with a debug APK on a physical device or emulator.

### Prerequisites for Building

Ensure you have completed Step 1 (development environment setup) and Step 2 (TWA project initialization). You need:
- ✅ Bubblewrap CLI installed
- ✅ Java JDK (version 11+)
- ✅ Android SDK with Build Tools
- ✅ Initialized TWA project (from Step 2)

### Build Debug APK Using Helper Script (Recommended)

1. **Navigate to the scripts directory from the repository root:**
   ```bash
   cd frontend/scripts
   ```

2. **Run the debug build script:**
   ```bash
   ./twa-build-apk-debug.sh
   ```

3. **Follow the prompt:**
   - TWA project directory: Press Enter to use default `bajyas-market-twa` (or enter the directory name you used in Step 2)

4. **The script will:**
   - Validate the TWA project exists
   - Build a debug APK using Bubblewrap
   - Copy the APK to `frontend/artifacts/app-debug.apk` for easy access

5. **Expected output location:**
   ```
   frontend/artifacts/app-debug.apk
   ```
   This is your downloadable debug APK file.

### Build Debug APK Manually

If you prefer to run Bubblewrap commands directly:

1. **Navigate to your TWA project directory:**
   ```bash
   cd frontend/scripts/bajyas-market-twa
   ```

2. **Build the debug APK:**
   ```bash
   bubblewrap build
   ```

3. **Locate the generated APK:**
   ```
   app/build/outputs/apk/debug/app-debug.apk
   ```

### Install and Test the Debug APK

#### Option A: Install via USB (Recommended)

1. **Enable USB debugging on your Android device:**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times to enable Developer Options
   - Go to Settings → Developer Options
   - Enable "USB Debugging"

2. **Connect your device via USB**

3. **Install the APK using adb:**
   ```bash
   adb install frontend/artifacts/app-debug.apk
   ```

4. **Launch the app from your device's app drawer**

#### Option B: Install via File Transfer

1. **Copy the APK to your device:**
   - Transfer `frontend/artifacts/app-debug.apk` to your device via USB, email, or cloud storage

2. **On your device:**
   - Open the APK file
   - Allow installation from unknown sources if prompted
   - Tap "Install"

### Important Notes About Debug APKs

- ⚠️ **Debug APKs are for testing only** and cannot be published to the Play Store
- ✅ **The APK wraps your live PWA** at `https://bajyasmarketshop.icp0.io`
- ✅ **Automatic updates:** Any changes you deploy to your web app will automatically appear in the TWA without rebuilding the APK
- ✅ **No signing required:** Debug APKs are automatically signed with a debug keystore
- ⚠️ **Security:** Debug APKs should not be distributed publicly; use release builds for production

### Troubleshooting

**Build fails with "Android SDK not found":**
- Verify `ANDROID_HOME` environment variable is set correctly
- Ensure Android SDK Build Tools are installed

**APK installs but shows blank screen:**
- Verify your PWA is accessible at `https://bajyasmarketshop.icp0.io`
- Check that the manifest URL returns valid JSON
- Ensure all icon assets exist at the specified paths

**"App not installed" error:**
- Uninstall any previous version of the app
- Ensure your device has sufficient storage
- Try installing via adb instead of file transfer

---

## Step 4: Generate a Signing Key for Release Builds

To publish to the Play Store, you need a release build signed with your own keystore.

### Create a Keystore

1. **Generate a new keystore:**
   ```bash
   keytool -genkey -v -keystore bajyas-market-release.keystore \
     -alias bajyas-market \
     -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Follow the prompts:**
   - Enter a strong keystore password (save this securely!)
   - Enter your organization details
   - Confirm the information

3. **Store the keystore securely:**
   - ⚠️ **CRITICAL:** Back up this file and password. If you lose them, you cannot update your app on the Play Store.
   - Do not commit the keystore to version control
   - Consider using a password manager or secure vault

### Keystore Information You'll Need

Save these details securely:
- Keystore file path: `bajyas-market-release.keystore`
- Keystore password: (the password you entered)
- Key alias: `bajyas-market`
- Key password: (same as keystore password, or different if you specified one)

---

## Step 5: Build Release APK or AAB

### Build Release APK (for direct distribution)

1. **Navigate to the scripts directory:**
   ```bash
   cd frontend/scripts
   ```

2. **Run the release APK build script:**
   ```bash
   ./twa-build-apk-release.sh
   ```

3. **Follow the prompts:**
   - TWA project directory
   - Keystore file path
   - Key alias
   - Passwords (entered securely)

4. **Output location:**
   ```
   frontend/scripts/bajyas-market-twa/app/build/outputs/apk/release/app-release.apk
   ```

### Build Release AAB (for Google Play Store)

**Recommended for Play Store submission** (smaller download size, optimized per-device):

1. **Navigate to the scripts directory:**
   ```bash
   cd frontend/scripts
   ```

2. **Run the release AAB build script:**
   ```bash
   ./twa-build-aab-release.sh
   ```

3. **Follow the prompts:**
   - TWA project directory
   - Keystore file path
   - Key alias
   - Passwords (entered securely)

4. **Output location:**
   ```
   frontend/scripts/bajyas-market-twa/app/build/outputs/bundle/release/app-release.aab
   ```

---

## Step 6: Verify Digital Asset Links

For your TWA to work properly, you must set up Digital Asset Links to prove you own the domain.

### What are Digital Asset Links?

Digital Asset Links verify that your Android app and website are owned by the same entity. Without this verification, your TWA will open in a Chrome Custom Tab instead of full-screen mode.

### Set Up Asset Links

1. **Generate SHA-256 fingerprint from your keystore:**
   ```bash
   keytool -list -v -keystore bajyas-market-release.keystore -alias bajyas-market
   ```

2. **Copy the SHA-256 fingerprint** (it looks like: `AA:BB:CC:...`)

3. **Create an `assetlinks.json` file** in your PWA's `frontend/public/.well-known/` directory:
   ```json
   [{
     "relation": ["delegate_permission/common.handle_all_urls"],
     "target": {
       "namespace": "android_app",
       "package_name": "io.icp0.bajyasmarketshop",
       "sha256_cert_fingerprints": [
         "AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99"
       ]
     }
   }]
   ```

4. **Replace the values:**
   - `package_name`: Your app's package name
   - `sha256_cert_fingerprints`: Your keystore's SHA-256 fingerprint (remove colons)

5. **Deploy the file** so it's accessible at:
   ```
   https://bajyasmarketshop.icp0.io/.well-known/assetlinks.json
   ```

6. **Verify the file is accessible:**
   ```bash
   curl https://bajyasmarketshop.icp0.io/.well-known/assetlinks.json
   ```

### Test Asset Links

Use Google's Asset Links testing tool:
