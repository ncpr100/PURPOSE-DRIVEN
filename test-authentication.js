/**
 * Test authentication and API access
 */

const testAuth = async () => {
  console.log('🧪 TESTING AUTHENTICATION & DATA ACCESS\n');
  
  // Test 1: Check if API is responding
  console.log('Test 1: API Health Check...');
  try {
    const healthResponse = await fetch('http://localhost:3000/api/health');
    
    if (healthResponse.ok) {
      console.log('✅ API responding');
    } else {
      console.log('❌ API not responding:', healthResponse.status);
    }
  } catch (error) {
    console.log('❌ API connection failed:', error.message);
  }
  
  // Test 2: Test members API (should work with RLS now)
  console.log('\nTest 2: Members API Access...');
  try {
    const membersResponse = await fetch('http://localhost:3000/api/members');
    console.log('Members API status:', membersResponse.status);
    
    if (membersResponse.ok) {
      const data = await membersResponse.json();
      console.log('✅ Members API accessible');
      console.log('Response type:', typeof data);
    } else {
      console.log('❌ Members API failed:', membersResponse.status);
    }
  } catch (error) {
    console.log('❌ Members API error:', error.message);
  }
  
  // Test 3: Check authentication endpoints
  console.log('\nTest 3: Authentication endpoints...');
  try {
    const authResponse = await fetch('http://localhost:3000/api/auth/csrf');
    console.log('Auth CSRF status:', authResponse.status);
    
    if (authResponse.ok) {
      console.log('✅ Auth endpoints accessible');
    } else {
      console.log('❌ Auth endpoints failed');
    }
  } catch (error) {
    console.log('❌ Auth endpoints error:', error.message);
  }
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('1. Test login at http://localhost:3000/auth/signin');
  console.log('2. Use credentials:');
  console.log('   - soporte@khesed-tek-systems.org / Bendecido100%$$%');
  console.log('   - testadmin@prueba.com / TestPassword123!');
  console.log('3. Check if members data loads properly');
};

testAuth().catch(console.error);