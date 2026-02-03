#!/bin/bash

echo "🚀 Starting Railway Auto-Deployment Setup..."

# Check if Railway CLI is available
if ! command -v railway &> /dev/null; then
    echo "⚠️  Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Ensure git is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Staging changes for deployment..."
    git add .
    git commit -m "Auto-deploy: Railway configuration setup

✅ Added railway.json for deployment configuration
✅ Added GitHub Actions workflow for auto-deploy  
✅ Enhanced nixpacks.toml configuration
🎯 GOAL: Enable automatic Railway deployment on git push

ENTERPRISE-LEVEL AUTO-DEPLOYMENT ACTIVATED"
fi

# Push to trigger deployment
echo "🚀 Pushing to main branch to trigger Railway deployment..."
git push origin main

echo "✅ Auto-deployment configuration complete!"
echo "🎯 Future commits to main branch will automatically deploy to Railway"