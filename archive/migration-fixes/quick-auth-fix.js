/**
 * SIMPLIFIED AUTHENTICATION FIX: Add password column via migration
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function quickFix() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 QUICK AUTHENTICATION FIX\n');
    
    console.log('Step 1: Adding password column...');
    await prisma.$executeRaw`ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT`;
    console.log('✅ Column added\n');
    
    console.log('Step 2: Setting passwords...');
    
    // Hash passwords
    const superAdminHash = await bcrypt.hash('Bendecido100%$$%', 12);
    const testAdminHash = await bcrypt.hash('TestPassword123!', 12);
    const centralAdminHash = await bcrypt.hash('AdminIglesia2026!', 12);
    
    console.log('✅ Passwords hashed\n');
    
    console.log('Step 3: Updating database...');
    
    await prisma.$executeRaw`
      UPDATE users 
      SET password = ${superAdminHash} 
      WHERE email = 'soporte@khesed-tek-systems.org'
    `;
    console.log('✅ SUPER_ADMIN updated');
    
    await prisma.$executeRaw`
      UPDATE users 
      SET password = ${testAdminHash} 
      WHERE email = 'testadmin@prueba.com'
    `;
    console.log('✅ testadmin updated');
    
    await prisma.$executeRaw`
      UPDATE users 
      SET password = ${centralAdminHash} 
      WHERE email = 'admin@iglesiacentral.com'
    `;
    console.log('✅ central admin updated\n');
    
    // Verify
    const users = await prisma.users.findMany({
      select: { email: true, password: true },
    });
    
    console.log('🎉 VERIFICATION:');
    users.forEach(u => {
      console.log(`📧 ${u.email}: ${u.password ? 'Password SET ✅' : 'NO Password ❌'}`);
    });
    
    console.log('\n🔑 READY TO TEST LOGIN!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

quickFix();