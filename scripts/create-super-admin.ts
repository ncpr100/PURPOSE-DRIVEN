import { db } from '../lib/db'
import bcrypt from 'bcryptjs'

async function createSuperAdmin() {
  try {
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: 'soporte@khesed-tek.com' }
    })

    if (existingUser) {
      console.log('✅ User already exists!')
      console.log('Email:', existingUser.email)
      console.log('Name:', existingUser.name)
      console.log('Role:', existingUser.role)
      return
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('Bendecido100%$$%', 10)

    // Create the user
    const user = await db.user.create({
      data: {
        email: 'soporte@khesed-tek.com',
        name: 'Super Admin',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isActive: true,
        emailVerified: new Date(),
      }
    })

    console.log('✅ Super Admin created successfully!')
    console.log('Email:', user.email)
    console.log('Password: Bendecido100%$$%')
    console.log('Role:', user.role)
    console.log('ID:', user.id)

  } catch (error) {
    console.error('❌ Error creating super admin:', error)
  } finally {
    await db.$disconnect()
  }
}

createSuperAdmin()
