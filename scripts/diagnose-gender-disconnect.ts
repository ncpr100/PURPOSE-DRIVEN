// CRITICAL DIAGNOSTIC: Compare database reality vs UI display
// Run with: npx tsx scripts/diagnose-gender-disconnect.ts

import { db } from '../lib/db'

async function diagnoseGenderDisconnect() {
  try {
    console.log('🔍 CRITICAL DIAGNOSTIC: Database vs UI Gender Display\n')
    
    // Check if there are multiple gender-related fields
    console.log('1. Checking Member model structure for gender-related fields...')
    
    const sampleMember = await db.members.findFirst({
      where: { isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        gender: true,
        maritalStatus: true,
        notes: true
      }
    })
    
    if (sampleMember) {
      console.log('Sample member data structure:')
      console.log(JSON.stringify(sampleMember, null, 2))
    }
    
    // Check if there's a computation happening in the API
    console.log('\n2. Checking what the actual API returns...')
    
    // Simulate the API call
    const membersFromAPI = await db.members.findMany({
      where: {
        isActive: true,
        // Using demo-church from the earlier investigation
        churchId: 'demo-church'
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        gender: true,
      },
      take: 10
    })
    
    console.log('\nFirst 10 members from API query:')
    membersFromAPI.forEach((member, index) => {
      console.log(`${index + 1}. ${member.firstName} ${member.lastName}: gender="${member.gender}" (${typeof member.gender})`)
      
      // If gender is null, check if there could be inference
      if (!member.gender) {
        console.log(`   ^ This member would show NO gender badge (gender is null)`)
      } else {
        console.log(`   ^ This member would show "${member.gender}" badge`)
      }
    })
    
    // Count exactly what we have using Prisma (not raw SQL)
    console.log('\n3. Exact gender value counts using Prisma:')
    
    const allMembers = await db.members.findMany({
      where: {
        churchId: 'demo-church',
        isActive: true
      },
      select: {
        gender: true,
        firstName: true,
        lastName: true
      }
    })
    
    const genderCounts = allMembers.reduce((acc, member) => {
      const gender = member.gender || 'NULL'
      acc[gender] = (acc[gender] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    console.log('Gender distribution:')
    Object.entries(genderCounts).forEach(([gender, count]) => {
      console.log(`  ${gender}: ${count} members`)
    })
    
    console.log('\nExamples of NULL gender members:')
    const nullGenderMembers = allMembers.filter(m => !m.gender).slice(0, 5)
    nullGenderMembers.forEach(member => {
      console.log(`  ${member.firstName} ${member.lastName}: gender=${member.gender}`)
    })
    
    // Total count check
    const totalCount = await db.members.count({
      where: {
        churchId: 'demo-church',
        isActive: true
      }
    })
    
    console.log(`\nTotal active members: ${totalCount}`)
    
    console.log('\n🚨 CRITICAL QUESTIONS:')
    console.log('1. If database shows 845 NULL gender values...')
    console.log('2. But UI shows gender badges for ALL members...')
    console.log('3. Then where is the UI getting the gender information from?')
    console.log('\nPOSSIBLE EXPLANATIONS:')
    console.log('- Gender inference from first names happening in frontend')
    console.log('- Different database table being used')
    console.log('- Cached data showing different than current database')
    console.log('- Multiple gender fields in the Member model')
    console.log('- API transformation we haven\'t found yet')

  } catch (error) {
    console.error('❌ Error in diagnostic:', error)
  } finally {
    await db.$disconnect()
  }
}

diagnoseGenderDisconnect()