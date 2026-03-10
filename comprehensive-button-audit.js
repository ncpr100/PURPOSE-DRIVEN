#!/usr/bin/env node

/**
 * COMPREHENSIVE BUTTON & FUNCTIONALITY AUDIT TOOL
 * 
 * This tool will systematically test ALL buttons, tabs, and interactive elements
 * across the entire application to identify non-functional elements.
 * 
 * Protocol Violation Response: Testing EVERY SINGLE BUTTON for functionality
 */

const fs = require('fs');
const path = require('path');

console.log('🚨 COMPREHENSIVE BUTTON & FUNCTIONALITY AUDIT');
console.log('Protocol Violation Response: Testing ALL interactive elements\n');

// Define all UI files to audit
const UI_FILES = [
  // Volunteer Module
  'app/(dashboard)/volunteers/_components/volunteers-client.tsx',
  'app/(dashboard)/volunteers/page.tsx',
  
  // Member Module  
  'app/(dashboard)/members/_components/members-client.tsx',
  'components/members/enhanced-member-form.tsx',
  
  // Dashboard & Navigation
  'app/(dashboard)/layout.tsx',
  'components/ui/button.tsx',
  
  // Forms & Dialogs
  'app/(dashboard)/form-builder/_components/branded-form-builder.tsx',
  
  // Analytics Modules
  'app/(dashboard)/analytics/_components/analytics-page-client.tsx',
  'app/(dashboard)/intelligent-analytics/_components/intelligent-analytics-client.tsx'
];

// Button patterns to search for
const BUTTON_PATTERNS = [
  // Button components
  { pattern: '<Button', type: 'Component Button' },
  { pattern: 'onClick={', type: 'Click Handler' },
  { pattern: 'onSubmit={', type: 'Form Submit' },
  { pattern: 'handleClick', type: 'Click Function' },
  { pattern: 'handleSubmit', type: 'Submit Function' },
  { pattern: 'handleSave', type: 'Save Function' },
  { pattern: 'handleOpen', type: 'Open Dialog Function' },
  { pattern: 'handleClose', type: 'Close Dialog Function' },
  
  // Tab components
  { pattern: '<TabsList', type: 'Tab List' },
  { pattern: '<TabsTrigger', type: 'Tab Trigger' },
  { pattern: '<TabsContent', type: 'Tab Content' },
  
  // Form components
  { pattern: '<form', type: 'Form Element' },
  { pattern: 'type="submit"', type: 'Submit Input' },
  { pattern: 'type="button"', type: 'Button Input' },
  
  // Dialog components
  { pattern: '<Dialog', type: 'Dialog Component' },
  { pattern: 'DialogTrigger', type: 'Dialog Trigger' },
  { pattern: 'DialogContent', type: 'Dialog Content' }
];

// Critical button texts to find
const CRITICAL_BUTTONS = [
  'Ver Perfil',
  'Asignar Actividad', 
  'Guardar',
  'Guardar Habilidades',
  'Guardar y Cerrar',
  'Crear',
  'Editar',
  'Eliminar',
  'Nuevo Voluntario',
  'Asignar Tarea',
  'Completar Evaluación',
  'Enviar',
  'Cancelar',
  'Cerrar'
];

