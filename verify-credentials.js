const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function verifySuperAdmin() {
  try {
    const email = 'soporte@khesed-tek-systems.org';
    const password = 'Bendecido100%$$%';
    
    const user = await prisma.users.findUnique({
      where: { email: email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        password: true
      }
    });
    
    if (!user) {
      console.log('❌ User not found!');
      await prisma.$disconnect();
      return;
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    console.log('');
    console.log('🔍 SUPER_ADMIN Account Verification');
    console.log('=====================================');
    console.log('');
    console.log('✅ Account Status:');
    console.log('   👤 Name:', user.name);
    console.log('   📧 Email:', user.email);
    console.log('   🔑 Role:', user.role);
    console.log('   ✔️  Active:', user.isActive);
    console.log('   🔒 Password:', passwordMatch ? '✅ VALID' : '❌ INVALID');
    console.log('');
    console.log('🎯 Login Credentials:');
    console.log('   📧 Email: soporte@khesed-tek-systems.org');
    console.log('   🔑 Password: Bendecido100%$$%');
    console.log('');
    console.log('🌐 Access URLs:');
    console.log('   Login: /auth/signin');
    console.log('   Platform: /platform/dashboard');
    console.log('   Enhanced Admin: /platform');
    console.log('');
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await prisma.$disconnect();
  }
}

verifySuperAdmin();
