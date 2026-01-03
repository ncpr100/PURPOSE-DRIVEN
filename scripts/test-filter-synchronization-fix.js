// Test the filter synchronization fix
// This should show different counts when different filters are applied

async function testFilterSynchronization() {
  const baseUrl = 'http://localhost:3000'
  
  console.log('🧪 Testing Filter Synchronization Fix...')
  console.log('')

  // Test 1: No filters - should show total counts
  console.log('📊 TEST 1: No filters (should show total: 322M + 314F + 232? = 868)')
  try {
    const response1 = await fetch(`${baseUrl}/api/members/counts`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    const data1 = await response1.json()
    const counts1 = data1.counts
    console.log('✅ Total:', counts1.totalCount)
    console.log('✅ Masculino:', counts1.genderCounts.masculino)
    console.log('✅ Femenino:', counts1.genderCounts.femenino) 
    console.log('✅ Sin Especificar:', counts1.genderCounts.sinEspecificar)
    console.log('✅ Sum:', counts1.genderCounts.masculino + counts1.genderCounts.femenino + counts1.genderCounts.sinEspecificar)
  } catch (error) {
    console.error('❌ Test 1 failed:', error.message)
  }
  
  console.log('')
  
  // Test 2: Gender filter = masculino - should show only male counts
  console.log('📊 TEST 2: Filter by Masculino (should show: 322 total, 322M + 0F + 0? = 322)')
  try {
    const response2 = await fetch(`${baseUrl}/api/members/counts?gender=masculino`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    const data2 = await response2.json()
    const counts2 = data2.counts
    console.log('✅ Total:', counts2.totalCount, '(should be 322)')
    console.log('✅ Masculino:', counts2.genderCounts.masculino, '(should be 322)')
    console.log('✅ Femenino:', counts2.genderCounts.femenino, '(should be 0)')
    console.log('✅ Sin Especificar:', counts2.genderCounts.sinEspecificar, '(should be 0)')
    console.log('✅ Sum:', counts2.genderCounts.masculino + counts2.genderCounts.femenino + counts2.genderCounts.sinEspecificar)
    console.log('✅ FILTER FIX SUCCESS:', counts2.totalCount === 322 && counts2.genderCounts.femenino === 0 ? '✅ YES' : '❌ NO')
  } catch (error) {
    console.error('❌ Test 2 failed:', error.message)
  }
  
  console.log('')
  
  // Test 3: Gender filter = femenino - should show only female counts
  console.log('📊 TEST 3: Filter by Femenino (should show: 314 total, 0M + 314F + 0? = 314)')
  try {
    const response3 = await fetch(`${baseUrl}/api/members/counts?gender=femenino`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    const data3 = await response3.json()
    const counts3 = data3.counts
    console.log('✅ Total:', counts3.totalCount, '(should be 314)')
    console.log('✅ Masculino:', counts3.genderCounts.masculino, '(should be 0)')
    console.log('✅ Femenino:', counts3.genderCounts.femenino, '(should be 314)')
    console.log('✅ Sin Especificar:', counts3.genderCounts.sinEspecificar, '(should be 0)')
    console.log('✅ Sum:', counts3.genderCounts.masculino + counts3.genderCounts.femenino + counts3.genderCounts.sinEspecificar)
    console.log('✅ FILTER FIX SUCCESS:', counts3.totalCount === 314 && counts3.genderCounts.masculino === 0 ? '✅ YES' : '❌ NO')
  } catch (error) {
    console.error('❌ Test 3 failed:', error.message)
  }
  
  console.log('')
  console.log('🎯 EXPECTED BEHAVIOR AFTER FIX:')
  console.log('   - When no filters: shows 868 total (322M + 314F + 232?)')
  console.log('   - When "Masculino" selected: shows 322 total (322M + 0F + 0?)')  
  console.log('   - When "Femenino" selected: shows 314 total (0M + 314F + 0?)')
  console.log('   - Dashboard count cards should match filter selection!')
}

// Run the test
testFilterSynchronization().catch(console.error)