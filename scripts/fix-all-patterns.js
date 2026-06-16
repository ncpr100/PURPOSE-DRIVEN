const fs = require('fs');
const files = [
  'app/(dashboard)/help/manual/phase-3-members/page.tsx',
  'app/(dashboard)/help/manual/phase-6-analytics/page.tsx'
];
const quote = String.fromCharCode(34);
const backslash = String.fromCharCode(92);
const escapedQuote = backslash + quote;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // 1. Remove all Unicode replacement characters
  content = content.replace(/\uFFFD/g, '');
  // 2. Fix pattern: em-dash followed by quote
  const emDash = String.fromCharCode(8212);
  content = content.split(emDash + quote).join(emDash + escapedQuote);
  // 3. Fix pattern: space + quote + space + uppercase letter (unescaped quotes in middle of strings)
  const space = String.fromCharCode(32);
  content = content.split(space + quote + space).join(space + escapedQuote + space);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed: ' + file);
});
console.log('Done');
