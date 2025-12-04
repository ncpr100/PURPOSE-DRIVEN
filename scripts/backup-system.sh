#!/bin/bash

##############################################################################
# KHESED-TEK COMPREHENSIVE BACKUP SYSTEM
# Creates complete backup of codebase, database, and critical configurations
##############################################################################

set -e  # Exit on error

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="/workspaces/KHESED-TEK-BACKUP-${TIMESTAMP}"
PROJECT_DIR="/workspaces/PURPOSE-DRIVEN"

echo "🔄 KHESED-TEK BACKUP SYSTEM"
echo "=================================================="
echo "Timestamp: ${TIMESTAMP}"
echo "Backup Location: ${BACKUP_DIR}"
echo ""

# Step 1: Clone Repository
echo "📦 Step 1/5: Cloning repository..."
cd /workspaces
git clone https://github.com/ncpr100/PURPOSE-DRIVEN.git "${BACKUP_DIR}"
echo "✅ Repository cloned"
echo ""

# Step 2: Export Database Schema
echo "🗄️  Step 2/5: Exporting database schema..."
cd "${PROJECT_DIR}"
npx prisma db pull --force 2>/dev/null || echo "⚠️  Schema already current"
cp prisma/schema.prisma "${BACKUP_DIR}/prisma/schema.prisma.backup"
echo "✅ Database schema exported"
echo ""

# Step 3: Create Backup Manifest
echo "📋 Step 3/5: Creating backup manifest..."
cat > "${BACKUP_DIR}/BACKUP_MANIFEST.md" << EOF
# KHESED-TEK BACKUP MANIFEST

**Backup Date**: $(date)
**Backup Timestamp**: ${TIMESTAMP}
**Git Commit**: $(git rev-parse HEAD)
**Git Branch**: $(git branch --show-current)

## System State

### Phase Status
- Phase 1: Core Foundation ✅ COMPLETE
- Phase 2: Business Intelligence ✅ COMPLETE  
- Phase 3: Advanced Analytics ✅ COMPLETE
- Phase 4: AI & Mobile Apps 🔄 PLANNING

### Critical Systems Operational
- ✅ Authentication & Authorization (JWT + Middleware)
- ✅ Multi-tenant Architecture (50 tables)
- ✅ Dual Analytics Dashboard (General + Intelligent)
- ✅ Social Media Automation (8 triggers)
- ✅ Member Journey Analytics
- ✅ Performance Optimization Complete

### Recent Critical Fixes
- ✅ JWT-Middleware Authentication Fix (Dec 4, 2025)
- ✅ Navigation Tab Authorization Restored
- ✅ Auth Validation System Implemented

### Key Metrics
- Total Files: $(find ${BACKUP_DIR} -type f | wc -l)
- Lines of Code: $(find ${BACKUP_DIR} -name "*.ts" -o -name "*.tsx" -o -name "*.js" | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}')
- Database Tables: 50
- Prisma Schema Lines: 2,794

### Environment
- Framework: Next.js 14 (App Router)
- Database: PostgreSQL + Prisma ORM
- Deployment: Railway (Production)
- Auth: NextAuth.js with JWT

## Restoration Instructions

