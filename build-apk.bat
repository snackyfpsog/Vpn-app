@echo off
REM VPN Gate Android App - Automated Build Script (Windows)

echo 🚀 Starting VPN Gate Android App Build...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

REM Check if Android SDK is installed
if "%ANDROID_HOME%"=="" (
    echo ❌ ANDROID_HOME is not set. Please install Android Studio and set ANDROID_HOME.
    exit /b 1
)

echo 📦 Installing dependencies...
call npm install

echo 🔨 Building Android APK...
cd android
call gradlew.bat assembleRelease
cd ..

if exist "android\app\build\outputs\apk\release\app-release.apk" (
    echo ✅ APK built successfully!
    echo 📍 APK location: android\app\build\outputs\apk\release\app-release.apk
    echo.
    echo 📱 To install on your Android device:
    echo    adb install android\app\build\outputs\apk\release\app-release.apk
) else (
    echo ❌ Build failed. Please check the error messages above.
    exit /b 1
)
