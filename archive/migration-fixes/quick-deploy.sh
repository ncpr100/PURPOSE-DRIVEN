#!/bin/bash
cd /workspaces/PURPOSE-DRIVEN
git config user.name || git config --global user.name "Copilot Agent"
git config user.email || git config --global user.email "copilot@khesed-tek.com"
git add lib/db.ts lib/auth.ts deploy-critical-fix.sh deploy.py git-deploy.log DEPLOYMENT_AUDIT.md
git status --short
git commit -m "CRITICAL: Enhanced database logging" || echo "Nothing to commit or already committed"
git log --oneline -1
git push origin main 2>&1
echo "DEPLOYMENT DONE"
