const { PrismaClient } = require('@prisma/client')

async function checkAllGenderData() {
  const prisma = new PrismaClient()
  
  try {
    // Get counts by gender for active members
    const genderCounts = await prisma.members.groupBy({
      by: ['gender'],
      where: { isActive: true },
      _count: { gender: true }
    })
    
    console.log('Gender distribution for all 868 active members:')
    let total = 0
    genderCounts.forEach(c => {
      console.log(`"${c.gender}": ${c._count.gender} members`)
      total += c._count.gender
    })
    console.log(`Total counted: ${total}`)
    
    // Check for null/empty gender values
    const nullGender = await prisma.members.count({
      where: { 
        isActive: true,
        OR: [
          { gender: null },
          { gender: '' }
        ]
      }
    })
    console.log(`\nMembers with null/empty gender: ${nullGender}`)
    
    // Sample some records to see actual values
    const sampleMembers = await prisma.members.findMany({
      where: { isActive: true },
      select: { gender: true },
      take: 20
    })
    
    console.log('\nSample of first 20 gender values:')
    sampleMembers.forEach((m, i) => console.log(`${i+1}. "${m.gender}"`))
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAllGenderData()
