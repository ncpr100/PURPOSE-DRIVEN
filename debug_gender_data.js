const { PrismaClient } = require('@prisma/client')

async function checkGenderData() {
  const prisma = new PrismaClient()
  
  try {
    // Get all unique gender values
    const genderValues = await prisma.members.findMany({
      select: { gender: true },
      where: { isActive: true },
      distinct: ['gender']
    })
    
    console.log('All unique gender values in database:')
    genderValues.forEach(g => console.log(`"${g.gender}"`))
    
    // Count by gender
    const counts = await prisma.members.groupBy({
      by: ['gender'],
      where: { isActive: true },
      _count: { gender: true }
    })
    
    console.log('\nGender counts:')
    counts.forEach(c => console.log(`${c.gender}: ${c._count.gender}`))
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkGenderData()
