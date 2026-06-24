const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function checkAgent5() {
  console.log('=== Estado Completo de Agentes ===\n');
  try {
    const allAgents = await prisma.agent_settings.findMany({
      orderBy: { id: 'asc' }
    });
    console.log('Total agentes:', allAgents.length);
    console.log('');
    allAgents.forEach((a, idx) => {
      console.log('--- Agente #' + idx + ' ---');
      console.log('   ID:', a.id);
      console.log('   Todos los campos:', JSON.stringify(a, null, 2));
      console.log('');
    });
    // El agente en indice 4 deberia ser Ag.5 Shepherd's Log
    const agent5 = allAgents[4];
    if (agent5) {
      console.log('\n=== ANALISIS DEL AGENTE EN INDICE 4 (Probable Ag.5) ===');
      console.log('   ID:', agent5.id);
      console.log('   isEnabled:', agent5.isEnabled);
      // Verificar overrides
      const overrides = await prisma.church_agent_overrides.findMany({
        where: { agentId: agent5.id },
        include: { church: true }
      });
      console.log('\n=== Overrides para este agente ===');
      if (overrides.length === 0) {
        console.log('   Sin overrides configurados');
      } else {
        overrides.forEach(o => {
          console.log('   Iglesia:', o.church.name, '- isEnabled:', o.isEnabled);
        });
      }
      // Verificar ejecuciones
      const executions = await prisma.agent_execution_log.findMany({
        where: { agentId: agent5.id },
        orderBy: { executedAt: 'desc' },
        take: 3
      });
      console.log('\n=== Ultimas Ejecuciones ===');
      if (executions.length === 0) {
        console.log('   Sin ejecuciones registradas');
      } else {
        executions.forEach(e => {
          console.log('   Fecha:', e.executedAt);
          console.log('   Status:', e.status);
          console.log('   Duration:', e.durationMs + 'ms');
          console.log('   Error:', e.error || 'Ninguno');
          console.log('   ---');
        });
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}
checkAgent5();
