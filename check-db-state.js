// Check database state using pg library
const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.qxdwpihcmgctznvdfmbv:Bendecido100%25%24%24%25@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
});

async function checkDB() {
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // Check users
    const usersResult = await client.query('SELECT email, name, role, "churchId", "isActive" FROM users ORDER BY email');
    console.log('\n📊 USERS IN DATABASE:');
    console.log('Total users:', usersResult.rows.length);
    usersResult.rows.forEach(user => {
      console.log(`  - ${user.email} | ${user.name} | ${user.role} | Church: ${user.churchId || 'PLATFORM'} | Active: ${user.isActive}`);
    });
    
    // Check churches
    const churchesResult = await client.query('SELECT id, name, "isActive" FROM churches');
    console.log('\n🏛️ CHURCHES IN DATABASE:');
    console.log('Total churches:', churchesResult.rows.length);
    churchesResult.rows.forEach(church => {
      console.log(`  - ${church.id} | ${church.name} | Active: ${church.isActive}`);
    });
    
    // Check members count
    const membersResult = await client.query('SELECT COUNT(*) as count FROM members WHERE "churchId" = \'iglesia-central\'');
    console.log('\n👥 IGLESIA CENTRAL DATA:');
    console.log('  - Members:', membersResult.rows[0].count);
    
    const eventsResult = await client.query('SELECT COUNT(*) as count FROM events WHERE "churchId" = \'iglesia-central\'');
    console.log('  - Events:', eventsResult.rows[0].count);
    
    const donationsResult = await client.query('SELECT COUNT(*) as count FROM donations WHERE "churchId" = \'iglesia-central\'');
    console.log('  - Donations:', donationsResult.rows[0].count);
    
    await client.end();
    console.log('\n✅ Database check complete');
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }
}

checkDB();
