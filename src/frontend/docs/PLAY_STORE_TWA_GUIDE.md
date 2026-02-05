# Publishing bajya's market to Google Play Store

This guide explains how to package your Progressive Web App (PWA) as a Trusted Web Activity (TWA) and publish it to the Google Play Store.

## Prerequisites

Before you begin, ensure:

1. ✅ Your PWA is live at: **https://bajyasmarketshop.icp0.io**
2. ✅ The web app manifest is configured (`/manifest.webmanifest`)
3. ✅ PWA icons are available:
   - `/assets/generated/pwa-icon-192.dim_192x192.png`
   - `/assets/generated/pwa-icon-512.dim_512x512.png`
   - `/assets/generated/pwa-icon-maskable-512.dim_512x512.png`
4. ✅ Service worker is registered and working (`/sw.js`)

## Important Limitation

⚠️ **This Internet Computer project does not directly generate APK/AAB files.** The IC deployment serves your web application. To publish to the Play Store, you must package the PWA externally using TWA tooling (described below).

## Step 1: Set Up Your Development Environment

### Install Required Tools

1. **Install Node.js** (v16 or higher)
   - Download from: https://nodejs.org/

2. **Install Bubblewrap CLI** (Google's TWA packaging tool)
   ```bash
   npm install -g @bubblewrap/cli
   ```

3. **Install Java Development Kit (JDK)** (version 11 or higher)
   - Download from: https://adoptium.net/

4. **Install Android SDK**
   - Option A: Install Android Studio (recommended): https://developer.android.com/studio
   - Option B: Install command-line tools only

## Step 2: Initialize Your TWA Project

1. **Create a new directory for your TWA project:**
   ```bash
   mkdir bajyas-market-twa
   cd bajyas-market-twa
   ```

2. **Initialize Bubblewrap:**
   ```bash
   bubblewrap init --manifest https://bajyasmarketshop.icp0.io/manifest.webmanifest
   ```

3. **Answer the prompts:**
   - **Domain:** `bajyasmarketshop.icp0.io`
   - **Package name:** `io.icp0.bajyasmarketshop` (or your preferred reverse domain)
     - Must be unique on Play Store
     - Use lowercase letters, numbers, and dots only
     - Example format: `com.yourcompany.appname`
   - **App name:** `bajya's market`
   - **Start URL:** `/`
   - **Icon URL:** Use the 512x512 icon from your manifest
   - **Theme color:** `#ea580c`
   - **Background color:** `#ffffff`

## Step 3: Generate a Signing Key

Android apps must be signed. Create a keystore file:

