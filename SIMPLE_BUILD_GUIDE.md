# VPN App - Expo Se APK Banane Ka Simple Guide

## Kya Chahiye?
- Ek smartphone (Android)
- Internet connection
- 15-20 minutes time

## Step 1: Expo Account Banao (5 minutes)
1. Browser mein jaao: https://expo.dev
2. "Sign Up" button click karo
3. Email aur password se account banao
4. Email verify karo

## Step 2: Code Download Karo
1. Yeh project download karo (ZIP file)
2. Kisi folder mein extract karo
3. Folder ko "vpn-app" naam do

## Step 3: Terminal/Command Prompt Kholo
**Windows:**
- Start menu mein "cmd" likho aur enter karo
- Command Prompt khul jayega

**Mac:**
- Spotlight search mein "terminal" likho
- Terminal khul jayega

## Step 4: Folder Mein Jao
Terminal mein likho:
\`\`\`
cd Desktop/vpn-app
\`\`\`
(agar Desktop mein rakha hai to)

## Step 5: Expo Install Karo
Terminal mein likho:
\`\`\`
npm install -g eas-cli
\`\`\`
Yeh 2-3 minutes mein complete hoga.

## Step 6: Expo Login Karo
Terminal mein likho:
\`\`\`
eas login
\`\`\`
Apna email aur password enter karo.

## Step 7: APK Build Karo
Terminal mein likho:
\`\`\`
eas build --platform android --profile preview
\`\`\`

Phir ye likha aayega:
\`\`\`
? Build for Android? (Y/n)
\`\`\`
"Y" likho aur enter karo.

## Step 8: Wait Karo
Build 5-10 minutes mein complete hoga. Terminal mein status dikhega.

## Step 9: APK Download Karo
Build complete hone par:
1. Ek link aayega
2. Upar click karo
3. APK download hoga

## Step 10: Phone Mein Install Karo
1. APK file ko phone mein transfer karo
2. File manager mein jaao
3. APK file par click karo
4. "Install" button click karo
5. App install ho jayega!

## Agar Kuch Problem Ho?

**"npm not found" likha aaye:**
- Node.js install karo: https://nodejs.org
- Phir dobara try karo

**"eas-cli not found" likha aaye:**
- Phir se likho: npm install -g eas-cli
- Wait karo 2-3 minutes

**Build fail ho raha hai:**
- Internet check karo
- Expo account verify hai check karo
- Phir dobara try karo

## Kya Hoga?
- APK download hoga
- Phone mein install hoga
- App khul jayega
- Server select karke Connect button dabao
- VPN connect ho jayega!

Bas! Itna hi! 🚀
