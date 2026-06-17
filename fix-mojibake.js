const fs = require('fs');
const path = require('path');
const replacements = {
  'ó': 'ó', 'á': 'á', 'é': 'é', 'í': 'í', 'ú': 'ú', 'ñ': 'ñ', 'ü': 'ü',
  'Ó': 'Ó', 'É': 'É', 'Ñ': 'Á', 'Ñ': 'Í', 'Ñš': 'Ú', 'Ñ': 'Ñ', 'Ñœ': 'Ü',
  '—': '—', '"': '"', ''': '"', ''™': "'", ''˜': "'", ''¦': '…'
};
function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.next') && !fullPath.includes('.git')) {
        walk(fullPath);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const [bad, good] of Object.entries(replacements)) {
        if (content.includes(bad)) {
          content = content.split(bad).join(good);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('✓', fullPath);
      }
    }
  }
}
console.log('🔧 Fixing mojibake characters...');
walk('.');
console.log('✅ Done.');
