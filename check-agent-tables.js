const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTables() {
  const tables = ['agent_settings', 'agent_execution_log', 'church_agent_overrides', 'church_leads'];

  console.log('Verificando tablas críticas de agentes en producción...\n');

  for (const table of tables) {
    try {
      const count = await prisma[table].count();
      console.log('✅ ' + table + ': ' + count + ' registros');
    } catch (e) {
      if (e.message.includes('does not exist')) {
        console.log('❌ ' + table + ': NO EXISTE');
      } else {
        console.log('⚠️  ' + table + ': ERROR - ' + e.message);
      }
    }
  }

  await prisma.$disconnect();
}

checkTables().catch(console.error);
