const fs = require('fs');
const path = require('path');
const files = [
  'app/(dashboard)/help/manual/phase-3-members/page.tsx',
  'app/(dashboard)/help/manual/phase-6-analytics/page.tsx'
];
let fixedCount = 0;
files.forEach(file => {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) {
    console.log('Not found: ' + file);
    return;
  }
  const buffer = fs.readFileSync(filePath);
  let contentBuffer = buffer;
  if (buffer.length >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
    contentBuffer = buffer.slice(3);
    console.log('Removed BOM from: ' + file);
  }
  let content = contentBuffer.toString('utf8');
  content = Buffer.from(content, 'latin1').toString('utf8');
  const emDash = '\u2014';
  const pattern = new RegExp(emDash + '"', 'g');
  const replacement = emDash + '\\"';
  content = content.replace(pattern, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed: ' + file);
  fixedCount++;
});
console.log('\nTotal files fixed: ' + fixedCount);
