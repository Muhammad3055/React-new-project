#!/bin/bash
# ==============================================================================
# Fast Local Push Script for Maktab tul Muslim
# Builds production React bundle, commits, and pushes to GitHub main
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "======================================================="
echo "🚀 Maktab tul Muslim - Live Git Push & Build"
echo "======================================================="

# 1. Build React Frontend
echo ""
echo "📦 [1/4] Building React Frontend for Production..."
cd "$SCRIPT_DIR/frontend"
npm run build
cd "$SCRIPT_DIR"

# 2. Stage all changed files
echo ""
echo "📂 [2/4] Staging all files for Git..."
git add .

# 3. Commit with custom or timestamped message
COMMIT_MSG="$1"
if [ -z "$COMMIT_MSG" ]; then
    read -p "💬 Enter commit message (Press Enter for auto timestamp): " input_msg
    COMMIT_MSG="$input_msg"
fi

if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Live update $(date '+%Y-%m-%d %H:%M:%S')"
fi

echo ""
echo "📝 [3/4] Committing: \"$COMMIT_MSG\"..."
git commit -m "$COMMIT_MSG" || {
    echo "ℹ️ Nothing new to commit."
}

# 4. Push to GitHub main
echo ""
echo "🚀 [4/4] Pushing to GitHub origin main..."
git push origin main

echo ""
echo "======================================================="
echo "🎉 SUCCESS! All changes pushed to GitHub."
echo "🌐 Repo: https://github.com/Muhammad3055/React-new-project"
echo "======================================================="
