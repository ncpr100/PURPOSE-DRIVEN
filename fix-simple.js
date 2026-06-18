const fs = require('fs');
const path = require('path');
const replacements = [
  ['ó', 'ó'], ['á', 'á'], ['é', 'é'], ['í', 'í'], ['ú', 'ú'],
  ['ñ', 'ñ'], ['ü', 'ü'], ['É', 'É'], ['Ó', 'Ó'], ['Á', 'Á'],
  ['Á', 'Í'], ['Áš', 'Ú'], ['Á‘', 'Ñ'], ['Áœ', 'Ü'],
  ['—', '—'], ['—', '–'], ['"', '"'], ['"', '"'],
  ['"™', "'"], ['"˜', "'"], ['"¦', '…'],
  ['€', '€'], ['°', '°'], ['©', '©'], ['®', '®'], ['™', '™'],
  ['', ''], ['', '']
];
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  for (const [bad, good] of replacements) {
    content = content.split(bad).join(good);
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}
function walk(dir) {
  let fixed = 0;
  let scanned = 0;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (['node_modules', '.next', '.git', 'PURPOSE-DRIVEN'].includes(item)) continue;
      const res = walk(full);
      fixed += res.fixed;
      scanned += res.scanned;
    } else if (/\.(ts|tsx|js|jsx)$/.test(item)) {
      scanned++;
      if (fixFile(full)) {
        console.log('Fixed: ' + full);
        fixed++;
      }
    }
  }
  return { fixed, scanned };
}
console.log('Scanning and fixing all files...');
const res = walk('.');
console.log('Done.');
console.log('Fixed: ' + res.fixed);
console.log('Scanned: ' + res.scanned);
