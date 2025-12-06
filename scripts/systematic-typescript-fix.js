#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 SYSTEMATIC TYPESCRIPT ERROR FIXER');
console.log('=====================================');

// Pattern 1: Missing nanoid imports and id fields in create operations
const NANOID_PATTERNS = [
  // Files that need nanoid import and id field
  'app/api/**/*route.ts',
  'lib/**/*.ts'
];

// Pattern 2: Model name fixes (camelCase → snake_case)
const MODEL_FIXES = {
  'AutomationCondition': 'automation_conditions',
  'AutomationAction': 'automation_actions', 
  'aIModelABTest': 'ai_model_ab_tests',
  'prayerContact': 'prayer_contacts',
  'prayerCategory': 'prayer_categories'
};

// Pattern 3: Common type fixes
const TYPE_FIXES = {
  'impact: string': 'impact: "high" | "medium" | "low"',
  'effort: string': 'effort: "high" | "medium" | "low"'
};

function findFilesWithPattern(pattern, directory = '.') {
  try {
    const files = execSync(`find ${directory} -name "*.ts" -type f | grep -E "(api|lib)" | head -50`, 
      { encoding: 'utf8', cwd: '/workspaces/PURPOSE-DRIVEN' })
      .split('\n')
      .filter(f => f.trim());
    return files;
  } catch (e) {
    return [];
  }
}

function fixFile(filePath) {
  try {
    const fullPath = `/workspaces/PURPOSE-DRIVEN/${filePath}`;
    if (!fs.existsSync(fullPath)) return false;
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;
    
    // Fix 1: Add nanoid import if missing and file has .create( operations
    if (content.includes('.create(') && !content.includes("import { nanoid }")) {
      const importIndex = content.indexOf('import');
      if (importIndex !== -1) {
        content = content.slice(0, importIndex) + 
          "import { nanoid } from 'nanoid'\n" + 
          content.slice(importIndex);
        changed = true;
      }
    }
    
    // Fix 2: Add missing id fields in create operations
    const createDataRegex = /(\.create\(\s*\{\s*data:\s*\{)/g;
    if (createDataRegex.test(content) && !content.includes('id: nanoid()')) {
      content = content.replace(
        /(\.create\(\s*\{\s*data:\s*\{)(\s*)/g,
        '$1$2id: nanoid(),$2'
      );
      changed = true;
    }
    
    // Fix 3: Model name fixes
    Object.entries(MODEL_FIXES).forEach(([wrong, correct]) => {
      const regex = new RegExp(`\\b${wrong}\\b`, 'g');
      if (content.includes(wrong)) {
        content = content.replace(regex, correct);
        changed = true;
      }
    });
    
    // Fix 4: Type fixes
    Object.entries(TYPE_FIXES).forEach(([wrong, correct]) => {
      if (content.includes(wrong)) {
        content = content.replace(new RegExp(wrong, 'g'), correct);
        changed = true;
      }
    });
    
    if (changed) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (e) {
    console.error(`❌ Error fixing ${filePath}:`, e.message);
    return false;
  }
}

function main() {
  const files = findFilesWithPattern();
  let fixedCount = 0;
  
  console.log(`📁 Found ${files.length} TypeScript files to check...`);
  
  files.forEach(file => {
    if (fixFile(file)) {
      fixedCount++;
    }
  });
  
  console.log(`\n🎉 SYSTEMATIC FIX COMPLETE!`);
  console.log(`📊 Fixed ${fixedCount} files`);
  console.log('\n🧪 Running TypeScript check...');
  
  try {
    execSync('npm run test:compile', { 
      cwd: '/workspaces/PURPOSE-DRIVEN',
      stdio: 'pipe' 
    });
    console.log('✅ TypeScript compilation successful!');
  } catch (e) {
    const errors = e.stdout ? e.stdout.toString() : '';
    const errorCount = (errors.match(/error TS/g) || []).length;
    console.log(`⚠️  ${errorCount} TypeScript errors remaining`);
  }
}

main();