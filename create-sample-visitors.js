const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createSampleVisitorData() {
  try {
    console.log('🏗️  Creating sample visitor data...')
    
    const churchId = 'cmgu3bev8000078ltyfy89pil'
    
    // Create some check-ins with first-time visitors
    const checkIns = await Promise.all([
      // First-time visitors this month
      prisma.checkIn.create({
        data: {
          firstName: 'María',
          lastName: 'González',
          email: 'maria.gonzalez@email.com',
          phone: '123-456-7890',
          isFirstTime: true,
          checkedInAt: new Date(2025, 11, 1), // December 1st
          engagementScore: 85,
          visitorType: 'first_time',
          automationTriggered: true,
          churchId
        }
      }),
      prisma.checkIn.create({
        data: {
          firstName: 'Carlos',
          lastName: 'Rodríguez',
          email: 'carlos.rodriguez@email.com',
          phone: '123-456-7891',
          isFirstTime: true,
          checkedInAt: new Date(2025, 11, 15), // December 15th
          engagementScore: 72,
          visitorType: 'first_time',
          automationTriggered: true,
          churchId
        }
      }),
      // Returning visitors
      prisma.checkIn.create({
        data: {
          firstName: 'Ana',
          lastName: 'López',
          email: 'ana.lopez@email.com',
          phone: '123-456-7892',
          isFirstTime: false,
          checkedInAt: new Date(2025, 11, 20), // December 20th
          engagementScore: 90,
          visitorType: 'returning',
          automationTriggered: false,
          churchId
        }
      }),
      // Today's check-in
      prisma.checkIn.create({
        data: {
          firstName: 'Luis',
          lastName: 'Martínez',
          email: 'luis.martinez@email.com',
          phone: '123-456-7893',
          isFirstTime: true,
          checkedInAt: new Date(), // Today
          engagementScore: 78,
          visitorType: 'first_time',
          automationTriggered: true,
          churchId
        }
      })
    ])
    
    console.log('✅ Created check-ins:', checkIns.length)
    
    // Create some visitor follow-ups
    const followUps = await Promise.all([
      prisma.visitorFollowUp.create({
        data: {
          checkInId: checkIns[0].id, // Link to María's check-in
          followUpType: 'WELCOME',
          status: 'PENDIENTE',
          priority: 'HIGH',
          notes: 'Primera visita, muy interesada en ministerio de jóvenes',
          assignedTo: null,
          category: 'WELCOME',
          touchSequence: 1,
          churchId
        }
      }),
      prisma.visitorFollowUp.create({
        data: {
          checkInId: checkIns[1].id, // Link to Carlos's check-in
          followUpType: 'MINISTRY_CONNECTION',
          status: 'COMPLETADO',
          priority: 'MEDIUM',
          notes: 'Contactado exitosamente, planea regresar',
          assignedTo: null,
          category: 'MINISTRY_CONNECTION',
          touchSequence: 2,
          completedAt: new Date(2025, 11, 16), // Completed this month
          responseReceived: true,
          churchId
        }
      })
    ])
    
    console.log('✅ Created follow-ups:', followUps.length)
    
    // Create some child check-ins
    const childCheckIns = await Promise.all([
      prisma.childCheckIn.create({
        data: {
          childName: 'Sofia González',
          parentName: 'María González',
          parentPhone: '123-456-7890',
          checkedIn: true,
          checkedOut: false,
          checkedInAt: new Date(),
          qrCode: 'CHILD_SOFIA_' + Date.now(),
          churchId
        }
      }),
      prisma.childCheckIn.create({
        data: {
          childName: 'Miguel Rodríguez',
          parentName: 'Carlos Rodríguez',
          parentPhone: '123-456-7891',
          checkedIn: true,
          checkedOut: false,
          checkedInAt: new Date(),
          qrCode: 'CHILD_MIGUEL_' + Date.now(),
          churchId
        }
      })
    ])
    
    console.log('✅ Created child check-ins:', childCheckIns.length)
    
    console.log('\n📊 Sample visitor data created successfully!')
    console.log('Now the dashboard should show:')
    console.log('- First-time visitors this month: 3')
    console.log('- Today\'s check-ins: 1')
    console.log('- Returning visitors: 1')
    console.log('- Pending follow-ups: 1')
    console.log('- Completed follow-ups this month: 1')
    console.log('- Children present: 2')
    
  } catch (error) {
    console.error('💥 Error creating visitor data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSampleVisitorData()