import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkJuanPachanga() {
  try {
    console.log('🔍 Searching for JUAN PACHANGA...\n')
    
    // Find member
    const member = await prisma.member.findFirst({
      where: {
        OR: [
          { firstName: { contains: 'JUAN', mode: 'insensitive' } },
          { lastName: { contains: 'PACHANGA', mode: 'insensitive' } }
        ]
      },
      include: {
        memberSpiritualProfile: true,
        volunteer: true
      }
    })
    
    if (!member) {
      console.log('❌ JUAN PACHANGA not found in database')
      return
    }
    
    console.log('✅ Found member:')
    console.log(`   ID: ${member.id}`)
    console.log(`   Name: ${member.firstName} ${member.lastName}`)
    console.log(`   Email: ${member.email}`)
    console.log(`   Is Volunteer: ${member.volunteer ? 'YES' : 'NO'}`)
    console.log('')
    
    // Check OLD system data
    console.log('📊 OLD SYSTEM (Member.spiritualGiftsStructured):')
    if (member.spiritualGiftsStructured) {
      console.log('   ✅ HAS DATA in old field!')
      console.log('   Data:', JSON.stringify(member.spiritualGiftsStructured, null, 2))
    } else {
      console.log('   ❌ NO DATA in old field')
    }
    console.log('')
    
    // Check NEW system data
    console.log('📊 NEW SYSTEM (MemberSpiritualProfile table):')
    if (member.memberSpiritualProfile) {
      console.log('   ✅ HAS PROFILE in new table!')
      console.log('   Primary Gifts:', member.memberSpiritualProfile.primaryGifts)
      console.log('   Secondary Gifts:', member.memberSpiritualProfile.secondaryGifts)
      console.log('   Ministry Passions:', member.memberSpiritualProfile.ministryPassions)
      console.log('   Experience Level:', member.memberSpiritualProfile.experienceLevel)
    } else {
      console.log('   ❌ NO PROFILE in new table')
    }
    console.log('')
    
    // Diagnosis
    console.log('🔬 DIAGNOSIS:')
    if (member.spiritualGiftsStructured && !member.memberSpiritualProfile) {
      console.log('   ⚠️ DATA EXISTS IN OLD SYSTEM BUT NOT MIGRATED TO NEW SYSTEM')
      console.log('   ➡️ Need to create migration script to copy data from spiritualGiftsStructured to MemberSpiritualProfile table')
    } else if (!member.spiritualGiftsStructured && !member.memberSpiritualProfile) {
      console.log('   ❌ NO SPIRITUAL ASSESSMENT DATA EXISTS IN EITHER SYSTEM')
      console.log('   ➡️ Volunteer needs to complete spiritual assessment')
    } else if (member.memberSpiritualProfile) {
      console.log('   ✅ DATA EXISTS IN NEW SYSTEM - Should be displaying correctly')
      console.log('   ⚠️ If not showing in UI, there may be an API fetch issue')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkJuanPachanga()
