const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function createComunidadDeFeChurch() {
  try {
    console.log('🏠 Creating "Comunidad de Fe" church...');
    
    // Create the church
    const comunidadDeFe = await db.church.create({
      data: {
        id: 'comunidad-de-fe',
        name: 'Comunidad de Fe',
        address: 'Av. Principal 123, Ciudad',
        phone: '+1 (555) 123-4567',
        email: 'contacto@comunidaddefepc.com',
        website: 'https://comunidaddefepc.com',
        description: 'Una iglesia comprometida con la fe, la esperanza y el amor en nuestra comunidad.',
        isActive: true
      }
    });
    
    console.log('✅ Church created:', comunidadDeFe.name);
    
    // Create ministries for Comunidad de Fe
    const ministries = await Promise.all([
      db.ministry.create({
        data: {
          id: 'cdf-evangelismo',
          name: 'Ministerio de Evangelismo',
          description: 'Compartir el evangelio en la comunidad',
          churchId: comunidadDeFe.id,
          isActive: true
        }
      }),
      db.ministry.create({
        data: {
          id: 'cdf-jovenes',
          name: 'Ministerio de Jóvenes',
          description: 'Ministerio dirigido a los jóvenes de la iglesia',
          churchId: comunidadDeFe.id,
          isActive: true
        }
      }),
      db.ministry.create({
        data: {
          id: 'cdf-musica',
          name: 'Ministerio de Música',
          description: 'Adoración y música congregacional',
          churchId: comunidadDeFe.id,
          isActive: true
        }
      }),
      db.ministry.create({
        data: {
          id: 'cdf-ninos',
          name: 'Ministerio de Niños',
          description: 'Cuidado y enseñanza de los niños',
          churchId: comunidadDeFe.id,
          isActive: true
        }
      }),
      db.ministry.create({
        data: {
          id: 'cdf-diaconos',
          name: 'Ministerio de Diáconos',
          description: 'Servicio y apoyo a la congregación',
          churchId: comunidadDeFe.id,
          isActive: true
        }
      })
    ]);
    
    console.log('✅ Created', ministries.length, 'ministries');
    
    // Create realistic members for Comunidad de Fe
    const memberNames = [
      ['Juan Carlos', 'Mendoza', 'juan.mendoza@email.com'],
      ['María Elena', 'Rodríguez', 'maria.rodriguez@email.com'],
      ['Pedro Pablo', 'García', 'pedro.garcia@email.com'],
      ['Ana Sofía', 'López', 'ana.lopez@email.com'],
      ['Carlos Alberto', 'Martínez', 'carlos.martinez@email.com'],
      ['Lucía Fernanda', 'Hernández', 'lucia.hernandez@email.com'],
      ['Miguel Ángel', 'González', 'miguel.gonzalez@email.com'],
      ['Isabella', 'Ramírez', 'isabella.ramirez@email.com'],
      ['José Luis', 'Torres', 'jose.torres@email.com'],
      ['Camila', 'Flores', 'camila.flores@email.com'],
      ['Diego Fernando', 'Morales', 'diego.morales@email.com'],
      ['Valentina', 'Cruz', 'valentina.cruz@email.com'],
      ['Andrés Felipe', 'Ruiz', 'andres.ruiz@email.com'],
      ['Sofía', 'Jiménez', 'sofia.jimenez@email.com'],
      ['Fernando', 'Vargas', 'fernando.vargas@email.com'],
      ['Catalina', 'Castillo', 'catalina.castillo@email.com'],
      ['Sebastián', 'Romero', 'sebastian.romero@email.com'],
      ['Alejandra', 'Peña', 'alejandra.pena@email.com'],
      ['Nicolás', 'Guerrero', 'nicolas.guerrero@email.com'],
      ['Daniela', 'Ortiz', 'daniela.ortiz@email.com'],
      ['Javier', 'Delgado', 'javier.delgado@email.com'],
      ['Paola', 'Medina', 'paola.medina@email.com'],
      ['Ricardo', 'Aguilar', 'ricardo.aguilar@email.com'],
      ['Natalia', 'Vega', 'natalia.vega@email.com'],
      ['Eduardo', 'Campos', 'eduardo.campos@email.com'],
      ['Gabriela', 'Ríos', 'gabriela.rios@email.com'],
      ['Arturo', 'Navarro', 'arturo.navarro@email.com'],
      ['Valeria', 'Ramos', 'valeria.ramos@email.com'],
      ['Roberto', 'Silva', 'roberto.silva@email.com'],
      ['Adriana', 'Herrera', 'adriana.herrera@email.com']
    ];
    
    console.log('👥 Creating 30 members for Comunidad de Fe...');
    
    const members = [];
    for (let i = 0; i < memberNames.length; i++) {
      const [firstName, lastName, email] = memberNames[i];
      
      const member = await db.member.create({
        data: {
          firstName,
          lastName,
          email,
          phone: `+57 300 ${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 900) + 100}`,
          address: `Calle ${Math.floor(Math.random() * 100) + 1} # ${Math.floor(Math.random() * 50) + 10}-${Math.floor(Math.random() * 90) + 10}`,
          city: 'Bogotá',
          state: 'Cundinamarca',
          zipCode: `110${Math.floor(Math.random() * 900) + 100}`,
          birthDate: new Date(1970 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          gender: Math.random() > 0.5 ? 'M' : 'F',
          maritalStatus: ['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'][Math.floor(Math.random() * 4)],
          membershipDate: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          churchId: comunidadDeFe.id,
          isActive: true
        }
      });
      
      members.push(member);
    }
    
    console.log('✅ Created', members.length, 'members');
    
    // Now create comprehensive data for these members
    console.log('📊 Creating spiritual profiles, volunteers, and availability...');
    
    const spiritualGifts = [
      'Evangelismo', 'Enseñanza', 'Pastoreo', 'Profecía', 'Discernimiento',
      'Sanidad', 'Milagros', 'Fe', 'Sabiduría', 'Conocimiento',
      'Liderazgo', 'Administración', 'Servicio', 'Ayuda', 'Misericordia',
      'Dación', 'Hospitalidad', 'Intercesión', 'Música'
    ];
    
    let profilesCreated = 0;
    let volunteersCreated = 0;
    let availabilityCreated = 0;
    
    for (const member of members) {
      // Create spiritual profile (90% of members)
      if (Math.random() > 0.1) {
        const primaryGiftsCount = Math.floor(Math.random() * 3) + 2;
        const secondaryGiftsCount = Math.floor(Math.random() * 3) + 1;
        
        const shuffledGifts = [...spiritualGifts].sort(() => 0.5 - Math.random());
        const primaryGifts = shuffledGifts.slice(0, primaryGiftsCount);
        const secondaryGifts = shuffledGifts.slice(primaryGiftsCount, primaryGiftsCount + secondaryGiftsCount);
        
        await db.memberSpiritualProfile.create({
          data: {
            memberId: member.id,
            primaryGifts,
            secondaryGifts,
            spiritualCalling: [
              'Ministerio de niños',
              'Ministerio de jóvenes', 
              'Ministerio de música',
              'Ministerio de evangelismo',
              'Ministerio de enseñanza',
              'Ministerio de diáconos'
            ][Math.floor(Math.random() * 6)],
            ministryPassions: [
              'Educación cristiana',
              'Cuidado pastoral', 
              'Evangelismo',
              'Adoración',
              'Servicio comunitario',
              'Discipulado'
            ].slice(0, Math.floor(Math.random() * 3) + 1),
            experienceLevel: Math.floor(Math.random() * 5) + 1,
            volunteerReadinessScore: Math.floor(Math.random() * 31) + 70,
            leadershipReadinessScore: Math.floor(Math.random() * 41) + 60,
            assessmentDate: new Date()
          }
        });
        profilesCreated++;
      }
      
      // Create volunteer record (85% of members)
      if (Math.random() > 0.15) {
        const randomMinistry = ministries[Math.floor(Math.random() * ministries.length)];
        
        await db.volunteer.create({
          data: {
            firstName: member.firstName,
            lastName: member.lastName,
            email: member.email,
            phone: member.phone,
            memberId: member.id,
            churchId: comunidadDeFe.id,
            ministryId: randomMinistry.id,
            skills: JSON.stringify([
              'Comunicación',
              'Trabajo en equipo',
              'Liderazgo', 
              'Organización',
              'Creatividad',
              'Paciencia',
              'Empatía'
            ].slice(0, Math.floor(Math.random() * 4) + 2)),
            isActive: true,
            availability: [
              'Disponible fines de semana',
              'Disponible entre semana por las noches',
              'Disponible sábados por la mañana',
              'Disponible domingos completo',
              'Disponible horarios flexibles'
            ][Math.floor(Math.random() * 5)]
          }
        });
        volunteersCreated++;
      }
      
      // Create availability matrix (75% of members)
      if (Math.random() > 0.25) {
        const availability = {};
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        
        const availableDays = days.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 3);
        
        availableDays.forEach(day => {
          availability[day] = [
            { start: '09:00', end: '12:00' },
            { start: '14:00', end: '17:00' },
            { start: '18:00', end: '21:00' }
          ].slice(0, Math.floor(Math.random() * 2) + 1);
        });
        
        await db.availabilityMatrix.create({
          data: {
            memberId: member.id,
            recurringAvailability: availability,
            blackoutDates: [],
            preferredMinistries: [ministries[Math.floor(Math.random() * ministries.length)].id],
            maxCommitmentsPerMonth: Math.floor(Math.random() * 4) + 3,
            preferredTimeSlots: ['morning', 'afternoon', 'evening'].slice(0, Math.floor(Math.random() * 3) + 1),
            travelWillingness: Math.floor(Math.random() * 8) + 3,
            lastUpdated: new Date()
          }
        });
        availabilityCreated++;
      }
      
      // Update old spiritual gifts for backward compatibility
      if (Math.random() > 0.3) {
        const randomGifts = [...spiritualGifts]
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
    
    console.log('\\n✅ COMUNIDAD DE FE CHURCH SETUP COMPLETE!');
    console.log('📊 Final Summary:');
    console.log(`   - Church: ${comunidadDeFe.name}`);
    console.log(`   - Members: ${members.length}`);
    console.log(`   - Ministries: ${ministries.length}`);
    console.log(`   - Spiritual Profiles: ${profilesCreated} (${Math.round(profilesCreated/members.length*100)}%)`);
    console.log(`   - Volunteers: ${volunteersCreated} (${Math.round(volunteersCreated/members.length*100)}%)`);
    console.log(`   - Availability Matrices: ${availabilityCreated} (${Math.round(availabilityCreated/members.length*100)}%)`);
    
    console.log('\\n🎯 Your dashboards should now show rich data for Comunidad de Fe church!');
    
  } catch (error) {
    console.error('❌ Error creating Comunidad de Fe church:', error);
  } finally {
    await db.$disconnect();
  }
}

createComunidadDeFeChurch();