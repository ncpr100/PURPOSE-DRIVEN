import { db } from '../lib/db'
import bcrypt from 'bcryptjs'

async function createTestChurchAndAdmin() {
  try {
    console.log('🏛️  Creating test church and admin user...\n')

    // Create church
    const church = await db.church.create({
      data: {
        name: 'Iglesia de Prueba',
        email: 'admin@iglesiadeprueba.com',
        phone: '+1-555-0100',
        address: '123 Main Street, Springfield',
        description: 'Test church for automation testing',
        isActive: true
      }
    })

    console.log('✅ Church created:')
    console.log(`   - ID: ${church.id}`)
    console.log(`   - Name: ${church.name}`)
    console.log(`   - Email: ${church.email}\n`)

    // Create church admin user
    const hashedPassword = await bcrypt.hash('Admin123!', 10)
    
    const admin = await db.user.create({
      data: {
        email: 'admin@iglesiadeprueba.com',
        name: 'Admin Iglesia',
        password: hashedPassword,
        role: 'ADMIN_IGLESIA',
        churchId: church.id,
        isActive: true,
        emailVerified: new Date()
      }
    })

    console.log('✅ Admin user created:')
    console.log(`   - ID: ${admin.id}`)
    console.log(`   - Name: ${admin.name}`)
    console.log(`   - Email: ${admin.email}`)
    console.log(`   - Role: ${admin.role}`)
    console.log(`   - Password: Admin123!\n`)

    console.log('🎉 TEST CREDENTIALS:')
    console.log('━'.repeat(60))
    console.log('Email: admin@iglesiadeprueba.com')
    console.log('Password: Admin123!')
    console.log('Role: ADMIN_IGLESIA')
    console.log('Church: Iglesia de Prueba')
    console.log('━'.repeat(60))

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await db.$disconnect()
  }
}

createTestChurchAndAdmin()
