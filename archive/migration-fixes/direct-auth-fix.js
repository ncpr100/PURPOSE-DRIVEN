/**
 * DIRECT DATABASE FIX - Using direct connection to avoid pooler issues
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

// Use direct database connection (not pooler) 
const DIRECT_DB_URL = 'postgresql://postgres:Bendecido100%25%24%24%25@db.qxdwpihcmgctznvdfmbv.supabase.co:5432/postgres';

async function directFix() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: DIRECT_DB_URL
      }
    }
  });
  
  try {
    console.log('🔧 DIRECT DATABASE AUTHENTICATION FIX\n');
    console.log('Using: db.qxdwpihcmgctznvdfmbv.supabase.co:5432 (direct)\n');
    
    console.log('Step 1: Adding password column...');
    await prisma.$executeRaw`ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT`;
    console.log('✅ Column added\n');
    
    console.log('Step 2: Hashing passwords...');
    const superAdminHash = await bcrypt.hash('Bendecido100%$$%', 12);
    const testAdminHash = await bcrypt.hash('TestPassword123!', 12);
    const centralAdminHash = await bcrypt.hash('AdminIglesia2026!', 12);
    console.log('✅ Passwords hashed\n');
    
    console.log('Step 3: Updating users...');
    
    await prisma.users.update({
      where: { email: 'soporte@khesed-tek-systems.org' },
      data: { password: superAdminHash }
    });
    console.log('✅ SUPER_ADMIN password set');
    
    await prisma.users.update({
      where: { email: 'testadmin@prueba.com' },
      data: { password: testAdminHash }
    });
    console.log('✅ testadmin password set');
    
    await prisma.users.update({
      where: { email: 'admin@iglesiacentral.com' },
      data: { password: centralAdminHash }
    });
    console.log('✅ central admin password set\n');
    
    // Final verification
    const users = await prisma.users.findMany({
      select: { email: true, role: true, password: true }
    });
    
    console.log('🎉 AUTHENTICATION SYSTEM RESTORED!\n');
    users.forEach(u => {
      console.log(`📧 ${u.email} (${u.role})`);
      console.log(`   Password: ${u.password ? 'SET ✅' : 'MISSING ❌'}`);
      console.log('');
    });
    
    console.log('🔑 CREDENTIALS TO TEST:');
    console.log('   soporte@khesed-tek-systems.org / Bendecido100%$$%');
    console.log('   testadmin@prueba.com / TestPassword123!');
    console.log('   admin@iglesiacentral.com / AdminIglesia2026!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

directFix();