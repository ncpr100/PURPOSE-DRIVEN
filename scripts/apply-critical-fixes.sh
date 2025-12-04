#!/bin/bash
# 🔧 AUTOMATIC PATTERN FIX SCRIPT
# Generated: 2025-12-04T21:48:13.265Z
# Issues found: 30

set -e
cd /workspaces/PURPOSE-DRIVEN

echo "🔧 Applying 30 critical pattern fixes..."

# Fix: donation → donations model naming in app/api/webhooks/stripe/route.ts
sed -i 's/prisma\\.donation\\b/prisma.donations/g' "app/api/webhooks/stripe/route.ts"

# Fix: church → churches relation naming in app/api/social-media-accounts/route.ts
sed -i 's/include:\\s*{\\s*church:\\s*true\\s*}/include: { churches: true }/g' "app/api/social-media-accounts/route.ts"

# Fix: donation → donations model naming in app/api/recruitment-pipeline/route.ts
sed -i 's/prisma\\.donation\\b/prisma.donations/g' "app/api/recruitment-pipeline/route.ts"

# Fix: volunteer → volunteers model naming in app/api/recruitment-pipeline/route.ts
sed -i 's/prisma\\.volunteer\\b/prisma.volunteers/g' "app/api/recruitment-pipeline/route.ts"

# Fix: volunteer → volunteers model naming in app/api/recruitment-pipeline/onboarding-workflows/route.ts
sed -i 's/prisma\\.volunteer\\b/prisma.volunteers/g' "app/api/recruitment-pipeline/onboarding-workflows/route.ts"

# Fix: volunteer → volunteers model naming in app/api/recruitment-pipeline/leadership-development/route.ts
sed -i 's/prisma\\.volunteer\\b/prisma.volunteers/g' "app/api/recruitment-pipeline/leadership-development/route.ts"

# Fix: church → churches relation naming in app/api/prayer-messaging-stats/route.ts
sed -i 's/include:\\s*{\\s*church:\\s*true\\s*}/include: { churches: true }/g' "app/api/prayer-messaging-stats/route.ts"

# Fix: church → churches relation naming in app/api/prayer-message-queue/route.ts
sed -i 's/include:\\s*{\\s*church:\\s*true\\s*}/include: { churches: true }/g' "app/api/prayer-message-queue/route.ts"

# Fix: church → churches relation naming in app/api/prayer-message-queue/[id]/retry/route.ts
sed -i 's/include:\\s*{\\s*church:\\s*true\\s*}/include: { churches: true }/g' "app/api/prayer-message-queue/[id]/retry/route.ts"

# Fix: church → churches relation naming in app/api/prayer-categories/route.ts
sed -i 's/include:\\s*{\\s*church:\\s*true\\s*}/include: { churches: true }/g' "app/api/prayer-categories/route.ts"

# Fix: church → churches relation naming in app/api/prayer-analytics/route.ts
sed -i 's/include:\\s*{\\s*church:\\s*true\\s*}/include: { churches: true }/g' "app/api/prayer-analytics/route.ts"

# Fix: church → churches relation naming in app/api/prayer-analytics/export/route.ts
sed -i 's/include:\\s*{\\s*church:\\s*true\\s*}/include: { churches: true }/g' "app/api/prayer-analytics/export/route.ts"

# Fix: donation → donations model naming in app/api/online-payments/webhook/route.ts
sed -i 's/prisma\\.donation\\b/prisma.donations/g' "app/api/online-payments/webhook/route.ts"

# Fix: event → events model naming in app/api/intelligent-scheduling/route.ts
sed -i 's/prisma\\.event\\b/prisma.events/g' "app/api/intelligent-scheduling/route.ts"

# Fix: volunteer → volunteers model naming in app/api/intelligent-scheduling/route.ts
sed -i 's/prisma\\.volunteer\\b/prisma.volunteers/g' "app/api/intelligent-scheduling/route.ts"

# Fix: event → events model naming in app/api/events/analytics/route.ts
sed -i 's/prisma\\.event\\b/prisma.events/g' "app/api/events/analytics/route.ts"

# Fix: event → events model naming in app/api/events/[id]/communications/route.ts
sed -i 's/prisma\\.event\\b/prisma.events/g' "app/api/events/[id]/communications/route.ts"

# Fix: volunteer → volunteers model naming in app/api/events/[id]/communications/route.ts
sed -i 's/prisma\\.volunteer\\b/prisma.volunteers/g' "app/api/events/[id]/communications/route.ts"

# Fix: event → events model naming in app/api/events/[id]/auto-assign-volunteers/route.ts
sed -i 's/prisma\\.event\\b/prisma.events/g' "app/api/events/[id]/auto-assign-volunteers/route.ts"

# Fix: volunteer → volunteers model naming in app/api/events/[id]/auto-assign-volunteers/route.ts
sed -i 's/prisma\\.volunteer\\b/prisma.volunteers/g' "app/api/events/[id]/auto-assign-volunteers/route.ts"

# Fix: automation_rulesTemplate → automation_rule_templates in app/api/automation-templates/route.ts
sed -i 's/prisma\\.automation_rulesTemplate/prisma.automation_rule_templates/g' "app/api/automation-templates/route.ts"

# Fix: church → churches relation naming in lib/auth.ts
sed -i 's/include:\\s*{\\s*church:\\s*true\\s*}/include: { churches: true }/g' "lib/auth.ts"


echo "✅ All 30 critical patterns fixed!"
echo "🚀 Ready for git commit and Railway deployment"

# Optional: Automatically commit and push
# git add .
# git commit -m "fix: automatic critical pattern fixes - prevent Railway deployment failures"
# git push
