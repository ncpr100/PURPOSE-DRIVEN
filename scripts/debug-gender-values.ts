// DEBUG: Investigate actual gender values in database
// Run with: npx tsx scripts/debug-gender-values.ts

import { db } from '../lib/db'

async function debugGenderValues() {
  try {
    console.log('🔍 INVESTIGATING ACTUAL DATABASE GENDER VALUES...\n')
    
    // Get all active members with their gender values
    const members = await db.members.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        gender: true,
        churchId: true
      }
      // Remove the take: 50 limit to see all members
    })

    console.log(`📊 Found ${members.length} total active members across all churches:\n`)

    // Group by gender value
    const genderGroups = members.reduce((acc, member) => {
      const gender = member.gender
      const key = gender === null ? 'NULL' : gender === '' ? 'EMPTY_STRING' : gender
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(member)
      return acc
    }, {} as Record<string, typeof members>)

    console.log('🎯 Gender Value Analysis:')
    Object.entries(genderGroups).forEach(([genderValue, memberList]) => {
      console.log(`\n"${genderValue}": ${memberList.length} members`)
      console.log(`   Examples: ${memberList.slice(0, 3).map(m => `${m.firstName} ${m.lastName}`).join(', ')}`)
      
      // Show how our current filter logic would handle this value
      const lower = genderValue?.toLowerCase()
      let matchResult = 'Sin Especificar'
      if (lower === 'masculino' || lower === 'male' || lower === 'm') {
        matchResult = 'MASCULINO'
      } else if (lower === 'femenino' || lower === 'female' || lower === 'f') {
        matchResult = 'FEMENINO'
      }
      console.log(`   Current filter would classify as: ${matchResult}`)
    })

    // Check church distribution
    const churchGroups = members.reduce((acc, member) => {
      const churchId = member.churchId || 'NO_CHURCH'
      if (!acc[churchId]) {
        acc[churchId] = 0
      }
      acc[churchId]++
      return acc
    }, {} as Record<string, number>)

    console.log('\n🏛️ Church Distribution:')
    Object.entries(churchGroups).forEach(([churchId, count]) => {
      console.log(`   ${churchId}: ${count} members`)
    })

    console.log('\n🔍 DIAGNOSIS:')
    console.log('1. Look at the exact gender values above')
    console.log('2. Check if they match our filter logic')
    console.log('3. Verify church ID distribution')
    console.log('4. Compare with the screenshot showing 11/12/845 split')

  } catch (error) {
    console.error('❌ Error investigating gender data:', error)
  } finally {
    await db.$disconnect()
  }
}

debugGenderValues()