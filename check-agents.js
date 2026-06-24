const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function checkAgents() {
  console.log('=== Estado de Agentes IA ===\n');
  try {
    const agents = await prisma.agent_settings.findMany({
      orderBy: { agentId: 'asc' }
    });
    console.log(`Total de agentes registrados: ${agents.length}\n`);
    agents.forEach(agent => {
      const statusEmoji = agent.isEnabled ? '✅' : '⏸️';
      console.log(`${statusEmoji} Ag.${agent.agentId} - ${agent.agentName}`);
      console.log(`   Enabled: ${agent.isEnabled}`);
      console.log(`   Schedule: ${agent.schedule || 'N/A'}`);
      console.log(`   Last Run: ${agent.lastRunAt ? new Date(agent.lastRunAt).toLocaleString('es-CO') : 'Nunca'}`);
      console.log(`   Last Status: ${agent.lastRunStatus || 'N/A'}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}
checkAgents();
