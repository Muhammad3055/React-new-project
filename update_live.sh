#!/bin/bash
# ==============================================================================
# Live Server Fast Update Script (Zero Downtime)
# Run on VPS: /var/www/quran_portal/update_live.sh
# Usage: ./update_live.sh
# ==============================================================================

set -e

PROJECT_DIR="/var/www/quran_portal"

echo "======================================================="
echo "🔄 Updating Maktab tul Muslim Live Website..."
echo "======================================================="

cd $PROJECT_DIR

# 1. Pull latest code from GitHub
echo "📥 [1/5] Pulling latest code from GitHub main..."
git pull origin main

# 2. Update Python backend dependencies & migrations
echo "🐍 [2/5] Running Backend Migrations & Static Collection..."
cd $PROJECT_DIR/backend
if [ -d "venv" ]; then
    source venv/bin/activate
fi
pip install -r requirements.txt --quiet || true
python manage.py migrate --noinput
python manage.py collectstatic --noinput

# 3. Rebuild React Frontend
echo "⚛️ [3/5] Building React Frontend Production Assets..."
cd $PROJECT_DIR/frontend
npm install --quiet || true
npm run build

# 4. Restart Services
echo "🔄 [4/5] Restarting Gunicorn & Nginx Services..."
sudo systemctl restart gunicorn_quran
sudo systemctl reload nginx

# 5. Done
echo ""
echo "======================================================="
echo "🎉 LIVE UPDATE COMPLETE!"
echo "🌐 Website: https://maktabatulmuslim.com"
echo "======================================================="
