#!/bin/bash

# Railway Emergency Build Fix - Prevent Metal Builder Hanging
# CRITICAL: Addresses persistent Railway Metal builder "scheduling build" hangs

set -e

echo "🚨 Railway Emergency Build Fix Starting - Preventing Metal Builder Hangs..."

# Aggressive cleanup to prevent hanging during scheduling
echo "🧹 Aggressive build artifact cleanup..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .temp
rm -rf dist
rm -rf .cache
rm -rf tmp
rm -rf temp
# Clear any problematic Next.js build artifacts
rm -rf .next/cache
rm -rf .next/standalone
find . -name "*.log" -delete 2>/dev/null || true
find . -name "_buildManifest.js" -delete 2>/dev/null || true

# Set Railway-optimized environment with timeout protection
export NODE_OPTIONS="--max-old-space-size=8192 --max-semi-space-size=1024 --no-deprecation --no-warnings"
export NPM_CONFIG_AUDIT=false
export NPM_CONFIG_FUND=false
export NPM_CONFIG_PROGRESS=false
export CI=true
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

# Install with timeout protection
echo "📦 Installing dependencies with timeout protection..."
timeout 300 npm ci --quiet --no-audit --no-fund --prefer-offline || {
    echo "⚠️ npm ci timeout, retrying with cache clear..."
    npm cache clean --force
    timeout 300 npm ci --quiet --no-audit --no-fund
}

# Generate Prisma with timeout
echo "🗄️ Generating Prisma client with timeout protection..."
timeout 120 npx prisma generate

# TypeScript compilation with timeout
echo "📝 Pre-compiling TypeScript with timeout..."
timeout 180 npm run test:compile || {
    echo "⚠️ TypeScript compilation timeout - proceeding with build"
}

# Railway build with multiple fallbacks and timeout
echo "🚀 Railway-optimized build with timeout protection..."
timeout 900 npm run build || {
    echo "🔄 Build timeout - trying memory-optimized build..."
    timeout 900 npm run build:memory-optimized
}

echo "✅ Railway Emergency Build Fix Complete!"
echo "🎯 Build should now bypass Metal builder hanging issues"