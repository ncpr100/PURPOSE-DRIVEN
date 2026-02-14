#!/usr/bin/env node
const { execSync } = require('child_process');

console.log('🚀 CRITICAL DEPLOYMENT - ENTERPRISE PROTOCOL\n');

try {
  process.chdir('/workspaces/PURPOSE-DRIVEN');
  
  // Configure git
  try { execSync('git config user.name', { stdio: 'ignore' }); } 
  catch (e) {
    execSync('git config --global user.name "Copilot Agent"', { stdio: 'inherit' });
    execSync('git config --global user.email "copilot@khesed-tek.com"', { stdio: 'inherit' });
  }
  
  console.log('📝 Staging files...');
  execSync('git add lib/db.ts lib/auth.ts DEPLOYMENT_AUDIT.md', { stdio: 'inherit' });
  
  console.log('\n💾 Committing...');
  try {
    execSync('git commit -m "CRITICAL: Enhanced database logging & connection testing"', { stdio: 'inherit' });
  } catch (e) {
    if (e.message && e.message.includes('nothing to commit')) {
      console.log('⚠️  Nothing to commit - changes already committed');
    } else {
      throw e;
    }
  }
  
  console.log('\n🌐 Pushing to GitHub...');
  execSync('git push origin main', { stdio: 'inherit' });
  
  console.log('\n✅ DEPLOYMENT COMPLETE!\n');
  console.log('⏳ Vercel rebuilding (ETA: 2-3 minutes)');
  console.log('📋 Test login: https://khesed-tek-cms-org.vercel.app/auth/signin');
  console.log('   admin@iglesiacentral.com / password123\n');
  
} catch (error) {
  console.error('\n❌ DEPLOYMENT FAILED:', error.message);
  process.exit(1);
}
