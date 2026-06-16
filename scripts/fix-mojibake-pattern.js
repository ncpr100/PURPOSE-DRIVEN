const fs = require('fs');
const files = [
  'app/(dashboard)/help/manual/phase-3-members/page.tsx',
  'app/(dashboard)/help/manual/phase-6-analytics/page.tsx'
];
// El patrón real en los archivos es: â⬠" (U+00E2 U+2A20 U+0022)
const mojibakePattern = 'â⬠"';
const replacement = ' - ';
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Reemplazar TODAS las ocurrencias del patrón mojibake + comilla
  const count = (content.match(new RegExp(mojibakePattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  content = content.split(mojibakePattern).join(replacement);
  // También reemplazar el mojibake sin comilla por si acaso
  const mojibakeOnly = 'â⬠';
  content = content.split(mojibakeOnly).join(' - ');
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Fixed ${count} occurrences in: ${file}`);
});
console.log('Done');
