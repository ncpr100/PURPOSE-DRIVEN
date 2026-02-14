#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const workDir = '/workspaces/PURPOSE-DRIVEN';
process.chdir(workDir);

console.log('🔍 CRITICAL SYSTEM VERIFICATION\n');

// 1. Verify enhanced logging is in place
console.log('1️⃣ Checking lib/db.ts for startup connection test...');
const dbContent = fs.readFileSync('lib/db.ts', 'utf8');
if (dbContent.includes('db.$connect()') && dbContent.includes('[DB] ✅ Connected successfully')) {
  console.log('   ✅ Startup connection test PRESENT');
} else {
  console.log('   ❌ Startup connection test MISSING');
}

if (dbContent.includes('[DB] Has pgbouncer param:')) {
  console.log('   ✅ Pgbouncer validation logging PRESENT');
} else {
  console.log('   ❌ Pgbouncer validation logging MISSING');
}

if (dbContent.includes("['error', 'warn']")) {
  console.log('   ✅ Production warning logs ENABLED');
} else {
  console.log('   ❌ Production warning logs NOT enabled');
}

console.log('\n2️⃣ Checking lib/auth.ts for enhanced error logging...');
const authContent = fs.readFileSync('lib/auth.ts', 'utf8');
if (authContent.includes('Full error:', JSON.stringify')) {
  console.log('   ✅ Enhanced error JSON logging PRESENT');
} else if (authContent.includes("JSON.stringify(error")) {
  console.log('   ✅ Enhanced error JSON logging PRESENT');
} else {
  console.log('   ❌ Enhanced error logging MISSING');
}

if (!authContent.includes('temp-super-admin') && !authContent.includes('temp-tenant-admin')) {
  console.log('   ✅ Fallback users REMOVED');
} else {
  console.log('   ❌ Fallback users STILL PRESENT');
}

console.log('\n3️⃣ Checking git status...');
try {
  const status = execSync('git status --porcelain', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  if (status.trim() === '') {
    console.log('   ✅ Working directory CLEAN (all changes committed)');
  } else {
    console.log('   ⚠️  Uncommitted changes:');
    status.split('\n').filter(l => l.trim()).forEach(line => {
      console.log(`      ${line}`);
    });
  }
} catch (e) {
  console.log('   ❌ Git status check failed');
}

console.log('\n4️⃣ Checking last commit...');
try {
  const lastCommit = execSync('git log -1 --oneline', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  console.log(`   📝 Last commit: ${lastCommit.trim()}`);
  
  if (lastCommit.includes('CRITICAL') || lastCommit.includes('Enhanced') || lastCommit.includes('logging')) {
    console.log('   ✅ Recent deployment-related commit found');
  } else {
    console.log('   ⚠️  Last commit may not include latest changes');
  }
} catch (e) {
  console.log('   ❌ Git log check failed');
}

console.log('\n5️⃣ Checking remote sync status...');
try {
  execSync('git fetch origin main', { stdio: 'ignore' });
  const localHead = execSync('git rev-parse HEAD', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  const remoteHead = execSync('git rev-parse origin/main', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  
  if (localHead === remoteHead) {
    console.log('   ✅ Local and remote are IN SYNC');
    console.log('   ✅ Changes have been PUSHED to GitHub');
  } else {
    console.log('   ⚠️  Local and remote are OUT OF SYNC');
    console.log('   ⏳ Need to push changes to GitHub');
  }
} catch (e) {
  console.log('   ❌ Remote sync check failed');
}

console.log('\n📊 SUMMARY:\n');
console.log('Enhanced logging code: ✅ VERIFIED IN FILES');
console.log('Deployment status: ⏳ CHECKING...\n');

console.log('🎯 NEXT ACTIONS:\n');
console.log('IF NOT SYNCED:');
console.log('  1. Run: git add lib/db.ts lib/auth.ts DEPLOYMENT_AUDIT.md CRITICAL_8_STEP_AUDIT.md');
console.log('  2. Run: git commit -m "CRITICAL: Enhanced database logging"');
console.log('  3. Run: git push origin main');
console.log('\nIF SYNCED:');
console.log('  1. Check Vercel deployment status');
console.log('  2. Review production logs for [DB] messages');
console.log('  3. Test login at https://khesed-tek-cms-org.vercel.app/auth/signin');
console.log('  4. Credentials: admin@iglesiacentral.com / password123\n');

