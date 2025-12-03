const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// Helper functions
function randomDate(start = new Date('2020-01-01'), end = new Date()) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomPhone() {
  return `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
}

function randomEmail(firstName, lastName) {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}@test.com`;
}

const firstNames = [
  'Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Sofia', 'Luis', 'Carmen', 'Miguel', 'Isabel',
  'Jorge', 'Patricia', 'Roberto', 'Laura', 'Francisco', 'Elena', 'Antonio', 'Rosa', 'Manuel', 'Teresa',
  'José', 'Marta', 'Fernando', 'Lucia', 'Diego', 'Raquel', 'Alejandro', 'Beatriz', 'Ricardo', 'Gloria'
];

const lastNames = [
  'García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández', 'Pérez', 'Sánchez', 'Ramírez', 'Torres',
  'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales', 'Reyes', 'Jiménez', 'Ruiz', 'Ortiz'
];

async function createTestChurch() {
  try {
    console.log('🚀 Starting test church creation with 100 members...\n');

    // Create the church
    console.log('1️⃣ Creating church...');
    const church = await prisma.church.create({
      data: {
        name: 'Iglesia de Prueba',
        address: '123 Test Street, Test City, TC 12345',
        phone: '+15551234567',
        email: 'contacto@iglesiadeprueba.com',
        website: 'https://iglesiadeprueba.com',
        founded: new Date('2020-01-01'),
        description: 'Iglesia de prueba para testing con 100 miembros'
      }
    });
    console.log(`✅ Church created: ${church.name} (ID: ${church.id})\n`);

    // Create admin user
    console.log('2️⃣ Creating admin user...');
    const hashedPassword = await bcrypt.hash('Admin2024!', 10);
    const timestamp = Date.now();
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin Prueba',
        email: `admin${timestamp}@iglesiadeprueba.com`,
        password: hashedPassword,
        role: 'ADMIN_IGLESIA',
        churchId: church.id,
        emailVerified: new Date()
      }
    });
    console.log(`✅ Admin user created: ${adminUser.email}\n`);

    // Create 100 members
    console.log('3️⃣ Creating 100 members...');
    const members = [];
    for (let i = 0; i < 100; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const email = randomEmail(firstName, lastName);
      
      const member = await prisma.member.create({
        data: {
          firstName,
          lastName,
          email,
          phone: randomPhone(),
          birthDate: randomDate(new Date('1950-01-01'), new Date('2010-01-01')),
          gender: Math.random() > 0.5 ? 'MASCULINO' : 'FEMENINO',
          maritalStatus: ['SOLTERO', 'CASADO', 'DIVORCIADO', 'VIUDO'][Math.floor(Math.random() * 4)],
          membershipStatus: ['ACTIVO', 'INACTIVO', 'VISITANTE'][Math.floor(Math.random() * 3)],
          joinDate: randomDate(new Date('2020-01-01'), new Date()),
          churchId: church.id
        }
      });
      members.push(member);
      
      if ((i + 1) % 20 === 0) {
        console.log(`   ✓ Created ${i + 1}/100 members...`);
      }
    }
    console.log(`✅ All 100 members created\n`);

    // Create 20 volunteers
    console.log('4️⃣ Creating 20 volunteers...');
    for (let i = 0; i < 20; i++) {
      const member = members[Math.floor(Math.random() * members.length)];
      await prisma.volunteer.create({
        data: {
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          phone: member.phone,
          skills: ['Música', 'Enseñanza', 'Tecnología', 'Administración', 'Cocina'][Math.floor(Math.random() * 5)],
          availability: ['Domingos', 'Lunes a Viernes', 'Fines de Semana'][Math.floor(Math.random() * 3)],
          churchId: church.id,
          memberId: member.id,
          isActive: true
        }
      });
    }
    console.log(`✅ 20 volunteers created\n`);

    // Create 10 events
    console.log('5️⃣ Creating 10 events...');
    const eventTitles = [
      'Servicio Dominical', 'Estudio Bíblico', 'Reunión de Oración', 
      'Conferencia', 'Retiro Juvenil', 'Noche de Adoración',
      'Taller Matrimonial', 'Servicio Comunitario', 'Células'
    ];
    
    for (let i = 0; i < 10; i++) {
      const startDate = randomDate(new Date('2024-01-01'), new Date('2026-01-01'));
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
      
      await prisma.event.create({
        data: {
          title: eventTitles[Math.floor(Math.random() * eventTitles.length)] + ` ${i + 1}`,
          description: `Descripción del evento de prueba ${i + 1}`,
          startDate,
          endDate,
          location: `Sala ${i + 1}`,
          capacity: Math.floor(Math.random() * 100) + 50,
          isPublic: true,
          churchId: church.id,
          createdBy: adminUser.id
        }
      });
    }
    console.log(`✅ 10 events created\n`);

    // Summary
    console.log('=' .repeat(60));
    console.log('🎉 TEST CHURCH CREATION COMPLETED!');
    console.log('=' .repeat(60));
    console.log(`Church: ${church.name}`);
    console.log(`Church ID: ${church.id}`);
    console.log(`\n📧 Admin Login Credentials:`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Password: Admin2024!`);
    console.log(`\n📊 Statistics:`);
    console.log(`   Members: 100`);
    console.log(`   Volunteers: 20`);
    console.log(`   Events: 10`);
    console.log('=' .repeat(60));

  } catch (error) {
    console.error('❌ Error creating test church:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createTestChurch();
