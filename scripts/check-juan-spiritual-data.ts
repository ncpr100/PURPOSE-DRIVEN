import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkJuanSpiritualData() {
  try {
    console.log('🔍 Searching for JUAN PACHANGA (JUAN HERRERA)...\n')

    // Find Juan in the database - search more broadly
    const allJuans = await prisma.member.findMany({
      where: {
        OR: [
          { firstName: { contains: 'JUAN', mode: 'insensitive' } },
          { firstName: { contains: 'Juan', mode: 'insensitive' } },
          { lastName: { contains: 'PACHANGA', mode: 'insensitive' } },
          { lastName: { contains: 'Herrera', mode: 'insensitive' } }
        ]
      },
      include: {
        spiritualProfile: true
      },
      take: 5
    })

    console.log(`✅ Found ${allJuans.length} members matching 'Juan':\n`)
    
    for (const member of allJuans) {
      console.log('━'.repeat(60))
      console.log(`   ID: ${member.id}`)
      console.log(`   Name: ${member.firstName} ${member.lastName}`)
      console.log(`   Email: ${member.email || 'N/A'}`)
      console.log('')

      // Check OLD system (spiritualGiftsStructured JSON field)
      console.log('📊 OLD SYSTEM CHECK (Member.spiritualGiftsStructured):')
      if (member.spiritualGiftsStructured) {
        console.log('   ✅ HAS DATA in spiritualGiftsStructured field:')
        console.log(JSON.stringify(member.spiritualGiftsStructured, null, 2))
      } else {
        console.log('   ❌ NO DATA in spiritualGiftsStructured field')
      }
      console.log('')

      // Check NEW system (MemberSpiritualProfile table via relation)
      console.log('📊 NEW SYSTEM CHECK (MemberSpiritualProfile table):')
      if (member.spiritualProfile) {
        console.log('   ✅ HAS DATA in MemberSpiritualProfile table:')
        console.log(`   ID: ${member.spiritualProfile.id}`)
        console.log(`   Primary Gifts:`, member.spiritualProfile.primaryGifts)
        console.log(`   Secondary Gifts:`, member.spiritualProfile.secondaryGifts)
        console.log(`   Ministry Passions:`, member.spiritualProfile.ministryPassions)
        console.log(`   Experience Level: ${member.spiritualProfile.experienceLevel}`)
        console.log(`   Spiritual Calling: ${member.spiritualProfile.spiritualCalling}`)
        console.log(`   Volunteer Readiness: ${member.spiritualProfile.volunteerReadinessScore}`)
      } else {
        console.log('   ❌ NO DATA in MemberSpiritualProfile table (relation not found)')
      }
      console.log('')
    }

    // Also do a direct query on MemberSpiritualProfile table
    console.log('━'.repeat(60))
    console.log('� DIRECT QUERY ON MemberSpiritualProfile TABLE:')
    const allProfiles = await prisma.memberSpiritualProfile.findMany({
      include: {
        member: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      take: 10
    })

    console.log(`Found ${allProfiles.length} spiritual profiles in database:\n`)
    for (const profile of allProfiles) {
      console.log(`   Member: ${profile.member.firstName} ${profile.member.lastName}`)
      console.log(`   Primary Gifts Count: ${Array.isArray(profile.primaryGifts) ? profile.primaryGifts.length : 'N/A'}`)
      console.log(`   Secondary Gifts Count: ${Array.isArray(profile.secondaryGifts) ? profile.secondaryGifts.length : 'N/A'}`)
      console.log(`   Readiness Score: ${profile.volunteerReadinessScore}`)
      console.log('')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkJuanSpiritualData()
