const fs = require('fs');
const path = require('path');
const filePath = path.resolve('app/api/cron/prayer-watchman/route.ts');
console.log('Cleaning Mojibake in:', filePath);
let content = fs.readFileSync(filePath, 'utf8');
const originalLength = content.length;
// Regex del validador - detectar mojibake
const mojibakeRegex = /\u00C3[\u0080-\u00BF]|\u00C2[\u00A0-\u00BF]|\u00E2\u20AC[\u201C-\u201D]|\u00EF\u00BF\u00BD/g;
// Contar coincidencias
const matches = content.match(mojibakeRegex);
if (!matches) {
  console.log('No Mojibake found.');
  process.exit(0);
}
console.log('Found', matches.length, 'Mojibake sequences:');
matches.forEach((m, i) => {
  const codes = Array.from(m).map(c => 'U+' + c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0'));
  console.log('  ' + (i+1) + ': ' + codes.join(' '));
});
// Reemplazos comunes de Mojibake (UTF-8 mal interpretado como Windows-1252)
// Usamos escapes Unicode para evitar problemas con PowerShell
const replacements = [
  // Em dash (U+2014) - el mas comun en comentarios
  ['\u00E2\u0080\u0094', '\u2014'],
  // En dash (U+2013)
  ['\u00E2\u0080\u0093', '\u2013'],
  // Left double quote (U+201C)
  ['\u00E2\u0080\u009C', '\u201C'],
  // Right double quote (U+201D)
  ['\u00E2\u0080\u009D', '\u201D'],
  // Left single quote (U+2018)
  ['\u00E2\u0080\u0098', '\u2018'],
  // Right single quote (U+2019)
  ['\u00E2\u0080\u0099', '\u2019'],
  // Bullet (U+2022)
  ['\u00E2\u0080\u00A2', '\u2022'],
  // Ellipsis (U+2026)
  ['\u00E2\u0080\u00A6', '\u2026'],
  // Non-breaking space (U+00A0) - reemplazar con espacio normal
  ['\u00C2\u00A0', ' '],
  // Replacement character (U+FFFD)
  ['\u00EF\u00BF\u00BD', '?'],
];
// Aplicar reemplazos especificos primero
let changeCount = 0;
replacements.forEach(([from, to]) => {
  if (content.includes(from)) {
    const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const m = content.match(regex);
    if (m) {
      changeCount += m.length;
      content = content.replace(regex, to);
      console.log('  Replaced pattern (length ' + from.length + ') -> "' + to + '" (' + m.length + ' times)');
    }
  }
});
// Si todavia queda mojibake, reemplazar con caracter seguro
const remaining = content.match(mojibakeRegex);
if (remaining) {
  console.log('  Still ' + remaining.length + ' unknown Mojibake sequences - replacing with safe chars');
  content = content.replace(mojibakeRegex, function(match) {
    // Intentar decodificar: si es secuencia de 3 bytes UTF-8 mal interpretada
    if (match.length >= 2) {
      return '-'; // Reemplazo seguro
    }
    return '';
  });
  changeCount += remaining.length;
}
if (changeCount === 0) {
  console.log('No changes made.');
  process.exit(0);
}
// Guardar con UTF-8 sin BOM
fs.writeFileSync(filePath, content, 'utf8');
console.log('\nCleaning complete:');
console.log('  Changes: ' + changeCount);
console.log('  Original size: ' + originalLength + ' bytes');
console.log('  Final size: ' + content.length + ' bytes');
// Verificar que ya no hay mojibake
const verifyContent = fs.readFileSync(filePath, 'utf8');
const verifyMatches = verifyContent.match(mojibakeRegex);
if (verifyMatches) {
  console.log('\nWARNING: Still ' + verifyMatches.length + ' Mojibake sequences remain!');
  process.exit(1);
} else {
  console.log('\nSUCCESS: No Mojibake detected after cleaning.');
}
