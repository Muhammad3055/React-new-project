# 🚀 Complete Live VPS Deployment Guide (React + Django)

This guide walks you through deploying your **Quran Portal (React SPA + Django REST API + PostgreSQL)** on any **Live VPS** (Ubuntu 20.04 / 22.04 / 24.04 LTS) such as **DigitalOcean, AWS EC2, Hetzner, Contabo, Linode, or Vultr**.

---

## ⚡ Method 1: One-Click Automated Script (Recommended)

Log into your VPS via SSH and run this command:

```bash
curl -sSL https://raw.githubusercontent.com/Muhammad3055/React-new-project/main/deploy_vps.sh | bash
```

Or step-by-step:

```bash
# 1. SSH into your VPS
ssh root@YOUR_VPS_IP

# 2. Download deployment script
git clone https://github.com/Muhammad3055/React-new-project.git /var/www/quran_portal
cd /var/www/quran_portal

# 3. Make script executable and run it
chmod +x deploy_vps.sh
./deploy_vps.sh
```

---

## 🛠 Method 2: Manual Step-by-Step VPS Setup

### Step 1: Install System Packages
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3-pip python3-venv postgresql postgresql-contrib nginx git certbot python3-certbot-nginx curl
```

### Step 2: Configure PostgreSQL Database
```bash
sudo -u postgres psql
```
Inside PostgreSQL prompt:
```sql
CREATE DATABASE quran_db;
CREATE USER quran_user WITH PASSWORD 'quran_db_secure_pass_2026';
ALTER ROLE quran_user SET client_encoding TO 'utf8';
ALTER ROLE quran_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE quran_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE quran_db TO quran_user;
\q
```

### Step 3: Setup Backend Virtual Environment & Migrations
```bash
cd /var/www/quran_portal/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env file
nano .env
```
Paste this into `.env`:
```ini
DEBUG=False
SECRET_KEY=your-production-secret-key
ALLOWED_HOSTS=*
DATABASE_URL=postgres://quran_user:quran_db_secure_pass_2026@localhost:5432/quran_db
```
Then run migrations & static collection:
```bash
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py seed_data
python manage.py createsuperuser
```

### Step 4: Build React Frontend Assets
```bash
cd /var/www/quran_portal/frontend
npm install
npm run build
```

### Step 5: Setup Gunicorn Service
```bash
sudo nano /etc/systemd/system/gunicorn_quran.service
```
Paste:
```ini
[Unit]
Description=Gunicorn daemon for Django Quran Portal
After=network.target

[Service]
User=root
Group=www-data
WorkingDirectory=/var/www/quran_portal/backend
ExecStart=/var/www/quran_portal/backend/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:8000 quran_project.wsgi:application

[Install]
WantedBy=multi-user.target
```
Enable & Start Service:
```bash
sudo systemctl daemon-reload
sudo systemctl restart gunicorn_quran
sudo systemctl enable gunicorn_quran
```

### Step 6: Configure Nginx Reverse Proxy
```bash
sudo nano /etc/nginx/sites-available/quran_portal
```
Paste:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com; # Replace with your domain or VPS IP

    client_max_body_size 100M;

    # Serve React Frontend App
    location / {
        root /var/www/quran_portal/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Gunicorn
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Proxy Django Admin requests to Gunicorn
    location /admin/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Serve Django Static & Media Uploads
    location /static/ {
        alias /var/www/quran_portal/backend/staticfiles/;
    }

    location /media/ {
        alias /var/www/quran_portal/backend/media/;
    }
}
```
Enable & Test Nginx:
```bash
sudo ln -sf /etc/nginx/sites-available/quran_portal /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 Step 7: Free SSL Certificate (HTTPS)

To secure your website with a free HTTPS certificate from Let's Encrypt:

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🔄 Updating your VPS Site on New Git Pushes

Whenever you update your code and push to GitHub, run this simple command on your VPS:

```bash
cd /var/www/quran_portal
git pull origin main
cd backend && source venv/bin/activate && python manage.py migrate && python manage.py collectstatic --noinput
cd ../frontend && npm install && npm run build
sudo systemctl restart gunicorn_quran
sudo systemctl restart nginx
```
