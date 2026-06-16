const fs = require('fs');
const path = require('path');
const problemFiles = [
  'app/(dashboard)/help/manual/phase-3-members/page.tsx',
  'app/(dashboard)/help/manual/phase-6-analytics/page.tsx',
  'app/api/auth/mfa/verify/route.ts',
  'app/api/monitoring/collect/route.ts'
];
let fixedCount = 0;
problemFiles.forEach(file => {
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
  const originalContent = content;
  content = content.replace(/\u00E2\u2A20/g, '\u2014');
  content = content.replace(/\u00D2\u00B3/g, '\u00F3');
  content = content.replace(/\u00D2\u00A9/g, '\u00E9');
  content = content.replace(/\u00D2\u00AD/g, '\u00ED');
  content = content.replace(/\u00D2\u00BA/g, '\u00FA');
  content = content.replace(/\u00D2\u00B1/g, '\u00F1');
  content = content.replace(/\uFFFD/g, '');
  content = content.replace(/\u00C3\u00A1/g, '\u00E1');
  content = content.replace(/\u00C3\u00A9/g, '\u00E9');
  content = content.replace(/\u00C3\u00AD/g, '\u00ED');
  content = content.replace(/\u00C3\u00B3/g, '\u00F3');
  content = content.replace(/\u00C3\u00BA/g, '\u00FA');
  content = content.replace(/\u00C3\u00B1/g, '\u00F1');
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed: ' + file);
    fixedCount++;
  } else {
    console.log('No changes: ' + file);
  }
});
console.log('\nTotal files fixed: ' + fixedCount);
