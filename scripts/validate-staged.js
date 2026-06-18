const fs = require('fs');
const path = require('path');
const files = process.argv.slice(2);
let hasErrors = false;
// Regex corregido: solo detectar mojibake REAL (Windows-1252 mal interpretado)
const mojibakeRegex = /\u00C3[\u0080-\u00BF]|\u00C2[\u00A0-\u00BF]|\u00E2\u20AC[\u201C-\u201D]|\u00EF\u00BF\u00BD/;
files.forEach(file => {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  if (mojibakeRegex.test(content)) {
    console.error('❌ Encoding error (Mojibake) detected in: ' + file);
    hasErrors = true;
  }
  // Lucide-React Import Check
  const lines = content.split('\n');
  lines.forEach((line, lineNum) => {
    if (line.includes('({') || line.includes('({ ') || line.match(/^\s*\(\s*{/)) return;
    if (line.includes(': IconType') || line.includes(': LucideIcon')) return;
    const iconUsageMatches = line.match(/icon:\s*([A-Z][a-zA-Z0-9]*)/g);
    if (iconUsageMatches) {
      iconUsageMatches.forEach(match => {
        const iconName = match.replace('icon:', '').trim();
        if (iconName === 'Icon' || iconName === 'IconType' || iconName === 'LucideIcon') return;
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