function auditFile(filePath) {
  try {
    const fullPath = path.join('/workspaces/PURPOSE-DRIVEN', filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ File not found: ${filePath}`);
      return { found: false, buttons: [], issues: ['File not found'] };
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    
    console.log(`\n📁 AUDITING: ${filePath}`);
    console.log('='.repeat(60));
    
    let foundButtons = [];
    let foundPatterns = [];
    let issues = [];
    
    // Search for button patterns
    BUTTON_PATTERNS.forEach(({ pattern, type }) => {
      const matches = content.match(new RegExp(pattern, 'g'));
      if (matches) {
        foundPatterns.push({ type, count: matches.length });
        console.log(`  ✅ ${type}: ${matches.length} found`);
      }
    });
    
    // Search for critical button text
    CRITICAL_BUTTONS.forEach(buttonText => {
      if (content.includes(buttonText)) {
        foundButtons.push(buttonText);
        console.log(`  🔵 BUTTON TEXT: "${buttonText}" found`);
        
        // Check if button has proper onClick handler
        const buttonRegex = new RegExp(`.*${buttonText}.*`, 'g');
        const buttonLines = content.match(buttonRegex);
        
        if (buttonLines) {
          buttonLines.forEach(line => {
            if (!line.includes('onClick') && !line.includes('onSubmit')) {
              issues.push(`Button "${buttonText}" may be missing click handler`);
              console.log(`  ⚠️  WARNING: "${buttonText}" may be missing click handler`);
            }
          });
        }
      }
    });
    
    // Check for common issues
    if (content.includes('activeTab ===') && content.includes('? (') && content.includes(') : null')) {
      issues.push('Conditional rendering pattern detected - may cause tab content blocking');
      console.log('  ⚠️  WARNING: Conditional rendering pattern detected');
    }
    
    if (content.includes('console.log') && content.includes('clicked')) {
      console.log('  ✅ DEBUG: Debug logging found in click handlers');
    }
    
    // Check for error handling
    if (content.includes('try {') && content.includes('catch')) {
      console.log('  ✅ ERROR HANDLING: Try-catch blocks found');
    }
    
    if (foundButtons.length === 0 && foundPatterns.length === 0) {
      console.log('  ❌ NO INTERACTIVE ELEMENTS FOUND');
    }
    
    return {
      found: true,
      buttons: foundButtons,
      patterns: foundPatterns,
      issues: issues,
      hasDebugLogging: content.includes('console.log') && content.includes('clicked'),
      hasErrorHandling: content.includes('try {') && content.includes('catch')
    };
    
  } catch (error) {
    console.log(`  ❌ ERROR reading file: ${error.message}`);
    return { found: false, buttons: [], issues: [`Error: ${error.message}`] };
  }
}

function generateAuditReport(results) {
  console.log('\n' + '='.repeat(80));
  console.log('📊 COMPREHENSIVE AUDIT REPORT');
  console.log('='.repeat(80));
  
  let totalButtons = 0;
  let totalIssues = 0;
  let criticalFiles = [];
  
  results.forEach((result, index) => {
    const file = UI_FILES[index];
    
    if (result.found) {
      totalButtons += result.buttons.length;
      totalIssues += result.issues.length;
      
      if (result.issues.length > 0) {
        criticalFiles.push({ file, issues: result.issues });
      }
    }
  });
  
  console.log(`\n📈 STATISTICS:`);
  console.log(`  Total Files Audited: ${UI_FILES.length}`);
  console.log(`  Total Button Texts Found: ${totalButtons}`);
  console.log(`  Total Issues Detected: ${totalIssues}`);
  console.log(`  Critical Files: ${criticalFiles.length}`);
  
  if (criticalFiles.length > 0) {
    console.log(`\n🚨 CRITICAL ISSUES FOUND:`);
    criticalFiles.forEach(({ file, issues }) => {
      console.log(`\n  📁 ${file}:`);
      issues.forEach(issue => {
        console.log(`    ❌ ${issue}`);
      });
    });
  }
  
  console.log(`\n🔧 RECOMMENDED ACTIONS:`);
  if (totalIssues > 0) {
    console.log(`  1. FIX ${totalIssues} identified issues immediately`);
    console.log(`  2. TEST each button manually in browser`);
    console.log(`  3. Add comprehensive error handling to all click handlers`);
    console.log(`  4. Remove conditional rendering blocking tab content`);
    console.log(`  5. Verify all buttons have proper onClick handlers`);
  } else {
    console.log(`  1. Manual testing required - code appears correct`);
    console.log(`  2. Check browser console for JavaScript errors`);
    console.log(`  3. Verify state management and component rendering`);
    console.log(`  4. Test actual user workflows end-to-end`);
  }
  
  return { totalButtons, totalIssues, criticalFiles };
}

// Main audit execution
function runComprehensiveAudit() {
  console.log('🔍 Starting comprehensive button audit...\n');
  
  const results = UI_FILES.map(auditFile);
  const report = generateAuditReport(results);
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ AUDIT COMPLETE');
  console.log('='.repeat(80));
  
  if (report.totalIssues > 0) {
    console.log(`❌ FAILED: ${report.totalIssues} issues found requiring immediate fixes`);
    process.exit(1);
  } else {
    console.log('✅ PASSED: No obvious code issues - manual testing required');
  }
}

if (require.main === module) {
  runComprehensiveAudit();
}

module.exports = { auditFile, runComprehensiveAudit };