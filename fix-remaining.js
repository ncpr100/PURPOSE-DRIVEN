const fs = require('fs');
const file = 'components/platform/platform-sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');
// Arreglar Documentación
content = content.replace(/Documentaci.{1,3}n/, 'Documentación');
// Arreglar SRE — Uptime
content = content.replace(/SRE.{1,5}Uptime/, 'SRE — Uptime');
fs.writeFileSync(file, content, 'utf8');
console.log('✓ Correcciones aplicadas');
