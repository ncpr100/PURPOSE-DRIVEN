#!/bin/bash
# 🛡️ PRE-COMMIT HOOK - CRITICAL PATTERN VERIFICATION
# 
# This hook prevents commits containing problematic patterns
# that cause Railway deployment failures.
#
# Installation: Copy to .git/hooks/pre-commit and make executable

set -e

echo "🛡️ Running critical pattern verification..."

# Run the verification script
if ! node scripts/verify-critical-patterns.js; then
    echo ""
    echo "❌ COMMIT BLOCKED: Critical patterns found!"
    echo "🔧 Fix patterns using: bash scripts/apply-critical-fixes.sh"
    echo "🚀 Then try committing again"
    exit 1
fi

echo "✅ Pattern verification passed - proceeding with commit"
exit 0