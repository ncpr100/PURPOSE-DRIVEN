const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function createComunidadDeFe() {
  try {
    console.log('🚀 CREATING COMUNIDAD DE FE CHURCH IMMEDIATELY...');
    
    // First, check if Nelson Castro user exists and needs church assignment
    const nelsonUser = await db.user.findFirst({
      where: {
        OR: [
          { email: { contains: 'nelson' } },
          { name: { contains: 'Nelson' } }
        ]
      }
    });
    
    console.log('👤 Found user:', nelsonUser ? `${nelsonUser.name} (${nelsonUser.email})` : 'No Nelson user found');
    
    // Create Comunidad de Fe church
    const church = await db.church.create({
      data: {
        id: 'comunidad-de-fe',
        name: 'Comunidad de Fe',
        address: 'Avenida de la Fe 123, Ciudad de la Esperanza',
        phone: '+1 (555) 123-4567',
        email: 'info@comunidaddefe.org',
        website: 'https://comunidaddefe.org',
        description: 'Una iglesia comprometida con la fe, la esperanza y el amor.',
        settings: {
          timezone: 'America/New_York',
          currency: 'USD',
          language: 'es'
        },
        capacity: 500,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    console.log('✅ Created church:', church.name);
    
    // Update Nelson's user to belong to this church
    if (nelsonUser) {
      await db.user.update({
        where: { id: nelsonUser.id },
        data: {
          churchId: church.id,
          role: 'SUPER_ADMIN' // Make Nelson super admin of his church
        }
      });
      console.log('✅ Updated Nelson Castro to be admin of Comunidad de Fe');
    }
    
    // Create ministries for the church
    const ministries = [
      { name: 'Adoración y Música', description: 'Ministerio de alabanza y adoración' },
      { name: 'Evangelismo', description: 'Alcance evangelístico y misiones' },
      { name: 'Niños y Familia', description: 'Ministerio infantil y familiar' },
      { name: 'Jóvenes', description: 'Ministerio juvenil' },
      { name: 'Grupos Pequeños', description: 'Ministerio de células y grupos pequeños' }
    ];
    
    const createdMinistries = [];
    for (const ministry of ministries) {
      const created = await db.ministry.create({
        data: {
          ...ministry,
          churchId: church.id,
          isActive: true
        }
      });
      createdMinistries.push(created);
    }
    
    console.log(`✅ Created ${createdMinistries.length} ministries`);
    
    // Create 30 realistic members with spiritual profiles
    const memberNames = [
      { firstName: 'Nelson', lastName: 'Castro', email: 'nelson@comunidaddefe.org', isLeader: true },
      { firstName: 'María', lastName: 'González', email: 'maria.gonzalez@email.com' },
      { firstName: 'Carlos', lastName: 'Rodríguez', email: 'carlos.rodriguez@email.com', isLeader: true },
      { firstName: 'Ana', lastName: 'Martínez', email: 'ana.martinez@email.com' },
      { firstName: 'José', lastName: 'López', email: 'jose.lopez@email.com' },
      { firstName: 'Carmen', lastName: 'Hernández', email: 'carmen.hernandez@email.com' },
      { firstName: 'Luis', lastName: 'García', email: 'luis.garcia@email.com' },
      { firstName: 'Isabel', lastName: 'Ruiz', email: 'isabel.ruiz@email.com' },
      { firstName: 'Miguel', lastName: 'Jiménez', email: 'miguel.jimenez@email.com' },
      { firstName: 'Rosa', lastName: 'Moreno', email: 'rosa.moreno@email.com' },
      { firstName: 'Fernando', lastName: 'Álvarez', email: 'fernando.alvarez@email.com' },
      { firstName: 'Teresa', lastName: 'Romero', email: 'teresa.romero@email.com' },
      { firstName: 'Antonio', lastName: 'Sánchez', email: 'antonio.sanchez@email.com' },
      { firstName: 'Pilar', lastName: 'Vargas', email: 'pilar.vargas@email.com' },
      { firstName: 'Francisco', lastName: 'Castro', email: 'francisco.castro@email.com' },
      { firstName: 'Dolores', lastName: 'Ortiz', email: 'dolores.ortiz@email.com' },
      { firstName: 'Manuel', lastName: 'Rubio', email: 'manuel.rubio@email.com' },
      { firstName: 'Concepción', lastName: 'Moya', email: 'concepcion.moya@email.com' },
      { firstName: 'David', lastName: 'Gil', email: 'david.gil@email.com' },
      { firstName: 'Josefa', lastName: 'Díaz', email: 'josefa.diaz@email.com' },
      { firstName: 'Daniel', lastName: 'Serrano', email: 'daniel.serrano@email.com' },
      { firstName: 'Francisca', lastName: 'Blanco', email: 'francisca.blanco@email.com' },
      { firstName: 'Rafael', lastName: 'Muñoz', email: 'rafael.munoz@email.com' },
      { firstName: 'Mercedes', lastName: 'Suárez', email: 'mercedes.suarez@email.com' },
      { firstName: 'Ángel', lastName: 'Ramos', email: 'angel.ramos@email.com' },
      { firstName: 'Pilar', lastName: 'Vega', email: 'pilar.vega@email.com' },
      { firstName: 'Alejandro', lastName: 'Martín', email: 'alejandro.martin@email.com' },
      { firstName: 'Elena', lastName: 'Cano', email: 'elena.cano@email.com' },
      { firstName: 'Javier', lastName: 'Guerrero', email: 'javier.guerrero@email.com' },
      { firstName: 'Montserrat', lastName: 'Cortés', email: 'montserrat.cortes@email.com' }
    ];
    
    const spiritualGifts = ['LIDERAZGO', 'ENSEÑANZA', 'EVANGELISMO', 'PASTOREO', 'MISERICORDIA', 'SERVICIO', 'DIACONADO', 'MUSICA', 'INTERCESION', 'ADMINISTRACION'];
    const lifecycleStages = ['VISITANTE', 'NUEVO_CREYENTE', 'EN_CRECIMIENTO', 'MADURO', 'LIDER'];
    
    const createdMembers = [];
    
    for (let i = 0; i < memberNames.length; i++) {
      const memberData = memberNames[i];
      
      // Create member
      const member = await db.member.create({
        data: {
          firstName: memberData.firstName,
          lastName: memberData.lastName,
          email: memberData.email,
          phone: `+1-555-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          dateOfBirth: new Date(1970 + Math.floor(Math.random() * 40), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          gender: Math.random() > 0.5 ? 'MASCULINO' : 'FEMENINO',
          maritalStatus: ['SOLTERO', 'CASADO', 'DIVORCIADO', 'VIUDO'][Math.floor(Math.random() * 4)],
          address: `Calle ${Math.floor(Math.random() * 100) + 1}, Ciudad de la Fe`,
          churchId: church.id,
          isActive: true,
          membershipDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        }
      });
      
      createdMembers.push(member);
      
      // Create spiritual profile
      const randomGifts = spiritualGifts.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
      
      await db.memberSpiritualProfile.create({
        data: {
          memberId: member.id,
          spiritualGifts: randomGifts,
          baptismDate: Math.random() > 0.2 ? new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1) : null,
          salvationDate: new Date(2015 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          discipleshipLevel: Math.floor(Math.random() * 5) + 1,
          leadershipLevel: memberData.isLeader ? Math.floor(Math.random() * 3) + 3 : Math.floor(Math.random() * 2) + 1,
          servingAreas: randomGifts.slice(0, 2),
          lifecycleStage: lifecycleStages[Math.floor(Math.random() * lifecycleStages.length)],
          lastAssessmentDate: new Date(),
          notes: `Perfil espiritual de ${member.firstName} ${member.lastName}`,
          churchId: church.id
        }
      });
      
      // Create volunteer (85% chance)
      if (Math.random() > 0.15) {
        const volunteerMinistry = createdMinistries[Math.floor(Math.random() * createdMinistries.length)];
        
        await db.volunteer.create({
          data: {
            memberId: member.id,
            position: memberData.isLeader ? 'Líder de Ministerio' : 'Voluntario',
            ministryId: volunteerMinistry.id,
            startDate: new Date(2021 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            skills: randomGifts.join(', '),
            availability: ['Domingo mañana', 'Miércoles noche'][Math.floor(Math.random() * 2)],
            isActive: true,
            churchId: church.id
          }
        });
        
        // Create availability matrix (70% chance)
        if (Math.random() > 0.3) {
          const daysOfWeek = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
          const timeSlots = ['MANANA', 'TARDE', 'NOCHE'];
          
          const availableDays = daysOfWeek.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 2);
          const availableSlots = timeSlots.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1);
          
          for (const day of availableDays) {
            for (const slot of availableSlots) {
              await db.availabilityMatrix.create({
                data: {
                  memberId: member.id,
                  dayOfWeek: day,
                  timeSlot: slot,
                  isAvailable: Math.random() > 0.2,
                  churchId: church.id
                }
              });
            }
          }
        }
      }
    }
    
    console.log(`✅ Created ${createdMembers.length} members with spiritual profiles`);
    
    // Create some events
    const events = [
      {
        title: 'Culto Dominical',
        description: 'Servicio principal de adoración',
        startDate: new Date(2024, 11, 8, 10, 0), // December 8, 2024 10:00 AM
        endDate: new Date(2024, 11, 8, 12, 0),
        location: 'Santuario Principal',
        eventType: 'CULTO',
        isRecurring: true
      },
      {
        title: 'Estudio Bíblico Miércoles',
        description: 'Estudio profundo de la Palabra',
        startDate: new Date(2024, 11, 11, 19, 0), // December 11, 2024 7:00 PM
        endDate: new Date(2024, 11, 11, 21, 0),
        location: 'Aula de Educación',
        eventType: 'ESTUDIO_BIBLICO',
        isRecurring: true
      },
      {
        title: 'Retiro de Jóvenes',
        description: 'Retiro espiritual para jóvenes',
        startDate: new Date(2024, 11, 14, 9, 0), // December 14, 2024
        endDate: new Date(2024, 11, 15, 17, 0),
        location: 'Centro de Retiros Monte de Oración',
        eventType: 'RETIRO',
        capacity: 50
      }
    ];
    
    for (const eventData of events) {
      await db.event.create({
        data: {
          ...eventData,
          churchId: church.id,
          createdBy: nelsonUser?.id || createdMembers[0].id,
          isActive: true
        }
      });
    }
    
    console.log(`✅ Created ${events.length} events`);
    
    // Final summary
    const finalStats = {
      church: await db.church.findUnique({ where: { id: church.id } }),
      members: await db.member.count({ where: { churchId: church.id } }),
      volunteers: await db.volunteer.count({ where: { churchId: church.id } }),
      spiritualProfiles: await db.memberSpiritualProfile.count({ where: { churchId: church.id } }),
      availabilityMatrix: await db.availabilityMatrix.count({ where: { churchId: church.id } }),
      ministries: await db.ministry.count({ where: { churchId: church.id } }),
      events: await db.event.count({ where: { churchId: church.id } })
    };
    
    console.log('\n🎉 COMUNIDAD DE FE CHURCH CREATED SUCCESSFULLY!');
    console.log(`📊 Final Statistics:`);
    console.log(`   Members: ${finalStats.members}`);
    console.log(`   Volunteers: ${finalStats.volunteers}`);
    console.log(`   Spiritual Profiles: ${finalStats.spiritualProfiles}`);
    console.log(`   Availability Matrices: ${finalStats.availabilityMatrix}`);
    console.log(`   Ministries: ${finalStats.ministries}`);
    console.log(`   Events: ${finalStats.events}`);
    
    if (nelsonUser) {
      console.log(`\n👤 User ${nelsonUser.name} is now SUPER_ADMIN of Comunidad de Fe`);
    }
    
  } catch (error) {
    console.error('❌ URGENT ERROR creating Comunidad de Fe:', error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

createComunidadDeFe().catch(console.error);