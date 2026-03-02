async function testAuthentication() {
  console.log('🧪 TESTING AUTHENTICATION API...\n')
  
  const testCases = [
    {
      name: 'SOPORTE Account',
      email: 'soporte@khesed-tek-systems.org',
      password: 'Bendecido100%$$%'
    },
    {
      name: 'TESTADMIN Account', 
      email: 'testadmin@prueba.com',
      password: 'TestPassword123!'
    }
  ]
  
  for (const test of testCases) {
    console.log(`🔍 Testing ${test.name}...`)
    
    try {
      // Test the credentials provider directly via NextAuth
      const response = await fetch('http://localhost:3000/api/auth/callback/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: test.email,
          password: test.password,
          csrfToken: 'test-token', // We'll skip CSRF for direct testing
          callbackUrl: 'http://localhost:3000/dashboard'
        }).toString()
      })
      
      console.log(`   Status: ${response.status} ${response.statusText}`)
      console.log(`   Headers:`, Object.fromEntries(response.headers))
      
      if (response.status === 200 || response.status === 302) {
        console.log(`   ✅ ${test.name}: Authentication appears successful`)
      } else {
        console.log(`   ❌ ${test.name}: Authentication failed`)
        const text = await response.text()
        console.log(`   Response: ${text.substring(0, 200)}...`)
      }
      
    } catch (error) {
      console.log(`   💥 ${test.name}: Network error - ${error.message}`)
    }
    
    console.log('')
  }
  
  // Test signin page availability
  console.log('🔍 Testing signin page...')
  try {
    const signinResponse = await fetch('http://localhost:3000/auth/signin')
    console.log(`   Signin page: ${signinResponse.status} ${signinResponse.statusText}`)
  } catch (error) {
    console.log(`   💥 Signin page error: ${error.message}`)
  }
  
  console.log('\n🎯 AUTHENTICATION TEST COMPLETE')
}

testAuthentication().catch(console.error)