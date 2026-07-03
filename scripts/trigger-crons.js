// scripts/trigger-crons.js
// Fuerza la ejecución inmediata de los cron jobs de la Fase 1
require('dotenv').config({ path: '.env.local' });
const https = require('https');
const CRON_SECRET = process.env.CRON_SECRET;
// URL de producción basada en tus logs anteriores
const BASE_URL = 'cms-q9uxk71qy-khesed-tek-systems.vercel.app'; 
const crons = [
  { path: '/api/cron/prayer-watchman', name: 'Ag. 4 (Prayer Watchman)' },
  { path: '/api/cron/triage-followup', name: 'Ag. 2 (Spiritual Triage)' },
  { path: '/api/cron/coverage-precheck', name: 'Ag. 12 (Coverage Engine)' }
];
if (!CRON_SECRET) {
  console.error('❌ CRON_SECRET no encontrado en .env.local');
  process.exit(1);
}
async function triggerCron(cron) {
  return new Promise((resolve) => {
    const options = {
      hostname: BASE_URL,
      path: cron.path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`\n🚀 ${cron.name} (Status: ${res.statusCode})`);
        try {
          const json = JSON.parse(data);
          console.log('   Respuesta:', JSON.stringify(json, null, 2));
        } catch (e) {
          console.log('   Respuesta:', data.substring(0, 300));
        }
        resolve();
      });
    });
    req.on('error', (e) => {
      console.error(`❌ ${cron.name} falló: ${e.message}`);
      resolve();
    });
    req.end();
  });
}
async function main() {
  console.log('⚡ Forzando ejecución de Crons Fase 1...\n');
  for (const cron of crons) {
    await triggerCron(cron);
  }
  console.log('\n✅ Todos los crons disparados. Revisa Supabase ahora.');
}
main();
