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

