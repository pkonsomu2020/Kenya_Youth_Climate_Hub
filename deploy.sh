#!/bin/bash

# Exit immediately if any command returns a non-zero exit code
set -e

echo "=================================================="
echo "🚀 STARTING DEPLOYMENT"
echo "=================================================="

# 1. Reset file ownership to the current active user
echo "🔒 Fixing local file permissions..."
sudo chown -R $(whoami):$(whoami) .

# 2. Pull the latest code
echo "📥 Pulling latest changes from git..."
git pull origin main

# 3. Build the Next.js application (Runs as the local user, NOT root/sudo)
echo "🏗️ Building production Next.js assets..."
npm run build

# 4. Restart PM2 to clean memory cache and serve the new assets
echo "🔄 Restarting server process in PM2..."
if pm2 list | grep -q "kych-admin"; then
  pm2 restart kych-admin
  echo "✅ PM2 process 'kych-admin' restarted successfully."
elif sudo pm2 list | grep -q "kych-admin"; then
  sudo pm2 restart kych-admin
  echo "✅ PM2 process 'kych-admin' restarted successfully (via sudo)."
else
  echo "⚠️ PM2 process 'kych-admin' was not found."
  echo "🔄 Attempting to restart all processes..."
  pm2 restart all || sudo pm2 restart all || echo "❌ Failed to restart PM2 automatically. Please restart it manually."
fi

echo "=================================================="
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "=================================================="
