/**
 * Fix Juan Pachanga - Assign to Hillsong Barranquilla
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixJuanPachanga() {
  console.log('🔧 Fixing Juan Pachanga church assignment...\n');

  try {
    // Find Hillsong Barranquilla church
    const church = await prisma.churches.findFirst({
      where: {
        OR: [
          { name: { contains: 'Hillsong', mode: 'insensitive' } },
          { name: { contains: 'Barranquilla', mode: 'insensitive' } }
        ]
      }
    });

    if (!church) {
      console.error('❌ Hillsong Barranquilla not found!');
      const allChurches = await prisma.churches.findMany();
      console.log('Available churches:', allChurches);
      return;
    }

    console.log(`✅ Found church: ${church.name} (${church.id})\n`);

    // Find Juan Pachanga
    const juan = await prisma.users.findFirst({
      where: {
        email: 'testadmin@prueba.com'
      }
    });

    if (!juan) {
      console.error('❌ Juan Pachanga not found!');
      return;
    }

    console.log(`📋 Current Juan Pachanga status:`);
    console.log(`   Email: ${juan.email}`);
    console.log(`   ChurchId: ${juan.churchId || 'NULL (Sin iglesia)'}`);
    console.log(`   Role: ${juan.role}`);
    console.log(`   Active: ${juan.isActive}\n`);

    // Update Juan's churchId
    console.log(`🔄 Updating Juan Pachanga's church assignment...`);
    const updated = await prisma.users.update({
      where: { id: juan.id },
      data: {
        churchId: church.id,
        isActive: true
      }
    });

    console.log('\n✅ UPDATE SUCCESSFUL!\n');
    console.log(`📊 New Juan Pachanga status:`);
    console.log(`   Email: ${updated.email}`);
    console.log(`   ChurchId: ${updated.churchId}`);
    console.log(`   Church: ${church.name}`);
    console.log(`   Role: ${updated.role}`);
    console.log(`   Active: ${updated.isActive}\n`);

    console.log('🎉 Juan Pachanga is now linked to Hillsong Barranquilla!');
    console.log('👉 Logout and login again to see the church dashboard.\n');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

fixJuanPachanga();
