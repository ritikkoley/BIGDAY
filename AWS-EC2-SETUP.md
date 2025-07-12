# AWS EC2 Setup Guide for BIG DAY Backend

## 🚀 Step-by-Step EC2 Deployment

### 1. Create EC2 Instance

1. **Login to AWS Console**
   - Go to [AWS Console](https://console.aws.amazon.com/)
   - Navigate to EC2 Dashboard

2. **Launch Instance**
   - Click "Launch Instance"
   - **Name**: `bigday-backend-server`
   - **AMI**: Ubuntu Server 22.04 LTS (Free tier eligible)
   - **Instance Type**: t2.micro (Free tier) or t3.small (Recommended)
   - **Key Pair**: Create new or use existing
   - **Security Group**: Create with these rules:
     - SSH (22) - Your IP only
     - HTTP (80) - Anywhere (0.0.0.0/0)
     - HTTPS (443) - Anywhere (0.0.0.0/0)
     - Custom TCP (3001) - Anywhere (for API)

3. **Launch Instance**
   - Review and launch
   - Download key pair if new

### 2. Connect to EC2 Instance

```bash
# Make key file secure
chmod 400 your-key.pem

# Connect to instance
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### 3. Deploy Backend

```bash
# Upload your backend code
scp -i your-key.pem -r ./backend ubuntu@your-ec2-ip:~/

# Connect to server
ssh -i your-key.pem ubuntu@your-ec2-ip

# Run deployment script
cd backend
chmod +x deploy-to-ec2.sh
./deploy-to-ec2.sh
```

### 4. Configure Environment

```bash
# Edit environment file
nano .env

# Add your configuration:
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-domain.com
JWT_SECRET=your-super-secret-jwt-key
MONGODB_URI=mongodb://localhost:27017/bigday
```

### 5. Set Up SSL (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 6. Configure Firewall

```bash
# Enable UFW
sudo ufw enable

# Allow necessary ports
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 3001

# Check status
sudo ufw status
```

### 7. Set Up Monitoring

```bash
# Install htop for monitoring
sudo apt install htop

# Monitor PM2 processes
pm2 monit

# Set up log rotation
pm2 install pm2-logrotate
```

## 🔧 Useful Commands

### PM2 Management
```bash
# Check status
pm2 status

# View logs
pm2 logs

# Restart app
pm2 restart bigday-backend

# Stop app
pm2 stop bigday-backend

# Delete app
pm2 delete bigday-backend
```

### Nginx Management
```bash
# Check status
sudo systemctl status nginx

# Restart Nginx
sudo systemctl restart nginx

# Test configuration
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### MongoDB Management
```bash
# Check status
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Connect to MongoDB
mongosh

# View logs
sudo tail -f /var/log/mongodb/mongod.log
```

## 🌐 Frontend Configuration

Update your frontend to use the backend API:

```javascript
// In your frontend .env file
VITE_API_BASE_URL=https://your-ec2-domain.com/api
# or
VITE_API_BASE_URL=http://your-ec2-ip:3001/api
```

## 📊 Health Checks

Your backend includes a health check endpoint:

```bash
# Check if backend is running
curl http://your-ec2-ip:3001/health

# Should return:
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

## 🔒 Security Best Practices

1. **Keep system updated**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Use strong passwords and keys**
3. **Enable fail2ban**
   ```bash
   sudo apt install fail2ban
   ```

4. **Regular backups**
   ```bash
   # Backup MongoDB
   mongodump --out /backup/$(date +%Y%m%d)
   ```

5. **Monitor logs regularly**
   ```bash
   # Check system logs
   sudo journalctl -f
   
   # Check application logs
   pm2 logs
   ```

## 🚨 Troubleshooting

### Common Issues:

1. **Port 3001 not accessible**
   - Check security group rules
   - Verify firewall settings
   - Ensure app is running: `pm2 status`

2. **Nginx 502 Bad Gateway**
   - Check if backend is running
   - Verify proxy configuration
   - Check Nginx error logs

3. **MongoDB connection issues**
   - Ensure MongoDB is running: `sudo systemctl status mongod`
   - Check connection string in .env
   - Verify MongoDB logs

4. **SSL certificate issues**
   - Verify domain DNS settings
   - Check Certbot logs
   - Ensure ports 80/443 are open

## 💰 Cost Optimization

1. **Use t2.micro for development** (Free tier)
2. **t3.small for production** (~$15/month)
3. **Set up CloudWatch alarms** for monitoring
4. **Use Elastic IP** to avoid IP changes
5. **Regular snapshots** for backups

## 📈 Scaling Options

1. **Vertical Scaling**: Upgrade instance type
2. **Horizontal Scaling**: Use Load Balancer + Auto Scaling
3. **Database**: Move to MongoDB Atlas or RDS
4. **CDN**: Use CloudFront for static assets
5. **Caching**: Add Redis for session management

Your backend is now ready for production! 🎉