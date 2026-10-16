<#
.SYNOPSIS
    Automated Build, Commit, and Push script for Maktab tul Muslim
.DESCRIPTION
    Runs npm run build, stages all files, creates a commit, and pushes to GitHub main.
.EXAMPLE
    .\push_live.ps1 -Message "Updated features"
#>

param (
    [string]$Message = ""
)

$ErrorActionPreference = "Stop"

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "🚀 Maktab tul Muslim - Live Push (PowerShell Automation)" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan

$scriptRoot = $PSScriptRoot

# 1. Build Frontend
Write-Host "`n📦 [1/4] Building React Frontend..." -ForegroundColor Cyan
Set-Location -Path "$scriptRoot\frontend"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Aborting push." -ForegroundColor Red
    Set-Location -Path $scriptRoot
    exit 1
}

# 2. Stage All Changes
Set-Location -Path $scriptRoot
Write-Host "`n📂 [2/4] Staging all files..." -ForegroundColor Cyan
git add .

# 3. Commit
if ([string]::IsNullOrWhiteSpace($Message)) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    $inputMsg = Read-Host "💬 Enter commit message (Press Enter for 'Live update $timestamp')"
    if ([string]::IsNullOrWhiteSpace($inputMsg)) {
        $Message = "Live update $timestamp"
    } else {
        $Message = $inputMsg
    }
}

Write-Host "`n📝 [3/4] Committing with message: '$Message'..." -ForegroundColor Cyan
try {
    git commit -m "$Message"
} catch {
    Write-Host "ℹ️ Nothing new to commit, proceeding to push." -ForegroundColor Gray
}

# 4. Push to GitHub
Write-Host "`n🚀 [4/4] Pushing to GitHub (origin main)..." -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=======================================================" -ForegroundColor Green
    Write-Host "✅ SUCCESS! Code pushed to GitHub live repository." -ForegroundColor Green
    Write-Host "🌐 Repo: https://github.com/Muhammad3055/React-new-project" -ForegroundColor Yellow
    Write-Host "=======================================================" -ForegroundColor Green
} else {
    Write-Host "`n❌ Push failed! Please check your network connection." -ForegroundColor Red
}
