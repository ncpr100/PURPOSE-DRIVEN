#!/bin/bash

echo "� Railway CLI Activation & Deployment Script"
echo "============================================="

# Check Railway CLI installation
if ! command -v railway &> /dev/null; then
    echo "⚠️ Railway CLI not found. Installing..."
    npm install -g @railway/cli
    echo "✅ Railway CLI installed: $(railway --version)"
else
    echo "✅ Railway CLI found: $(railway --version)"
fi

# Check authentication status
echo ""
echo "🔍 Checking Railway CLI authentication status..."
if railway whoami &> /dev/null; then
    echo "✅ Railway CLI authenticated: $(railway whoami)"
    
    # Check project connection
    echo "🔍 Checking Railway project connection..."
    if railway status &> /dev/null; then
        echo "✅ Connected to Railway project"
        echo "🚀 Deploying to Railway..."
        railway up --detach
        echo "✅ Deployment initiated successfully!"
        echo "🔗 Monitor deployment: https://railway.app"
    else
        echo "❌ Not connected to Railway project"
        echo "💡 Connect with: railway link [your-project-id]"
    fi
else
    echo "❌ Railway CLI NOT AUTHENTICATED"
    
    # Try authentication if token available
    if [ -n "$RAILWAY_TOKEN" ]; then
        echo "🔐 Attempting authentication with provided token..."
        railway login --token "$RAILWAY_TOKEN"
        
        if railway whoami &> /dev/null; then
            echo "✅ Authentication successful: $(railway whoami)"
            echo "🔍 Checking project connection..."
            
            if railway status &> /dev/null; then
                echo "✅ Connected to Railway project"
                echo "🚀 Deploying to Railway..."
                railway up --detach
                echo "✅ Deployment completed!"
            else
                echo "❌ Project not linked. Run: railway link [project-id]"
            fi
        else
            echo "❌ Authentication failed. Check RAILWAY_TOKEN value"
        fi
    else
        echo "⚠️ RAILWAY_TOKEN environment variable not found"
        echo ""
        echo "🔧 TO ACTIVATE RAILWAY CLI:"
        echo "1. Get Railway API token: https://railway.app/account/tokens"
        echo "2. Export token: export RAILWAY_TOKEN='rwy_your_token_here'"
        echo "3. Add RAILWAY_TOKEN to GitHub Secrets for auto-deployment"
        echo "4. Re-run this script"
        echo ""
        echo "📖 Full guide: RAILWAY_CLI_ACTIVATION_GUIDE.md"
    fi
fi

echo ""
echo "📋 DEPLOYMENT STATUS SUMMARY:"
echo "✅ Railway CLI: Installed"
if railway whoami &> /dev/null; then
    echo "✅ Authentication: Connected"
    if railway status &> /dev/null; then
        echo "✅ Project: Connected"
        echo "✅ Auto-Deploy: ACTIVATED"
    else
        echo "❌ Project: Not linked"
        echo "❌ Auto-Deploy: INCOMPLETE"
    fi
else
    echo "❌ Authentication: Required"
    echo "❌ Auto-Deploy: NOT ACTIVATED"
fi