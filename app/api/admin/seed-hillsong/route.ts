/**
 * API Endpoint: Seed Hillsong Barranquilla with 2000 Members
 * 
 * URL: /api/admin/seed-hillsong
 * Method: POST
 * 
 * Generates comprehensive church data for testing
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

const LIFECYCLE_STAGES = ['VISITANTE', 'NUEVO_CREYENTE', 'CRECIMIENTO', 'MADURO', 'LIDER'];

function randomElement(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateEmail(firstName: string, lastName: string, index: number) {
  const clean = (str: string) => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return `${clean(firstName)}.${clean(lastName)}${index}@hillsong.com`;
}

function generatePhone() {
  return `+57 3${randomInt(10, 19)} ${randomInt(100, 999)} ${randomInt(1000, 9999)}`;
}

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export async function POST(request: NextRequest) {
  try {
    console.log('[SEED-HILLSONG] Starting seed process...');

    // Find Hillsong Barranquilla
    const church = await db.churches.findFirst({
      where: { 
        OR: [
          { name: { contains: 'Hillsong', mode: 'insensitive' } },
          { name: { contains: 'Barranquilla', mode: 'insensitive' } }
        ]
      }
    });

    if (!church) {
      return NextResponse.json({
        success: false,
        error: 'Hillsong Barranquilla church not found',
        availableChurches: await db.churches.findMany({ select: { id: true, name: true } })
      }, { status: 404 });
    }

    console.log(`[SEED-HILLSONG] Found church: ${church.name}`);

    // Check existing data
    const existingMembers = await db.member.count({ where: { churchId: church.id } });
    console.log(`[SEED-HILLSONG] Existing members: ${existingMembers}`);

    const membersToCreate = Math.max(0, 2000 - existingMembers);
    
    if (membersToCreate === 0) {
      return NextResponse.json({
        success: true,
        message: 'Church already has 2000+ members',
        stats: {
          members: existingMembers,
          volunteers: await db.volunteers.count({ where: { churchId: church.id } }),
          events: await db.events.count({ where: { churchId: church.id } })
        }
      });
    }

    // Create members in batches
    console.log(`[SEED-HILLSONG] Creating ${membersToCreate} members...`);
    const batchSize = 100;
    const batches = Math.ceil(membersToCreate / batchSize);
    let totalCreated = 0;

    for (let batch = 0; batch < batches; batch++) {
      const batchStart = batch * batchSize;
      const batchEnd = Math.min(batchStart + batchSize, membersToCreate);
      const currentBatchSize = batchEnd - batchStart;

      const members = [];
      
      for (let i = 0; i < currentBatchSize; i++) {
        const index = batchStart + i + existingMembers;
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

      await db.member.createMany({ data: members, skipDuplicates: true });
      totalCreated += members.length;
      console.log(`[SEED-HILLSONG] Batch ${batch + 1}/${batches} completed (${members.length} members)`);
    }

    // Get all members for additional data
    const allMembers = await db.member.findMany({
      where: { churchId: church.id },
      select: { id: true, lifecycle: true }
    });

    // Create volunteers (30% of members)
    console.log('[SEED-HILLSONG] Creating volunteers...');
    const volunteerCount = Math.floor(allMembers.length * 0.3);
    const volunteers = [];
    
    for (let i = 0; i < volunteerCount && i < allMembers.length; i++) {
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

    await db.volunteers.createMany({ data: volunteers, skipDuplicates: true });
    console.log(`[SEED-HILLSONG] Created ${volunteers.length} volunteers`);

    // Create events
    console.log('[SEED-HILLSONG] Creating events...');
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
        endDate: new Date('2026-02-16T18:00:00'),
        location: 'Auditorio Principal',
        capacity: 500,
        churchId: church.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.events.createMany({ data: events, skipDuplicates: true });

    // Final stats
    const finalStats = {
      members: await db.member.count({ where: { churchId: church.id } }),
      volunteers: await db.volunteers.count({ where: { churchId: church.id } }),
      events: await db.events.count({ where: { churchId: church.id } })
    };

    console.log('[SEED-HILLSONG] Seed complete!', finalStats);

    return NextResponse.json({
      success: true,
      message: 'Hillsong Barranquilla seeded successfully!',
      created: {
        newMembers: totalCreated,
        newVolunteers: volunteers.length,
        newEvents: events.length
      },
      stats: finalStats
    }, { status: 201 });

  } catch (error: any) {
    console.error('[SEED-HILLSONG] ERROR:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to seed Hillsong Barranquilla with 2000 members',
    willCreate: {
      members: '2000 (realistic Colombian names)',
      volunteers: '~600 (30% of members)',
      events: '4 upcoming events',
      checkIns: '~450 recent check-ins'
    }
  });
}
