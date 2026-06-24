const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function checkAgent10() {
  console.log('=== Estado del Agente 10: Small Group Monitor ===\n');
  try {
    // Verificar configuración del agente
    const agent = await prisma.agent_settings.findUnique({
      where: { agentId: 10 }
    });
    if (agent) {
      console.log('✅ Agente 10 encontrado:');
      console.log('   agentName:', agent.agentName);
      console.log('   isEnabled:', agent.isEnabled);
      console.log('   schedule:', agent.schedule);
      console.log('   requiresWhatsApp:', agent.requiresWhatsApp);
      console.log('   requiresAnthropicKey:', agent.requiresAnthropicKey);
    } else {
      console.log('❌ Agente 10 NO encontrado en agent_settings');
    }
    // Verificar tablas de grupos pequeños
    const tables = [
      'small_groups',
      'small_group_members',
      'small_group_attendance',
      'small_group_health_scores'
    ];
    console.log('\n=== Verificando Tablas ===');
    for (const table of tables) {
      try {
        const count = await prisma[table].count();
        console.log(`✅ ${table}: ${count} registros`);
      } catch (e) {
        console.log(`⚠️  ${table}: No existe o error (${e.message.split('\n')[0]})`);
      }
    }
  } catch (error) {
    console.error('❌ Error general:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}
checkAgent10();
