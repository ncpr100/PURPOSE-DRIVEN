// Test the diagnostic endpoint deployed to Vercel
const fetch = require('node-fetch');

async function testDiagnostic() {
  console.log('🔍 Testing Vercel production diagnostic endpoint...\n');
  
  try {
    const response = await fetch('https://khesed-tek-cms-org.vercel.app/api/diagnostic/database');
    const data = await response.json();
    
    console.log('📊 DIAGNOSTIC RESULTS:');
    console.log(JSON.stringify(data, null, 2));
    
    console.log('\n=== SUMMARY ===');
    console.log('Database URL configured:', data.databaseUrl);
    console.log('Environment:', data.environment);
    
    if (data.tests.overallStatus) {
      console.log('Overall Status:', data.tests.overallStatus);
    }
    
    if (data.tests.connectionTest) {
      console.log('Connection:', data.tests.connectionTest);
    }
    
    if (data.tests.churchCount) {
      console.log('Churches in DB:', data.tests.churchCount.count);
    }
    
    if (data.tests.totalMembersTest) {
      console.log('Total Members:', data.tests.totalMembersTest.count);
    }
    
    if (data.tests.iglesiacentralTest) {
      console.log('\n🏛️ IGLESIA CENTRAL:');
      console.log(JSON.stringify(data.tests.iglesiacentralTest, null, 2));
    }
    
    if (data.tests.error) {
      console.log('\n❌ ERROR DETECTED:');
      console.log(JSON.stringify(data.tests.error, null, 2));
      
      if (data.tests.diagnosis) {
        console.log('\n💡 DIAGNOSIS:');
        console.log(JSON.stringify(data.tests.diagnosis, null, 2));
      }
    }
    
  } catch (error) {
    console.error('❌ Failed to call diagnostic endpoint:');
    console.error(error.message);
  }
}

testDiagnostic();
