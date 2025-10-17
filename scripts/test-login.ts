import { db } from '../lib/db'
import bcrypt from 'bcryptjs'

async function testLogin() {
  try {
    const email = 'soporte@khesed-tek.com'
    const password = 'Bendecido100%$$%'

    console.log('Testing login for:', email)
    console.log('Password:', password)
    console.log('')

    const user = await db.user.findUnique({
      where: { email },
      include: { church: true }
    })

    if (!user) {
      console.log('❌ User not found')
      return
    }

    console.log('✅ User found:')
    console.log('  - ID:', user.id)
    console.log('  - Email:', user.email)
    console.log('  - Name:', user.name)
    console.log('  - Role:', user.role)
    console.log('  - ChurchId:', user.churchId)
    console.log('  - Has password:', !!user.password)
    console.log('')

    if (!user.password) {
      console.log('❌ User has no password hash')
      return
    }

    const isValid = await bcrypt.compare(password, user.password)
    console.log('Password validation:', isValid ? '✅ VALID' : '❌ INVALID')

    if (!isValid) {
      console.log('')
      console.log('Testing alternative passwords...')
      const alternatives = [
        'Bendecido100%$$%',
        'Bendecido100%$$%',
        'password',
        'admin123',
      ]

      for (const alt of alternatives) {
        const altValid = await bcrypt.compare(alt, user.password)
        if (altValid) {
          console.log(`✅ Password "${alt}" is VALID`)
        }
      }
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await db.$disconnect()
  }
}

testLogin()
