import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixSpiritualProfileLink() {
  try {
    console.log('🔧 Fixing spiritual profile member ID link...\n')

    const OLD_MEMBER_ID = 'cmgvcgysw0001781k10u0dh07' // JUAN PACHANGA (old)
    const NEW_MEMBER_ID = 'cmgu3bfhm004k78ltvvk466hj' // Juan Herrera (current)

    // Get the spiritual profile
    const profile = await prisma.memberSpiritualProfile.findUnique({
      where: { memberId: OLD_MEMBER_ID }
    })

    if (!profile) {
      console.log('❌ Spiritual profile not found for old member ID')
      return
    }

    console.log('✅ Found spiritual profile to update:')
    console.log(`   Current Member ID: ${profile.memberId}`)
    console.log(`   Primary Gifts Count: ${Array.isArray(profile.primaryGifts) ? profile.primaryGifts.length : 0}`)
    console.log(`   Secondary Gifts Count: ${Array.isArray(profile.secondaryGifts) ? profile.secondaryGifts.length : 0}`)
    console.log('')

    // Check if new member already has a spiritual profile
    const existingProfile = await prisma.memberSpiritualProfile.findUnique({
      where: { memberId: NEW_MEMBER_ID }
    })

    if (existingProfile) {
      console.log('⚠️ Juan Herrera already has a spiritual profile!')
      console.log('   Deleting old Juan Herrera profile and replacing with JUAN PACHANGA profile...')
      await prisma.memberSpiritualProfile.delete({
        where: { memberId: NEW_MEMBER_ID }
      })
    }

    // Update the spiritual profile to point to Juan Herrera
    const updatedProfile = await prisma.memberSpiritualProfile.update({
      where: { memberId: OLD_MEMBER_ID },
      data: { memberId: NEW_MEMBER_ID }
    })

    console.log('✅ Spiritual profile updated successfully!')
    console.log(`   New Member ID: ${updatedProfile.memberId}`)
    console.log('')

    // Verify the fix
    const verification = await prisma.member.findUnique({
      where: { id: NEW_MEMBER_ID },
      include: { spiritualProfile: true }
    })

    console.log('🔍 Verification - Juan Herrera now has:')
    console.log(`   Name: ${verification?.firstName} ${verification?.lastName}`)
    console.log(`   Spiritual Profile: ${verification?.spiritualProfile ? '✅ LINKED' : '❌ NOT FOUND'}`)
    if (verification?.spiritualProfile) {
      console.log(`   Primary Gifts: ${Array.isArray(verification.spiritualProfile.primaryGifts) ? verification.spiritualProfile.primaryGifts.length : 0}`)
      console.log(`   Secondary Gifts: ${Array.isArray(verification.spiritualProfile.secondaryGifts) ? verification.spiritualProfile.secondaryGifts.length : 0}`)
      console.log(`   Ministry Passions: ${Array.isArray(verification.spiritualProfile.ministryPassions) ? verification.spiritualProfile.ministryPassions.length : 0}`)
      console.log(`   Readiness Score: ${verification.spiritualProfile.volunteerReadinessScore}`)
    }
    console.log('')
    console.log('🎉 FIX COMPLETE! Juan Herrera\'s spiritual assessment should now appear in Recommendations and Profile Dialog')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixSpiritualProfileLink()
