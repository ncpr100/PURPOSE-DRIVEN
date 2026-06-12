// prisma/seeds/agent-settings.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de configuración de agentes...');

  const agents = [
    { agentId: 1, agentName: 'Sermon Antiphony Engine', schedule: 'Wednesday 8am', requiresAnthropicKey: true },
    { agentId: 2, agentName: 'Spiritual Triage', schedule: 'Real-time event-driven', requiresWhatsApp: true },
    { agentId: 3, agentName: 'Content Filter', schedule: 'Daily 7am', requiresAnthropicKey: true },
    { agentId: 4, agentName: 'Prayer Watchman', schedule: 'Every 30 min', requiresWhatsApp: true },
    { agentId: 5, agentName: "Shepherd's Log", schedule: 'Monday 7am' },
    { agentId: 6, agentName: 'Leadership Pipeline', schedule: '1st of month', requiresAnthropicKey: true },
    { agentId: 7, agentName: 'Burnout Sentinel', schedule: 'Monday 9am' },
    { agentId: 8, agentName: 'Visitor Conversion Intelligence', schedule: '1st of month', requiresAnthropicKey: true },
    { agentId: 9, agentName: 'Generosity Coach', schedule: 'Monday 8am', requiresAnthropicKey: true },
    { agentId: 10, agentName: 'Small Group Monitor', schedule: 'Monday 10am' },
    { agentId: 11, agentName: 'Board Synthesizer', schedule: '1st of month', requiresAnthropicKey: true },
    { agentId: 12, agentName: 'Coverage Engine', schedule: 'Friday 8am + webhook', requiresWhatsApp: true },
    { agentId: 13, agentName: 'Web Performance Engineer', schedule: 'Every 5 min', requiresAnthropicKey: true },
    { agentId: 14, agentName: 'SRE Engineer', schedule: 'Every 2 min' },
    { agentId: 15, agentName: 'AI Product Designer', schedule: 'Monday 9am', requiresAnthropicKey: true },
  ];

  for (const agent of agents) {
    await prisma.agent_settings.upsert({
      where: { agentId: agent.agentId },
      update: {},
      create: {
        ...agent,
        isEnabled: false, // Todos desactivados por defecto (seguridad)
      },
    });
  }

  console.log('✅ Seed completado: 15 agentes registrados en agent_settings');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  