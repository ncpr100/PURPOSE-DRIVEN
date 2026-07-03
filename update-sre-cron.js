const fs = require('fs');
const filePath = 'vercel.json';
let content = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(content);
// Buscar y actualizar el cron de SRE health check
const sreCron = data.crons.find(c => c.path === '/api/cron/sre-health-check');
if (sreCron) {
  console.log('Antes:', sreCron.schedule);
  sreCron.schedule = '*/10 * * * *';
  console.log('Despu?s:', sreCron.schedule);
} else {
  console.error('? No se encontr? el cron de SRE health check');
  process.exit(1);
}
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('? vercel.json actualizado');
