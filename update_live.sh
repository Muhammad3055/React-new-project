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

# 4. Sync Nginx Web Server Configuration
if [ -f "$PROJECT_DIR/nginx.conf" ]; then
    echo "🌐 [4/5] Applying updated Nginx configuration..."
    sudo cp "$PROJECT_DIR/nginx.conf" /etc/nginx/sites-available/quran_portal
    sudo ln -sf /etc/nginx/sites-available/quran_portal /etc/nginx/sites-enabled/quran_portal
    sudo rm -f /etc/nginx/sites-enabled/default
fi

# 5. Restart & Reload Services
echo "🔄 [5/5] Restarting Gunicorn & Reloading Nginx..."
sudo systemctl daemon-reload || true
sudo systemctl restart gunicorn_quran || sudo systemctl restart gunicorn || true
sudo nginx -t && sudo systemctl reload nginx

# 5. Done
echo ""
echo "======================================================="
echo "🎉 LIVE UPDATE COMPLETE!"
echo "🌐 Website: https://maktabatulmuslim.com"
echo "======================================================="
