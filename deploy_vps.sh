#!/bin/bash
# ==============================================================================
# Automated VPS Deployment Script for React + Django Quran Portal
# OS: Ubuntu 20.04 / 22.04 / 24.04 LTS
# ==============================================================================

set -e

echo "🚀 Starting Deployment of Quran Portal on Live VPS..."

# 1. System Updates & Install Dependencies
echo "📦 Installing System Packages (Python 3, Nginx, PostgreSQL, Node.js, Certbot)..."
sudo apt update -y
sudo apt upgrade -y
sudo apt install -y python3-pip python3-venv postgresql postgresql-contrib nginx git certbot python3-certbot-nginx curl

# Install Node.js 20 LTS if not present
if ! command -v node &> /dev/null; then
    echo "🟢 Installing Node.js LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# 2. Database Setup (PostgreSQL)
echo "🗄️ Setting up PostgreSQL Database..."
sudo -u postgres psql -c "CREATE DATABASE quran_db;" || true
sudo -u postgres psql -c "CREATE USER quran_user WITH PASSWORD 'quran_db_secure_pass_2026';" || true
sudo -u postgres psql -c "ALTER ROLE quran_user SET client_encoding TO 'utf8';" || true
sudo -u postgres psql -c "ALTER ROLE quran_user SET default_transaction_isolation TO 'read committed';" || true
sudo -u postgres psql -c "ALTER ROLE quran_user SET timezone TO 'UTC';" || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE quran_db TO quran_user;" || true

# 3. Setup Project Directory
PROJECT_DIR="/var/www/quran_portal"
echo "📂 Setting up project in $PROJECT_DIR..."

if [ ! -d "$PROJECT_DIR" ]; then
    echo "📥 Cloning project from GitHub..."
    sudo git clone https://github.com/Muhammad3055/React-new-project.git $PROJECT_DIR
fi

sudo chown -R $USER:$USER $PROJECT_DIR
cd $PROJECT_DIR

# Pull latest changes
git pull origin main

# 4. Django Backend Environment & Dependencies
echo "🐍 Setting up Python Virtual Environment..."
cd $PROJECT_DIR/backend
python3 -m venv venv
source venv/bin/venv/activate || source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Create .env for Backend
cat <<EOT > .env
DEBUG=False
SECRET_KEY=vps-production-super-secret-key-$(openssl rand -hex 16)
ALLOWED_HOSTS=*
DATABASE_URL=postgres://quran_user:quran_db_secure_pass_2026@localhost:5432/quran_db
EOT

# Run Migrations, Collectstatic, and Seed Data
echo "⚙️ Running Database Migrations & Static Files Collection..."
python manage.py migrate --noinput
python manage.py collectstatic --noinput
python manage.py seed_data || true

# Create Admin Superuser if needed
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@example.com', 'AdminPass123!')" | python manage.py shell

# 5. Build React Frontend
echo "⚛️ Building React Frontend Static Assets..."
cd $PROJECT_DIR/frontend
npm install
npm run build

# 6. Setup Gunicorn Systemd Service
echo "🔧 Configuring Gunicorn Service..."
sudo cat <<EOT | sudo tee /etc/systemd/system/gunicorn_quran.service
[Unit]
Description=Gunicorn daemon for Django Quran Portal
After=network.target

[Service]
User=$USER
Group=www-data
WorkingDirectory=$PROJECT_DIR/backend
ExecStart=$PROJECT_DIR/backend/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:8000 quran_project.wsgi:application

[Install]
WantedBy=multi-user.target
EOT

sudo systemctl daemon-reload
sudo systemctl restart gunicorn_quran
sudo systemctl enable gunicorn_quran

# 7. Configure Nginx Web Server
echo "🌐 Configuring Nginx Reverse Proxy..."
sudo cat <<EOT | sudo tee /etc/nginx/sites-available/quran_portal
server {
    listen 80;
    server_name _;

    client_max_body_size 100M;

    # Serve React Frontend Build
    location / {
        root $PROJECT_DIR/frontend/dist;
        try_files \$uri \$uri/ /index.html;
    }

    # Proxy Django API & Admin Requests
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /admin/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Static & Media Files
    location /static/ {
        alias $PROJECT_DIR/backend/staticfiles/;
    }

    location /media/ {
        alias $PROJECT_DIR/backend/media/;
    }
}
EOT

sudo ln -sf /etc/nginx/sites-available/quran_portal /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo "✅ Deployment Successful! Your website is live on your VPS IP address!"
echo "📍 Access Backend Admin: http://YOUR_VPS_IP/admin/ (user: admin / pass: AdminPass123!)"
echo "🔒 To add free SSL certificate (HTTPS), run: sudo certbot --nginx -d yourdomain.com"
