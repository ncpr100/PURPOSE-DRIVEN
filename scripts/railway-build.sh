#!/bin/bash

# Railway-Optimized Build Script
# Designed to handle large codebases with memory constraints

echo "🚂 Starting Railway-Optimized Build..."

# Set memory limits for Node.js
export NODE_OPTIONS="--max-old-space-size=8192 --max-semi-space-size=1024 --optimize-for-size"

# Clean up any previous builds
echo "🧹 Cleaning previous build artifacts..."
rm -rf .next
rm -rf node_modules/.cache

# Generate Prisma client with explicit output
echo "🏗️ Generating Prisma client..."
npx prisma generate

# Pre-compile TypeScript if needed
echo "📝 TypeScript compilation check..."
npx tsc --noEmit

# Build Next.js with memory optimization
echo "🚀 Building Next.js application..."
next build

echo "✅ Railway build completed successfully!"