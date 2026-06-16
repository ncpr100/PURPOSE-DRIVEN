const fs = require('fs');
const files = [
  'app/(dashboard)/help/manual/phase-3-members/page.tsx',
  'app/(dashboard)/help/manual/phase-6-analytics/page.tsx'
];
// Build patterns using char codes to avoid PowerShell corruption
const emDashMojibake = String.fromCharCode(0xE2, 0x2A20); // â⬠
const emDash = String.fromCharCode(0x2014); // —
const quote = String.fromCharCode(34); // "
const backslash = String.fromCharCode(92); // \
const escapedQuote = backslash + quote; // \"
const space = String.fromCharCode(32); // space
const hyphen = String.fromCharCode(45); // -
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // 1. Replace ALL mojibake em-dash + quote patterns with clean hyphen + escaped quote
  // Pattern: â⬠" → - "
  content = content.split(emDashMojibake + quote).join(hyphen + space + quote);
  // 2. Replace remaining mojibake em-dash without quote
  content = content.split(emDashMojibake).join(hyphen);
  // 3. Replace real em-dash + unescaped quote (if any)
  content = content.split(emDash + quote).join(emDash + escapedQuote);
  // 4. Clean up any remaining mojibake characters
  // Ó³ → ó, Ó© → é, Ó­ → í, Óº → ú, Ó± → ñ
  const otilde = String.fromCharCode(0xD2, 0xB3); // Ò³
  const eacute = String.fromCharCode(0xD2, 0xA9); // Ò©  
  const iacute = String.fromCharCode(0xD2, 0xAD); // Ò­
  const uacute = String.fromCharCode(0xD2, 0xBA); // Òº
  const ntilde = String.fromCharCode(0xD2, 0xB1); // Ò±
  content = content.split(otilde).join('o');
  content = content.split(eacute).join('e');
  content = content.split(iacute).join('i');
  content = content.split(uacute).join('u');
  content = content.split(ntilde).join('n');
  // 5. Remove replacement characters
  const replacement = String.fromCharCode(0xFFFD); // 
  content = content.split(replacement).join('');
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed all patterns in: ' + file);
});
console.log('Done - global replacement applied to all files');
