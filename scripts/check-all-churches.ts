import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function checkAllChurches() {
  try {
    console.log('🔍 CHECKING ALL CHURCHES\n')

    const churches = await db.church.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: {
            members: true,
            ministries: true,
            users: true
          }
        }
      }
    })

    console.log(`Found ${churches.length} churches:\n`)

    for (const church of churches) {
      console.log('═'.repeat(80))
      console.log(`Church: ${church.name}`)
      console.log(`ID: ${church.id}`)
      console.log(`Email: ${church.email}`)
      console.log(`Members: ${church._count.members}`)
      console.log(`Ministries: ${church._count.ministries}`)
      console.log(`Users: ${church._count.users}`)
      console.log()
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await db.$disconnect()
  }
}

checkAllChurches()
