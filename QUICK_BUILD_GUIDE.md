# VPN Gate Android App - Quick Build Guide

## Prerequisites
1. **Node.js** - Download from https://nodejs.org/
2. **Android Studio** - Download from https://developer.android.com/studio
3. **Android SDK** - Installed via Android Studio (API 24+)
4. **Java Development Kit (JDK)** - Usually comes with Android Studio

## Step-by-Step Build Instructions

### Windows Users:
\`\`\`bash
# 1. Download the project files
# 2. Open Command Prompt in the project folder
# 3. Run the build script:
build-apk.bat
\`\`\`

### Mac/Linux Users:
\`\`\`bash
# 1. Download the project files
# 2. Open Terminal in the project folder
# 3. Make the script executable:
chmod +x build-apk.sh

# 4. Run the build script:
./build-apk.sh
\`\`\`

## Manual Build (If Script Fails)

### Step 1: Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Step 2: Build APK
\`\`\`bash
cd android
./gradlew assembleRelease  # Mac/Linux
# OR
gradlew.bat assembleRelease  # Windows
cd ..
\`\`\`

### Step 3: Find Your APK
The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

## Install on Android Device

### Option 1: Using ADB (Command Line)
\`\`\`bash
adb install android/app/build/outputs/apk/release/app-release.apk
\`\`\`

### Option 2: Manual Installation
1. Copy the APK file to your Android device
2. Open a file manager on your device
3. Tap the APK file to install

### Option 3: Using Android Studio
1. Open Android Studio
2. Go to Build → Analyze APK
3. Select the APK file
4. Click "Install"

## Troubleshooting

### "ANDROID_HOME is not set"
- Open Android Studio
- Go to Settings → Appearance & Behavior → System Settings → Android SDK
- Copy the Android SDK Location
- Set environment variable:
  - **Windows**: `setx ANDROID_HOME "C:\Users\YourName\AppData\Local\Android\Sdk"`
  - **Mac/Linux**: `export ANDROID_HOME=~/Library/Android/sdk`

### "Gradle build failed"
- Delete `android/.gradle` folder
- Run `npm install` again
- Try building again

### "APK not installing"
- Make sure your Android device has "Unknown Sources" enabled
- Go to Settings → Security → Unknown Sources → Enable
- Try installing again

## Features in the App

✅ Real VPN Gate Server List
✅ One-Click VPN Connection
✅ Real-time Speed & Ping Display
✅ Server Selection by Country
✅ Connection Status Monitoring
✅ Settings & Preferences
✅ Background VPN Service

## Support

If you face any issues:
1. Check the error messages carefully
2. Make sure all prerequisites are installed
3. Try the manual build steps
4. Check Android Studio logs for detailed errors

Happy VPNing! 🚀
