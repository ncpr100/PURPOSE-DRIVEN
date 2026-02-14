/**
 * SEED ONLY - Skip user updates, just create members
 * Juan is already linked, just need to add 2000 members
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

const FIRST_NAMES_MALE = [
  'Juan', 'Carlos', 'José', 'Miguel', 'David', 'Diego', 'Andrés', 'Pedro', 'Luis', 'Fernando',
  'Jorge', 'Ricardo', 'Javier', 'Daniel', 'Alejandro', 'Pablo', 'Manuel', 'Francisco', 'Antonio', 'Raúl',
  'Roberto', 'Sergio', 'Enrique', 'Arturo', 'Eduardo', 'Alberto', 'Guillermo', 'Héctor', 'Óscar', 'Rafael'
];

const FIRST_NAMES_FEMALE = [
  'María', 'Carmen', 'Ana', 'Isabel', 'Laura', 'Patricia', 'Rosa', 'Andrea', 'Diana', 'Carolina',
  'Sofía', 'Lucía', 'Valentina', 'Gabriela', 'Camila', 'Daniela', 'Paula', 'Claudia', 'Natalia', 'Alejandra'
];

const LAST_NAMES = [
  'García', 'Rodríguez', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores',
  'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales', 'Reyes', 'Gutiérrez', 'Ortiz', 'Jiménez', 'Hernández'
];

const MINISTRIES = [
  'Alabanza y Adoración', 'Niños', 'Jóvenes', 'Mujeres', 'Hombres', 'Familias', 
  'Evangelismo', 'Intercesión', 'Multimedia', 'Ujieres', 'Hospitalidad', 'Discipulado'
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

async function seedMembersOnly() {
  console.log('🚀 SEEDING 2000 MEMBERS FOR HILLSONG BARRANQUILLA\n');
  console.log('='.repeat(70));
  
  try {
    // Find Hillsong church directly
    const churchId = 'AaS4Pjqrw5viy04ky14Jv'; // Known from previous run
    console.log(`Using church ID: ${churchId}\n`);

    // Check existing members using raw query to avoid prepared statement issues
    const existingResult = await prisma.$queryRawUnsafe(
      `SELECT COUNT(*)::int as count FROM members WHERE "churchId" = $1`,
      churchId
    );
    const existingCount = existingResult[0]?.count || 0;
    console.log(`Existing members: ${existingCount}`);

    const membersToCreate = Math.max(0, 2000 - existingCount);
    if (membersToCreate === 0) {
      console.log('✅ Already have 2000+ members!\n');
      await prisma.$disconnect();
      process.exit(0);
    }

    console.log(`Creating ${membersToCreate} members in batches...\n`);

    // Create members in batches
    const batchSize = 100;
    const batches = Math.ceil(membersToCreate / batchSize);
    let totalCreated = 0;

    for (let batch = 0; batch < batches; batch++) {
      const batchStart = batch * batchSize;
      const batchEnd = Math.min(batchStart + batchSize, membersToCreate);
      const currentBatchSize = batchEnd - batchStart;

      const values = [];
      const params = [];
      let paramIndex = 1;

      for (let i = 0; i < currentBatchSize; i++) {
        const index = batchStart + i + existingCount;
        const gender = Math.random() > 0.5 ? 'M' : 'F';
        const firstName = gender === 'M' ? randomElement(FIRST_NAMES_MALE) : randomElement(FIRST_NAMES_FEMALE);
        const lastName = `${randomElement(LAST_NAMES)} ${randomElement(LAST_NAMES)}`;
        
        let lifecycle;
        const rand = Math.random();
        if (rand < 0.10) lifecycle = 'VISITANTE';
        else if (rand < 0.30) lifecycle = 'NUEVO_CREYENTE';
        else if (rand < 0.65) lifecycle = 'CRECIMIENTO';
        else if (rand < 0.90) lifecycle = 'MADURO';
        else lifecycle = 'LIDER';

        const birthDate = randomDate(new Date('1940-01-01'), new Date('2010-12-31'));
        const joinDate = randomDate(new Date('2018-01-01'), new Date('2026-01-31'));
        const baptismDate = lifecycle !== 'VISITANTE' && Math.random() > 0.3 ? randomDate(joinDate, new Date()) : null;

        const id = `member-hillsong-${Date.now()}-${index}`;
        const email = generateEmail(firstName, lastName, index);
        const phone = generatePhone();
        const address = `Calle ${randomInt(1, 200)} #${randomInt(10, 99)}-${randomInt(10, 99)}`;
        const postalCode = `${randomInt(80000, 80999)}`;

        values.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
        
        params.push(
          id, firstName, lastName, email, phone, gender,
          birthDate, address, 'Barranquilla', 'Atlántico', 'Colombia', postalCode,
          lifecycle, 'ACTIVE', joinDate, churchId
        );
      }

      const insertQuery = `
        INSERT INTO members (
          id, "firstName", "lastName", email, phone, gender,
          "birthDate", address, city, state, country, "postalCode",
          lifecycle, "membershipStatus", "joinDate", "churchId"
        ) VALUES ${values.join(', ')}
        ON CONFLICT (id) DO NOTHING
      `;

      await prisma.$queryRawUnsafe(insertQuery, ...params);
      totalCreated += currentBatchSize;
      console.log(`✅ Batch ${batch + 1}/${batches}: ${currentBatchSize} members created`);
    }

    console.log(`\n✅ Created ${totalCreated} members total!`);

    // Create volunteers using raw query
    console.log('\n👥 Creating volunteers...');
    const memberIdsResult = await prisma.$queryRawUnsafe(
      `SELECT id FROM members WHERE "churchId" = $1 LIMIT 600`,
      churchId
    );

    const volunteerBatch = memberIdsResult.map((m, i) => {
      const ministry = randomElement(MINISTRIES);
      const role = Math.random() > 0.7 ? 'LIDER' : 'SERVIDOR';
      const startDate = randomDate(new Date('2020-01-01'), new Date());
      return `('volunteer-${Date.now()}-${i}', '${m.id}', '${ministry}', '${role}', 'ACTIVE', '${startDate.toISOString()}', '${churchId}', NOW(), NOW())`;
    });

    if (volunteerBatch.length > 0) {
      await prisma.$queryRawUnsafe(`
        INSERT INTO volunteers (id, "memberId", ministry, role, status, "startDate", "churchId", "createdAt", "updatedAt")
        VALUES ${volunteerBatch.join(', ')}
        ON CONFLICT (id) DO NOTHING
      `);
      console.log(`✅ Created ${volunteerBatch.length} volunteers`);
    }

    // Create events
    console.log('\n📅 Creating events...');
    const now = new Date();
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + (7 - now.getDay()));

    await prisma.$queryRawUnsafe(`
      INSERT INTO events (id, title, description, "eventType", date, "endDate", location, capacity, "churchId", "createdAt", "updatedAt")
      VALUES 
        ('event-${Date.now()}-1', 'Culto Dominical Matutino', 'Servicio de alabanza', 'CULTO', '${new Date(nextSunday.setHours(9,0,0)).toISOString()}', '${new Date(nextSunday.setHours(11,0,0)).toISOString()}', 'Auditorio Principal', 500, '${churchId}', NOW(), NOW()),
        ('event-${Date.now()}-2', 'Culto Dominical Vespertino', 'Servicio de adoración', 'CULTO', '${new Date(nextSunday.setHours(18,0,0)).toISOString()}', '${new Date(nextSunday.setHours(20,0,0)).toISOString()}', 'Auditorio Principal', 500, '${churchId}', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `);
    console.log('✅ Created 2 events');

    // Final stats
    const finalCount = await prisma.$queryRawUnsafe(
      `SELECT COUNT(*)::int as count FROM members WHERE "churchId" = $1`,
      churchId
    );
    const volunteerCount = await prisma.$queryRawUnsafe(
      `SELECT COUNT(*)::int as count FROM volunteers WHERE "churchId" = $1`,
      churchId
    );

    console.log('\n' + '='.repeat(70));
    console.log('🎉 SEED COMPLETE!');
    console.log('='.repeat(70));
    console.log(`\n📊 FINAL STATS:`);
    console.log(`   Members: ${finalCount[0].count}`);
    console.log(`   Volunteers: ${volunteerCount[0].count}`);
    console.log('\n✅ Refresh your dashboard!\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMembersOnly();
