const { PrismaClient } = require('@prisma/client')

async function testAllFilters() {
  const prisma = new PrismaClient()
  
  try {
    const members = await prisma.members.findMany({
      where: { isActive: true },
      select: {
        gender: true,
        birthDate: true,
        maritalStatus: true
      }
    })
    
    console.log(`Total active members: ${members.length}`)
    
    // Test age groups
    console.log('\n=== AGE GROUPS ===')
    const ageGroups = {
      '0-17': 0,
      '18-25': 0, 
      '26-35': 0,
      '36-50': 0,
      '51+': 0,
      'sinEspecificar': 0
    }
    
    members.forEach(m => {
      if (!m.birthDate) {
        ageGroups.sinEspecificar++
        return
      }
      
      const today = new Date()
      const birthDate = new Date(m.birthDate)
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      if (age >= 0 && age <= 17) ageGroups['0-17']++
      else if (age >= 18 && age <= 25) ageGroups['18-25']++
      else if (age >= 26 && age <= 35) ageGroups['26-35']++
      else if (age >= 36 && age <= 50) ageGroups['36-50']++
      else if (age >= 51) ageGroups['51+']++
    })
    
    let ageTotal = 0
    Object.entries(ageGroups).forEach(([key, count]) => {
      console.log(`${key}: ${count}`)
      ageTotal += count
    })
    console.log(`Age Total: ${ageTotal} (${ageTotal === members.length ? '✅' : '❌'})`)
    
    // Test marital status
    console.log('\n=== MARITAL STATUS ===')
    const maritalGroups = {
      soltero: 0,
      casado: 0,
      divorciado: 0,
      viudo: 0,
      sinEspecificar: 0
    }
    
    members.forEach(m => {
      const status = m.maritalStatus?.toLowerCase()
      if (!status || status === 'null' || status === '') {
        maritalGroups.sinEspecificar++
      } else if (status === 'soltero' || status === 'single') {
        maritalGroups.soltero++
      } else if (status === 'casado' || status === 'married') {
        maritalGroups.casado++
      } else if (status === 'divorciado' || status === 'divorced') {
        maritalGroups.divorciado++
      } else if (status === 'viudo' || status === 'widowed') {
        maritalGroups.viudo++
      } else {
        maritalGroups.sinEspecificar++
      }
    })
    
    let maritalTotal = 0
    Object.entries(maritalGroups).forEach(([key, count]) => {
      console.log(`${key}: ${count}`)
      maritalTotal += count
    })
    console.log(`Marital Total: ${maritalTotal} (${maritalTotal === members.length ? '✅' : '❌'})`)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAllFilters()
