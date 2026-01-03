const { PrismaClient } = require('@prisma/client')

async function checkNullGender() {
  const prisma = new PrismaClient()

  try {
    const churchId = 'demo-church'
    
    // Count members with null gender
    const nullGenderCount = await prisma.members.count({
      where: { 
        churchId,
        isActive: true,
        gender: null
      }
    })
    console.log(`Members with null gender: ${nullGenderCount}`)

    // Count members with empty string gender
    const emptyGenderCount = await prisma.members.count({
      where: { 
        churchId,
        isActive: true,
        gender: ""
      }
    })
    console.log(`Members with empty string gender: ${emptyGenderCount}`)

    // Sample a few members to see what their gender values look like
    const sampleMembers = await prisma.members.findMany({
      where: { 
        churchId,
        isActive: true
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        gender: true
      },
      take: 10
    })

    console.log('\nSample members:')
    sampleMembers.forEach(m => {
      console.log(`${m.firstName} ${m.lastName}: gender = "${m.gender}" (type: ${typeof m.gender})`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkNullGender()
