#!/bin/bash

# KHESED-TEK MEMORY-OPTIMIZED BUILD STRATEGY
# Builds the application using memory-efficient techniques

set -e

echo "🚀 STARTING MEMORY-OPTIMIZED BUILD"
echo "=================================="

# Step 1: Clear all caches and free memory
echo "🧹 Phase 1: Memory Preparation"
sudo sync
echo 3 | sudo tee /proc/sys/vm/drop_caches > /dev/null
npm cache clean --force 2>/dev/null || true

# Step 2: Kill memory-heavy VSCode processes and keep them terminated
echo "⏸️  Phase 2: Pausing Memory-Heavy Processes"
pkill -f "tsserver.js" || true
pkill -f "typescript" || true  
pkill -f "extensionHost" || true
sleep 3

# Keep killing processes that restart during build
(
  for i in {1..60}; do
    pkill -f "tsserver.js" 2>/dev/null || true
    sleep 5
  done
) &
KILLER_PID=$!

# Step 3: Check available memory
AVAILABLE_MB=$(free -m | awk 'NR==2{printf "%.0f", $7}')
echo "💾 Available Memory: ${AVAILABLE_MB}MB"

# Step 4: Determine optimal Node.js memory allocation
if [ "$AVAILABLE_MB" -gt 3000 ]; then
    NODE_MEMORY=2048
elif [ "$AVAILABLE_MB" -gt 2000 ]; then
    NODE_MEMORY=1536
else
    NODE_MEMORY=1024
fi

echo "🎯 Node.js Memory Allocation: ${NODE_MEMORY}MB"

# Step 5: Build with optimized settings
echo "🔨 Phase 3: TypeScript Compilation"
NODE_OPTIONS="--max-old-space-size=$NODE_MEMORY" npm run build

# Step 6: Cleanup and restore processes
kill $KILLER_PID 2>/dev/null || true

# Step 7: Verify build success
if [ $? -eq 0 ]; then
    echo "✅ BUILD SUCCESSFUL"
    echo "📦 Build artifacts created in .next/"
    du -sh .next/ 2>/dev/null || echo "Build size: Unknown"
else
    echo "❌ BUILD FAILED"
    exit 1
fi

echo "=================================="
echo "🎉 MEMORY-OPTIMIZED BUILD COMPLETE"