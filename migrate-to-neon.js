const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function migrateAndSeed() {
  try {
    console.log('🚀 Neon Database Migration & Seeding...')
    console.log('=======================================')
    
    // Test database connection first
    console.log('🔍 Testing database connection...')
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful!')
    
    // Create church
    console.log('🏛️ Creating church...')
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
    
    // Create hashed passwords
    console.log('🔐 Creating password hashes...')
    const tenantPassword = await bcrypt.hash('password123', 12)
    const superAdminPassword = await bcrypt.hash('Bendecido100%$$%', 12)
    
    // Create tenant admin user
    console.log('👤 Creating tenant user...')
    const tenantUser = await prisma.user.upsert({
      where: { email: 'admin@iglesiacentral.com' },
      update: {
        password: tenantPassword,
        isActive: true
      },
      create: {
        name: 'María González',
        email: 'admin@iglesiacentral.com',
        password: tenantPassword,
        role: 'ADMIN_IGLESIA',
        churchId: church.id,
        isActive: true
      }
    })
    console.log('✅ Tenant user created:', tenantUser.email)
    
    // Create SUPER_ADMIN user
    console.log('🔧 Creating SUPER_ADMIN user...')
    const superAdminUser = await prisma.user.upsert({
      where: { email: 'soporte@khesed-tek-systems.org' },
      update: {
        password: superAdminPassword,
        isActive: true
      },
      create: {
        name: 'Khesed-Tek Support',
        email: 'soporte@khesed-tek-systems.org',
        password: superAdminPassword,
        role: 'SUPER_ADMIN',
        churchId: null, // SUPER_ADMIN doesn't belong to specific church
        isActive: true
      }
    })
    console.log('✅ SUPER_ADMIN user created:', superAdminUser.email)
    
    // Verify password hashes
    console.log('🧪 Testing password verification...')
    const tenantPasswordTest = await bcrypt.compare('password123', tenantUser.password)
    const superPasswordTest = await bcrypt.compare('Bendecido100%$$%', superAdminUser.password)
    
    console.log('✅ AUTHENTICATION SETUP COMPLETE!')
    console.log('==================================')
    console.log('👤 TENANT LOGIN:')
    console.log('   📧 Email: admin@iglesiacentral.com')
    console.log('   🔑 Password: password123')
    console.log('   ✅ Hash Valid:', tenantPasswordTest ? 'YES' : 'NO')
    console.log('')
    console.log('🔧 SUPER_ADMIN LOGIN:')
    console.log('   📧 Email: soporte@khesed-tek-systems.org')
    console.log('   🔑 Password: Bendecido100%$$%')
    console.log('   ✅ Hash Valid:', superPasswordTest ? 'YES' : 'NO')
    console.log('')
    console.log('🎯 NEXT STEPS:')
    console.log('1. Test tenant login on Vercel deployment')
    console.log('2. Test SUPER_ADMIN login')
    console.log('3. Test all 4 upload buttons functionality')
    console.log('4. Verify database operations work correctly')
    
  } catch (error) {
    console.error('❌ Migration/Seed Error:', error.message)
    if (error.code === 'P1001') {
      console.error('🔌 Database connection failed - check your DATABASE_URL')
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

migrateAndSeed()