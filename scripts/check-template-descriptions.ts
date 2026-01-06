import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDescriptions() {
  const templates = await prisma.automation_rule_templates.findMany({
    select: { id: true, name: true, description: true },
    orderBy: { category: 'asc' }
  });

  console.log('\n=== DESCRIPCIONES ACTUALES ===\n');
  templates.forEach((t, i) => {
    console.log(`${i + 1}. ${t.name}`);
    console.log(`   ${t.description}\n`);
  });

  await prisma.$disconnect();
}

checkDescriptions();
