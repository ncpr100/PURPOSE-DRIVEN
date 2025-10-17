import { db } from '../lib/db'

async function checkExistingData() {
  try {
    console.log('🔍 CHECKING EXISTING DATA...\n')

    // Check churches
    const churches = await db.church.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isActive: true,
        users: {
          select: { id: true }
        },
        members: {
          select: { id: true }
        }
      },
      take: 10
    })

    console.log('📍 CHURCHES FOUND:', churches.length)
    churches.forEach((church, i) => {
      console.log(`\n${i + 1}. ${church.name}`)
      console.log(`   - ID: ${church.id}`)
      console.log(`   - Email: ${church.email || 'N/A'}`)
      console.log(`   - Phone: ${church.phone || 'N/A'}`)
      console.log(`   - Active: ${church.isActive}`)
      console.log(`   - Users: ${church.users.length}`)
      console.log(`   - Members: ${church.members.length}`)
    })

    console.log('\n' + '='.repeat(80) + '\n')

    // Check users
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        churchId: true,
        isActive: true
      },
      take: 20
    })

    console.log('👥 USERS FOUND:', users.length)
    
    for (const user of users) {
      console.log(`\n${users.indexOf(user) + 1}. ${user.name} (${user.email})`)
      console.log(`   - Role: ${user.role}`)
      console.log(`   - ChurchId: ${user.churchId || 'No church'}`)
      console.log(`   - Active: ${user.isActive}`)
      
      if (user.churchId) {
        const church = await db.church.findUnique({
          where: { id: user.churchId },
          select: { name: true }
        })
        console.log(`   - Church Name: ${church?.name || 'Unknown'}`)
      }
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await db.$disconnect()
  }
}

checkExistingData()
