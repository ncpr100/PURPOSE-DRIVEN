
require('dotenv').config({ path: '.env.local' });
console.log('=== PROBANDO CRON JOB SRE ===\n');
console.log('CRON_SECRET:', process.env.CRON_SECRET ? process.env.CRON_SECRET.substring(0, 16) + '...' : 'NO CONFIGURADO');
console.log('ENABLE_SRE_ENGINEER:', process.env.ENABLE_SRE_ENGINEER);
console.log('');
async function testCron() {
  try {
    const response = await fetch('http://localhost:3000/api/cron/sre-health-check', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SECRET}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    const data = await response.json();
    console.log('\nResponse:', JSON.stringify(data, null, 2));
    if (response.ok) {
      console.log('\n✅ Cron job ejecutado exitosamente');
      console.log('   Los health checks de Paddle y OpenRouter deberían aparecer en el Dashboard SRE');
    } else {
      console.log('\n❌ Cron job falló');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}
testCron();
