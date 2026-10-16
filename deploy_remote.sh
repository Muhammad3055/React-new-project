#!/bin/bash
# ==============================================================================
# All-In-One Push to GitHub + Remote SSH Deploy
# Usage: ./deploy_remote.sh [VPS_IP] [VPS_USER]
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

CONFIG_FILE="$SCRIPT_DIR/.vps_config"

VPS_HOST="$1"
VPS_USER="$2"

if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE" || true
fi

if [ -z "$VPS_HOST" ]; then
    read -p "🌐 Enter your VPS IP Address or Domain: " VPS_HOST
fi

if [ -z "$VPS_USER" ]; then
    read -p "👤 Enter SSH Username (Default: root): " VPS_USER
    VPS_USER="${VPS_USER:-root}"
fi

# Save config for future runs
cat <<EOT > "$CONFIG_FILE"
VPS_HOST=$VPS_HOST
VPS_USER=$VPS_USER
EOT

# 1. Build and push code locally
echo ""
echo "📦 [1/2] Building and Pushing to GitHub..."
bash "$SCRIPT_DIR/push_live.sh" "Automated remote deploy $(date '+%Y-%m-%d %H:%M:%S')"

# 2. Remote SSH into server to execute update_live.sh
echo ""
echo "📡 [2/2] Connecting via SSH to $VPS_USER@$VPS_HOST to update live site..."
ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" "cd /var/www/quran_portal && chmod +x update_live.sh && ./update_live.sh"

echo ""
echo "======================================================="
echo "🎉 DEPLOYMENT COMPLETE! LIVE SITE UPDATED!"
echo "🌐 Website: https://maktabatulmuslim.com (or http://$VPS_HOST)"
echo "======================================================="
