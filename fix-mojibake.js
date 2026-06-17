const fs = require('fs');
const path = require('path');
const replacements = {
  'Ã³': 'ó', 'Ã¡': 'á', 'Ã©': 'é', 'Ã­': 'í', 'Ãº': 'ú', 'Ã±': 'ñ', 'Ã¼': 'ü',
  'Ã“': 'Ó', 'Ã‰': 'É', 'Ã': 'Á', 'Ã': 'Í', 'Ãš': 'Ú', 'Ã': 'Ñ', 'Ãœ': 'Ü',
  'â€"': '—', 'â€œ': '"', 'â€': '"', 'â€™': "'", 'â€˜': "'", 'â€¦': '…'
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
