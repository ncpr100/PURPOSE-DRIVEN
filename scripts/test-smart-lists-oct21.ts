const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testSmartLists() {
  try {
    console.log('📊 SMART LISTS VALIDATION TEST - October 21, 2025');
    console.log('='.repeat(60));
    
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const currentMonth = now.getMonth() + 1; // October = 10
    
    // 1. All Active Members
    const allMembers = await prisma.member.count({
      where: { isActive: true }
    });
    console.log(`\n1️⃣  Todos los Miembros: ${allMembers}`);
    
    // 2. New Members (last 30 days)
    const newMembers = await prisma.member.count({
      where: {
        isActive: true,
        createdAt: { gte: thirtyDaysAgo }
      }
    });
    console.log(`2️⃣  Nuevos Miembros (últimos 30 días): ${newMembers}`);
    
    // 3. Birthdays This Month
    const membersWithBirthdays = await prisma.member.findMany({
      where: {
        isActive: true,
        birthDate: { not: null }
      },
      select: { id: true, firstName: true, lastName: true, birthDate: true }
    });
    const birthdaysThisMonth = membersWithBirthdays.filter(m => {
      const month = new Date(m.birthDate).getMonth() + 1;
      return month === currentMonth;
    });
    console.log(`3️⃣  Cumpleaños en Octubre: ${birthdaysThisMonth.length}`);
    if (birthdaysThisMonth.length > 0 && birthdaysThisMonth.length <= 5) {
      birthdaysThisMonth.forEach(m => {
        console.log(`   - ${m.firstName} ${m.lastName} (${new Date(m.birthDate).getDate()} de octubre)`);
      });
    }
    
    // 4. Inactive Members (no activity in 90 days)
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const inactiveMembers = await prisma.member.count({
      where: {
        isActive: true,
        updatedAt: { lt: ninetyDaysAgo }
      }
    });
    console.log(`4️⃣  Miembros Inactivos (90+ días sin actividad): ${inactiveMembers}`);
    
    // 5. Membership Anniversaries This Month
    const membersWithAnniversaries = await prisma.member.findMany({
      where: {
        isActive: true,
        membershipDate: { not: null }
      },
      select: { id: true, firstName: true, lastName: true, membershipDate: true }
    });
    const anniversariesThisMonth = membersWithAnniversaries.filter(m => {
      const month = new Date(m.membershipDate).getMonth() + 1;
      return month === currentMonth;
    });
    console.log(`5️⃣  Aniversarios de Membresía en Octubre: ${anniversariesThisMonth.length}`);
    
    // 6. Ministry Leaders
    const ministryLeaders = await prisma.member.count({
      where: {
        isActive: true,
        ministryId: { not: null }
      }
    });
    console.log(`6️⃣  Líderes de Ministerio: ${ministryLeaders}`);
    
    // 7. Volunteer Candidates (not volunteers yet)
    const volunteerCandidates = await prisma.member.count({
      where: {
        isActive: true,
        volunteers: { none: {} }
      }
    });
    console.log(`7️⃣  Candidatos Voluntarios: ${volunteerCandidates}`);
    
    // 8. Active Volunteers
    const activeVolunteers = await prisma.member.findMany({
      where: {
        isActive: true,
        volunteers: { some: {} }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        volunteers: {
          select: {
            id: true,
            createdAt: true
          }
        }
      }
    });
    console.log(`8️⃣  Son Voluntarios: ${activeVolunteers.length}`);
    if (activeVolunteers.length > 0 && activeVolunteers.length <= 10) {
      activeVolunteers.forEach(m => {
        console.log(`   - ${m.firstName} ${m.lastName}`);
      });
    }
    
    // 9. Leadership Ready (1+ year membership)
    const leadershipReady = await prisma.member.count({
      where: {
        isActive: true,
        membershipDate: { 
          not: null,
          lte: oneYearAgo
        }
      }
    });
    console.log(`9️⃣  Listos para Liderazgo (1+ año de membresía): ${leadershipReady}`);
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE RESULTADOS:');
    console.log('='.repeat(60));
    console.log(`Total de miembros activos: ${allMembers}`);
    console.log(`Nuevos en los últimos 30 días: ${newMembers}`);
    console.log(`Cumpleaños este mes: ${birthdaysThisMonth.length}`);
    console.log(`Aniversarios este mes: ${anniversariesThisMonth.length}`);
    console.log(`Voluntarios activos: ${activeVolunteers.length}`);
    console.log(`Candidatos a voluntarios: ${volunteerCandidates}`);
    console.log(`Listos para liderazgo: ${leadershipReady}`);
    console.log('='.repeat(60));
    console.log('✅ TEST #2.4: SMART LISTS - VALIDACIÓN COMPLETA');
    
  } catch (error) {
    console.error('❌ Error durante la validación:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testSmartLists();
