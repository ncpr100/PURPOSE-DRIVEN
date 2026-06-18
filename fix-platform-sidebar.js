const fs = require('fs');
const file = 'components/platform/platform-sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');
// Reemplazos exactos basados en lo que vemos en el archivo
const replacements = [
  ['Analtica', 'Analítica'],
  ['Configuracin de Agentes', 'Configuración de Agentes'],
  ['Configuracin', 'Configuración'],
  ['SRE – Uptime 24/7', 'SRE — Uptime 24/7'],
  ['–', '—'],
  ['“', '"'],
  ['†', '"'],
  ['†™', "'"],
  ['', 'ó']
];
let changed = false;
for (const [bad, good] of replacements) {
  if (content.includes(bad)) {
    content = content.split(bad).join(good);
    changed = true;
    console.log('✓ Reemplazado:', bad, '→', good);
  }
}
if (changed) {
  fs.writeFileSync(file, content, 'utf8');
  console.log('\n✅ Archivo guardado correctamente');
  // Verificar resultado
  console.log('\n=== Verificación ===');
  const lines = content.split('\n');
  for (let i = 49; i <= 59; i++) {
    if (lines[i]) console.log(lines[i]);
  }
} else {
  console.log('⚠️  No se encontraron patrones mojibake');
}
