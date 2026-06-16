const fs = require('fs');
const path = require('path');
const files = process.argv.slice(2);
let hasErrors = false;
const mojibakeRegex = /Ã|â€|Â¡|Â¿/;
files.forEach(file => {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  // 1. Check for Mojibake
  if (mojibakeRegex.test(content)) {
    console.error('❌ Encoding error (Mojibake) detected in: ' + file);
    hasErrors = true;
  }
  // 2. Lucide-React Import Check - improved to avoid false positives
  // Match patterns like "icon: IconName" but exclude:
  // - Destructured parameters: ({ icon: Icon })
  // - Type definitions: icon: IconType
  // - Variable assignments: const icon: IconType
  const lines = content.split('\n');
  lines.forEach((line, lineNum) => {
    // Skip if line is a function parameter destructuring
    if (line.includes('({') || line.includes('({ ') || line.match(/^\s*\(\s*{/)) {
      return;
    }
    // Skip if line is a type definition
    if (line.includes(': IconType') || line.includes(': LucideIcon')) {
      return;
    }
    const iconUsageMatches = line.match(/icon:\s*([A-Z][a-zA-Z0-9]*)/g);
    if (iconUsageMatches) {
      iconUsageMatches.forEach(match => {
        const iconName = match.replace('icon:', '').trim();
        // Skip common parameter names that aren't actual icons
        if (iconName === 'Icon' || iconName === 'IconType' || iconName === 'LucideIcon') {
          return;
        }
        const importRegex = new RegExp('import\\s*{[^}]*\\b' + iconName + '\\b[^}]*}\\s*from\\s*["\']lucide-react["\']');
        if (!importRegex.test(content)) {
          console.error('❌ Icon \'' + iconName + '\' is used but not imported from lucide-react in: ' + file + ' (line ' + (lineNum + 1) + ')');
          hasErrors = true;
        }
      });
    }
  });
});
if (hasErrors) {
  console.error('\nPre-commit validation failed. Please fix the errors above.');
  process.exit(1);
}
console.log('✅ Pre-commit validation passed.');
process.exit(0);
