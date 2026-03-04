/**
 * Seed Hillsong Barranquilla - 2000 Members Church
 * 
 * Generates realistic data for a large church:
 * - 2000 members with Spanish names
 * - Family groupings
 * - Lifecycle stages distribution
 * - Volunteers and ministry assignments
 * - Events (past and upcoming)
 * - Donations history
 * - Check-ins and spiritual assessments
 * - Prayer requests
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Spanish names database
const FIRST_NAMES_MALE = [
  'Juan', 'Carlos', 'José', 'Miguel', 'David', 'Diego', 'Andrés', 'Pedro', 'Luis', 'Fernando',
  'Jorge', 'Ricardo', 'Javier', 'Daniel', 'Alejandro', 'Pablo', 'Manuel', 'Francisco', 'Antonio', 'Raúl',
  'Roberto', 'Sergio', 'Enrique', 'Arturo', 'Eduardo', 'Alberto', 'Guillermo', 'Héctor', 'Óscar', 'Rafael'
];

const FIRST_NAMES_FEMALE = [
  'María', 'Carmen', 'Ana', 'Isabel', 'Laura', 'Patricia', 'Rosa', 'Andrea', 'Diana', 'Carolina',
  'Sofía', 'Lucía', 'Valentina', 'Gabriela', 'Camila', 'Daniela', 'Paula', 'Claudia', 'Natalia', 'Alejandra',
  'Marcela', 'Catalina', 'Beatriz', 'Teresa', 'Elena', 'Adriana', 'Gloria', 'Silvia', 'Monica', 'Cristina'
];

const LAST_NAMES = [
  'García', 'Rodríguez', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores',
  'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales', 'Reyes', 'Gutiérrez', 'Ortiz', 'Jiménez', 'Hernández',
  'Ruiz', 'Mendoza', 'Álvarez', 'Castillo', 'Romero', 'Herrera', 'Medina', 'Aguilar', 'Vargas', 'Castro',
  'Ramos', 'Guerrero', 'Nuñez', 'Mejía', 'Vega', 'Pacheco', 'Ríos', 'Espinoza', 'Delgado', 'Silva'
];

const MINISTRIES = [
  'Alabanza y Adoración', 'Niños', 'Jóvenes', 'Mujeres', 'Hombres', 'Familias', 
  'Evangelismo', 'Intercesión', 'Multimedia', 'Ujieres', 'Hospitalidad', 'Discipulado',
  'Misiones', 'Grupos Pequeños', 'Consejería', 'Comunicaciones'
];

const SPIRITUAL_GIFTS = [
  'Liderazgo', 'Enseñanza', 'Evangelismo', 'Profecía', 'Sanidad', 'Misericordia',
  'Servicio', 'Administración', 'Exhortación', 'Fe', 'Discernimiento', 'Sabiduría'
];

const LIFECYCLE_STAGES = ['VISITANTE', 'NUEVO_CREYENTE', 'CRECIMIENTO', 'MADURO', 'LIDER'];

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateEmail(firstName, lastName, index) {
  const clean = (str) => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return `${clean(firstName)}.${clean(lastName)}${index}@hillsong.com`;
}

function generatePhone() {
  return `+57 3${randomInt(10, 19)} ${randomInt(100, 999)} ${randomInt(1000, 9999)}`;
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedHillsongBarranquilla() {
  console.log('🚀 Starting Hillsong Barranquilla Seed - 2000 Members\n');
  
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
      console.error('❌ Hillsong Barranquilla church not found!');
      console.log('Available churches:');
      const allChurches = await prisma.churches.findMany({ select: { id: true, name: true } });
      allChurches.forEach(c => console.log(`  - ${c.name} (${c.id})`));
      return;
    }

    console.log(`✅ Found church: ${church.name} (${church.id})\n`);

    // Check existing members
    const existingCount = await prisma.member.count({ where: { churchId: church.id } });
    console.log(`📊 Existing members: ${existingCount}`);
    
    if (existingCount >= 2000) {
      console.log('⚠️  Church already has 2000+ members. Skipping seed.');
      return;
    }

    const membersToCreate = 2000 - existingCount;
    console.log(`\n📝 Creating ${membersToCreate} new members...\n`);

    // Generate members in batches
    const batchSize = 100;
    const batches = Math.ceil(membersToCreate / batchSize);

    for (let batch = 0; batch < batches; batch++) {
      const batchStart = batch * batchSize;
      const batchEnd = Math.min(batchStart + batchSize, membersToCreate);
      const currentBatchSize = batchEnd - batchStart;

      console.log(`Processing batch ${batch + 1}/${batches} (${currentBatchSize} members)...`);

      const members = [];
      
      for (let i = 0; i < currentBatchSize; i++) {
        const index = batchStart + i + existingCount;
        const gender = Math.random() > 0.5 ? 'M' : 'F';
        const firstName = gender === 'M' ? randomElement(FIRST_NAMES_MALE) : randomElement(FIRST_NAMES_FEMALE);
        const lastName = `${randomElement(LAST_NAMES)} ${randomElement(LAST_NAMES)}`;
        
        // Lifecycle distribution: 10% Visitante, 20% Nuevo Creyente, 35% Crecimiento, 25% Maduro, 10% Líder
        let lifecycle;
        const rand = Math.random();
        if (rand < 0.10) lifecycle = 'VISITANTE';
        else if (rand < 0.30) lifecycle = 'NUEVO_CREYENTE';
        else if (rand < 0.65) lifecycle = 'CRECIMIENTO';
        else if (rand < 0.90) lifecycle = 'MADURO';
        else lifecycle = 'LIDER';

        const birthDate = randomDate(new Date('1940-01-01'), new Date('2010-12-31'));
        const joinDate = randomDate(new Date('2015-01-01'), new Date('2025-12-31'));

        members.push({
          id: `member-hillsong-${Date.now()}-${index}`,
          firstName,
          lastName,
          email: generateEmail(firstName, lastName, index),
          phone: generatePhone(),
          gender,
          birthDate,
          address: `Calle ${randomInt(1, 200)} #${randomInt(10, 99)}-${randomInt(10, 99)}`,
          city: 'Barranquilla',
          state: 'Atlántico',
          country: 'Colombia',
          postalCode: `${randomInt(80000, 80999)}`,
          lifecycle,
          membershipStatus: 'ACTIVE',
          joinDate,
          baptismDate: lifecycle !== 'VISITANTE' && Math.random() > 0.3 ? randomDate(joinDate, new Date()) : null,
          churchId: church.id,
          createdAt: joinDate,
          updatedAt: new Date()
        });
      }

      // Batch insert members
      await prisma.member.createMany({
        data: members,
        skipDuplicates: true
      });

      console.log(`✅ Batch ${batch + 1}/${batches} completed (${members.length} members created)`);
    }

    // Get all created members
    const allMembers = await prisma.member.findMany({
      where: { churchId: church.id },
      select: { id: true, lifecycle: true, firstName: true }
    });

    console.log(`\n✅ Total members in church: ${allMembers.length}`);

    // Create volunteers (30% of members)
    console.log('\n👥 Creating volunteers...');
    const volunteerCount = Math.floor(allMembers.length * 0.3);
    const volunteers = [];
    
    for (let i = 0; i < volunteerCount; i++) {
      const member = allMembers[i];
      volunteers.push({
        id: `volunteer-${Date.now()}-${i}`,
        memberId: member.id,
        ministry: randomElement(MINISTRIES),
        role: Math.random() > 0.7 ? 'LIDER' : 'SERVIDOR',
        status: 'ACTIVE',
        startDate: randomDate(new Date('2020-01-01'), new Date()),
        churchId: church.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await prisma.volunteers.createMany({ data: volunteers, skipDuplicates: true });
    console.log(`✅ Created ${volunteers.length} volunteers`);

    // Create spiritual assessments (40% of non-Visitante members)
    console.log('\n📋 Creating spiritual assessments...');
    const assessableMembers = allMembers.filter(m => m.lifecycle !== 'VISITANTE');
    const assessmentCount = Math.floor(assessableMembers.length * 0.4);
    const assessments = [];

    for (let i = 0; i < assessmentCount; i++) {
      const member = assessableMembers[i];
      assessments.push({
        id: `assessment-${Date.now()}-${i}`,
        memberId: member.id,
        spiritualGifts: [randomElement(SPIRITUAL_GIFTS), randomElement(SPIRITUAL_GIFTS)],
        ministryPassions: [randomElement(MINISTRIES)],
        experienceLevel: randomElement(['NOVATO', 'INTERMEDIO', 'AVANZADO']),
        availabilityDays: ['DOMINGO', Math.random() > 0.5 ? 'MIERCOLES' : 'VIERNES'],
        timeCommitment: randomElement(['1-2 HORAS', '3-5 HORAS', '5-10 HORAS']),
        completedAt: randomDate(new Date('2024-01-01'), new Date()),
        churchId: church.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await prisma.spiritual_assessments.createMany({ data: assessments, skipDuplicates: true });
    console.log(`✅ Created ${assessments.length} spiritual assessments`);

    // Create events
    console.log('\n📅 Creating events...');
    const events = [
      {
        id: `event-${Date.now()}-1`,
        title: 'Culto Dominical Matutino',
        description: 'Servicio de alabanza y predicación',
        eventType: 'CULTO',
        date: new Date('2026-02-16T09:00:00'),
        endDate: new Date('2026-02-16T11:00:00'),
        location: 'Auditorio Principal',
        capacity: 500,
        churchId: church.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: `event-${Date.now()}-2`,
        title: 'Culto Dominical Vespertino',
        description: 'Servicio de adoración',
        eventType: 'CULTO',
        date: new Date('2026-02-16T18:00:00'),
        endDate: new Date('2026-02-16T20:00:00'),
        location: 'Auditorio Principal',
        capacity: 500,
        churchId: church.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: `event-${Date.now()}-3`,
        title: 'Reunión de Jóvenes',
        description: 'Encuentro juvenil',
        eventType: 'REUNION',
        date: new Date('2026-02-21T19:00:00'),
        endDate: new Date('2026-02-21T21:00:00'),
        location: 'Sala Jóvenes',
        capacity: 200,
        churchId: church.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: `event-${Date.now()}-4`,
        title: 'Escuela de Líderes',
        description: 'Formación de liderazgo',
        eventType: 'CONFERENCIA',
        date: new Date('2026-03-01T10:00:00'),
        endDate: new Date('2026-03-01T16:00:00'),
        location: 'Centro de Conferencias',
        capacity: 150,
        churchId: church.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await prisma.events.createMany({ data: events, skipDuplicates: true });
    console.log(`✅ Created ${events.length} events`);

    // Create check-ins for recent events
    console.log('\n✔️  Creating check-ins...');
    const recentEvent = events[0];
    const checkInCount = Math.min(450, allMembers.length); // 450 attendees
    const checkIns = [];

    for (let i = 0; i < checkInCount; i++) {
      checkIns.push({
        id: `checkin-${Date.now()}-${i}`,
        eventId: recentEvent.id,
        memberId: allMembers[i].id,
        checkedInAt: new Date('2026-02-16T09:15:00'),
        churchId: church.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await prisma.check_ins.createMany({ data: checkIns, skipDuplicates: true });
    console.log(`✅ Created ${checkIns.length} check-ins`);

    // Final statistics
    console.log('\n' + '='.repeat(60));
    console.log('🎉 HILLSONG BARRANQUILLA SEED COMPLETE!');
    console.log('='.repeat(60));
    
    const stats = {
      members: await prisma.member.count({ where: { churchId: church.id } }),
      volunteers: await prisma.volunteers.count({ where: { churchId: church.id } }),
      assessments: await prisma.spiritual_assessments.count({ where: { churchId: church.id } }),
      events: await prisma.events.count({ where: { churchId: church.id } }),
      checkIns: await prisma.check_ins.count({ where: { churchId: church.id } })
    };

    console.log('\n📊 Database Statistics:');
    console.log(`   Members: ${stats.members}`);
    console.log(`   Volunteers: ${stats.volunteers}`);
    console.log(`   Spiritual Assessments: ${stats.assessments}`);
    console.log(`   Events: ${stats.events}`);
    console.log(`   Check-ins: ${stats.checkIns}`);
    console.log('\n✅ Refresh your dashboard to see the data!\n');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seedHillsongBarranquilla();
