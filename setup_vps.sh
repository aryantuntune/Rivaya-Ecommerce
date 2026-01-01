#!/bin/bash

# Rivaya VPS Setup Script for Ubuntu 24.04
# Run as root

set -e

echo "----------------------------------------------------------------"
echo "Starting Rivaya VPS Setup..."
echo "----------------------------------------------------------------"

# 1. Update System
echo "[1/6] Updating System..."
apt update && apt upgrade -y
apt install -y curl git ufw build-essential

# 2. Configure Firewall (UFW)
echo "[2/6] Configuring Firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
ufw status

# 3. Install Node.js 20 LTS
echo "[3/6] Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v
npm -v

# 4. Install MongoDB 7.0 (Community)
echo "[4/6] Installing MongoDB..."
apt install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod
systemctl status mongod --no-pager

# 5. Install Nginx & Certbot
echo "[5/6] Installing Nginx & Certbot..."
apt install -y nginx certbot python3-certbot-nginx
systemctl start nginx
systemctl enable nginx

# 6. Install PM2
echo "[6/6] Installing PM2..."
npm install -g pm2
pm2 startup systemd

echo "----------------------------------------------------------------"
echo "Setup Complete!"
echo "Next Steps:"
echo "1. Clone your repo to /var/www/rivaya"
echo "2. Setup .env file"
echo "3. Run 'npm install' in server and root"
echo "4. Build frontend: 'npm run build'"
echo "5. Configure Nginx sites-available"
echo "----------------------------------------------------------------"
