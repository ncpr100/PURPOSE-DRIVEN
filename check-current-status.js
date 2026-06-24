const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function checkCurrentStatus() {
  console.log('=== Estado Actual de Todos los Servicios ===\n');
  try {
    const services = [
      'database', 'redis', 'production_url', 'stripe', 'paddle',
      'mailgun', 'twilio', 'whatsapp', 'mercadopago', 'openrouter',
      'vercel_api', 'supabase_api'
    ];
    let downCount = 0;
    let degradedCount = 0;
    let healthyCount = 0;
    let unknownCount = 0;
    for (const service of services) {
      const lastCheck = await prisma.platform_health_checks.findFirst({
        where: { service },
        orderBy: { checkedAt: 'desc' }
      });
      if (lastCheck) {
        const statusEmoji = lastCheck.status === 'HEALTHY' ? '✅' :
                           lastCheck.status === 'DEGRADED' ? '⚠️' :
                           lastCheck.status === 'DOWN' ? '🔴' : '❓';
        console.log(`${statusEmoji} ${service}:`);
        console.log(`   Estado: ${lastCheck.status}`);
        console.log(`   Response: ${lastCheck.responseTimeMs || 'N/A'} ms`);
        console.log(`   Fecha: ${lastCheck.checkedAt}`);
        if (lastCheck.errorMessage) {
          console.log(`   Error: ${lastCheck.errorMessage.substring(0, 150)}`);
        }
        console.log('');
        if (lastCheck.status === 'DOWN') downCount++;
        else if (lastCheck.status === 'DEGRADED') degradedCount++;
        else if (lastCheck.status === 'HEALTHY') healthyCount++;
        else unknownCount++;
      } else {
        console.log(`❓ ${service}: Sin registros\n`);
        unknownCount++;
      }
    }
    console.log('=== Resumen ===');
    console.log(`✅ HEALTHY: ${healthyCount}`);
    console.log(`⚠️  DEGRADED: ${degradedCount}`);
    console.log(`🔴 DOWN: ${downCount}`);
    console.log(`❓ UNKNOWN/Sin datos: ${unknownCount}`);
    console.log(`\nTotal servicios verificados: ${healthyCount + degradedCount + downCount + unknownCount}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}
checkCurrentStatus();
