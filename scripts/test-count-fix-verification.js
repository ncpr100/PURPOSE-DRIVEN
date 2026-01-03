// Test the corrected count logic for gender statistics
// Run with: node scripts/test-count-fix-verification.js

const baseUrl = 'http://localhost:3000'

async function testCountsAfterFix() {
  console.log('🔍 Testing Dashboard Count Fix...\n')
  
  try {
    // Test the counts API endpoint
    console.log('1. Testing /api/members/counts endpoint')
    const response = await fetch(`${baseUrl}/api/members/counts`, {
      headers: {
        'Cookie': 'next-auth.session-token=test-session' // Would need real session
      }
    })
    
    console.log(`Status: ${response.status}`)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Counts API Response:')
      console.log(`   Total Members: ${data.totalCount}`)
      console.log(`   Gender Counts:`)
      console.log(`     Masculino: ${data.genderCounts.masculino}`)
      console.log(`     Femenino: ${data.genderCounts.femenino}`)
      console.log(`     Sin Especificar: ${data.genderCounts.sinEspecificar}`)
      
      // Verify the math
      const genderSum = data.genderCounts.masculino + data.genderCounts.femenino + data.genderCounts.sinEspecificar
      console.log(`\n📊 Math Verification:`)
      console.log(`   ${data.genderCounts.masculino} + ${data.genderCounts.femenino} + ${data.genderCounts.sinEspecificar} = ${genderSum}`)
      console.log(`   Total Members: ${data.totalCount}`)
      
      if (genderSum === data.totalCount) {
        console.log('   ✅ Math is CORRECT! Counts add up perfectly.')
      } else {
        console.log(`   ❌ Math is WRONG! Difference: ${data.totalCount - genderSum}`)
      }
      
    } else {
      console.log('❌ API request failed (expected without valid session):', await response.text())
      console.log('💡 This test requires a running server and valid authentication')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.log('💡 Make sure the server is running with: npm run dev')
  }
}

// Expected results based on the screenshot:
console.log('🎯 Expected Results Based on Screenshot:')
console.log('   Total: 868 members')
console.log('   The issue: Dashboard shows 845 "Sin Especificar" but members clearly have gender data')
console.log('   Root cause: Count API was using filtered members instead of all members')
console.log('   Fix: Changed genderCounts to use allMembers array for accurate dashboard statistics')
console.log('')
console.log('🧪 Running verification test...\n')

testCountsAfterFix()