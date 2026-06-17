const fs = require('fs');
const path = require('path');
const replacements = {
  'ó': 'ó', 'á': 'á', 'é': 'é', 'í': 'í', 'ú': 'ú', 'ñ': 'ñ', 'ü': 'ü',
  'Ó': 'Ó', 'É': 'É', 'Ñ': 'Á', 'Ñ': 'Í', 'Ñš': 'Ú', 'Ñ': 'Ñ', 'Ñœ': 'Ü',
  '—': '—', '"': '"', ''': '"', ''™': "'", ''': "'", ''¦': '…',
  'Ñ¢Â€Â”': '—', 'Ñ¢Â€Âœ': '"', 'Ñ¢Â€': '"', 'Ñ¢Â€™': "'"
};
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fullPath.includes('node_modules') || fullPath.includes('.next') || fullPath.includes('.git')) continue;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      try {
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
      } catch (e) { console.error('Error:', fullPath, e.message); }
    }
  }
}
console.log('🔧 Fixing all source files...');
walk('.');
console.log('✅ Done.');
