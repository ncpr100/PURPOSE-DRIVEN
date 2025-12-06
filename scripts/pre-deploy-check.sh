#!/bin/bash

# 🛡️ DEPLOYMENT BLOCKER PREVENTION SYSTEM
# Prevents TypeScript errors from reaching Railway

echo "🛡️ DEPLOYMENT BLOCKER PREVENTION SYSTEM"
echo "========================================="

# Run TypeScript compilation check
echo "📝 Checking TypeScript compilation..."
if ! npm run test:compile > /dev/null 2>&1; then
  echo "❌ TYPESCRIPT COMPILATION FAILED"
  echo "🚫 BLOCKING DEPLOYMENT TO PREVENT RAILWAY FAILURE"
  echo ""
  echo "📋 TypeScript Errors Found:"
  npm run test:compile 2>&1 | grep "error TS" | head -10
  echo ""
  echo "🔧 Fix these errors before deployment:"
  echo "1. Run: npm run test:compile"
  echo "2. Fix all errors shown"
  echo "3. Run this script again"
  echo ""
  exit 1
fi

echo "✅ TypeScript compilation successful"

# Run pattern verification
echo "📝 Checking for critical patterns..."
if ! npm run verify:patterns > /dev/null 2>&1; then
  echo "❌ CRITICAL PATTERNS FOUND" 
  echo "🚫 BLOCKING DEPLOYMENT TO PREVENT RAILWAY FAILURE"
  npm run verify:patterns
  exit 1
fi

echo "✅ No critical patterns found"

# All checks passed
echo ""
echo "🎉 ALL DEPLOYMENT CHECKS PASSED!"
echo "✅ TypeScript: Clean"
echo "✅ Patterns: Clean"
echo "🚀 Safe to deploy to Railway"
echo ""
echo "Deploy with: git push"