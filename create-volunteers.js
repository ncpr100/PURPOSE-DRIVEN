const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const churchId = 'cmgu3bev8000078ltyfy89pil'; // Iglesia Comunidad de Fe
    
    console.log('Creating volunteers for Iglesia Comunidad de Fe...');
    
    // Get current volunteer count
    const currentVolunteers = await prisma.volunteer.count({
      where: {
        member: { churchId: churchId }
      }
    });
    
    console.log(`Current volunteers: ${currentVolunteers}`);
    
    // Get members without volunteers
    const membersWithoutVolunteers = await prisma.member.findMany({
      where: {
        churchId: churchId,
        volunteers: {
          none: {}
        }
      },
      take: 14,
      select: {
        id: true,
        firstName: true,
        lastName: true
      }
    });
    
    console.log(`Found ${membersWithoutVolunteers.length} members without volunteer records`);
    
    if (membersWithoutVolunteers.length === 0) {
      console.log('All members already have volunteer records');
      await prisma.$disconnect();
      return;
    }
    
    // Find or create ministry
    let ministry = await prisma.ministry.findFirst({
      where: {
        churchId: churchId
      }
    });
    
    if (!ministry) {
      console.log('Creating ministry...');
      ministry = await prisma.ministry.create({
        data: {
          name: 'Ministerio de Servicio',
          description: 'Ministerio general de servicio y apoyo',
          churchId: churchId,
          isActive: true
        }
      });
      console.log(`Created ministry: ${ministry.name}`);
    } else {
      console.log(`Using existing ministry: ${ministry.name}`);
    }
    
    // Create volunteer records
    let created = 0;
    
    for (const member of membersWithoutVolunteers) {
      try {
        const volunteer = await prisma.volunteer.create({
          data: {
            memberId: member.id,
            ministryId: ministry.id,
            skills: JSON.stringify(['Servicio general', 'Apoyo comunitario']),
            availability: JSON.stringify(['Domingos por la mañana', 'Ocasional entre semana']),
            isActive: true
          }
        });
        
        created++;
        console.log(`✅ Created volunteer ${created}: ${member.firstName} ${member.lastName}`);
      } catch (error) {
        console.error(`❌ Failed to create volunteer for ${member.firstName} ${member.lastName}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Successfully created ${created} volunteers!`);
    
    // Final count
    const finalCount = await prisma.volunteer.count({
      where: {
        member: { churchId: churchId }
      }
    });
    
    console.log(`Final volunteer count for Iglesia Comunidad de Fe: ${finalCount}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();