const fs = require('fs');
const path = require('path');
const mojibakeMap = {
  'ó': 'ó', 'á': 'á', 'é': 'é', 'í': 'í', 'ú': 'ú',
  'É': 'É', 'Ó': 'Ó', 'Í': 'Á', 'Í': 'Í', 'Íš': 'Ú',
  'Í±': 'ñ', 'Í‘': 'Ñ', 'Í¼': 'ü', 'Íœ': 'Ü',
  '–': '—', '–': '–', '“': '\u201C', '†': '\u201D',
  '†˜': '\u2018', '†™': '\u2019', '†¦': '…', '†': '†', '†¡': '‡',
  '€': '€', '°': '°', '©': '©', '®': '®', '™': '™',
  '': '', '': '', '\uFFFD': ''
};
let filesFixed = 0;
let filesScanned = 0;
function fixMojibake(content) {
  let fixed = content;
  for (const [bad, good] of Object.entries(mojibakeMap)) {
    fixed = fixed.split(bad).join(good);
  }
  return fixed;
}
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file === 'node_modules' || file === '.next' || file === '.git' || file === 'PURPOSE-DRIVEN') {
        continue;
      }
      walkDir(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      filesScanned++;
      try {
        const originalContent = fs.readFileSync(filePath, 'utf8');
        const fixedContent = fixMojibake(originalContent);
        if (fixedContent !== originalContent) {
          fs.writeFileSync(filePath, fixedContent, 'utf8');
          filesFixed++;
          console.log('✓ ' + filePath);
        }
      } catch (err) {
        console.error('✗ ' + filePath + ': ' + err.message);
      }
    }
  }
}
console.log('🔧 Iniciando corrección masiva de mojibake...\n');
walkDir('.');
console.log('\n✅ Resumen:');
console.log('   Archivos escaneados: ' + filesScanned);
console.log('   Archivos corregidos: ' + filesFixed);
console.log('   Archivos sin cambios: ' + (filesScanned - filesFixed));
