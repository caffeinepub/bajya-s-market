#!/bin/bash

# TWA Initialization Script for bajya's market
# This script initializes a Bubblewrap TWA project using the live manifest

set -e  # Exit on error

echo "=========================================="
echo "  bajya's market - TWA Initialization"
echo "=========================================="
echo ""

# Configuration
MANIFEST_URL="https://bajyasmarketshop.icp0.io/manifest.webmanifest"
DEFAULT_PACKAGE_NAME="io.icp0.bajyasmarketshop"
DEFAULT_OUTPUT_DIR="bajyas-market-twa"

echo "This script will initialize a Bubblewrap TWA project from your live PWA."
echo ""
echo "📱 Live PWA Manifest URL:"
echo "   $MANIFEST_URL"
echo ""

# Check if Bubblewrap is installed
if ! command -v bubblewrap &> /dev/null; then
    echo "❌ Error: Bubblewrap CLI is not installed."
    echo ""
    echo "Install it with:"
    echo "  npm install -g @bubblewrap/cli"
    echo ""
    exit 1
fi

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Error: Java (JDK) is not installed."
    echo ""
    echo "Download from: https://adoptium.net/"
    echo ""
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Prompt for output directory
read -p "Output directory [${DEFAULT_OUTPUT_DIR}]: " OUTPUT_DIR
OUTPUT_DIR=${OUTPUT_DIR:-$DEFAULT_OUTPUT_DIR}

# Check if directory already exists
if [ -d "$OUTPUT_DIR" ]; then
    echo ""
    echo "⚠️  Directory '$OUTPUT_DIR' already exists."
    read -p "Do you want to overwrite it? (y/N): " OVERWRITE
    if [[ ! $OVERWRITE =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 0
    fi
    rm -rf "$OUTPUT_DIR"
fi

# Prompt for package name
echo ""
echo "Package name must be unique on Google Play Store."
echo "Format: reverse domain notation (e.g., com.company.appname)"
echo "Use lowercase letters, numbers, and dots only."
read -p "Package name [${DEFAULT_PACKAGE_NAME}]: " PACKAGE_NAME
PACKAGE_NAME=${PACKAGE_NAME:-$DEFAULT_PACKAGE_NAME}

# Validate package name format
if [[ ! $PACKAGE_NAME =~ ^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$ ]]; then
    echo "❌ Error: Invalid package name format."
    echo "Must use lowercase letters, numbers, underscores, and dots."
    echo "Example: io.icp0.bajyasmarketshop"
    exit 1
fi

echo ""
echo "Initializing TWA project from live manifest..."
echo "  Manifest URL: $MANIFEST_URL"
echo "  Package Name: $PACKAGE_NAME"
echo "  Output Directory: $OUTPUT_DIR"
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"
cd "$OUTPUT_DIR"

# Initialize Bubblewrap with the manifest
echo "Running Bubblewrap init..."
echo ""

# Run bubblewrap init with manifest URL
# Note: Bubblewrap will fetch the manifest and prompt for additional configuration
bubblewrap init --manifest "$MANIFEST_URL"

echo ""
echo "=========================================="
echo "  ✅ TWA Project Initialized Successfully"
echo "=========================================="
echo ""
echo "Project location: $OUTPUT_DIR"
echo "Manifest source: $MANIFEST_URL"
echo ""
echo "Next steps:"
echo "  1. Review the generated twa-manifest.json"
echo "  2. Generate a signing keystore (see PLAY_STORE_TWA_GUIDE.md)"
echo "  3. Build your APK/AAB using the build scripts"
echo ""
echo "Build commands:"
echo "  Debug APK:   cd frontend/scripts && ./twa-build-apk-debug.sh"
echo "  Release APK: cd frontend/scripts && ./twa-build-apk-release.sh"
echo "  Release AAB: cd frontend/scripts && ./twa-build-aab-release.sh"
echo ""

