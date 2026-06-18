const fs = require('fs');
const path = require('path');
// Patrones mojibake comunes y sus reemplazos correctos
const replacements = [
  // Vocales con acento
  ['ó', 'ó'], ['á', 'á'], ['é', 'é'], ['í', 'í'], ['ú', 'ú'],
  ['É', 'É'], ['Ó', 'Ó'], ['Í', 'Á'], ['Í', 'Í'], ['Íš', 'Ú'],
  // Ñ y Ü
  ['Í±', 'ñ'], ['Í‘', 'Ñ'], ['Í¼', 'ü'], ['Íœ', 'Ü'],
  // Puntuación y símbolos
  ['–', '—'], ['–', '–'], ['†˜', '\u2018'], ['†™', '\u2019'],
  ['“', '\u201C'], ['†', '\u201D'], ['†¦', '…'], ['†', '†'], ['†¡', '‡'],
  ['€', '€'], ['', ''], ['', '']
];
let totalFixed = 0;
let filesFixed = [];
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file === 'node_modules' || file === '.next' || file === '.git') continue;
      walkDir(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        for (const [bad, good] of replacements) {
          content = content.split(bad).join(good);
        }
        if (content !== originalContent) {
          fs.writeFileSync(filePath, content, 'utf8');
          filesFixed.push(filePath);
          totalFixed++;
        }
      } catch (err) {
        console.error(Error processing C:\Users\nchyd\KT-CMS\KT-CMS\app\(auth)\auth\mfa\page.tsx:, err.message);
      }
    }
  }
}
console.log('🔧 Starting mass mojibake fix...\n');
walkDir('.');
console.log(\n✅ Fixed  files);
if (filesFixed.length > 0) {
  console.log('\nFirst 20 fixed files:');
  filesFixed.slice(0, 20).forEach(f => console.log(  - ));
}
