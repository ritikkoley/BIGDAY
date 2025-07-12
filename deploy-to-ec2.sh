#!/bin/bash

# BIG DAY Backend Deployment Script for AWS EC2
# Run this script on your EC2 instance

set -e

echo "🚀 Starting BIG DAY Backend Deployment..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt install -y nginx

# Install MongoDB (optional - you can use MongoDB Atlas instead)
echo "📦 Installing MongoDB..."
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/bigday-backend
sudo chown -R $USER:$USER /var/www/bigday-backend

# Clone or copy your backend code here
# For now, we'll assume the code is already in the current directory
echo "📋 Copying backend files..."
cp -r . /var/www/bigday-backend/
cd /var/www/bigday-backend

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Create logs directory
mkdir -p logs

# Create environment file
echo "⚙️ Creating environment file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration"
fi

# Configure Nginx
echo "🌐 Configuring Nginx..."
sudo tee /etc/nginx/sites-available/bigday-backend > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/bigday-backend /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Start services
echo "🚀 Starting services..."
sudo systemctl restart nginx
sudo systemctl enable nginx

# Start the application with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "✅ Deployment completed!"
echo "🌐 Your backend should be running on http://your-server-ip"
echo "📊 Check status with: pm2 status"
echo "📝 View logs with: pm2 logs"
echo ""
echo "⚠️  Don't forget to:"
echo "   1. Update .env file with your configuration"
echo "   2. Configure your domain in Nginx config"
echo "   3. Set up SSL certificate (Let's Encrypt recommended)"
echo "   4. Configure firewall (UFW)"
echo "   5. Set up monitoring and backups"