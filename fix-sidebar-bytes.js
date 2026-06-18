const fs = require('fs');
const file = 'components/platform/platform-sidebar.tsx';
// Leer como buffer de bytes
const buffer = fs.readFileSync(file);
// Detectar encoding actual
console.log('Primeros 100 bytes:', buffer.slice(0, 100));
// Intentar 1: Leer como Latin-1 y convertir a UTF-8
const latin1 = buffer.toString('latin1');
console.log('\n=== Como Latin-1 ===');
const lines1 = latin1.split('\n');
for (let i = 49; i <= 59; i++) {
  if (lines1[i]) console.log(lines1[i]);
}
// Intentar 2: Leer como UTF-8
const utf8 = buffer.toString('utf8');
console.log('\n=== Como UTF-8 ===');
const lines2 = utf8.split('\n');
for (let i = 49; i <= 59; i++) {
  if (lines2[i]) console.log(lines2[i]);
}
// Aplicar fix usando Latin-1 (que debería mostrar los caracteres correctos)
let fixed = latin1;
const replacements = [
  ['Analítica', 'Analítica'], // Si ya está correcto en Latin-1
  ['Configuración de Agentes', 'Configuración de Agentes'],
  ['Configuración', 'Configuración'],
  ['SRE — Uptime 24/7', 'SRE — Uptime 24/7']
];
for (const [bad, good] of replacements) {
  if (fixed.includes(bad)) {
    console.log('✓ Encontrado en Latin-1:', bad);
  }
}
// Guardar como UTF-8 limpio
fs.writeFileSync(file, fixed, 'utf8');
console.log('\n✅ Archivo guardado como UTF-8');
