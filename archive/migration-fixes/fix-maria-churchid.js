// FIX: Update María González churchId to 'iglesia-central'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.qxdwpihcmgctznvdfmbv:Bendecido100%25%24%24%25@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
    }
  }
});

async function fixMariaChurchId() {
  try {
    console.log('🔧 Fixing María González churchId...\n');
    
    // First, verify the church exists
    const church = await prisma.churches.findUnique({
      where: { id: 'iglesia-central' }
    });
    
    if (!church) {
      console.error('❌ Church "iglesia-central" not found!');
      return;
    }
    
    console.log('✅ Church found:', church.name);
    
    // Update María González
    const updatedUser = await prisma.users.update({
      where: { email: 'admin@iglesiacentral.com' },
      data: {
        churchId: 'iglesia-central',
        isActive: true,
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5kosgVH3y2KQG', // bcrypt hash for 'password123'
        updatedAt: new Date()
      }
    });
    
    console.log('\n✅ María González updated successfully!');
    console.log('-----------------------------------');
    console.log('Email:', updatedUser.email);
    console.log('Name:', updatedUser.name);
    console.log('Role:', updatedUser.role);
    console.log('Church ID:', updatedUser.churchId);
    console.log('Active:', updatedUser.isActive);
    console.log('Password Hash:', updatedUser.password.substring(0, 30) + '...');
    
    // Verify the user can be authenticated
    const user = await prisma.users.findUnique({
      where: { email: 'admin@iglesiacentral.com' },
      include: { churches: true }
    });
    
    if (user && user.churches) {
      console.log('\n✅ VERIFICATION: User is now linked to church:', user.churches.name);
      
      // Test password
      const passwordMatch = await bcrypt.compare('password123', user.password);
      console.log('✅ Password verification:', passwordMatch ? 'SUCCESS' : 'FAILED');
    }
    
    console.log('\n🎉 Fix complete! Try logging in now with:');
    console.log('   Email: admin@iglesiacentral.com');
    console.log('   Password: password123');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixMariaChurchId();
