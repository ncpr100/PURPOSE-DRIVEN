const { PrismaClient } = require('@prisma/client')

async function testCountsFix() {
  const prisma = new PrismaClient()
  
  try {
    // Simulate the same logic as the counts API
    const members = await prisma.members.findMany({
      where: { isActive: true },
      select: {
        gender: true,
        birthDate: true,
        maritalStatus: true
      }
    })
    
    console.log('Testing fixed counts logic:')
    console.log(`Total active members: ${members.length}`)
    
    // Test gender counts
    const masculino = members.filter(m => {
      const gender = m.gender?.toLowerCase()
      return gender === 'masculino' || gender === 'male' || gender === 'm'
    }).length
    
    const femenino = members.filter(m => {
      const gender = m.gender?.toLowerCase()
      return gender === 'femenino' || gender === 'female' || gender === 'f'
    }).length
    
    const sinEspecificar = members.filter(m => {
      const gender = m.gender?.toLowerCase()
      return !gender || gender === 'null' || gender === ''
    }).length
    
    console.log('\nGender counts:')
    console.log(`Masculino: ${masculino}`)
    console.log(`Femenino: ${femenino}`)
    console.log(`Sin Especificar: ${sinEspecificar}`)
    console.log(`Total: ${masculino + femenino + sinEspecificar}`)
    
    console.log(`\n✅ Math check: ${masculino + femenino + sinEspecificar === members.length ? 'PASSED' : 'FAILED'}`)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testCountsFix()