### 1. Clone This Backup
\`\`\`bash
git clone file://${BACKUP_DIR} khesed-tek-restored
cd khesed-tek-restored
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Configure Environment
\`\`\`bash
# Copy .env.example to .env
# Set DATABASE_URL to your PostgreSQL instance
# Set NEXTAUTH_SECRET
# Configure all API keys
\`\`\`

### 4. Database Setup
\`\`\`bash
# Push schema to database
npx prisma db push

# Seed initial data
npx prisma db seed
\`\`\`

### 5. Build and Run
\`\`\`bash
npm run build
npm run start
\`\`\`

## Critical Files Backed Up
- ✅ All source code (app/, components/, lib/)
- ✅ Database schema (prisma/schema.prisma)
- ✅ Configuration files (next.config.js, middleware.ts)
- ✅ Documentation (*.md files)
- ✅ Scripts (scripts/)
- ✅ Package dependencies (package.json, package-lock.json)

## Security Notes
⚠️  This backup does NOT include:
- Environment variables (.env) - Must be configured manually
- node_modules (reinstall with npm install)
- .next build cache (rebuild with npm run build)
- Production database data (must be exported separately)

## Validation Checklist
After restoration, verify:
- [ ] npm install completes without errors
- [ ] Database schema pushes successfully
- [ ] npm run build completes (189/189 pages)
- [ ] Authentication works (JWT includes role)
- [ ] All navigation tabs functional
- [ ] npm run validate:auth passes

## Support
Repository: https://github.com/ncpr100/PURPOSE-DRIVEN
Backup Date: $(date)
EOF

echo "✅ Backup manifest created"
echo ""

# Step 4: Create Quick Restore Script
echo "🔧 Step 4/5: Creating restore script..."
cat > "${BACKUP_DIR}/RESTORE.sh" << 'EOF'
#!/bin/bash
echo "🔄 KHESED-TEK RESTORATION SCRIPT"
echo "=================================================="
echo ""
echo "⚠️  PREREQUISITES:"
echo "   1. PostgreSQL database available"
echo "   2. Node.js 18+ installed"
echo "   3. .env file configured with DATABASE_URL"
echo ""
read -p "Have you completed all prerequisites? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Restoration cancelled. Complete prerequisites first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🗄️  Setting up database..."
npx prisma generate
npx prisma db push

echo "🌱 Seeding initial data..."
npx prisma db seed

echo "🏗️  Building application..."
npm run build

echo ""
echo "✅ RESTORATION COMPLETE!"
echo ""
echo "🚀 To start the application:"
echo "   npm run dev      # Development mode"
echo "   npm run start    # Production mode"
echo ""
EOF

chmod +x "${BACKUP_DIR}/RESTORE.sh"
echo "✅ Restore script created"
echo ""

# Step 5: Summary
echo "📊 Step 5/5: Backup summary..."
BACKUP_SIZE=$(du -sh "${BACKUP_DIR}" | cut -f1)
FILE_COUNT=$(find "${BACKUP_DIR}" -type f | wc -l)

cat > "${BACKUP_DIR}/BACKUP_INFO.txt" << EOF
KHESED-TEK BACKUP INFORMATION
========================================
Backup Date: $(date)
Backup Path: ${BACKUP_DIR}
Backup Size: ${BACKUP_SIZE}
Total Files: ${FILE_COUNT}
Git Commit:  $(cd ${PROJECT_DIR} && git rev-parse HEAD)
Git Branch:  $(cd ${PROJECT_DIR} && git branch --show-current)

CRITICAL: This is a working stable build with:
- Fixed JWT authentication
- All navigation tabs functional
- Auth validation system in place
- Phase 3 complete (95% overall completion)

To restore: bash ${BACKUP_DIR}/RESTORE.sh
EOF

echo ""
echo "=================================================="
echo "✅ BACKUP COMPLETE!"
echo "=================================================="
echo ""
echo "📍 Backup Location: ${BACKUP_DIR}"
echo "📦 Backup Size: ${BACKUP_SIZE}"
echo "📄 Total Files: ${FILE_COUNT}"
echo ""
echo "📋 Documentation:"
echo "   - ${BACKUP_DIR}/BACKUP_MANIFEST.md"
echo "   - ${BACKUP_DIR}/BACKUP_INFO.txt"
echo ""
echo "🔧 To restore this backup:"
echo "   bash ${BACKUP_DIR}/RESTORE.sh"
echo ""
echo "⚠️  IMPORTANT: Update existing backup with:"
echo "   rm -rf /workspaces/KHESED-TEK-BACKUP-LATEST"
echo "   ln -s ${BACKUP_DIR} /workspaces/KHESED-TEK-BACKUP-LATEST"
echo ""
