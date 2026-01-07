#!/bin/bash

# Railway Environment Setup Script
# Run this to configure Resend email for production deployment

echo "🚀 Configuring Railway Environment Variables for Resend Email"
echo "=============================================================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "⚠️  Railway CLI not installed"
    echo ""
    echo "Install Railway CLI:"
    echo "npm install -g @railway/cli"
    echo ""
    echo "Then run: railway login"
    echo ""
    exit 1
fi

echo "✅ Railway CLI detected"
echo ""

# Link to project (if not already linked)
echo "📡 Linking to Railway project..."
railway link

# Set environment variables
echo ""
echo "🔧 Setting environment variables..."
echo ""

# Resend API Key
echo "Setting RESEND_API_KEY..."
railway variables set RESEND_API_KEY="re_SJntBLZa_L8XYtMQarjrfh3Z3SF3T5KK3"

# From Email (CHANGE THIS after verifying your domain in Resend)
echo "Setting FROM_EMAIL..."
railway variables set FROM_EMAIL="onboarding@resend.dev"

# From Name
echo "Setting FROM_NAME..."
railway variables set FROM_NAME="Khesed-tek Church Management Systems"

echo ""
echo "✅ Environment variables set successfully!"
echo ""
echo "⚠️  IMPORTANT NEXT STEPS:"
echo ""
echo "1. Verify your domain in Resend dashboard:"
echo "   https://resend.com/domains"
echo ""
echo "2. After domain verification, update FROM_EMAIL:"
echo "   railway variables set FROM_EMAIL=\"onboarding@khesed-tek.com\""
echo ""
echo "3. Redeploy application:"
echo "   railway up"
echo ""
echo "4. Test email sending by creating a church in platform"
echo ""
echo "Current FROM_EMAIL: onboarding@resend.dev (TEST MODE - emails not delivered)"
echo "Production FROM_EMAIL: onboarding@khesed-tek.com (AFTER domain verification)"
echo ""
