require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  console.log('=== VERIFICANDO TABLA mfa_policy_settings ===\n');
  try {
    const result = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'mfa_policy_settings'
      ) as existe;
    `;
    console.log(`Tabla mfa_policy_settings: ${result[0].existe ? '✅ EXISTE' : '❌ NO EXISTE'}`);
    if (!result[0].existe) {
      console.log('\n⚠️  La tabla NO existe. La migración no se aplicó.');
      console.log('   Solución: Aplicar SQL directamente con script Node.js');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}
check();
