const fs = require('fs');
// Leer CRON_SECRET del .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const match = envContent.match(/CRON_SECRET=(.*)/);
const CRON_SECRET = match ? match[1].trim() : '';
console.log('=== Ejecutando Agente 7 (Burnout Sentinel) ===\n');
console.log('CRON_SECRET:', CRON_SECRET ? 'Encontrado (' + CRON_SECRET.substring(0, 10) + '...)' : 'NO ENCONTRADO');
if (!CRON_SECRET) {
  console.log('❌ CRON_SECRET no encontrado en .env.local');
  process.exit(1);
}
async function runCron() {
  try {
    console.log('\n--- Llamando a http://localhost:3000/api/cron/burnout-sentinel ---');
    const res = await fetch('http://localhost:3000/api/cron/burnout-sentinel', {
      headers: {
        'Authorization': 'Bearer ' + CRON_SECRET
      }
    });
    console.log('Status HTTP:', res.status);
    const data = await res.json();
    console.log('\n✅ Respuesta del endpoint:');
    console.log(JSON.stringify(data, null, 2));
    if (data.skipped) {
      console.log('\n⚠️  El agente fue saltado. Razón:', data.reason);
      console.log('   Verifica que ENABLE_BURNOUT_SENTINEL=true en .env.local');
    }
  } catch (error) {
    console.error('\n❌ Error al llamar el endpoint:');
    console.error('   Mensaje:', error.message);
    console.error('   ¿Está corriendo npm run dev en http://localhost:3000?');
  }
}
runCron();
