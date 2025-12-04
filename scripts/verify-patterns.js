#!/usr/bin/env node

/**
 * KHESED-TEK PATTERN VERIFICATION SYSTEM
 * 
 * This script prevents the church vs churches pattern regression from happening again.
 * It scans all TypeScript files for problematic patterns and fails if any are found.
 * 
 * Usage:
 * - npm run verify:patterns (manual run)
 * - Called automatically in git pre-commit hook
 * - Called automatically before Railway deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 KHESED-TEK PATTERN VERIFICATION SYSTEM');
console.log('=========================================');

// Define problematic patterns that caused Railway deployment failures
const FORBIDDEN_PATTERNS = [
  {
    pattern: /include:\s*{\s*church:\s*true\s*}/g,
    replacement: 'include: { churches: true }',
    description: 'church should be churches in include statements',
    severity: 'CRITICAL'
  },
  {
    pattern: /prisma\.automationExecution\./g,
    replacement: 'prisma.automation_executions.',
    description: 'automationExecution should be automation_executions',
    severity: 'CRITICAL'
  },
  {
    pattern: /include:\s*{\s*automation:\s*{/g,
    replacement: 'include: { automations: {',
    description: 'automation should be automations in include statements',
    severity: 'CRITICAL'
  },
  {
    pattern: /exec\.automation\?\.name/g,
    replacement: 'exec.automations?.name',
    description: 'exec.automation should be exec.automations',
    severity: 'CRITICAL'
  }
];

// Files to scan (TypeScript files in critical areas)
const SCAN_PATTERNS = [
  'app/api/**/*.ts',
  'app/api/**/*.tsx',
  'lib/**/*.ts',
  'components/**/*.ts',
  'components/**/*.tsx'
];

/**
 * Get all files matching the scan patterns
 */
function getFilesToScan() {
  const files = [];
  
  for (const pattern of SCAN_PATTERNS) {
    try {
      const globFiles = execSync(`find . -path "./node_modules" -prune -o -name "*.ts" -o -name "*.tsx" | grep -E "(app/api|lib|components)" | grep -v node_modules`, 
        { encoding: 'utf8', cwd: process.cwd() }).trim().split('\n').filter(f => f);
      files.push(...globFiles);
    } catch (error) {
      // Continue if find command fails
    }
  }
  
  return [...new Set(files)]; // Remove duplicates
}

/**
 * Scan a single file for problematic patterns
 */
function scanFile(filePath) {
  const violations = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    for (const forbiddenPattern of FORBIDDEN_PATTERNS) {
      const matches = [...content.matchAll(forbiddenPattern.pattern)];
      
      for (const match of matches) {
        // Find line number
        const beforeMatch = content.substring(0, match.index);
        const lineNumber = beforeMatch.split('\n').length;
        const lineContent = lines[lineNumber - 1];
        
        violations.push({
          file: filePath,
          line: lineNumber,
          content: lineContent.trim(),
          pattern: forbiddenPattern,
          match: match[0]
        });
      }
    }
  } catch (error) {
    console.error(`❌ Error scanning ${filePath}:`, error.message);
  }
  
  return violations;
}

/**
 * Main verification function
 */
function verifyPatterns() {
  console.log('🔍 Scanning for problematic patterns...\n');
  
  const filesToScan = getFilesToScan();
  console.log(`📁 Scanning ${filesToScan.length} files...\n`);
  
  let totalViolations = 0;
  const violationsByFile = {};
  
  for (const file of filesToScan) {
    const violations = scanFile(file);
    
    if (violations.length > 0) {
      violationsByFile[file] = violations;
      totalViolations += violations.length;
    }
  }
  
  // Report results
  if (totalViolations === 0) {
    console.log('✅ SUCCESS: No problematic patterns found!');
    console.log('🎉 All church vs churches patterns are correct!');
    console.log('🚀 Railway deployment should succeed!');
    return true;
  } else {
    console.log(`❌ FAILURE: Found ${totalViolations} problematic patterns!\n`);
    
    for (const [file, violations] of Object.entries(violationsByFile)) {
      console.log(`📄 ${file}:`);
      
      for (const violation of violations) {
        console.log(`  ❌ Line ${violation.line}: ${violation.pattern.description}`);
        console.log(`     Found: ${violation.match}`);
        console.log(`     Should be: ${violation.pattern.replacement}`);
        console.log(`     Severity: ${violation.pattern.severity}`);
        console.log(`     Code: ${violation.content}\n`);
      }
    }
    
    console.log('🛠️  FIX REQUIRED: Please fix these patterns before deploying!');
    console.log('📖 Reference: BACKUP_RECOVERY_GUIDE.md for pattern fixes');
    
    return false;
  }
}

/**
 * Auto-fix function (optional)
 */
function autoFix() {
  console.log('🔧 AUTO-FIX MODE: Attempting to fix patterns automatically...\n');
  
  const filesToScan = getFilesToScan();
  let fixedFiles = 0;
  let totalFixes = 0;
  
  for (const file of filesToScan) {
    try {
      let content = fs.readFileSync(file, 'utf8');
      let fileChanged = false;
      
      for (const forbiddenPattern of FORBIDDEN_PATTERNS) {
        const beforeContent = content;
        content = content.replace(forbiddenPattern.pattern, forbiddenPattern.replacement);
        
        if (beforeContent !== content) {
          fileChanged = true;
          const fixes = (beforeContent.match(forbiddenPattern.pattern) || []).length;
          totalFixes += fixes;
          console.log(`✅ Fixed ${fixes} instances in ${file}: ${forbiddenPattern.description}`);
        }
      }
      
      if (fileChanged) {
        fs.writeFileSync(file, content, 'utf8');
        fixedFiles++;
      }
    } catch (error) {
      console.error(`❌ Error auto-fixing ${file}:`, error.message);
    }
  }
  
  if (totalFixes > 0) {
    console.log(`\n🎉 AUTO-FIX COMPLETE: Fixed ${totalFixes} patterns in ${fixedFiles} files!`);
    console.log('🔄 Please commit these changes and redeploy.');
    return true;
  } else {
    console.log('\n✅ No patterns needed fixing.');
    return false;
  }
}

// Command line interface
const args = process.argv.slice(2);

if (args.includes('--fix')) {
  autoFix();
  verifyPatterns();
} else if (args.includes('--help')) {
  console.log(`
Usage:
  node scripts/verify-patterns.js           # Verify patterns (exit code 1 if violations found)
  node scripts/verify-patterns.js --fix     # Auto-fix patterns, then verify
  node scripts/verify-patterns.js --help    # Show this help

Exit codes:
  0 = Success (no violations)
  1 = Failure (violations found)
  2 = Error during execution
`);
} else {
  const success = verifyPatterns();
  process.exit(success ? 0 : 1);
}