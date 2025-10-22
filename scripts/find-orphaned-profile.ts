import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function findOrphanedProfile() {
  try {
    console.log('🔍 Finding orphaned spiritual profile...\n')

    // Get the spiritual profile
    const profile = await prisma.memberSpiritualProfile.findFirst({
      include: {
        member: true
      }
    })

    if (!profile) {
      console.log('❌ No spiritual profiles found')
      return
    }

    console.log('✅ Found spiritual profile:')
    console.log(`   Profile ID: ${profile.id}`)
    console.log(`   Member ID: ${profile.memberId}`)
    console.log(`   Member Name: ${profile.member?.firstName} ${profile.member?.lastName}`)
    console.log(`   Primary Gifts: ${JSON.stringify(profile.primaryGifts)}`)
    console.log(`   Secondary Gifts: ${JSON.stringify(profile.secondaryGifts)}`)
    console.log(`   Ministry Passions: ${JSON.stringify(profile.ministryPassions)}`)
    console.log('')

    // Check if this member has a volunteer record
    const volunteer = await prisma.volunteer.findFirst({
      where: {
        id: profile.memberId
      }
    })

    console.log('🔍 Checking volunteer record:')
    if (volunteer) {
      console.log(`   ✅ Volunteer record exists for member ID: ${volunteer.id}`)
    } else {
      console.log(`   ❌ NO volunteer record found for member ID: ${profile.memberId}`)
    }
    console.log('')

    // Find Juan Herrera member record
    const juanHerrera = await prisma.member.findFirst({
      where: {
        firstName: { contains: 'Juan', mode: 'insensitive' },
        lastName: { contains: 'Herrera', mode: 'insensitive' }
      }
    })

    if (juanHerrera) {
      console.log('🔍 Found "Juan Herrera" member record:')
      console.log(`   Member ID: ${juanHerrera.id}`)
      console.log(`   Email: ${juanHerrera.email}`)
      console.log('')

      if (juanHerrera.id !== profile.memberId) {
        console.log('⚠️ MISMATCH DETECTED:')
        console.log(`   Spiritual Profile member ID: ${profile.memberId}`)
        console.log(`   Juan Herrera member ID: ${juanHerrera.id}`)
        console.log('')
        console.log('💡 SOLUTION: Update spiritual profile to point to correct member ID')
      }
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

findOrphanedProfile()
