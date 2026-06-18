const fs = require('fs');
const file = 'components/platform/platform-sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');
let lines = content.split('\n');
// Reescribir las líneas específicas con texto correcto
for (let i = 0; i < lines.length; i++) {
  // Línea 50: Analítica
  if (lines[i].includes('href: "/platform/analytics"')) {
    lines[i] = '  { name: "Analítica", href: "/platform/analytics", icon: BarChart3 },';
    console.log('✓ Línea', i, 'corregida: Analítica');
  }
  // Línea 52: Configuración de Agentes
  if (lines[i].includes('href: "/platform/agents/settings"')) {
    lines[i] = '{ name: "Configuración de Agentes", href: "/platform/agents/settings", icon: Cpu },';
    console.log('✓ Línea', i, 'corregida: Configuración de Agentes');
  }
  // Línea 54: SRE — Uptime 24/7
  if (lines[i].includes('href: "/platform/agents/sre"')) {
    lines[i] = '{ name: "SRE — Uptime 24/7", href: "/platform/agents/sre", icon: Shield },';
    console.log('✓ Línea', i, 'corregida: SRE — Uptime 24/7');
  }
  // Línea 56: Configuración
  if (lines[i].includes('href: "/platform/settings"')) {
    lines[i] = '  { name: "Configuración", href: "/platform/settings", icon: Settings },';
    console.log('✓ Línea', i, 'corregida: Configuración');
  }
}
// Guardar el archivo
const fixedContent = lines.join('\n');
fs.writeFileSync(file, fixedContent, 'utf8');
console.log('\n✅ Archivo guardado correctamente');
// Verificación final
console.log('\n=== VERIFICACIÓN FINAL ===');
for (let i = 49; i <= 59; i++) {
  if (lines[i] && lines[i].includes('name:')) {
    console.log(lines[i]);
  }
}
