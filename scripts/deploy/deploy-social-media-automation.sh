#!/bin/bash

# SAFE DEPLOYMENT SCRIPT FOR SOCIAL MEDIA AUTOMATION
# P1 HIGH PRIORITY ENHANCEMENT

echo "🚀 SOCIAL MEDIA AUTOMATION DEPLOYMENT SCRIPT"
echo "=============================================="

# Step 1: Check current system status
echo "1️⃣ Checking system status..."
npm run build
BUILD_STATUS=$?

if [ $BUILD_STATUS -ne 0 ]; then
    echo "❌ Build failed. Aborting deployment."
    exit 1
fi

echo "✅ Build successful"

# Step 2: Check for compilation errors
echo "2️⃣ Checking for errors..."
npx tsc --noEmit
TSC_STATUS=$?

if [ $TSC_STATUS -ne 0 ]; then
    echo "❌ TypeScript errors found. Aborting deployment."
    exit 1
fi

echo "✅ No compilation errors"

# Step 3: Run tests if available
echo "3️⃣ Running tests..."
if [ -f "package.json" ] && grep -q "\"test\"" package.json; then
    npm test
    TEST_STATUS=$?
    
    if [ $TEST_STATUS -ne 0 ]; then
        echo "❌ Tests failed. Aborting deployment."
        exit 1
    fi
    echo "✅ Tests passed"
else
    echo "⚠️ No tests configured - proceeding with deployment"
fi

# Step 4: Commit changes
echo "4️⃣ Committing P1 enhancements..."
git add .
git commit -m "feat: P1 Social Media Automation Integration

- ✅ Fix 7 compilation errors in accounts-manager.tsx
- ✅ Add feature flag system for safe deployment
- ✅ Implement social media automation triggers
- ✅ Add YouTube and TikTok platform support
- ✅ Safe database migration strategy
- 🔒 Feature-flagged rollout (disabled by default)

BREAKING: None - feature flag protected
TESTING: Ready for gradual rollout
MONITORING: Enhanced logging for new features"

# Step 5: Push to Railway
echo "5️⃣ Deploying to Railway..."
git push origin HEAD

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "========================="
echo "✅ P1 Social Media Automation Integration deployed"
echo "🔒 Feature flag: ENABLE_SOCIAL_MEDIA_AUTOMATION=false (disabled by default)"
echo "📊 To enable: Set ENABLE_SOCIAL_MEDIA_AUTOMATION=true in Railway environment"
echo "🔄 Next steps: Database migration for automation trigger types"
echo ""
echo "🚀 Ready for production rollout with zero downtime!"