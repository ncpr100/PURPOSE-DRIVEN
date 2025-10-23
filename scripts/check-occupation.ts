import { db } from '../lib/db'

async function checkOccupation() {
  try {
    // First, find all members with JUAN in the name
    const members = await db.member.findMany({
      where: {
        OR: [
          { firstName: { contains: 'JUAN', mode: 'insensitive' } },
          { firstName: { contains: 'Juan', mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        occupation: true,
        emergencyContact: true,
        notes: true
      }
    })

    console.log(`📋 Found ${members.length} members with 'Juan' in name:`)
    members.forEach(member => {
      console.log('\n---')
      console.log('ID:', member.id)
      console.log('Name:', member.firstName, member.lastName)
      console.log('Occupation:', member.occupation || '(empty)')
      console.log('Emergency Contact:', member.emergencyContact || '(empty)')
      console.log('Notes:', member.notes?.substring(0, 50) || '(empty)')
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await db.$disconnect()
  }
}

checkOccupation()
