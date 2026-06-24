const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function enableAgent7() {
  console.log('=== Habilitando Agente 7: Burnout Sentinel ===\n');
  try {
    const agent = await prisma.agent_settings.update({
      where: { agentId: 7 },
      data: { isEnabled: true }
    });
    console.log('✅ Agente 7 habilitado:');
    console.log('   agentName:', agent.agentName);
    console.log('   isEnabled:', agent.isEnabled);
    console.log('   schedule:', agent.schedule);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}
enableAgent7();
