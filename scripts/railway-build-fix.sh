#!/bin/bash

# Railway Build Optimization Script for Khesed-Tek
# Addresses Metal Builder hanging issues

set -e

echo "🔧 Railway Build Optimization Starting..."

# Clean any previous build artifacts that might cause hangs
echo "📦 Cleaning build artifacts..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .temp
rm -rf dist

# Set Railway-optimized Node.js options
export NODE_OPTIONS="--max-old-space-size=8192 --max-semi-space-size=1024 --no-deprecation"
export NPM_CONFIG_AUDIT=false
export NPM_CONFIG_FUND=false
export CI=true

# Pre-build dependency check
echo "🔍 Checking dependencies..."
npm ci --quiet --no-audit --no-fund

# Generate Prisma client early to prevent build-time issues
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Pre-compile to catch TypeScript errors early
echo "📝 Pre-compiling TypeScript..."
npm run test:compile

# Railway-optimized build with better memory management
echo "🚀 Starting Railway-optimized build..."
NODE_ENV=production \
NODE_OPTIONS="--max-old-space-size=8192 --max-semi-space-size=1024" \
NEXT_TELEMETRY_DISABLED=1 \
npm run build

echo "✅ Railway build optimization complete!"