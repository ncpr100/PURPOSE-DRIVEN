const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTenantUser() {  
  try {
    console.log('🚀 Creating tenant user and church...')
    
    // Create church first
    const church = await prisma.church.upsert({
      where: { id: 'demo-church' },
      update: {},
      create: {
        id: 'demo-church', 
        name: 'Iglesia Central Ejemplo',
        address: 'Calle Principal 123, Ciudad, Estado',
        phone: '+1234567890',
        email: 'contacto@iglesiacentral.com',
        website: 'https://iglesiacentral.com',
        founded: new Date('2000-01-01'),
        description: 'Una iglesia comprometida con la comunidad y el crecimiento espiritual.',
        isActive: true
      }
    })
    console.log('✅ Church created:', church.name)
    
    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 12)
    
    // Create tenant user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@iglesiacentral.com' },
      update: {
        password: hashedPassword, // Update password in case it was wrong
        isActive: true
      },
      create: {
        name: 'María González',
        email: 'admin@iglesiacentral.com', 
        password: hashedPassword,
        role: 'ADMIN_IGLESIA',
        churchId: church.id,
        isActive: true
      }
    })
    
    console.log('✅ Admin user created/updated:', adminUser.name)
    console.log('📧 Email:', adminUser.email)
    console.log('🔑 Password: password123')
    console.log('🏛️ Role:', adminUser.role)
    console.log('⛪ Church ID:', adminUser.churchId)
    console.log('✅ Active:', adminUser.isActive)
    
    // Test password hash
    const passwordMatch = await bcrypt.compare('password123', adminUser.password)
    console.log('🔐 Password hash verification:', passwordMatch ? '✅ VALID' : '❌ INVALID')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createTenantUser()