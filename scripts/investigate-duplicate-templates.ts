import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function investigateTemplates() {
  console.log('=== INVESTIGACIÓN PROFUNDA DE PLANTILLAS ===\n');
  
  const church = await prisma.church.findFirst({
    where: { name: 'Iglesia Comunidad de Fe' },
    select: { id: true, name: true }
  });
  
  console.log(`Iglesia: ${church?.name}\n`);
  
  // Get ALL templates WITHOUT filters
  const allTemplates = await prisma.automationRuleTemplate.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      category: true,
      isSystemTemplate: true,
      createdBy: true,
      createdAt: true,
      updatedAt: true,
      installCount: true,
      churchId: true,
    },
    orderBy: { createdAt: 'asc' }
  });
  
  console.log(`Total plantillas: ${allTemplates.length}\n`);
  
  // Group by system vs custom
  const systemTemplates = allTemplates.filter(t => t.isSystemTemplate);
  const customTemplates = allTemplates.filter(t => !t.isSystemTemplate);
  
  console.log('📊 CLASIFICACIÓN:\n');
  console.log(`  Sistema: ${systemTemplates.length} plantillas`);
  console.log(`  Personalizadas: ${customTemplates.length} plantillas\n`);
  
  console.log('=== PLANTILLAS DEL SISTEMA ===\n');
  systemTemplates.forEach((t, i) => {
    const date = new Date(t.createdAt).toLocaleDateString('es-ES');
    const updated = new Date(t.updatedAt).toLocaleDateString('es-ES');
    console.log(`${i + 1}. ${t.name}`);
    console.log(`   ID: ${t.id}`);
    console.log(`   Categoría: ${t.category}`);
    console.log(`   ChurchId: ${t.churchId || 'GLOBAL'}`);
    console.log(`   Creada: ${date}`);
    console.log(`   Actualizada: ${updated}`);
    console.log(`   Instalaciones: ${t.installCount}`);
    console.log(`   Descripción: ${t.description?.substring(0, 80)}...\n`);
  });
  
  if (customTemplates.length > 0) {
    console.log('=== PLANTILLAS PERSONALIZADAS ===\n');
    customTemplates.forEach((t, i) => {
      const date = new Date(t.createdAt).toLocaleDateString('es-ES');
      console.log(`${i + 1}. ${t.name}`);
      console.log(`   Categoría: ${t.category}`);
      console.log(`   Creada: ${date}`);
      console.log(`   Creada por: ${t.createdBy || 'N/A'}\n`);
    });
  }
  
  // Check by category
  console.log('=== POR CATEGORÍA ===\n');
  const categories = [...new Set(allTemplates.map(t => t.category))];
  categories.forEach(cat => {
    const templates = allTemplates.filter(t => t.category === cat);
    console.log(`${cat}: ${templates.length} plantillas`);
    templates.forEach(t => {
      console.log(`  - ${t.name}`);
    });
    console.log();
  });
  
  await prisma.$disconnect();
}

investigateTemplates().catch(console.error);
