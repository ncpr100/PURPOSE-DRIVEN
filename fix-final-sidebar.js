const fs = require('fs');
const file = 'components/platform/platform-sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');
// El archivo tiene  (U+FFFD) donde deberían ir caracteres válidos
// Reemplazamos las palabras completas directamente
const replacements = [
  ['Anal\uFFFDeca', 'Analítica'],
  ['Configuraci\uFFFDn de Agentes', 'Configuración de Agentes'],
  ['Configuraci\uFFFDn', 'Configuración']
];
let changed = false;
for (const [bad, good] of replacements) {
  if (content.includes(bad)) {
    content = content.split(bad).join(good);
    changed = true;
    console.log('✓ Reemplazado:', JSON.stringify(bad), '→', good);
  }
}
if (changed) {
  fs.writeFileSync(file, content, 'utf8');
  console.log('\n✅ Archivo guardado correctamente');
} else {
  console.log('⚠️  No se encontraron patrones con U+FFFD');
}
// Verificación final
console.log('\n=== VERIFICACIÓN FINAL ===');
const lines = content.split('\n');
for (let i = 49; i <= 59; i++) {
  if (lines[i] && lines[i].includes('name:')) {
    console.log(lines[i]);
  }
}
