#!/usr/bin/env node
const { execSync } = require('child_process');

console.log('🚀 DEPLOYING DIAGNOSTIC ENDPOINT\n');

try {
  process.chdir('/workspaces/PURPOSE-DRIVEN');
  
  console.log('📝 Staging diagnostic endpoint...');
  execSync('git add app/api/diagnostic/check-maria/route.ts', { stdio: 'inherit' });
  
  console.log('💾 Committing...');
  execSync('git commit -m "Add diagnostic endpoint for María González user check"', { stdio: 'inherit' });
  
  console.log('🌐 Pushing to GitHub...');
  execSync('git push origin main', { stdio: 'inherit' });
  
  console.log('\n✅ DEPLOYED!');
  console.log('\n⏳ Wait 2-3 minutes for Vercel rebuild');
  console.log('\n📋 Then access:');
  console.log('   https://khesed-tek-cms-org.vercel.app/api/diagnostic/check-maria');
  
} catch (error) {
  console.error('\n❌ DEPLOYMENT FAILED:', error.message);
  process.exit(1);
}
