import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function cleanupDuplicates() {
  try {
    console.log('🧹 CLEANING UP DUPLICATE CHURCHES\n')

    // Keep only the church with 999 members
    const correctChurchId = 'cmgu3bev8000078ltyfy89pil'

    const churches = await db.church.findMany({
      where: {
        name: 'Iglesia Comunidad de Fe',
        id: { not: correctChurchId }
      }
    })

    console.log(`Found ${churches.length} duplicate churches to delete:\n`)

    for (const church of churches) {
      console.log(`Deleting church: ${church.id}`)
      
      // Delete members first
      const deletedMembers = await db.member.deleteMany({
        where: { churchId: church.id }
      })
      console.log(`  - Deleted ${deletedMembers.count} members`)
      
      // Delete ministries
      const deletedMinistries = await db.ministry.deleteMany({
        where: { churchId: church.id }
      })
      console.log(`  - Deleted ${deletedMinistries.count} ministries`)
      
      // Delete users
      const deletedUsers = await db.user.deleteMany({
        where: { churchId: church.id }
      })
      console.log(`  - Deleted ${deletedUsers.count} users`)
      
      // Delete church
      await db.church.delete({
        where: { id: church.id }
      })
      console.log(`  ✅ Deleted church\n`)
    }

    console.log('✅ CLEANUP COMPLETE')
    console.log(`\nKept church: ${correctChurchId} with 999 members`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await db.$disconnect()
  }
}

cleanupDuplicates()
