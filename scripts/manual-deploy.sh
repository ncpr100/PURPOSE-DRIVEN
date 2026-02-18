#!/bin/bash

# Manual Deployment Script - Vercel Production Deploy
# Use this for manual deployment when git push auto-deploy is not working

set -e

echo "🚀 MANUAL DEPLOYMENT - Vercel Production"
echo "⚡ Use this when automatic deployment needs manual trigger"
echo ""

# Check if we have required tools
command -v vercel >/dev/null 2>&1 || { 
    echo "❌ Vercel CLI not found. Install: npm i -g vercel"
    echo "🔄 Continuing without Vercel deployment..."
    VERCEL_AVAILABLE=false
}

command -v docker >/dev/null 2>&1 || { 
    echo "❌ Docker not found. Install Docker to use containerized deployment"
    echo "🔄 Continuing without Docker deployment..."
    DOCKER_AVAILABLE=false
}

# Function to deploy to Vercel
deploy_vercel() {
    echo "🟣 Deploying to Vercel production..."
    
    # Build optimizations
    export NODE_OPTIONS="--max-old-space-size=8192 --max-semi-space-size=1024"
    export NEXT_TELEMETRY_DISABLED=1
    export NPM_CONFIG_AUDIT=false
    export NPM_CONFIG_FUND=false
    
    # Clean build
    rm -rf .next
    rm -rf node_modules/.cache
    
    # Install and build with timeouts
    echo "📦 Installing dependencies..."
    timeout 300 npm ci --no-audit --no-fund
    
    echo "🗄️ Generating Prisma client..."
    timeout 120 npx prisma generate
    
    echo "🔨 Building for Vercel..."
    timeout 900 npm run build
    
    # Deploy to Vercel
    echo "🚀 Deploying to Vercel production..."
    vercel --prod --yes
    
    echo "✅ Vercel deployment completed!"
}

# Function to build Docker and provide deployment instructions
deploy_docker() {
    echo "🐳 Building Docker image as Railway alternative..."
    
    # Build Docker image
    echo "🔨 Building Docker image..."
    docker build -t khesed-tek-emergency:latest .
    
    echo "📦 Docker image built successfully!"
    echo ""
    echo "🚀 Docker Deployment Options:"
    echo "1. Deploy to Google Cloud Run:"
    echo "   docker tag khesed-tek-emergency:latest gcr.io/PROJECT_ID/khesed-tek"
    echo "   docker push gcr.io/PROJECT_ID/khesed-tek"
    echo "   gcloud run deploy --image gcr.io/PROJECT_ID/khesed-tek"
    echo ""
    echo "2. Deploy to AWS ECS/Fargate:"
    echo "   docker tag khesed-tek-emergency:latest AWS_ACCOUNT.dkr.ecr.REGION.amazonaws.com/khesed-tek"
    echo "   docker push AWS_ACCOUNT.dkr.ecr.REGION.amazonaws.com/khesed-tek"
    echo ""
    echo "3. Deploy to Azure Container Instances:"
    echo "   docker tag khesed-tek-emergency:latest khesedtek.azurecr.io/khesed-tek"
    echo "   docker push khesedtek.azurecr.io/khesed-tek"
}

# Function to show Railway status and alternatives
show_alternatives() {
    echo "🔍 Railway Metal Builder Status Check:"
    echo "❌ Railway Metal builder 'builder-cbuxkt' hanging at 'scheduling build'"
    echo "⏱️ Last hang: Feb 8, 2026, 12:48 PM - 12:59 PM (11 minutes)"
    echo "🚨 Multiple hang incidents detected - infrastructure issue"
    echo ""
    echo "🎯 Available Emergency Deployment Options:"
    echo "1. Vercel (recommended for immediate deployment)"
    echo "2. Docker + Cloud Provider (for production scalability)" 
    echo "3. GitHub Pages (for static build testing)"
    echo "4. Netlify (alternative serverless platform)"
    echo ""
}

# Main deployment logic
case "${1:-menu}" in
    "vercel")
        if [ "$VERCEL_AVAILABLE" != "false" ]; then
            deploy_vercel
        else
            echo "❌ Vercel CLI not available"
            exit 1
        fi
        ;;
    "docker")
        if [ "$DOCKER_AVAILABLE" != "false" ]; then
            deploy_docker
        else
            echo "❌ Docker not available"
            exit 1
        fi
        ;;
    "status")
        show_alternatives
        ;;
    "menu"|*)
        show_alternatives
        echo "Usage: $0 {vercel|docker|status}"
        echo ""
        echo "Examples:"
        echo "  ./scripts/emergency-deploy.sh vercel   # Deploy to Vercel immediately"
        echo "  ./scripts/emergency-deploy.sh docker   # Build Docker for cloud deployment"
        echo "  ./scripts/emergency-deploy.sh status   # Show deployment alternatives"
        ;;
esac

echo ""
echo "🎯 Emergency deployment script completed!"
echo "💡 Remember: Update DNS records to point to new deployment if switching from Railway"