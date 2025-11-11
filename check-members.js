const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkMembers() {
  try {
    const members = await prisma.member.findMany({
      take: 5,
      select: {
        firstName: true,
        lastName: true,
        leadershipStage: true,
        spiritualGifts: true,
        email: true
      }
    })
    
    console.log('Members with spiritual assessment data:')
    members.forEach(member => {
      console.log(`\n${member.firstName} ${member.lastName} (${member.email})`)
      console.log(`Leadership: ${member.leadershipStage}`)
      
      if (member.spiritualGifts) {
        const gifts = JSON.parse(member.spiritualGifts)
        console.log(`Primary Gifts: ${gifts.primary?.join(', ') || 'None'}`)
        console.log(`Experience Level: ${gifts.experienceLevel || 'Not set'}`)
        console.log(`Spiritual Calling: ${gifts.spiritualCalling || 'Not set'}`)
      } else {
        console.log('No spiritual gifts data')
      }
    })
    
    const count = await prisma.member.count()
    console.log(`\nTotal members created: ${count}`)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkMembers()