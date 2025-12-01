const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createSampleVolunteerData() {
  try {
    console.log('🏗️  Creating sample volunteer data and assignments...')
    
    const churchId = 'cmgu3bev8000078ltyfy89pil'
    
    // First, let's create some ministries if they don't exist
    const existingMinistries = await prisma.ministry.findMany({
      where: { churchId }
    })
    
    let ministries = existingMinistries
    if (ministries.length === 0) {
      console.log('📋 Creating sample ministries...')
      ministries = await Promise.all([
        prisma.ministry.create({
          data: {
            name: 'Ministerio Juvenil',
            description: 'Ministerio para jóvenes de 12-25 años',
            churchId,
            isActive: true,
            leaderEmail: 'juvenil@iglesia.com'
          }
        }),
        prisma.ministry.create({
          data: {
            name: 'Ministerio Infantil', 
            description: 'Ministerio para niños de 3-12 años',
            churchId,
            isActive: true,
            leaderEmail: 'infantil@iglesia.com'
          }
        }),
        prisma.ministry.create({
          data: {
            name: 'Adoración y Música',
            description: 'Ministerio de alabanza y adoración',
            churchId,
            isActive: true,
            leaderEmail: 'musica@iglesia.com'
          }
        }),
        prisma.ministry.create({
          data: {
            name: 'Evangelismo',
            description: 'Ministerio de evangelización y misiones',
            churchId,
            isActive: true,
            leaderEmail: 'evangelismo@iglesia.com'
          }
        })
      ])
      console.log('✅ Created', ministries.length, 'ministries')
    } else {
      console.log('📋 Using existing', ministries.length, 'ministries')
    }
    
    // Get existing volunteers
    const existingVolunteers = await prisma.volunteer.findMany({
      where: { member: { churchId } },
      include: { member: { select: { id: true, firstName: true, lastName: true } } }
    })
    
    // Update some volunteers to have ministry assignments
    if (existingVolunteers.length > 0) {
      console.log('🔄 Assigning ministries to existing volunteers...')
      
      const updates = []
      for (let i = 0; i < Math.min(existingVolunteers.length, ministries.length); i++) {
        const volunteer = existingVolunteers[i]
        const ministry = ministries[i]
        
        updates.push(
          prisma.volunteer.update({
            where: { id: volunteer.id },
            data: {
              ministryId: ministry.id,
              skills: JSON.stringify([
                i === 0 ? 'Liderazgo juvenil' : i === 1 ? 'Cuidado infantil' : i === 2 ? 'Música' : 'Evangelismo',
                'Comunicación',
                'Compromiso'
              ]),
              availability: JSON.stringify({
                weekdays: ['sabado', 'domingo'],
                times: ['mañana', 'tarde']
              })
            }
          })
        )
      }
      
      await Promise.all(updates)
      console.log('✅ Updated', updates.length, 'volunteers with ministries')
    }
    
    // Create some volunteer assignments
    console.log('📅 Creating volunteer assignments...')
    const assignments = []
    
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    
    for (let i = 0; i < Math.min(existingVolunteers.length, 6); i++) {
      const volunteer = existingVolunteers[i]
      const ministry = ministries[i % ministries.length]
      
      // Create a future assignment
      assignments.push(
        prisma.volunteerAssignment.create({
          data: {
            title: `Servicio ${ministry.name}`,
            description: `Servicio programado para ${ministry.name}`,
            volunteerId: volunteer.id,
            date: new Date(today.getTime() + (i + 1) * 7 * 24 * 60 * 60 * 1000),
            startTime: '09:00',
            endTime: '11:00',
            status: 'assigned',
            churchId
          }
        })
      )
      
      // Create a past assignment 
      assignments.push(
        prisma.volunteerAssignment.create({
          data: {
            title: `Servicio Anterior ${ministry.name}`,
            description: `Servicio completado para ${ministry.name}`,
            volunteerId: volunteer.id,
            date: new Date(today.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000),
            startTime: '09:00',
            endTime: '11:00',
            status: 'completed',
            churchId
          }
        })
      )
    }
    
    const createdAssignments = await Promise.all(assignments)
    console.log('✅ Created', createdAssignments.length, 'volunteer assignments')
    
    // Update some members to have higher leadership readiness for recruitment pipeline
    console.log('👑 Setting leadership readiness scores...')
    const members = await prisma.member.findMany({
      where: { churchId },
      take: 5
    })
    
    if (members.length > 0) {
      const leadershipUpdates = []
      for (let i = 0; i < members.length; i++) {
        const member = members[i]
        const readinessScore = [85, 78, 92, 67, 73][i] || 60
        
        leadershipUpdates.push(
          prisma.member.update({
            where: { id: member.id },
            data: {
              leadershipReadiness: readinessScore,
              leadershipStage: readinessScore > 80 ? 'MINISTRY_LEADER' : readinessScore > 70 ? 'TEAM_COORDINATOR' : 'VOLUNTEER'
            }
          })
        )
      }
      
      await Promise.all(leadershipUpdates)
      console.log('✅ Updated leadership readiness for', leadershipUpdates.length, 'members')
    }
    
    console.log('\n📊 Volunteer Dashboard Data Summary:')
    console.log('- Total Volunteers:', existingVolunteers.length)
    console.log('- Volunteers with Ministries:', Math.min(existingVolunteers.length, ministries.length))
    console.log('- Active Ministries:', ministries.length)
    console.log('- Future Assignments:', assignments.length / 2)
    console.log('- Completed Assignments:', assignments.length / 2) 
    console.log('- Members with Leadership Scores:', members.length)
    console.log('\n✅ Volunteer system data populated successfully!')
    
  } catch (error) {
    console.error('💥 Error creating volunteer data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSampleVolunteerData()