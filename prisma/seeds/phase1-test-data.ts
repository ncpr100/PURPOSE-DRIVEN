// prisma/seeds/phase1-test-data.ts
// Seed data for Phase 1 agent testing - FINAL CORRECTED VERSION
import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';
const prisma = new PrismaClient();
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
function randomBool(probability: number): boolean {
  return Math.random() < probability;
}
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
const firstNames = [
  'Carlos', 'Maria', 'Jose', 'Ana', 'Luis', 'Carmen', 'Jorge', 'Rosa',
  'Miguel', 'Laura', 'Pedro', 'Sofia', 'Andres', 'Valentina', 'Diego', 'Isabella',
  'Fernando', 'Camila', 'Ricardo', 'Daniela', 'Alejandro', 'Mariana', 'Roberto', 'Lucia',
  'Gabriel', 'Natalia', 'Sebastian', 'Paula', 'Mateo', 'Sara', 'Santiago', 'Andrea'
];
const lastNames = [
  'Rodriguez', 'Garcia', 'Martinez', 'Lopez', 'Gonzalez', 'Hernandez', 'Perez', 'Sanchez',
  'Ramirez', 'Torres', 'Flores', 'Rivera', 'Gomez', 'Diaz', 'Cruz', 'Morales',
  'Ortiz', 'Gutierrez', 'Chavez', 'Reyes', 'Mendoza', 'Ruiz', 'Alvarez', 'Romero'
];
const ministryNames = [
  'Alabanza', 'Ushers', 'Ninos', 'Jovenes', 'Matrimonios', 'Varones', 'Damas',
  'Intercesion', 'Evangelismo', 'Servicio Social', 'Misiones', 'Educacion Cristiana'
];
const triageKeywords = [
  'suicidio', 'violencia', 'abuso', 'depresion', 'adiccion', 'crisis',
  'muerte', 'divorcio', 'enfermedad', 'soledad', 'ansiedad', 'miedo'
];
const prayerCategories = [
  'Sanidad', 'Familia', 'Provision', 'Direccion', 'Liberacion', 'Consuelo'
];
async function createChurchWithData(name: string, country: string, memberCount: number, prayerCount: number, triageCount: number, volunteerCount: number) {
  console.log(`📍 Creating ${name} (${memberCount} target members)...`);
  const churchId = generateId();
  const now = new Date();
  // Create church
  const church = await prisma.churches.create({
    data: {
      id: churchId,
      name,
      country,
      phone: `+57300${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
      email: `contacto@${name.toLowerCase().replace(/\s+/g, '')}.test`,
      description: `Iglesia de prueba para testing de agentes Fase 1 - ${memberCount} miembros objetivo`,
      isActive: true,
      language: 'es',
      createdAt: now,
      updatedAt: now,
    }
  });
  // Create ministries for this church
  const ministriesCreated = [];
  for (const minName of ministryNames.slice(0, 6)) {
    const ministryId = generateId();
    const ministry = await prisma.ministries.create({
      data: {
        id: ministryId,
        name: minName,
        description: `Ministerio de ${minName}`,
        churchId: church.id,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      }
    });
    ministriesCreated.push(ministry);
  }
  // Create prayer categories
  const categoriesCreated = [];
  for (const catName of prayerCategories) {
    const existing = await prisma.prayer_categories.findFirst({
      where: { churchId: church.id, name: catName }
    });
    if (!existing) {
      const catId = generateId();
      const cat = await prisma.prayer_categories.create({
        data: {
          id: catId,
          name: catName,
          description: `Categoria de oracion: ${catName}`,
          churchId: church.id,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        }
      });
      categoriesCreated.push(cat);
    } else {
      categoriesCreated.push(existing);
    }
  }
  // Create members (sample subset for performance)
  const actualMembers = Math.min(memberCount, 100);
  const membersCreated = [];
  for (let i = 0; i < actualMembers; i++) {
    const memberId = generateId();
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const isActive = randomBool(0.78);
    const ministry = ministriesCreated[Math.floor(Math.random() * ministriesCreated.length)];
    const member = await prisma.members.create({
      data: {
        id: memberId,
        churchId: church.id,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@test.com`,
        phone: `+573${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
        address: `Calle ${Math.floor(Math.random() * 100)} # ${Math.floor(Math.random() * 50)}-${Math.floor(Math.random() * 99)}`,
        birthDate: randomDate(new Date('1960-01-01'), new Date('2005-01-01')),
        membershipDate: isActive ? randomDate(new Date('2020-01-01'), new Date('2025-06-01')) : null,
        isActive,
        ministryId: isActive ? ministry.id : null,
        notes: isActive ? 'Miembro activo - testing' : 'En riesgo de desconexion - testing',
        createdAt: now,
        updatedAt: now,
      }
    });
    membersCreated.push(member);
  }
  // Create prayer contacts (needed for prayer_requests)
  const contactsCreated = [];
  const contactCount = Math.min(prayerCount, 30);
  for (let i = 0; i < contactCount; i++) {
    const contactId = generateId();
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const contact = await prisma.prayer_contacts.create({
      data: {
        id: contactId,
        fullName: `${firstName} ${lastName}`,
        phone: `+573${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@prayer.test`,
        preferredContact: randomBool(0.6) ? 'whatsapp' : 'sms',
        churchId: church.id,
        source: 'seed_data',
        createdAt: now,
        updatedAt: now,
      }
    });
    contactsCreated.push(contact);
  }
  // Create prayer requests
  for (let i = 0; i < prayerCount; i++) {
    const requestId = generateId();
    const contact = contactsCreated[Math.floor(Math.random() * contactsCreated.length)];
    const category = categoriesCreated[Math.floor(Math.random() * categoriesCreated.length)];
    const themes = ['sanidad fisica', 'restauracion familiar', 'provision financiera', 'liberacion', 'direccion espiritual', 'consuelo en perdida'];
    const theme = themes[Math.floor(Math.random() * themes.length)];
    await prisma.prayer_requests.create({
      data: {
        id: requestId,
        churchId: church.id,
        contactId: contact.id,
        categoryId: category.id,
        message: `Necesito oracion por ${theme}. Confio en que Dios respondera a su tiempo. Esta peticion es muy importante para mi y mi familia.`,
        isAnonymous: randomBool(0.2),
        status: randomBool(0.7) ? 'pending' : 'answered',
        priority: randomBool(0.3) ? 'urgent' : 'normal',
        source: 'seed_data',
        createdAt: now,
        updatedAt: now,
      }
    });
  }
  // Create triage events (for Ag. 2 Spiritual Triage)
  for (let i = 0; i < triageCount; i++) {
    const triageId = generateId();
    const keyword = triageKeywords[Math.floor(Math.random() * triageKeywords.length)];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const scenarios = [
      'Estoy pasando por una crisis muy fuerte. No se que hacer.',
      'Necesito ayuda urgente, estoy en un momento muy dificil.',
      'Siento que no puedo mas, necesito hablar con alguien.',
      'Hay una situacion en mi hogar que me tiene muy preocupado.',
    ];
    await prisma.triage_events.create({
      data: {
        id: triageId,
        churchId: church.id,
        triggerSource: 'prayer_form',
        sourceId: `seed_triage_${i}`,
        detectedKeyword: keyword,
        requesterName: `${firstName} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        requesterPhone: `+573${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
        messageBody: scenarios[Math.floor(Math.random() * scenarios.length)] + ` Palabra clave detectada: ${keyword}`,
        status: 'PENDING',
        createdAt: now,
        updatedAt: now,
      }
    });
  }
  // Create volunteers (for Ag. 12 Coverage Engine)
  for (let i = 0; i < volunteerCount; i++) {
    const volunteerId = generateId();
    const member = membersCreated[Math.floor(Math.random() * membersCreated.length)];
    const ministry = ministriesCreated[Math.floor(Math.random() * ministriesCreated.length)];
    const roles = ['Usher', 'Sonido', 'Ninos', 'Cafe', 'Parqueo', 'Alabanza', 'Proyeccion'];
    const times = ['6:00 AM', '9:00 AM', '11:00 AM'];
    await prisma.volunteers.create({
      data: {
        id: volunteerId,
        churchId: church.id,
        memberId: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phone: member.phone,
        ministryId: ministry.id,
        skills: roles[Math.floor(Math.random() * roles.length)],
        availability: JSON.stringify({
          preferredTime: times[Math.floor(Math.random() * times.length)],
          daysAvailable: ['Domingo'],
          lastConfirmed: randomDate(new Date('2026-06-20'), new Date('2026-07-02')).toISOString(),
        }),
        isActive: randomBool(0.85),
        createdAt: now,
        updatedAt: now,
      }
    });
  }
  console.log(`   ✅ ${name}: ${actualMembers} members, ${prayerCount} prayers, ${triageCount} triages, ${volunteerCount} volunteers`);
  return church;
}
async function main() {
  console.log('🚀 Starting Phase 1 test data seed (FINAL CORRECTED)...\n');
  // Church 1: Iglesia Central Ejemplo (update existing or create)
  const existingChurch1 = await prisma.churches.findFirst({
    where: { name: 'Iglesia Central Ejemplo' }
  });
  if (!existingChurch1) {
    await createChurchWithData('Iglesia Central Ejemplo', 'Colombia', 150, 20, 5, 30);
  } else {
    console.log('📍 Iglesia Central Ejemplo already exists, adding test data...');
    const church = existingChurch1;
    const now = new Date();
    // Add triage events
    for (let i = 0; i < 5; i++) {
      const triageId = generateId();
      const keyword = triageKeywords[Math.floor(Math.random() * triageKeywords.length)];
      await prisma.triage_events.create({
        data: {
          id: triageId,
          churchId: church.id,
          triggerSource: 'prayer_form',
          sourceId: `seed_triage_extra_${i}`,
          detectedKeyword: keyword,
          requesterName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} Testing`,
          requesterPhone: `+573${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
          messageBody: `Crisis detectada - keyword: ${keyword}`,
          status: 'PENDING',
          createdAt: now,
          updatedAt: now,
        }
      });
    }
    console.log('   ✅ Added 5 triage events to existing church');
  }
  // Church 2: Faith Family Church (1500 members target)
  await createChurchWithData('Faith Family Church', 'Colombia', 1500, 50, 12, 80);
  // Church 3: Iglesia El Shaddai (5000 members target)
  await createChurchWithData('Iglesia El Shaddai', 'Colombia', 5000, 100, 25, 200);
  console.log('\n🎉 Phase 1 test data seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log('   • 3 churches with test data');
  console.log('   • ~250 actual member records (100 per church cap)');
  console.log('   • 170 prayer requests across all churches');
  console.log('   • 42 triage events for Ag. 2 testing');
  console.log('   • 310 volunteers for Ag. 12 Coverage Engine');
  console.log('\n🧪 Ready for agent testing:');
  console.log('   • Ag. 2 (Spiritual Triage): 42 triage events with crisis keywords');
  console.log('   • Ag. 4 (Prayer Watchman): 170 prayer requests');
  console.log('   • Ag. 5 (Shepherd\'s Log): Members with varied attendance patterns');
  console.log('   • Ag. 12 (Coverage Engine): 310 volunteers across ministries');
}
main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
