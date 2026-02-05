#!/bin/bash

# TWA Release AAB Build Script for bajya's market
# Builds a signed release AAB for Google Play Store submission

set -e  # Exit on error

echo "=========================================="
echo "  bajya's market - Build Release AAB"
echo "=========================================="
echo ""

# Configuration
DEFAULT_TWA_DIR="bajyas-market-twa"

# Prompt for TWA project directory
read -p "TWA project directory [${DEFAULT_TWA_DIR}]: " TWA_DIR
TWA_DIR=${TWA_DIR:-$DEFAULT_TWA_DIR}

# Check if directory exists
if [ ! -d "$TWA_DIR" ]; then
    echo "❌ Error: TWA project directory '$TWA_DIR' not found."
    echo ""
    echo "Initialize a TWA project first:"
    echo "  cd frontend/scripts && ./twa-init.sh"
    echo ""
    exit 1
fi

# Check if twa-manifest.json exists
if [ ! -f "$TWA_DIR/twa-manifest.json" ]; then
    echo "❌ Error: twa-manifest.json not found in '$TWA_DIR'."
    echo "This doesn't appear to be a valid Bubblewrap project."
    exit 1
fi

echo "⚠️  Release AAB requires a signing keystore."
echo ""
echo "If you don't have a keystore, generate one with:"
echo "  keytool -genkey -v -keystore bajyas-market-keystore.jks \\"
echo "    -keyalg RSA -keysize 2048 -validity 10000 \\"
echo "    -alias bajyas-market-key"
echo ""

# Prompt for keystore details
read -p "Path to keystore file: " KEYSTORE_PATH
if [ ! -f "$KEYSTORE_PATH" ]; then
    echo "❌ Error: Keystore file not found: $KEYSTORE_PATH"
    exit 1
fi

read -p "Keystore alias [bajyas-market-key]: " KEY_ALIAS
KEY_ALIAS=${KEY_ALIAS:-bajyas-market-key}

echo ""
echo "Building release AAB for Play Store..."
echo "  Project: $TWA_DIR"
echo "  Keystore: $KEYSTORE_PATH"
echo "  Alias: $KEY_ALIAS"
echo ""

# Navigate to TWA directory
cd "$TWA_DIR"

# Build release AAB (Bubblewrap will prompt for passwords)
bubblewrap build \
  --signingKeyPath="$KEYSTORE_PATH" \
  --signingKeyAlias="$KEY_ALIAS" \
  --buildMode=release \
  --bundleMode=aab

echo ""
echo "=========================================="
echo "  ✅ Release AAB Built Successfully"
echo "=========================================="
echo ""
echo "Output location:"
echo "  $TWA_DIR/app/build/outputs/bundle/release/app-release.aab"
echo ""
echo "Next steps:"
echo "  1. Sign in to Google Play Console: https://play.google.com/console"
echo "  2. Create a new app or select existing app"
echo "  3. Go to Release → Production → Create new release"
echo "  4. Upload: app/build/outputs/bundle/release/app-release.aab"
echo "  5. Complete store listing and submit for review"
echo ""
echo "⚠️  Important: Keep your keystore file and passwords secure!"
echo "You cannot update your app without them."
echo ""
