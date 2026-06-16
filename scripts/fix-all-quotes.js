const fs = require('fs');
const files = [
  'app/(dashboard)/help/manual/phase-3-members/page.tsx',
  'app/(dashboard)/help/manual/phase-6-analytics/page.tsx'
];
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Fix ALL occurrences of em-dash followed by unescaped quote
  // Pattern: —" (em-dash + quote) → —\" (em-dash + escaped quote)
  content = content.replace(/—"/g, '—\\"');
  // Also fix any remaining mojibake em-dash patterns
  content = content.replace(/\u00E2\u20AC\u2014"/g, '\u2014\\"');
  content = content.replace(/\u00E2\u2A20"/g, '\u2014\\"');
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed all quotes in: ' + file);
});
console.log('Done - all files processed');
