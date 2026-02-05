#!/bin/bash

# TWA Debug APK Build Script for bajya's market
# Builds a debug APK for testing on devices/emulators and copies it to artifacts folder

set -e  # Exit on error

echo "=========================================="
echo "  bajya's market - Build Debug APK"
echo "=========================================="
echo ""

# Configuration
DEFAULT_TWA_DIR="bajyas-market-twa"
ARTIFACTS_DIR="../artifacts"

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

echo "Building debug APK from live manifest..."
echo "  Manifest URL: https://bajyasmarketshop.icp0.io/manifest.webmanifest"
echo "  Project: $TWA_DIR"
echo ""

# Navigate to TWA directory
cd "$TWA_DIR"

# Build debug APK
bubblewrap build

# Get the absolute path to the generated APK
APK_SOURCE="app/build/outputs/apk/debug/app-debug.apk"

if [ ! -f "$APK_SOURCE" ]; then
    echo "❌ Error: APK not found at expected location: $APK_SOURCE"
    exit 1
fi

# Create artifacts directory if it doesn't exist
cd ..
mkdir -p "$ARTIFACTS_DIR"

# Copy APK to artifacts folder with predictable name
echo ""
echo "Copying APK to artifacts folder..."
cp "$TWA_DIR/$APK_SOURCE" "$ARTIFACTS_DIR/app-debug.apk"

echo ""
echo "=========================================="
echo "  ✅ Debug APK Built Successfully"
echo "=========================================="
echo ""
echo "APK locations:"
echo "  Bubblewrap output: $TWA_DIR/$APK_SOURCE"
echo "  Downloadable artifact: frontend/artifacts/app-debug.apk"
echo ""
echo "Install on device:"
echo "  adb install frontend/artifacts/app-debug.apk"
echo ""
echo "Or download from:"
echo "  frontend/artifacts/app-debug.apk"
echo ""
echo "Next steps:"
echo "  1. Connect your Android device via USB"
echo "  2. Enable USB debugging on your device"
echo "  3. Run: adb install frontend/artifacts/app-debug.apk"
echo "  4. Launch the app from your device"
echo ""
echo "The APK wraps your live PWA at https://bajyasmarketshop.icp0.io"
echo "and will automatically reflect any updates you deploy to the web app."
echo ""

