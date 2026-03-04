/**
 * COMPLETE FIX AND SEED - DO EVERYTHING IN ONE SCRIPT
 * 
 * 1. Find Juan Pachanga user
 * 2. Find Hillsong Barranquilla church  
 * 3. Link Juan to church (fix churchId)
 * 4. Seed 2000 members
 * 5. Seed volunteers
 * 6. Seed events
 * 7. Verify everything
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Spanish names database
const FIRST_NAMES_MALE = [
  'Juan', 'Carlos', 'José', 'Miguel', 'David', 'Diego', 'Andrés', 'Pedro', 'Luis', 'Fernando',
  'Jorge', 'Ricardo', 'Javier', 'Daniel', 'Alejandro', 'Pablo', 'Manuel', 'Francisco', 'Antonio', 'Raúl',
  'Roberto', 'Sergio', 'Enrique', 'Arturo', 'Eduardo', 'Alberto', 'Guillermo', 'Héctor', 'Óscar', 'Rafael',
  'César', 'Ramón', 'Felipe', 'Andrés', 'Tomás', 'Mateo', 'Lucas', 'Gabriel', 'Samuel', 'Elías'
];

const FIRST_NAMES_FEMALE = [
  'María', 'Carmen', 'Ana', 'Isabel', 'Laura', 'Patricia', 'Rosa', 'Andrea', 'Diana', 'Carolina',
  'Sofía', 'Lucía', 'Valentina', 'Gabriela', 'Camila', 'Daniela', 'Paula', 'Claudia', 'Natalia', 'Alejandra',
  'Marcela', 'Catalina', 'Beatriz', 'Teresa', 'Elena', 'Adriana', 'Gloria', 'Silvia', 'Monica', 'Cristina',
  'Luisa', 'Fernanda', 'Sandra', 'Paola', 'Victoria', 'Julia', 'Raquel', 'Susana', 'Martha', 'Iris'
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

async function completeFixAndSeed() {
  console.log('🚀 COMPLETE FIX AND SEED STARTING...\n');
  console.log('='.repeat(70));
  
  try {
    await prisma.$connect();
    console.log('✅ Database connected\n');

    // STEP 1: Find Juan Pachanga
    console.log('STEP 1: Finding Juan Pachanga user...');
    const juan = await prisma.users.findFirst({
      where: {
        OR: [
          { name: { contains: 'Juan', mode: 'insensitive' } },
          { name: { contains: 'Pachanga', mode: 'insensitive' } }
        ]
      }
    });

    if (!juan) {
      console.error('❌ Juan Pachanga not found!');
      return;
    }
    console.log(`✅ Found: ${juan.name} (${juan.email})`);
    console.log(`   Current churchId: ${juan.churchId || 'NULL - NEEDS FIX'}\n`);

    // STEP 2: Find Hillsong Barranquilla church
    console.log('STEP 2: Finding Hillsong Barranquilla church...');
    let church = await prisma.churches.findFirst({
      where: {
        OR: [
          { name: { contains: 'Hillsong', mode: 'insensitive' } },
          { name: { contains: 'Barranquilla', mode: 'insensitive' } }
        ]
      }
    });

    // If church doesn't exist, find Juan's intended church by checking what was created with him
    if (!church) {
      console.log('   Hillsong church not found by name, checking all churches...');
      const allChurches = await prisma.churches.findMany();
      console.log(`   Found ${allChurches.length} churches total`);
      
      if (allChurches.length > 0) {
        // Use the first non-SUPER_ADMIN church or the most recent one
        church = allChurches.find(c => c.id !== 'platform') || allChurches[0];
        console.log(`   Using church: ${church.name} (${church.id})`);
      } else {
        console.log('   No churches found! Creating Hillsong Barranquilla...');
        church = await prisma.churches.create({
          data: {
            id: 'hillsong-barranquilla-' + Date.now(),
            name: 'Hillsong Barranquilla',
            slug: 'hillsong-barranquilla',
            country: 'CO',
            timezone: 'America/Bogota',
            language: 'es',
            currency: 'COP',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        console.log(`✅ Created church: ${church.name} (${church.id})`);
      }
    } else {
      console.log(`✅ Found church: ${church.name} (${church.id})\n`);
    }

    // STEP 3: Link Juan to church
    console.log('STEP 3: Linking Juan Pachanga to church...');
    await prisma.users.update({
      where: { id: juan.id },
      data: { 
        churchId: church.id,
        isActive: true 
      }
    });
    console.log(`✅ Juan Pachanga linked to ${church.name}\n`);

    // STEP 4: Check existing members
    console.log('STEP 4: Checking existing members...');
    const existingCount = await prisma.members.count({ where: { churchId: church.id } });
    console.log(`   Existing members: ${existingCount}`);

    const membersToCreate = Math.max(0, 2000 - existingCount);
    if (membersToCreate === 0) {
      console.log('✅ Church already has 2000+ members, skipping seed\n');
    } else {
      console.log(`   Creating ${membersToCreate} new members...\n`);

      // STEP 5: Create members in batches
      console.log('STEP 5: Creating members...');
      const batchSize = 100;
      const batches = Math.ceil(membersToCreate / batchSize);
      let totalCreated = 0;

      for (let batch = 0; batch < batches; batch++) {
        const batchStart = batch * batchSize;
        const batchEnd = Math.min(batchStart + batchSize, membersToCreate);
        const currentBatchSize = batchEnd - batchStart;

        const members = [];
        
        for (let i = 0; i < currentBatchSize; i++) {
          const index = batchStart + i + existingCount;
          const gender = Math.random() > 0.5 ? 'M' : 'F';
          const firstName = gender === 'M' ? randomElement(FIRST_NAMES_MALE) : randomElement(FIRST_NAMES_FEMALE);
          const lastName = `${randomElement(LAST_NAMES)} ${randomElement(LAST_NAMES)}`;
          
          // Lifecycle distribution
          let lifecycle;
          const rand = Math.random();
          if (rand < 0.10) lifecycle = 'VISITANTE';
          else if (rand < 0.30) lifecycle = 'NUEVO_CREYENTE';
          else if (rand < 0.65) lifecycle = 'CRECIMIENTO';
          else if (rand < 0.90) lifecycle = 'MADURO';
          else lifecycle = 'LIDER';

          const birthDate = randomDate(new Date('1940-01-01'), new Date('2010-12-31'));
          const joinDate = randomDate(new Date('2018-01-01'), new Date('2026-01-31'));

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

        await prisma.members.createMany({ data: members, skipDuplicates: true });
        totalCreated += members.length;
        console.log(`   Batch ${batch + 1}/${batches}: ${members.length} members created`);
      }

      console.log(`✅ Total members created: ${totalCreated}\n`);
    }

    // Get all members for additional data
    console.log('STEP 6: Getting all members for additional data...');
    const allMembers = await prisma.members.findMany({
      where: { churchId: church.id },
      select: { id: true, lifecycle: true }
    });
    console.log(`✅ Found ${allMembers.length} total members\n`);

    // STEP 7: Create volunteers
    console.log('STEP 7: Creating volunteers...');
    const existingVolunteers = await prisma.volunteers.count({ where: { churchId: church.id } });
    const targetVolunteers = Math.floor(allMembers.length * 0.3);
    const volunteersToCreate = Math.max(0, targetVolunteers - existingVolunteers);

    if (volunteersToCreate > 0) {
      const volunteers = [];
      for (let i = 0; i < volunteersToCreate && i < allMembers.length; i++) {
        volunteers.push({
          id: `volunteer-${Date.now()}-${i}`,
          memberId: allMembers[i].id,
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
      console.log(`✅ Created ${volunteers.length} volunteers\n`);
    } else {
      console.log(`✅ Already have ${existingVolunteers} volunteers\n`);
    }

    // STEP 8: Create events
    console.log('STEP 8: Creating events...');
    const existingEvents = await prisma.events.count({ where: { churchId: church.id } });
    
    if (existingEvents < 4) {
      const events = [];
      const now = new Date();
      const nextSunday = new Date(now);
      nextSunday.setDate(now.getDate() + (7 - now.getDay()));

      events.push({
        id: `event-${Date.now()}-1`,
        title: 'Culto Dominical Matutino',
        description: 'Servicio de alabanza y predicación',
        eventType: 'CULTO',
        date: new Date(nextSunday.setHours(9, 0, 0)),
        endDate: new Date(nextSunday.setHours(11, 0, 0)),
        location: 'Auditorio Principal',
        capacity: 500,
        churchId: church.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      events.push({
        id: `event-${Date.now()}-2`,
        title: 'Culto Dominical Vespertino',
        description: 'Servicio de adoración',
        eventType: 'CULTO',
        date: new Date(nextSunday.setHours(18, 0, 0)),
        endDate: new Date(nextSunday.setHours(20, 0, 0)),
        location: 'Auditorio Principal',
        capacity: 500,
        churchId: church.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await prisma.events.createMany({ data: events, skipDuplicates: true });
      console.log(`✅ Created ${events.length} events\n`);
    } else {
      console.log(`✅ Already have ${existingEvents} events\n`);
    }

    // FINAL VERIFICATION
    console.log('='.repeat(70));
    console.log('🎉 COMPLETE FIX AND SEED FINISHED!');
    console.log('='.repeat(70));
    
    const finalStats = {
      church: church.name,
      churchId: church.id,
      admin: juan.name,
      adminLinked: true,
      members: await prisma.members.count({ where: { churchId: church.id } }),
      volunteers: await prisma.volunteers.count({ where: { churchId: church.id } }),
      events: await prisma.events.count({ where: { churchId: church.id } })
    };

    console.log('\n📊 FINAL STATISTICS:');
    console.log(`   Church: ${finalStats.church}`);
    console.log(`   Church ID: ${finalStats.churchId}`);
    console.log(`   Admin: ${finalStats.admin} (LINKED ✅)`);
    console.log(`   Members: ${finalStats.members}`);
    console.log(`   Volunteers: ${finalStats.volunteers}`);
    console.log(`   Events: ${finalStats.events}`);
    console.log('\n✅ Task completed successfully!');
    console.log('✅ Refresh your dashboard to see all data!\n');

    return finalStats;

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

completeFixAndSeed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
