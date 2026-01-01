# Rivaya Deployment Guide

This guide assumes you have a fresh Ubuntu 24.04 VPS.

## Step 1: Initial Setup (On VPS)
Upload and run the setup script to install all dependencies.

```bash
# Verify you are root
whoami
# Should say 'root'

# Run the setup script (copy contents of setup_vps.sh to a file on your server)
nano setup_vps.sh
# Paste content, save (Ctrl+O, Enter) and exit (Ctrl+X)

chmod +x setup_vps.sh
./setup_vps.sh
```

## Step 2: Deploy Code
navigate to the web directory and pull your code.

```bash
mkdir -p /var/www/rivaya/html
cd /var/www/rivaya/html

# Clone your repo (if you haven't already, or pull latest)
git clone https://github.com/aryantuntune/Rivaya-Ecommerce.git .
# OR if already cloned:
# git pull origin main
```

## Step 3: Backend Setup

```bash
cd server
npm install

# Create .env file
nano .env
```
Paste your production variables into `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rivaya
JWT_SECRET=your_super_secret_production_key
JWT_EXPIRE=30d
NODE_ENV=production
```

Start the backend with PM2:
```bash
pm2 start index.js --name rivaya-backend
pm2 save
```

## Step 4: Frontend Setup

```bash
cd /var/www/rivaya/html
npm install
npm run build
```
This will create a `dist` folder.

## Step 5: Nginx Configuration

Create a new Nginx config:
```bash
nano /etc/nginx/sites-available/rivaya
```

Paste this content (Replace `your_domain.com` with your actual domain or IP):

```nginx
server {
    listen 80;
    server_name rivayaonline.in www.rivayaonline.in _; # '_' allows access via IP

    root /var/www/rivaya/html/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
ln -s /etc/nginx/sites-available/rivaya /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

## Step 6: SSL (Optional, requires Domain)
If you have a domain pointed to this server:

```bash
certbot --nginx -d rivayaonline.in -d www.rivayaonline.in
```

## Troubleshooting
- Check PM2 logs: `pm2 logs rivaya-backend`
- Check Nginx logs: `tail -f /var/log/nginx/error.log`
