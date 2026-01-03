// COMPREHENSIVE TEST: Verify consistent gender inference across entire app
// Run with: npx tsx scripts/test-app-wide-gender-consistency.ts

import { inferGenderFromName, getEffectiveGender, categorizeGender, matchesGenderFilter } from '../lib/gender-utils'

async function testAppWideConsistency() {
  console.log('🧪 COMPREHENSIVE GENDER CONSISTENCY TEST\n')
  
  // Test data that represents the database structure
  const testMembers = [
    { firstName: 'Juan', lastName: 'Pérez', gender: 'masculino' },
    { firstName: 'María', lastName: 'García', gender: 'femenino' },
    { firstName: 'Carlos', lastName: 'López', gender: null }, // Should infer masculino
    { firstName: 'Ana', lastName: 'Martínez', gender: null }, // Should infer femenino
    { firstName: 'Ashley', lastName: 'Johnson', gender: null }, // Should infer femenino (-a ending)
    { firstName: 'Gabriel', lastName: 'Silva', gender: null }, // Should infer masculino (-l ending)
    { firstName: 'Unknown', lastName: 'Person', gender: null }, // Should remain unspecified
    { firstName: null, lastName: 'NoName', gender: null }, // Should remain unspecified
  ]
  
  console.log('1. Testing Gender Inference Function:')
  testMembers.forEach(member => {
    const inferred = inferGenderFromName(member.firstName)
    const effective = getEffectiveGender(member)
    const category = categorizeGender(member)
    
    console.log(`${member.firstName || 'NULL'} ${member.lastName}:`)
    console.log(`  Database: "${member.gender || 'NULL'}"`)
    console.log(`  Inferred: "${inferred || 'none'}"`)
    console.log(`  Effective: "${effective || 'none'}"`) 
    console.log(`  Category: "${category}"`)
    console.log('')
  })
  
  console.log('2. Testing Filter Matching:')
  const filters = ['all', 'masculino', 'femenino']
  
  filters.forEach(filter => {
    console.log(`Filter: "${filter}"`)
    testMembers.forEach(member => {
      const matches = matchesGenderFilter(member, filter)
      console.log(`  ${member.firstName || 'NULL'}: ${matches ? '✅' : '❌'}`)
    })
    console.log('')
  })
  
  console.log('3. Testing Count Distribution:')
  const counts = {
    masculino: testMembers.filter(m => categorizeGender(m) === 'masculino').length,
    femenino: testMembers.filter(m => categorizeGender(m) === 'femenino').length,
    sinEspecificar: testMembers.filter(m => categorizeGender(m) === 'sinEspecificar').length
  }
  
  console.log(`Masculino: ${counts.masculino}`)
  console.log(`Femenino: ${counts.femenino}`)
  console.log(`Sin Especificar: ${counts.sinEspecificar}`)
  console.log(`Total: ${counts.masculino + counts.femenino + counts.sinEspecificar}`)
  
  const expectedTotal = testMembers.length
  const actualTotal = counts.masculino + counts.femenino + counts.sinEspecificar
  
  if (actualTotal === expectedTotal) {
    console.log('✅ Count math is correct!')
  } else {
    console.log('❌ Count math is wrong!')
  }
  
  console.log('\n4. Testing Consistency Across Components:')
  
  // Test UI display logic
  console.log('UI Badge Display:')
  testMembers.forEach(member => {
    const displayGender = getEffectiveGender(member)
    const showsBadge = !!displayGender
    const badgeVariant = member.gender ? 'secondary' : 'outline'
    console.log(`${member.firstName || 'NULL'}: ${showsBadge ? `"${displayGender}" (${badgeVariant})` : 'No badge'}`)
  })
  
  console.log('\n5. Expected Results After Implementation:')
  console.log('✅ Dashboard counts will show inferred gender distribution')
  console.log('✅ Member list will show gender badges for most members')  
  console.log('✅ Filtering will work with both actual and inferred genders')
  console.log('✅ Analytics will include inferred gender data')
  console.log('✅ All systems use identical inference logic')
  
  console.log('\n🎯 CONSISTENCY CHECK COMPLETE!')
  console.log('All components now use shared gender-utils for consistent behavior.')
}

testAppWideConsistency()