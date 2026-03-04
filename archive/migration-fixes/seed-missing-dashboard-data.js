const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function seedMissingData() {
  try {
    console.log('🔍 Checking existing data...');
    
    // Get all members
    const members = await db.member.findMany({
      include: {
        volunteers: true,
        spiritualProfile: true,
        availabilityMatrix: true
      }
    });
    
    console.log(`📊 Found ${members.length} members`);
    
    // Get church and ministry data
    const churches = await db.church.findMany();
    const ministries = await db.ministry.findMany();
    
    if (churches.length === 0 || ministries.length === 0) {
      console.error('❌ No churches or ministries found. Run seed script first.');
      return;
    }
    
    const churchId = churches[0].id;
    
    // Spiritual gifts data
    const spiritualGiftsData = [
      'Evangelismo', 'Enseñanza', 'Pastoreo', 'Profecía', 'Discernimiento',
      'Sanidad', 'Milagros', 'Fe', 'Sabiduría', 'Conocimiento',
      'Liderazgo', 'Administración', 'Servicio', 'Ayuda', 'Misericordia',
      'Dación', 'Hospitalidad', 'Intercesión', 'Música'
    ];
    
    let volunteersCreated = 0;
    let profilesCreated = 0;
    let availabilityCreated = 0;
    
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      
      // 1. Create volunteer record if missing (80% of members become volunteers)
      if (member.volunteers.length === 0 && Math.random() > 0.2) {
        const randomMinistry = ministries[Math.floor(Math.random() * ministries.length)];
        
        await db.volunteer.create({
          data: {
            firstName: member.firstName,
            lastName: member.lastName,
            email: member.email,
            memberId: member.id,
            churchId: churchId,
            ministryId: randomMinistry.id,
            skills: JSON.stringify([
              'Comunicación',
              'Trabajo en equipo',
              'Liderazgo',
              'Organización'
            ].slice(0, Math.floor(Math.random() * 3) + 1)),
            isActive: true,
            availability: 'Disponible fines de semana'
          }
        });
        volunteersCreated++;
      }
      
      // 2. Create spiritual profile if missing (90% of members)
      if (!member.spiritualProfile && Math.random() > 0.1) {
        const primaryGiftsCount = Math.floor(Math.random() * 3) + 2; // 2-4 primary gifts
        const secondaryGiftsCount = Math.floor(Math.random() * 3) + 1; // 1-3 secondary gifts
        
        const shuffledGifts = [...spiritualGiftsData].sort(() => 0.5 - Math.random());
        const primaryGifts = shuffledGifts.slice(0, primaryGiftsCount);
        const secondaryGifts = shuffledGifts.slice(primaryGiftsCount, primaryGiftsCount + secondaryGiftsCount);
        
        await db.memberSpiritualProfile.create({
          data: {
            memberId: member.id,
            primaryGifts: primaryGifts,
            secondaryGifts: secondaryGifts,
            spiritualCalling: [
              'Ministerio de niños',
              'Ministerio de jóvenes',
              'Ministerio de música',
              'Ministerio de evangelismo',
              'Ministerio de enseñanza'
            ][Math.floor(Math.random() * 5)],
            ministryPassions: [
              'Educación cristiana',
              'Cuidado pastoral',
              'Evangelismo',
              'Adoración',
              'Servicio comunitario'
            ].slice(0, Math.floor(Math.random() * 3) + 1),
            experienceLevel: Math.floor(Math.random() * 5) + 1, // 1-5
            volunteerReadinessScore: Math.floor(Math.random() * 31) + 70, // 70-100
            leadershipReadinessScore: Math.floor(Math.random() * 41) + 60, // 60-100
            assessmentDate: new Date()
          }
        });
        profilesCreated++;
      }
      
      // 3. Create availability matrix if missing (70% of members)
      if (!member.availabilityMatrix && Math.random() > 0.3) {
        const availability = {};
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        
        // Randomly assign availability for 3-5 days
        const availableDays = days.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 3);
        
        availableDays.forEach(day => {
          availability[day] = [
            { start: '09:00', end: '12:00' },
            { start: '18:00', end: '21:00' }
          ].slice(0, Math.floor(Math.random() * 2) + 1);
        });
        
        await db.availabilityMatrix.create({
          data: {
            memberId: member.id,
            recurringAvailability: availability,
            blackoutDates: [],
            preferredMinistries: [ministries[Math.floor(Math.random() * ministries.length)].id],
            maxCommitmentsPerMonth: Math.floor(Math.random() * 4) + 2, // 2-5
            preferredTimeSlots: ['morning', 'afternoon', 'evening'].slice(0, Math.floor(Math.random() * 3) + 1),
            travelWillingness: Math.floor(Math.random() * 10) + 1, // 1-10
            lastUpdated: new Date()
          }
        });
        availabilityCreated++;
      }
      
      // Update old spiritual gifts field for some members (backward compatibility)
      if (Math.random() > 0.4) {
        const randomGifts = [...spiritualGiftsData]
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 4) + 2);
          
        await db.member.update({
          where: { id: member.id },
          data: {
            spiritualGifts: randomGifts
          }
        });
      }
    }
    
    console.log('\n✅ Missing data seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Volunteers created: ${volunteersCreated}`);
    console.log(`   - Spiritual profiles created: ${profilesCreated}`);
    console.log(`   - Availability matrices created: ${availabilityCreated}`);
    
    // Verify the data
    console.log('\n🔍 Verification:');
    const finalStats = await db.member.findMany({
      include: {
        volunteers: true,
        spiritualProfile: true,
        availabilityMatrix: true,
        _count: {
          select: {
            volunteers: true
          }
        }
      }
    });
    
    const withVolunteers = finalStats.filter(m => m.volunteers.length > 0).length;
    const withProfiles = finalStats.filter(m => m.spiritualProfile).length;
    const withAvailability = finalStats.filter(m => m.availabilityMatrix).length;
    
    console.log(`   - Members with volunteer records: ${withVolunteers}/${finalStats.length} (${Math.round(withVolunteers/finalStats.length*100)}%)`);
    console.log(`   - Members with spiritual profiles: ${withProfiles}/${finalStats.length} (${Math.round(withProfiles/finalStats.length*100)}%)`);
    console.log(`   - Members with availability: ${withAvailability}/${finalStats.length} (${Math.round(withAvailability/finalStats.length*100)}%)`);
    
    console.log('\n🎯 The dashboards should now show actual data!');
    
  } catch (error) {
    console.error('❌ Error seeding missing data:', error);
  } finally {
    await db.$disconnect();
  }
}

seedMissingData();