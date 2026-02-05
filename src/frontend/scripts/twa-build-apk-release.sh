#!/bin/bash

# TWA Release APK Build Script for bajya's market
# Builds a signed release APK for distribution

set -e  # Exit on error

echo "=========================================="
echo "  bajya's market - Build Release APK"
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

echo "⚠️  Release APK requires a signing keystore."
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
echo "Building release APK..."
echo "  Project: $TWA_DIR"
echo "  Keystore: $KEYSTORE_PATH"
echo "  Alias: $KEY_ALIAS"
echo ""

# Navigate to TWA directory
cd "$TWA_DIR"

# Build release APK (Bubblewrap will prompt for passwords)
bubblewrap build \
  --signingKeyPath="$KEYSTORE_PATH" \
  --signingKeyAlias="$KEY_ALIAS"

echo ""
echo "=========================================="
echo "  ✅ Release APK Built Successfully"
echo "=========================================="
echo ""
echo "Output location:"
echo "  $TWA_DIR/app/build/outputs/apk/release/app-release.apk"
echo ""
echo "Next steps:"
echo "  1. Test the APK on a device: adb install app/build/outputs/apk/release/app-release.apk"
echo "  2. For Play Store submission, build an AAB instead (see twa-build-aab-release.sh)"
echo ""
