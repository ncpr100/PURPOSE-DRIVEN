const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function checkUsers() {
  try {
    const users = await db.users.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        churchId: true,
        isActive: true,
        password: true
      }
    });
    users.forEach(u => {
      console.log(`User: ${u.email}`);
      console.log(`  Name: ${u.name}`);
      console.log(`  Role: ${u.role}`);
      console.log(`  churchId: ${u.churchId}`);
      console.log(`  isActive: ${u.isActive}`);
      console.log(`  hasPassword: ${!!u.password}`);
      console.log(`  passwordLength: ${u.password ? u.password.length : 0}`);
      console.log('');
    });
  } catch(e) {
    console.error('Error:', e.message);
  } finally {
    await db.$disconnect();
  }
}

checkUsers();
