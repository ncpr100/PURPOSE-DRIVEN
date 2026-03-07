const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function checkDB() {
  try {
    // Check if country column exists in churches
    const countryCol = await db.$queryRaw`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'churches' AND column_name = 'country'`;
    console.log('churches.country column:', JSON.stringify(countryCol));
    
    // Check payment_gateway_configs table
    const tables = await db.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'payment_gateway_configs'`;
    console.log('payment_gateway_configs table:', JSON.stringify(tables));
    
    // Verify DB connection works
    const count = await db.users.count();
    console.log('users count (DB connected):', count);
    
    // List churches
    const churches = await db.churches.findMany({ select: { id: true, name: true } });
    console.log('churches:', JSON.stringify(churches));
    
  } catch(e) {
    console.error('DB error:', e.message);
  } finally {
    await db.$disconnect();
  }
}

checkDB();
