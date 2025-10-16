import { db } from './lib/db'
import bcrypt from 'bcryptjs'

async function checkUser() {
  try {
    const user = await db.user.findUnique({
      where: { email: 'soporte@khesed-tek.com' }
    })
    
    console.log('User found:', user ? 'YES' : 'NO')
    if (user) {
      console.log('User details:')
      console.log('- ID:', user.id)
      console.log('- Name:', user.name)
      console.log('- Email:', user.email)
      console.log('- Role:', user.role)
      console.log('- isActive:', user.isActive)
      console.log('- Password hash exists:', user.password ? 'YES' : 'NO')
      console.log('- Password length:', user.password ? user.password.length : 'N/A')
      
      // Test password
      const testPassword = 'Bendecido100%$$%'
      const isValid = user.password ? await bcrypt.compare(testPassword, user.password) : false
      console.log('- Password "Bendecido100%$$%" valid:', isValid ? 'YES' : 'NO')
      
      // Test multiple variations just in case
      const variations = [
        'Bendecido100%$$%',
        'Bendecido100%$$%',
        'Bendecido100%$$%',
        'password123'
      ]
      
      for (const pwd of variations) {
        if (user.password) {
          const isValidVar = await bcrypt.compare(pwd, user.password)
          console.log(`- Password "${pwd}" valid:`, isValidVar ? 'YES' : 'NO')
        }
      }
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await db.$disconnect()
  }
}

checkUser()
