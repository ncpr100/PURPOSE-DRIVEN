#!/bin/bash

# 🔧 AUTOMATIC TYPESCRIPT ERROR FIXER
# Fixes the most common patterns causing Railway deployment failures

echo "🔧 AUTOMATIC TYPESCRIPT ERROR FIXER"
echo "===================================="

FIXED_COUNT=0

# Fix 1: Missing nanoid imports in API routes with .create() operations
echo "🔍 Fixing missing nanoid imports..."
find app/api -name "*.ts" -type f | while read file; do
  if grep -q "\.create(" "$file" && ! grep -q "import { nanoid }" "$file"; then
    # Add nanoid import at the top
    sed -i '1i import { nanoid } from '\''nanoid'\''' "$file"
    echo "✅ Added nanoid import to $file"
    ((FIXED_COUNT++))
  fi
done

# Fix 2: Missing id fields in .create() operations
echo "🔍 Fixing missing id fields in create operations..."
find app/api -name "*.ts" -type f | while read file; do
  # Look for .create({ data: { without id: nanoid()
  if grep -q "\.create(\s*{\s*data:\s*{" "$file" && ! grep -q "id: nanoid()" "$file"; then
    # Add id: nanoid() after data: {
    sed -i 's/\.create(\s*{\s*data:\s*{/\.create({ data: { id: nanoid(),/g' "$file"
    echo "✅ Added id: nanoid() to $file"
    ((FIXED_COUNT++))
  fi
done

# Fix 3: Common relationship naming issues
echo "🔍 Fixing relationship naming issues..."
RELATIONSHIP_FIXES=(
  "s/volunteer_assignmentss/volunteer_assignments/g"
  "s/resourceReservations/event_resource_reservations/g"
  "s/include:\s*{\s*church:\s*true/include: { churches: true/g"
  "s/include:\s*{\s*volunteer:\s*true/include: { volunteers: true/g"
  "s/\.averageResourcesPerEvent/\.avgResourcesPerEvent/g"
)

for fix in "${RELATIONSHIP_FIXES[@]}"; do
  find app/api -name "*.ts" -type f -exec sed -i "$fix" {} +
done

echo ""
echo "🎉 AUTOMATIC FIXES COMPLETE!"
echo "📊 Estimated fixes applied: Multiple pattern fixes across API routes"
echo ""
echo "🧪 Running TypeScript check..."

if npm run test:compile > /dev/null 2>&1; then
  echo "✅ TypeScript compilation successful!"
  echo "🚀 Ready for deployment"
else
  echo "⚠️ Some TypeScript errors remain"
  echo "📋 Remaining errors:"
  npm run test:compile 2>&1 | grep "error TS" | head -5
  echo ""
  echo "💡 Run manual fixes for remaining errors"
fi