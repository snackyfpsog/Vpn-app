#!/bin/bash

# VPN Gate Android App - Automated Build Script
# This script builds the APK automatically

echo "🚀 Starting VPN Gate Android App Build..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Android SDK is installed
if [ -z "$ANDROID_HOME" ]; then
    echo "❌ ANDROID_HOME is not set. Please install Android Studio and set ANDROID_HOME."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building Android APK..."
cd android
./gradlew assembleRelease
cd ..

if [ -f "android/app/build/outputs/apk/release/app-release.apk" ]; then
    echo "✅ APK built successfully!"
    echo "📍 APK location: android/app/build/outputs/apk/release/app-release.apk"
    echo ""
    echo "📱 To install on your Android device:"
    echo "   adb install android/app/build/outputs/apk/release/app-release.apk"
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi
