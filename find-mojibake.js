const fs = require('fs');
const path = require('path');
// Regex del script de validación
const mojibakeRegex = /\u00C3[\u0080-\u00BF]|\u00C2[\u00A0-\u00BF]|\u00E2\u20AC[\u201C-\u201D]|\u00EF\u00BF\u00BD/;
function findMojibake(dir) {
  const results = [];
  function walk(currentPath) {
    const files = fs.readdirSync(currentPath);
    for (const file of files) {
      const filePath = path.join(currentPath, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        if (file !== 'node_modules' && file !== '.git' && file !== '.next') {
          walk(filePath);
        }
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (mojibakeRegex.test(content)) {
          results.push(filePath);
        }
      }
    }
  }
  walk(dir);
  return results;
}
console.log('🔍 Buscando archivos con Mojibake...\n');
const files = findMojibake('.');
if (files.length === 0) {
  console.log('✅ No se encontraron archivos con Mojibake');
} else {
  console.log(`❌ Se encontraron ${files.length} archivos con Mojibake:\n`);
  files.forEach(f => console.log('  - ' + f));
}
