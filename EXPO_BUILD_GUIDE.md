# VPN Gate Android App - Expo Build Guide

## Easiest Way to Build APK (No PC Required!)

### Step 1: Create Expo Account
1. Go to https://expo.dev
2. Click "Sign Up"
3. Create account with email/password

### Step 2: Install Expo CLI
Open any terminal/command prompt and run:
\`\`\`bash
npm install -g eas-cli
\`\`\`

### Step 3: Build APK
\`\`\`bash
eas build --platform android --profile preview
\`\`\`

This will:
- Upload your code to Expo servers
- Build APK in the cloud
- Give you a download link

### Step 4: Download & Install
1. Wait for build to complete (5-10 minutes)
2. Click download link
3. Transfer APK to your Android phone
4. Open file manager on phone
5. Tap APK file to install

### Alternative: Using GitHub Actions (Completely Free)

1. Push code to GitHub
2. GitHub automatically builds APK
3. Download from GitHub releases

### Troubleshooting

**Build fails?**
- Make sure you're logged in: `eas login`
- Check internet connection
- Try again in a few minutes

**APK won't install?**
- Enable "Unknown Sources" in Android settings
- Make sure you have enough storage
- Try clearing cache: Settings > Apps > Clear Cache

## That's it! Your VPN app is ready to use!
