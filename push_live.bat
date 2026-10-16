@echo off
setlocal enabledelayedexpansion

echo =======================================================
echo 🚀 Maktab tul Muslim - Live Git Push & Build Script
echo =======================================================

:: 1. Navigate to frontend & build production assets
echo.
echo 📦 [1/4] Building React Frontend for Production...
cd /d "%~dp0frontend"
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Frontend build failed! Aborting push.
    pause
    exit /b %ERRORLEVEL%
)

:: 2. Return to root directory and stage all changes
cd /d "%~dp0"
echo.
echo 📂 [2/4] Staging all files for Git...
git add .

:: 3. Commit with custom or default message
echo.
set /p COMMIT_MSG="💬 Enter commit message (Press Enter for auto timestamp): "
if "%COMMIT_MSG%"=="" (
    for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value 2^>nul') do set datetime=%%I
    if "!datetime!"=="" (
        set COMMIT_MSG=Live update %date% %time%
    ) else (
        set COMMIT_MSG=Live update !datetime:~0,4!-!datetime:~4,2!-!datetime:~6,2! !datetime:~8,2!:!datetime:~10,2!
    )
)

echo.
echo 📝 [3/4] Committing: "%COMMIT_MSG%"...
git commit -m "%COMMIT_MSG%"

:: 4. Push to GitHub main branch
echo.
echo 🚀 [4/4] Pushing to GitHub (origin main)...
git push origin main
if %ERRORLEVEL% EQU 0 (
    echo.
    echo =======================================================
    echo ✅ SUCCESS! Code pushed to GitHub live repository.
    echo 🌐 Repo: https://github.com/Muhammad3055/React-new-project
    echo =======================================================
) else (
    echo.
    echo ❌ Git push failed! Please check your network or credentials.
)

pause
