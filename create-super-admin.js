#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { nanoid } = require('nanoid');

const prisma = new PrismaClient({ log: ['error'] });

async function createSuperAdmin() {
  console.log('🔧 CREATING SUPER_ADMIN USER...\n');

  const email = 'soporte@khesed-tek-systems.org';
  const password = 'Bendecido100%$$%';
  const name = 'Khesed-Tek Support';

  try {
    // Check if already exists
    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing) {
      console.log(`⚠️  User already exists: ${existing.email} (role: ${existing.role})`);
      if (existing.role !== 'SUPER_ADMIN') {
        const updated = await prisma.users.update({
          where: { email },
          data: { role: 'SUPER_ADMIN', churchId: null }
        });
        console.log(`✅ Updated role to SUPER_ADMIN for ${updated.email}`);
      } else {
        // Reset password in case it changed
        const hashed = await bcrypt.hash(password, 12);
        await prisma.users.update({ where: { email }, data: { password: hashed } });
        console.log(`✅ Password reset for existing SUPER_ADMIN: ${existing.email}`);
      }
      return;
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.users.create({
      data: {
        id: nanoid(),
        email,
        name,
        password: hashed,
        role: 'SUPER_ADMIN',
        churchId: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    console.log('✅ SUPER_ADMIN created successfully!');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name:  ${user.name}`);
    console.log(`   Role:  ${user.role}`);
    console.log(`   ID:    ${user.id}`);
    console.log(`\n🔑 Login credentials:`);
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);

  } catch (error) {
    console.error('❌ Failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
