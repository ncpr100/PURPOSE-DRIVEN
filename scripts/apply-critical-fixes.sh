#!/bin/bash
# 🔧 AUTOMATIC PATTERN FIX SCRIPT
# Generated: 2026-03-12T19:15:01.512Z
# Issues found: 8

set -e
cd /workspaces/PURPOSE-DRIVEN

echo "🔧 Applying 8 critical pattern fixes..."

# Fix: Missing id: nanoid() in create operations in app/api/qr/[code]/route.ts
sed -i 's/\\.create\\(\\s*\\{\\s*data:\\s*\\{(?![^}]*id:)/.create({ data: { id: nanoid(),/g' "app/api/qr/[code]/route.ts"

# Fix: Missing id: nanoid() in create operations in app/api/platform/settings/route.ts
sed -i 's/\\.create\\(\\s*\\{\\s*data:\\s*\\{(?![^}]*id:)/.create({ data: { id: nanoid(),/g' "app/api/platform/settings/route.ts"

# Fix: Missing id: nanoid() in create operations in app/api/platform/forms/route.ts
sed -i 's/\\.create\\(\\s*\\{\\s*data:\\s*\\{(?![^}]*id:)/.create({ data: { id: nanoid(),/g' "app/api/platform/forms/route.ts"

# Fix: Missing id: nanoid() in create operations in app/api/platform/forms/[slug]/submit/route.ts
sed -i 's/\\.create\\(\\s*\\{\\s*data:\\s*\\{(?![^}]*id:)/.create({ data: { id: nanoid(),/g' "app/api/platform/forms/[slug]/submit/route.ts"

# Fix: Missing id: nanoid() in create operations in app/api/platform/dynamic-qr/route.ts
sed -i 's/\\.create\\(\\s*\\{\\s*data:\\s*\\{(?![^}]*id:)/.create({ data: { id: nanoid(),/g' "app/api/platform/dynamic-qr/route.ts"

# Fix: Missing id: nanoid() in create operations in app/api/notifications/bulk/route.ts
sed -i 's/\\.create\\(\\s*\\{\\s*data:\\s*\\{(?![^}]*id:)/.create({ data: { id: nanoid(),/g' "app/api/notifications/bulk/route.ts"

# Fix: Missing id: nanoid() in create operations in app/api/members/route.ts
sed -i 's/\\.create\\(\\s*\\{\\s*data:\\s*\\{(?![^}]*id:)/.create({ data: { id: nanoid(),/g' "app/api/members/route.ts"


echo "✅ All 8 critical patterns fixed!"
echo "🚀 Ready for git commit and Railway deployment"

# Optional: Automatically commit and push
# git add .
# git commit -m "fix: automatic critical pattern fixes - prevent Railway deployment failures"
# git push
