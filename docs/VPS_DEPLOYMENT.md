# AlikoHub VPS Deployment

This document provides complete instructions for deploying AlikoHub microservices to a VPS server.

## Prerequisites

- **VPS Requirements:**
  - Ubuntu 22.04 LTS or Debian 12 (recommended)
  - Minimum 2GB RAM (4GB recommended)
  - 20GB SSD storage
  - SSH access with root privileges

- **Domain Configuration:**
  - Point your API subdomain (e.g., `api.alikohub.com`) to your VPS IP address
  - Configure DNS A records before running SSL setup

- **Database:**
  - PostgreSQL 15+ (can be installed on the same VPS or use a managed service)
  - RabbitMQ (optional, for event-driven features)

## Quick Start

### 1. Connect to Your VPS

```bash
ssh root@your-vps-ip
```

### 2. Download and Run Deployment Script

```bash
# Download the deployment script
curl -O https://raw.githubusercontent.com/nattisam/alikohub-v2/dist-deploy/scripts/deploy-vps.sh

# Make it executable
chmod +x deploy-vps.sh

# Run the deployment
./deploy-vps.sh
```

### 3. Configure Environment

```bash
cd /opt/alikohub

# Copy the template
cp .env.production .env

# Edit with your values
nano .env
```

**Important:** Update the following in `.env`:
- Database credentials (`AUTH_DATABASE_URL`, etc.)
- `JWT_SECRET` (generate a secure random string)
- Firebase credentials
- SMTP settings (for emails)

### 4. Set Up PostgreSQL

```bash
# Install PostgreSQL
apt install postgresql postgresql-contrib -y

# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE alikohub;
CREATE USER alikohub_user WITH ENCRYPTED PASSWORD 'your-strong-password';
GRANT ALL PRIVILEGES ON DATABASE alikohub TO alikohub_user;

# Grant schema creation privileges
\c alikohub
GRANT ALL ON SCHEMA public TO alikohub_user;
GRANT CREATE ON DATABASE alikohub TO alikohub_user;
\q
```

### 5. Run Database Migrations

```bash
cd /opt/alikohub
sudo -u alikohub npm run sync
```

### 6. Configure Nginx

```bash
# Copy the nginx configuration
cp /opt/alikohub/scripts/nginx.conf /etc/nginx/sites-available/alikohub

# Edit the configuration (update domain names)
nano /etc/nginx/sites-available/alikohub

# Enable the site
ln -s /etc/nginx/sites-available/alikohub /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Reload nginx
systemctl reload nginx
```

### 7. Set Up SSL with Let's Encrypt

```bash
certbot --nginx -d api.alikohub.com
```

### 8. Restart Services

```bash
sudo -u alikohub pm2 restart all
```

## PM2 Commands Reference

```bash
# View all running services
pm2 list

# View logs for all services
pm2 logs

# View logs for specific service
pm2 logs api-gateway

# Restart all services
pm2 restart all

# Restart specific service
pm2 restart auth-service

# Stop all services
pm2 stop all

# Monitor CPU/Memory usage
pm2 monit

# View detailed info about a service
pm2 show api-gateway
```

## Directory Structure

```
/opt/alikohub/
├── .env                    # Environment configuration
├── ecosystem.config.cjs    # PM2 configuration
├── start-all.js           # Development startup script
├── domains/
│   ├── academy/backend/
│   ├── con-tech/backend/
│   ├── events/backend/
│   └── core-platform-services/
│       ├── api-gateway-service/
│       ├── auth-service/
│       ├── careers-service/
│       └── file-upload-service/
└── scripts/
    ├── deploy-vps.sh
    └── nginx.conf
```

## Service Ports

| Service | HTTP Port | TCP Port |
|---------|-----------|----------|
| API Gateway | 3006 | - |
| Auth Service | 3001 | 3011 |
| Academy | 3005 | 3005 |
| ConTech | 3002 | 3002 |
| Events | 3004 | 3004 |
| Careers | 3008 | 3008 |
| File Upload | 3009 | - |

## Updating the Application

```bash
cd /opt/alikohub

# Pull latest changes
sudo -u alikohub git pull origin dist-deploy

# Install new dependencies
sudo -u alikohub npm install

# Rebuild all services (uses start-all.js)
sudo -u alikohub npm run build

# Restart PM2
sudo -u alikohub pm2 restart all

# Or use the deployment script for full rebuild
./scripts/deploy-vps.sh
```

## Monitoring & Logs

### View Application Logs
```bash
# All services
pm2 logs

# Specific service
pm2 logs api-gateway --lines 100
```

### View Nginx Logs
```bash
tail -f /var/log/nginx/alikohub_access.log
tail -f /var/log/nginx/alikohub_error.log
```

### System Resources
```bash
# PM2 monitoring
pm2 monit

# System overview
htop
```

## Backup Strategy

### Database Backup
```bash
# Create backup
pg_dump -U alikohub_user alikohub > /backup/alikohub_$(date +%Y%m%d).sql

# Restore from backup
psql -U alikohub_user alikohub < /backup/alikohub_20260101.sql
```

### Automated Backup (Cron)
```bash
# Edit crontab
crontab -e

# Add daily backup at 3 AM
0 3 * * * pg_dump -U alikohub_user alikohub > /backup/alikohub_$(date +\%Y\%m\%d).sql
```

## Troubleshooting

### Service Won't Start
```bash
# Check PM2 logs for errors
pm2 logs <service-name>

# Check if port is already in use
netstat -tulpn | grep <port>

# Verify environment variables are loaded
cat /opt/alikohub/.env
```

### Database Connection Issues
```bash
# Test PostgreSQL connection
psql -h localhost -U alikohub_user -d alikohub

# Check PostgreSQL is running
systemctl status postgresql

# View PostgreSQL logs
tail -f /var/log/postgresql/postgresql-15-main.log
```

### Nginx Issues
```bash
# Test configuration
nginx -t

# Check Nginx status
systemctl status nginx

# View Nginx logs
tail -f /var/log/nginx/error.log
```

## Security Recommendations

1. **Firewall:** Only expose ports 22 (SSH), 80, and 443
2. **SSH:** Disable password authentication, use SSH keys only
3. **Updates:** Enable automatic security updates
4. **Fail2ban:** Install and configure to prevent brute-force attacks
5. **Database:** Use strong passwords and restrict network access

```bash
# Install fail2ban
apt install fail2ban -y
systemctl enable fail2ban
systemctl start fail2ban

# Enable automatic security updates
apt install unattended-upgrades -y
dpkg-reconfigure unattended-upgrades
```
