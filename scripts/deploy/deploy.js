const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const workDir = '/workspaces/PURPOSE-DRIVEN';
const logFile = path.join(workDir, 'deploy-result.log');

function log(message) {
  const line = `${new Date().toISOString()} - ${message}\n`;
  console.log(message);
  fs.appendFileSync(logFile, line);
}

function exec(command) {
  log(`Running: ${command}`);
  try {
    const output = execSync(command, { 
      cwd: workDir, 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    log(`✅ Success: ${output.substring(0, 200)}`);
    return output;
  } catch (error) {
    log(`❌ Error: ${error.message}`);
    if (error.stdout) log(`stdout: ${error.stdout}`);
    if (error.stderr) log(`stderr: ${error.stderr}`);
    throw error;
  }
}

try {
  log('🚀 STARTING DEPLOYMENT');
  
  // Configure git if needed
  try {
    exec('git config user.name');
  } catch (e) {
    exec('git config --global user.name "Copilot Agent"');
    exec('git config --global user.email "copilot@khesed-tek.com"');
  }
  
  // Check status
  log('\n📋 Git Status:');
  const status = exec('git status --short');
  log(status || 'No changes');
  
  // Add files
  log('\n📝 Staging files...');
  exec('git add lib/db.ts lib/auth.ts DEPLOYMENT_AUDIT.md');
  
  // Commit
  log('\n💾 Committing...');
  try {
    exec('git commit -m "CRITICAL: Enhanced database logging & connection testing"');
  } catch (e) {
    if (e.message.includes('nothing to commit')) {
      log('⚠️  Nothing to commit (already committed)');
    } else {
      throw e;
    }
  }
  
  // Push
  log('\n🌐 Pushing to GitHub...');
  const pushOutput = exec('git push origin main');
  log(pushOutput);
  
  log('\n✅ DEPLOYMENT COMPLETE!');
  log('⏳ Vercel will rebuild in 2-3 minutes');
  log('📋 Test at: https://khesed-tek-cms-org.vercel.app/auth/signin');
  
} catch (error) {
  log(`\n❌ DEPLOYMENT FAILED: ${error.message}`);
  process.exit(1);
}
