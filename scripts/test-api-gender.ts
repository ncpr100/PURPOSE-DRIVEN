// Test script to check if the API is returning gender correctly
const TEST_URL = 'https://khesed-tek-cms.up.railway.app/api/members'

async function testMembersAPI() {
  console.log('🔍 Testing Members API...\n')
  
  try {
    const response = await fetch(TEST_URL, {
      headers: {
        'Cookie': 'next-auth.session-token=test' // May need real session
      }
    })
    
    console.log(`Status: ${response.status}`)
    
    if (response.status === 401) {
      console.log('❌ Unauthorized - API requires authentication')
      console.log('   This is expected - the API is protected')
      return
    }
    
    const members = await response.json()
    console.log(`Total members returned: ${members.length}`)
    
    if (members.length > 0) {
      const sample = members.slice(0, 5)
      console.log('\n📋 Sample members:')
      sample.forEach((m: any, i: number) => {
        console.log(`${i+1}. ${m.firstName} ${m.lastName}`)
        console.log(`   gender: "${m.gender}" (type: ${typeof m.gender})`)
      })
      
      const masculino = members.filter((m: any) => m.gender === 'Masculino').length
      const femenino = members.filter((m: any) => m.gender === 'Femenino').length
      
      console.log(`\n📊 Gender counts:`)
      console.log(`   Masculino: ${masculino}`)
      console.log(`   Femenino: ${femenino}`)
      console.log(`   Total: ${masculino + femenino}`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testMembersAPI()
