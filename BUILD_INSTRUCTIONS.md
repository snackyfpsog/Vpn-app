# VPN Gate Android App - Build Instructions

## Prerequisites
- Node.js and npm installed
- Android Studio installed
- Android SDK (API level 24+)
- Java Development Kit (JDK 11+)

## Setup

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Install Android dependencies:**
   \`\`\`bash
   cd android
   ./gradlew clean
   cd ..
   \`\`\`

3. **Connect Android device or start emulator:**
   \`\`\`bash
   adb devices
   \`\`\`

## Development

**Run on Android device/emulator:**
\`\`\`bash
npm run android
\`\`\`

## Build Release APK

**Build signed APK:**
\`\`\`bash
npm run android-build
\`\`\`

The APK will be generated at:
\`\`\`
android/app/build/outputs/apk/release/app-release.apk
\`\`\`

## Installation

**Install on device:**
\`\`\`bash
npm run android-install
\`\`\`

Or manually:
\`\`\`bash
adb install android/app/build/outputs/apk/release/app-release.apk
\`\`\`

## Permissions

The app requires these permissions:
- **INTERNET** - To fetch VPN servers and connect
- **BIND_VPN_SERVICE** - To establish VPN connections
- **CHANGE_NETWORK_STATE** - To modify network settings
- **ACCESS_NETWORK_STATE** - To check network status

Grant these permissions when prompted on first launch.

## Features

- Real-time server list from VPN Gate
- One-tap VPN connection
- Server selection and filtering
- Connection status monitoring
- Settings for protocol and encryption
- Persistent connection in background

## Troubleshooting

**App crashes on connect:**
- Ensure VPN permissions are granted
- Check Android version (requires API 24+)
- Restart the app

**Can't fetch servers:**
- Check internet connection
- Verify VPN Gate API is accessible
- Check firewall settings

**Connection drops:**
- Check signal strength
- Verify server is still active
- Try connecting to different server
