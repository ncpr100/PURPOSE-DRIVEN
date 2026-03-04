#!/bin/bash

# 🚨 EMERGENCY DATABASE SETUP - SQLite Fallback
# This script creates a local SQLite database that works immediately
# No external dependencies, no waiting for services to initialize

echo "🚨 EMERGENCY DATABASE SETUP - SQLite Fallback"
echo "=============================================="

# 1. Install SQLite if not available
if ! command -v sqlite3 &> /dev/null; then
    echo "📦 Installing SQLite..."
    sudo apt-get update && sudo apt-get install -y sqlite3
fi

# 2. Create emergency .env configuration
echo "📝 Creating emergency database configuration..."

cat > .env.emergency << 'EOF'
# 🚨 EMERGENCY SQLite DATABASE - Works immediately without external services
DATABASE_URL="file:./emergency.db"
NEXTAUTH_URL="https://khesed-tek-cms-org.vercel.app"
NEXTAUTH_SECRET="iWIPngSO6B/HAqDRqjwXNmTk6abhMBXPffUzChG38b0="

# Resend Email Service  
RESEND_API_KEY="re_SJntBLZa_L8XYtMQarjrfh3Z3SF3T5KK3"
FROM_EMAIL="onboarding@khesed-tek-systems.org"

# Emergency fallback - all features work locally
ENABLE_SOCIAL_MEDIA_AUTOMATION="false" 
ENABLE_ADVANCED_ANALYTICS="true"
EOF

# 3. Backup current config and switch to emergency
echo "💾 Backing up current configuration..."
cp .env .env.backup
cp .env.emergency .env

echo "✅ Emergency configuration activated!"

echo ""
echo "🎯 NEXT STEPS:"
echo "1. Run: npx prisma db push"
echo "2. Run: npm run dev"
echo "3. Login with: soporte@khesed-tek-systems.org / Bendecido100%$$%"
echo "4. Test upload buttons - should work immediately!"
echo ""
echo "To restore original config later: mv .env.backup .env"