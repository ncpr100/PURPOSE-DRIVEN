import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function checkGenderDistribution() {
  try {
    console.log('🔍 CHECKING ACTUAL GENDER DISTRIBUTION\n')

    const church = await db.church.findFirst({
      where: { name: 'Iglesia Comunidad de Fe' }
    })

    if (!church) {
      console.log('❌ Church not found!')
      return
    }

    console.log(`Church: ${church.name} (${church.id})\n`)

    // Get all members
    const allMembers = await db.member.findMany({
      where: { churchId: church.id },
      select: { gender: true }
    })

    console.log(`Total members: ${allMembers.length}`)

    // Count by gender (exact match)
    const masculino = allMembers.filter(m => m.gender === 'Masculino').length
    const femenino = allMembers.filter(m => m.gender === 'Femenino').length
    const nullGender = allMembers.filter(m => !m.gender).length
    const other = allMembers.filter(m => m.gender && m.gender !== 'Masculino' && m.gender !== 'Femenino').length

    console.log('\n📊 GENDER BREAKDOWN:')
    console.log(`   Masculino (exact): ${masculino}`)
    console.log(`   Femenino (exact): ${femenino}`)
    console.log(`   NULL: ${nullGender}`)
    console.log(`   Other: ${other}`)
    console.log(`   TOTAL: ${masculino + femenino + nullGender + other}`)

    // Sample 10 members to see actual values
    console.log('\n📋 SAMPLE MEMBER GENDERS (first 10):')
    const sample = allMembers.slice(0, 10)
    sample.forEach((m, i) => {
      console.log(`   ${i+1}. gender = "${m.gender}" (type: ${typeof m.gender})`)
    })

    // Check unique gender values
    const uniqueGenders = [...new Set(allMembers.map(m => m.gender))]
    console.log('\n🔤 UNIQUE GENDER VALUES IN DATABASE:')
    uniqueGenders.forEach(g => {
      const count = allMembers.filter(m => m.gender === g).length
      console.log(`   "${g}" → ${count} members`)
    })

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await db.$disconnect()
  }
}

checkGenderDistribution()
