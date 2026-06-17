const fs = require('fs');
const path = require('path');
const dirsToScan = ['app', 'components', 'lib'];
// Regex para detectar mojibake real (SOLO patrones corruptos, NO caracteres válidos)
const mojibakeRegex = /\u00C3[\u0080-\u00BF]|\u00C2[\u00A0-\u00BF]|\u00E2\u20AC[\u201C-\u201D]|\u00EF\u00BF\u00BD/;
let errors = 0;
function checkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  files.forEach((f) => {
    const p = path.join(dir, f.name);
    if (f.isDirectory() && !p.includes('node_modules') && !p.includes('.next') && !p.includes('.git')) {
      checkDir(p);
    } else if (f.isFile() && (p.endsWith('.tsx') || p.endsWith('.ts'))) {
      const content = fs.readFileSync(p, 'utf8');
      if (mojibakeRegex.test(content)) {
        console.error('❌ Mojibake found in ' + p);
        errors++;
      }
    }
  });
}
dirsToScan.forEach(checkDir);
if (errors > 0) {
  console.error('\n❌ CI Quality Gate Failed: ' + errors + ' encoding errors found.');
  process.exit(1);
}
console.log('✅ CI Quality Gate Passed: No encoding errors found.');
process.exit(0);
