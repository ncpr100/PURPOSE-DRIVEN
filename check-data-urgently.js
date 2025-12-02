const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function checkAllData() {
  try {
    console.log('🔍 URGENT: CHECKING ALL DATA IN DATABASE:');
    
    // Check churches
    const churches = await db.church.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            users: true,
            members: true,
            volunteers: true
          }
        }
      }
    });
    
    console.log('\n🏠 CHURCHES:');
    if (churches.length === 0) {
      console.log('  ❌ NO CHURCHES FOUND!');
    } else {
      churches.forEach(church => {
        console.log(`  - ${church.name} (ID: ${church.id})`);
        console.log(`    Users: ${church._count.users}`);
        console.log(`    Members: ${church._count.members}`);
        console.log(`    Volunteers: ${church._count.volunteers}`);
      });
    }
    
    // Check users
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        churchId: true,
        church: {
          select: { 
            id: true,
            name: true 
          }
        }
      }
    });
    
    console.log('\n👥 USERS:');
    if (users.length === 0) {
      console.log('  ❌ NO USERS FOUND!');
    } else {
      users.forEach(user => {
        console.log(`  - ${user.name || user.email}`);
        console.log(`    Church: ${user.church?.name || 'NO CHURCH'} (${user.churchId})`);
      });
    }
    
    // Check members
    const members = await db.member.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        churchId: true,
        church: {
          select: { name: true }
        }
      }
    });
    
    console.log('\n👤 MEMBERS:');
    if (members.length === 0) {
      console.log('  ❌ NO MEMBERS FOUND!');
    } else {
      console.log(`  Found ${members.length} members`);
      members.slice(0, 5).forEach(member => {
        console.log(`  - ${member.firstName} ${member.lastName} (${member.church?.name})`);
      });
      if (members.length > 5) {
        console.log(`  ... and ${members.length - 5} more`);
      }
    }
    
  } catch (error) {
    console.error('❌ URGENT ERROR:', error);
  } finally {
    await db.$disconnect();
  }
}

checkAllData().catch(console.error);