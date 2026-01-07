#!/bin/bash

# Vultr/Ubuntu Setup Script for imoves
# Usage:
# 1. Create a new Instance on Vultr (Ubuntu 24.04 or 22.04)
# 2. Paste this entire script into the "Startup Script" (User Data) section optional
#    OR run it efficiently as root after logging in.

LOG_FILE="/var/log/imoves_setup.log"
exec > >(tee -a $LOG_FILE) 2>&1

echo "--- Starting Setup $(date) ---"

# 1. Update System
echo "--- Updating System ---"
apt-get update && apt-get upgrade -y

# 2. Install Dependencies
echo "--- Installing Dependencies ---"
apt-get install -y nginx git curl certbot python3-certbot-nginx

# 3. Install Node.js (Latest LTS)
echo "--- Installing Node.js ---"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 4. Clone Repository
REPO_URL="https://github.com/mchaitanya1118/imoves.git"
APP_DIR="/var/www/imoves"

if [ -d "$APP_DIR" ]; then
    echo "Directory exists, pulling changes..."
    cd $APP_DIR
    git pull
else
    echo "Cloning repository..."
    git clone $REPO_URL $APP_DIR
    cd $APP_DIR
fi

# 5. Build Application
echo "--- Building Application ---"
npm install
npm run build

# 6. Configure Nginx
echo "--- Configuring Nginx ---"
cat > /etc/nginx/sites-available/imoves <<EOF
server {
    listen 80;
    server_name _;  # Accepts any IP/Domain until configured

    root $APP_DIR;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
EOF

# Enable Site
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/imoves /etc/nginx/sites-enabled/

# 7. Restart Nginx
systemctl restart nginx

# 8. Firewall Setup (UFW)
echo "--- Configuring Firewall ---"
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw --force enable

echo "--- Setup Complete $(date) ---"
echo "Your site should be live at http://$(curl -s ifconfig.me)"
