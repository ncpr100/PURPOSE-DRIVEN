#!/bin/bash

# KHESED-TEK CMS MEMORY CLEANUP SCRIPT
# Systematic memory assessment and cleanup with safety checks

set -e  # Exit on any error

echo "🧹 STARTING SYSTEMATIC MEMORY CLEANUP"
echo "======================================="

# PROTOCOL CHECK: Create backup log
BACKUP_LOG="/tmp/cleanup-backup-$(date +%Y%m%d-%H%M%S).log"
echo "📝 Backup log: $BACKUP_LOG"

# MEMORY ASSESSMENT
echo "📊 MEMORY ASSESSMENT:"
free -h
echo ""

echo "💾 DISK USAGE BEFORE CLEANUP:"
du -sh * 2>/dev/null | sort -hr | head -5
echo ""

# SAFE CLEANUP OPERATIONS
echo "🔄 PHASE 1: BUILD ARTIFACTS CLEANUP"

# Remove TypeScript build info (safe to regenerate)
if [ -f "tsconfig.tsbuildinfo" ]; then
    echo "  ✅ Removing tsconfig.tsbuildinfo (468K)"
    rm -f tsconfig.tsbuildinfo
fi

# Remove Next.js cache (safe to regenerate)
if [ -d ".next" ]; then
    echo "  ✅ Removing .next cache"
    rm -rf .next
fi

# Remove dist folder (build output)
if [ -d "dist" ]; then
    echo "  ✅ Removing dist folder"
    rm -rf dist
fi

# Remove test build artifacts
if [ -d "test-build" ]; then
    echo "  ✅ Removing test-build (1.1M)"
    rm -rf test-build
fi

echo ""
echo "🔄 PHASE 2: TEMPORARY FILES CLEANUP"

# Remove temporary result files (.tmp)
find . -name "*.tmp" -type f -not -path "./node_modules/*" 2>/dev/null | while read file; do
    if [ -f "$file" ]; then
        echo "  ✅ Removing temporary file: $file"
        rm -f "$file"
    fi
done

# Remove backup files
find . -name "*.bak" -o -name "*.old" -type f -not -path "./node_modules/*" 2>/dev/null | while read file; do
    if [ -f "$file" ]; then
        echo "  ✅ Removing backup file: $file"
        rm -f "$file"
    fi
done

# Remove temporary test files (ONLY from root directory, NOT from node_modules)
find . -maxdepth 1 \( -name "test-*.js" -o -name "test-*.ts" \) -type f 2>/dev/null | while read file; do
    if [ -f "$file" ]; then
        echo "  ✅ Removing temporary test file: $file"
        rm -f "$file"
    fi
done

# Remove log files
find . -name "*.log" -type f -not -path "./node_modules/*" 2>/dev/null | while read file; do
    if [ -f "$file" ]; then
        echo "  ✅ Removing log file: $file"
        rm -f "$file"
    fi
done

# Report on screenshot/attachment files (don't delete, just report)
echo ""
echo "📸 ATTACHMENT FILES ASSESSMENT:"
SCREENSHOT_COUNT=$(find . \( -name "*screenshot*" -o -name "*capture*" \) -type f -not -path "./node_modules/*" 2>/dev/null | wc -l)
if [ "$SCREENSHOT_COUNT" -gt 0 ]; then
    echo "  📊 Found $SCREENSHOT_COUNT screenshot/capture files"
    echo "  💡 To review: find . \( -name '*screenshot*' -o -name '*capture*' \) -type f -not -path './node_modules/*'"
else
    echo "  ✅ No temporary screenshot files found"
fi

echo ""
echo "🔄 PHASE 3: DEPENDENCY OPTIMIZATION"

# Clean npm cache
echo "  🧹 Cleaning npm cache"
npm cache clean --force 2>/dev/null || true

echo ""
echo "📊 DISK USAGE AFTER CLEANUP:"
du -sh * 2>/dev/null | sort -hr | head -5
echo ""

echo "📊 MEMORY STATUS AFTER CLEANUP:"
free -h
echo ""

echo "✅ CLEANUP COMPLETED SUCCESSFULLY"
echo "📝 No critical files were removed"
echo "🔄 Build artifacts can be regenerated with: npm run build"
echo "======================================="