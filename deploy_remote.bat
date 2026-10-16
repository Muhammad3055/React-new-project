@echo off
setlocal enabledelayedexpansion

echo =======================================================
echo 🚀 Maktab tul Muslim - Local Push + Remote VPS Deploy
echo =======================================================

:: Check for VPS host config or prompt
set CONFIG_FILE="%~dp0.vps_config"
if exist %CONFIG_FILE% (
    for /f "tokens=1,2 delims==" %%a in (%CONFIG_FILE%) do (
        if "%%a"=="VPS_HOST" set VPS_HOST=%%b
        if "%%a"=="VPS_USER" set VPS_USER=%%b
    )
)

if "%VPS_HOST%"=="" (
    set /p VPS_HOST="🌐 Enter your VPS IP Address or Domain: "
    set /p VPS_USER="👤 Enter SSH Username (Default: root): "
    if "!VPS_USER!"=="" set VPS_USER=root
    echo VPS_HOST=!VPS_HOST!> %CONFIG_FILE%
    echo VPS_USER=!VPS_USER!>> %CONFIG_FILE%
)

:: 1. Run build & push
echo.
echo 📦 [1/3] Building & Pushing to GitHub...
call "%~dp0push_live.bat"

:: 2. Connect to VPS and run update_live.sh
echo.
echo 📡 [2/3] Connecting to VPS (%VPS_USER%@%VPS_HOST%) to deploy live updates...
ssh %VPS_USER%@%VPS_HOST% "cd /var/www/quran_portal && chmod +x update_live.sh && ./update_live.sh"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =======================================================
    echo 🎉 REMOTE DEPLOYMENT SUCCESSFUL!
    echo 🌐 Website: https://maktabatulmuslim.com (or http://%VPS_HOST%)
    echo =======================================================
) else (
    echo.
    echo ❌ Remote deploy via SSH encountered an error.
)

pause
