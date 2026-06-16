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
  // 1. Read as buffer and remove BOM
  const buffer = fs.readFileSync(filePath);
  let contentBuffer = buffer;
  if (buffer.length >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
    contentBuffer = buffer.slice(3);
    console.log('Removed BOM from: ' + file);
  }
  // 2. Decode as latin1 bytes -> utf8 (reverses the mojibake)
  let content = contentBuffer.toString('utf8');
  content = Buffer.from(content, 'latin1').toString('utf8');
  // 3. Fix the specific broken quotes pattern
  // Pattern: "text —" text" should become "text —\" text"
  content = content.replace(/Ve a Miembros —" Haz clic/g, 'Ve a Miembros —\\" Haz clic');
  content = content.replace(/semanas —" Sistema sugiere/g, 'semanas —\\" Sistema sugiere');
  // 4. Write back as clean UTF-8 without BOM
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed: ' + file);
  fixedCount++;
});
console.log('\nTotal files fixed: ' + fixedCount);
