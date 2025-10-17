import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAutomationRules() {
  console.log('=== AUTOMATION RULES CHECK ===\n');
  
  // Get the church
  const church = await prisma.church.findFirst({
    where: { name: 'Iglesia Comunidad de Fe' },
    select: { id: true, name: true }
  });
  
  if (!church) {
    console.log('❌ Church not found');
    await prisma.$disconnect();
    return;
  }
  
  console.log(`Church: ${church.name}\n`);
  
  // Count active automation rules for this church
  const count = await prisma.automationRule.count({
    where: { churchId: church.id }
  });
  
  console.log(`Active automation rules: ${count}`);
  
  if (count === 0) {
    console.log('\n⚠️  NO AUTOMATION RULES CREATED YET!');
    console.log('This is expected. You need to:');
    console.log('  1. Go to /automation-rules/templates');
    console.log('  2. Select a template (e.g., Prayer Request Automation)');
    console.log('  3. Click "Usar Plantilla" to activate it');
    console.log('  4. Then it will appear in /automation-rules dashboard\n');
  } else {
    const rules = await prisma.automationRule.findMany({
      where: { churchId: church.id },
      select: { id: true, name: true, isActive: true, triggerType: true }
    });
    console.log('\nActive rules:');
    rules.forEach(r => {
      console.log(`  - ${r.name} (${r.triggerType}) - Active: ${r.isActive}`);
    });
  }
  
  await prisma.$disconnect();
}

checkAutomationRules().catch(console.error);
