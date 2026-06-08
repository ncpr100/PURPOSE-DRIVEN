const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function verifyTemplates() {
  try {
    const templates = await prisma.email_templates.findMany({
      select: {
        type: true,
        language: true,
        subject: true
      }
    });
    console.log('Templates creados:', templates.length);
    console.log('\nPor tipo e idioma:');
    const grouped = templates.reduce((acc, t) => {
      if (!acc[t.type]) acc[t.type] = [];
      acc[t.type].push(t.language);
      return acc;
    }, {});
    Object.entries(grouped).forEach(([type, langs]) => {
      console.log(`  ${type}: ${langs.join(', ')}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}
verifyTemplates();
