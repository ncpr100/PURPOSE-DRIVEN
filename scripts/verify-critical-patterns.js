#!/usr/bin/env node
/**
 * 🛡️ CRITICAL PATTERN VERIFICATION SYSTEM
 * 
 * Prevents fix reversions by scanning for problematic patterns
 * that have caused Railway deployment failures.
 * 
 * Usage: node scripts/verify-critical-patterns.js
 * Returns: exit code 0 (success) or 1 (patterns found)
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🛡️ CRITICAL PATTERN VERIFICATION SYSTEM');
console.log('========================================\n');

// Define problematic patterns that MUST be caught
const CRITICAL_PATTERNS = [
  {
    pattern: /include:\s*{\s*church:\s*true\s*}/g,
    replacement: 'include: { churches: true }',
    description: 'church → churches relation naming'
  },
  {
    pattern: /prisma\.automation_rulesTemplate/g,
    replacement: 'prisma.automation_rule_templates',
    description: 'automation_rulesTemplate → automation_rule_templates'
  },
  {
    pattern: /prisma\.automationExecution/g,
    replacement: 'prisma.automation_executions',
    description: 'automationExecution → automation_executions'
  },
  {
    pattern: /include:\s*{\s*automation:\s*{/g,
    replacement: 'include: { automations: {',
    description: 'automation → automations include relation'
  },
  {
    pattern: /prisma\.donation\b/g,
    replacement: 'prisma.donations',
    description: 'donation → donations model naming'
  },
  {
    pattern: /prisma\.event\b/g,
    replacement: 'prisma.events',
    description: 'event → events model naming'
  },
  // NEW PATTERNS FROM RECENT DEPLOYMENTS
  {
    pattern: /volunteer_assignmentss/g,
    replacement: 'volunteer_assignments',
    description: 'volunteer_assignmentss → volunteer_assignments (remove double s)'
  },
  {
    pattern: /resourceReservations/g,
    replacement: 'event_resource_reservations',
    description: 'resourceReservations → event_resource_reservations'
  },
  {
    pattern: /\.create\(\s*\{\s*data:\s*\{(?![^}]*id:)/g,
    replacement: '.create({ data: { id: nanoid(),',
    description: 'Missing id: nanoid() in create operations'
  },
  {
    pattern: /prisma\.volunteer\b/g,
    replacement: 'prisma.volunteers',
    description: 'volunteer → volunteers model naming'
  }
];

// Files to scan (TypeScript API routes primarily)
const SCAN_PATTERNS = [
  'app/api/**/*.ts',
  'lib/**/*.ts',
  'components/**/*.tsx',
  'app/**/page.tsx'
];

let totalIssues = 0;
const issuesFound = [];

async function scanFiles() {
  console.log('📁 Scanning files for critical patterns...\n');

  for (const scanPattern of SCAN_PATTERNS) {
    const files = glob.sync(scanPattern, { cwd: '/workspaces/PURPOSE-DRIVEN' });
    
    for (const file of files) {
      const filePath = path.join('/workspaces/PURPOSE-DRIVEN', file);
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        for (const { pattern, replacement, description } of CRITICAL_PATTERNS) {
          const matches = content.match(pattern);
          
          if (matches) {
            totalIssues += matches.length;
            issuesFound.push({
              file: file,
              pattern: pattern.toString(),
              replacement,
              description,
              matches: matches.length,
              content: content
            });
            
            console.log(`❌ CRITICAL ISSUE FOUND:`);
            console.log(`   File: ${file}`);
            console.log(`   Pattern: ${description}`);
            console.log(`   Matches: ${matches.length}`);
            console.log(`   Fix: ${replacement}\n`);
          }
        }
      } catch (error) {
        console.warn(`⚠️  Could not read file: ${file}`);
      }
    }
  }
}

async function generateFixScript() {
  if (issuesFound.length === 0) return;

  console.log('🔧 Generating automatic fix script...\n');

  let fixScript = `#!/bin/bash
# 🔧 AUTOMATIC PATTERN FIX SCRIPT
# Generated: ${new Date().toISOString()}
# Issues found: ${totalIssues}

set -e
cd /workspaces/PURPOSE-DRIVEN

echo "🔧 Applying ${totalIssues} critical pattern fixes..."

`;

  for (const issue of issuesFound) {
    // Generate sed commands for each pattern
    const sedPattern = issue.pattern.toString()
      .replace(/^\//, '')
      .replace(/\/g$/, '')
      .replace(/\\/g, '\\\\')
      .replace(/\//g, '\\/');
    
    fixScript += `# Fix: ${issue.description} in ${issue.file}\n`;
    fixScript += `sed -i 's/${sedPattern}/${issue.replacement.replace(/\//g, '\\/')}/g' "${issue.file}"\n\n`;
  }

  fixScript += `
echo "✅ All ${totalIssues} critical patterns fixed!"
echo "🚀 Ready for git commit and Railway deployment"

# Optional: Automatically commit and push
# git add .
# git commit -m "fix: automatic critical pattern fixes - prevent Railway deployment failures"
# git push
`;

  fs.writeFileSync('/workspaces/PURPOSE-DRIVEN/scripts/apply-critical-fixes.sh', fixScript);
  fs.chmodSync('/workspaces/PURPOSE-DRIVEN/scripts/apply-critical-fixes.sh', '755');

  console.log('📝 Fix script generated: scripts/apply-critical-fixes.sh');
  console.log('💡 Run: bash scripts/apply-critical-fixes.sh');
}

async function main() {
  await scanFiles();
  
  if (totalIssues === 0) {
    console.log('✅ SUCCESS: No critical patterns found!');
    console.log('🚀 All systems ready for Railway deployment\n');
    process.exit(0);
  } else {
    console.log(`❌ CRITICAL: Found ${totalIssues} problematic patterns`);
    console.log('🛑 These WILL cause Railway deployment failures!\n');
    
    await generateFixScript();
    
    console.log('⚡ NEXT STEPS:');
    console.log('1. Run: bash scripts/apply-critical-fixes.sh');
    console.log('2. Commit and push changes');
    console.log('3. Re-run this verification script\n');
    
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { CRITICAL_PATTERNS, scanFiles };