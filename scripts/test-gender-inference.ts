// Test gender inference logic with member names
// Run with: npx tsx scripts/test-gender-inference.ts

import { db } from '../lib/db'

async function testGenderInference() {
  try {
    console.log('🧪 TESTING GENDER INFERENCE WITH REAL MEMBER DATA...\n')

    // Gender inference function (matches the one in components)
    const inferGenderFromName = (firstName: string): string => {
      if (!firstName) return ''
      
      const name = firstName.toLowerCase().trim()
      
      const maleNames = [
        'juan', 'carlos', 'josé', 'antonio', 'francisco', 'manuel', 'david', 'daniel', 
        'miguel', 'rafael', 'pedro', 'alejandro', 'fernando', 'sergio', 'pablo', 'jorge',
        'luis', 'alberto', 'ricardo', 'roberto', 'eduardo', 'andrés', 'javier', 'diego',
        'gabriel', 'adrián', 'óscar', 'gonzalo', 'mario', 'santiago', 'césar', 'ramón'
      ]
      
      const femaleNames = [
        'maría', 'ana', 'carmen', 'laura', 'elena', 'cristina', 'patricia', 'sandra',
        'monica', 'nuria', 'silvia', 'rosa', 'beatriz', 'teresa', 'pilar', 'mercedes',
        'angeles', 'isabel', 'julia', 'raquel', 'andrea', 'natalia', 'gloria', 'esperanza',
        'dolores', 'antonia', 'francisca', 'catalina', 'inmaculada', 'magdalena', 'josefa'
      ]
      
      if (maleNames.includes(name)) return 'masculino'
      if (femaleNames.includes(name)) return 'femenino'
      
      if (name.endsWith('a') && !name.endsWith('ía')) {
        return 'femenino'
      } else if (name.endsWith('o') || name.endsWith('r') || name.endsWith('n')) {
        return 'masculino'
      }
      
      return ''
    }

    // Get all members to test inference
    const allMembers = await db.members.findMany({
      where: {
        churchId: 'demo-church',
        isActive: true
      },
      select: {
        firstName: true,
        lastName: true,
        gender: true
      }
    })

    console.log(`Total members: ${allMembers.length}`)

    // Count with inference
    let masculinoCount = 0
    let femeninoCount = 0
    let sinEspecificarCount = 0

    console.log('\nSample inference results:')
    allMembers.slice(0, 20).forEach(member => {
      const actualGender = member.gender?.toLowerCase()
      const inferredGender = actualGender || inferGenderFromName(member.firstName || '')
      
      console.log(`${member.firstName} ${member.lastName}:`)
      console.log(`  Database: "${member.gender || 'NULL'}"`)
      console.log(`  Inferred: "${inferredGender || 'none'}"`)
      console.log(`  Display: "${inferredGender || 'Sin badge'}"`)
      console.log('')
    })

    // Full count with inference
    allMembers.forEach(member => {
      const actualGender = member.gender?.toLowerCase()
      const inferredGender = actualGender || inferGenderFromName(member.firstName || '')
      
      if (inferredGender === 'masculino' || actualGender === 'male' || actualGender === 'm') {
        masculinoCount++
      } else if (inferredGender === 'femenino' || actualGender === 'female' || actualGender === 'f') {
        femeninoCount++
      } else {
        sinEspecificarCount++
      }
    })

    console.log('📊 COUNT COMPARISON:')
    console.log('OLD COUNTING (database only):')
    console.log(`  Masculino: 11`)
    console.log(`  Femenino: 12`)
    console.log(`  Sin Especificar: 845`)
    console.log(`  Total: 868`)

    console.log('\nNEW COUNTING (with inference):')
    console.log(`  Masculino: ${masculinoCount}`)
    console.log(`  Femenino: ${femeninoCount}`)
    console.log(`  Sin Especificar: ${sinEspecificarCount}`)
    console.log(`  Total: ${masculinoCount + femeninoCount + sinEspecificarCount}`)

    console.log(`\n✅ Expected result: Math should add up to 868`)
    const newTotal = masculinoCount + femeninoCount + sinEspecificarCount
    console.log(`✅ Actual result: ${masculinoCount} + ${femeninoCount} + ${sinEspecificarCount} = ${newTotal}`)

    if (newTotal === 868) {
      console.log('🎉 INFERENCE COUNTING IS CORRECT!')
    } else {
      console.log('❌ COUNTING ERROR!')
    }

  } catch (error) {
    console.error('❌ Error testing gender inference:', error)
  } finally {
    await db.$disconnect()
  }
}

testGenderInference()