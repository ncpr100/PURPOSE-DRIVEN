// Test script for bulk gender update functionality
// Run with: node scripts/test-bulk-gender-update.js

const baseUrl = 'http://localhost:3000'

async function testBulkGenderAPI() {
  console.log('🧪 Testing Bulk Gender Update API...\n')
  
  try {
    // Test 1: Get members without gender
    console.log('1. Testing GET /api/members/bulk-gender-update')
    const getResponse = await fetch(`${baseUrl}/api/members/bulk-gender-update`, {
      headers: {
        'Cookie': 'next-auth.session-token=test-session' // Would need real session
      }
    })
    
    console.log(`Status: ${getResponse.status}`)
    if (getResponse.ok) {
      const getData = await getResponse.json()
      console.log(`✅ Found ${getData.total} members without gender`)
      console.log(`First few members:`, getData.members.slice(0, 3).map(m => ({
        name: `${m.firstName} ${m.lastName}`,
        id: m.id
      })))
    } else {
      console.log('❌ GET request failed:', await getResponse.text())
    }
    
    // Test 2: Test bulk update (would need real session and member IDs)
    console.log('\n2. Testing POST /api/members/bulk-gender-update')
    const updateResponse = await fetch(`${baseUrl}/api/members/bulk-gender-update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'next-auth.session-token=test-session'
      },
      body: JSON.stringify({
        updates: [
          // { id: 'member-id-1', gender: 'masculino' },
          // { id: 'member-id-2', gender: 'femenino' }
        ]
      })
    })
    
    console.log(`Status: ${updateResponse.status}`)
    if (updateResponse.ok) {
      const updateData = await updateResponse.json()
      console.log('✅ Update Response:', updateData)
    } else {
      console.log('❌ POST request failed (expected without valid session):', await updateResponse.text())
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Test name-based gender inference
function testGenderInference() {
  console.log('\n🔍 Testing Gender Inference Logic...\n')
  
  const inferGenderFromName = (firstName) => {
    if (!firstName) return ''
    
    const name = firstName.toLowerCase().trim()
    
    const maleNames = [
      'juan', 'carlos', 'josé', 'antonio', 'francisco', 'manuel', 'david', 'daniel', 
      'miguel', 'rafael', 'pedro', 'alejandro', 'fernando', 'sergio', 'pablo', 'jorge',
      'luis', 'alberto', 'ricardo', 'roberto', 'eduardo', 'andrés', 'javier', 'diego'
    ]
    
    const femaleNames = [
      'maría', 'ana', 'carmen', 'laura', 'elena', 'cristina', 'patricia', 'sandra',
      'monica', 'nuria', 'silvia', 'rosa', 'beatriz', 'teresa', 'pilar', 'mercedes',
      'angeles', 'isabel', 'julia', 'raquel', 'andrea', 'natalia', 'gloria', 'esperanza'
    ]
    
    if (maleNames.includes(name)) return 'masculino'
    if (femaleNames.includes(name)) return 'femenino'
    
    if (name.endsWith('a') && !name.endsWith('ía')) return 'femenino'
    if (name.endsWith('o') || name.endsWith('r') || name.endsWith('n')) return 'masculino'
    
    return ''
  }
  
  const testNames = [
    'Juan', 'María', 'Carlos', 'Ana', 'Francisco', 'Carmen',
    'Daniel', 'Patricia', 'Roberto', 'Elena', 'Andrea', 'Gabriel',
    'Natalia', 'Samuel', 'Sofia', 'Adrian', 'Camila', 'Oscar',
    'Unknown', 'Chris', 'Alex'
  ]
  
  testNames.forEach(name => {
    const inferred = inferGenderFromName(name)
    console.log(`${name.padEnd(10)} → ${inferred || 'sin inferencia'}`)
  })
}

// Run tests
console.log('🚀 Starting Bulk Gender Update Tests\n')
console.log('=' * 50)

// Test gender inference (always works)
testGenderInference()

// Test API (requires running server)
if (process.argv.includes('--api')) {
  console.log('\n' + '=' * 50)
  testBulkGenderAPI()
} else {
  console.log('\n💡 Run with --api flag to test API endpoints (requires running server)')
}

console.log('\n✅ Tests completed!')