// Quick test to verify Supabase connection and check for data
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['error', 'warn']
});

async function testConnection() {
  console.log('🔍 Testing Supabase PostgreSQL connection...\n');
  console.log('Connection string:', process.env.DATABASE_URL?.substring(0, 50) + '...\n');
  
  try {
    // Test 1: Basic connection
    console.log('TEST 1: Testing database connection...');
    await prisma.$connect();
    console.log('✅ Connected to Supabase successfully!\n');
    
    // Test 2: Check churches
    console.log('TEST 2: Checking churches in database...');
    const churches = await prisma.church.findMany({
      select: { id: true, name: true, _count: { select: { members: true } } }
    });
    console.log(`✅ Found ${churches.length} church(es):`);
    churches.forEach(c => console.log(`   - ${c.name} (ID: ${c.id}, Members: ${c._count.members})`));
    console.log('');
    
    // Test 3: Check members
    console.log('TEST 3: Checking members in database...');
    const memberCount = await prisma.member.count();
    console.log(`✅ Total members in database: ${memberCount}\n`);
    
    if (memberCount > 0) {
      const sampleMembers = await prisma.member.findMany({
        take: 5,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          church: { select: { name: true } }
        }
      });
      console.log('Sample members:');
      sampleMembers.forEach(m => console.log(`   - ${m.firstName} ${m.lastName} (${m.email}) - Church: ${m.church.name}`));
    }
    
    // Test 4: Check specifically for "Iglesia Central"
    console.log('\nTEST 4: Checking "Iglesia Central" specifically...');
    const iglesiacentral = await prisma.church.findFirst({
      where: { 
        OR: [
          { name: { contains: 'Central', mode: 'insensitive' } },
          { name: { contains: 'Iglesia', mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            members: true,
            events: true,
            donations: true,
            volunteers: true
          }
        }
      }
    });
    
    if (iglesiacentral) {
      console.log(`✅ Found church: ${iglesiacentral.name}`);
      console.log(`   Church ID: ${iglesiacentral.id}`);
      console.log(`   Members: ${iglesiacentral._count.members}`);
      console.log(`   Events: ${iglesiacentral._count.events}`);
      console.log(`   Donations: ${iglesiacentral._count.donations}`);
      console.log(`   Volunteers: ${iglesiacentral._count.volunteers}`);
    } else {
      console.log('❌ No church found matching "Central" or "Iglesia"');
    }
    
    console.log('\n✅ ALL TESTS PASSED - Database connection is working!');
    
  } catch (error) {
    console.error('❌ DATABASE TEST FAILED:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'P1001') {
      console.error('\n🚨 NETWORK ERROR: Cannot reach Supabase server');
      console.error('   This could mean:');
      console.error('   1. Supabase server is down');
      console.error('   2. Network firewall blocking connection');
      console.error('   3. Incorrect host/port in connection string');
    } else if (error.code === 'P1000') {
      console.error('\n🚨 AUTHENTICATION ERROR: Wrong username/password');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
