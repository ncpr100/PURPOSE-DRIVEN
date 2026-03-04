/**
 * Create Fresh Test Tenant - Verify Platform Works with New Data
 * 
 * Creates:
 * - New church: "Iglesia de Prueba"
 * - New admin user: testadmin@prueba.com / TestPassword123!
 * 
 * This verifies the platform can handle new tenants correctly.
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createFreshTestTenant() {
  console.log('🚀 Creating Fresh Test Tenant...\n');

  try {
    // Check database connection
    await prisma.$connect();
    console.log('✅ Database connected\n');

    // Generate password hash
    const passwordHash = bcrypt.hashSync('TestPassword123!', 12);
    console.log('✅ Password hash generated\n');

    // Create new church
    console.log('Creating test church...');
    const church = await prisma.churches.create({
      data: {
        id: 'iglesia-prueba-' + Date.now(),
        name: 'Iglesia de Prueba',
        slug: 'iglesia-prueba',
        country: 'ES',
        timezone: 'Europe/Madrid',
        language: 'es',
        currency: 'EUR',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    console.log('✅ Church created:', church.id, '-', church.name, '\n');

    // Create admin user for this church
    console.log('Creating church admin user...');
    const adminUser = await prisma.users.create({
      data: {
        id: 'user-test-admin-' + Date.now(),
        email: 'testadmin@prueba.com',
        password: passwordHash,
        name: 'Admin de Prueba',
        role: 'ADMIN_IGLESIA',
        churchId: church.id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    console.log('✅ Admin user created:', adminUser.email, '\n');

    // Verify relationships
    const verifyChurch = await prisma.churches.findUnique({
      where: { id: church.id },
      include: { users: true }
    });

    console.log('📊 VERIFICATION RESULTS:');
    console.log('='.repeat(60));
    console.log('Church ID:', verifyChurch.id);
    console.log('Church Name:', verifyChurch.name);
    console.log('Users in church:', verifyChurch.users.length);
    console.log('\nAdmin User Details:');
    console.log('  - Email:', adminUser.email);
    console.log('  - Role:', adminUser.role);
    console.log('  - ChurchId:', adminUser.churchId);
    console.log('  - Active:', adminUser.isActive);
    console.log('='.repeat(60));

    console.log('\n🎉 SUCCESS! Test tenant created.\n');
    console.log('🔑 LOGIN CREDENTIALS:');
    console.log('   Email: testadmin@prueba.com');
    console.log('   Password: TestPassword123!');
    console.log('   Church: Iglesia de Prueba');
    console.log('\n📝 Next steps:');
    console.log('   1. Go to https://khesed-tek-cms-org.vercel.app/auth/signin');
    console.log('   2. Login with credentials above');
    console.log('   3. Test upload buttons in church dashboard');
    console.log('   4. Verify all tenant features work correctly\n');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createFreshTestTenant();
