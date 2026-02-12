import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Creating emergency database users...')
  
  // Create sample church
  const church = await prisma.church.upsert({
    where: { id: 'church-emergency' },
    update: {},
    create: {
      id: 'church-emergency',
      name: 'Iglesia Central (Emergency)',
      description: 'Emergency church for testing',
      city: 'Ciudad de México',
      country: 'México',
      email: 'admin@iglesiacentral.com',
      isActive: true
    }
  })
  
  // Create SUPER_ADMIN user (no churchId)
  const superAdmin = await prisma.user.upsert({
    where: { email: 'soporte@khesed-tek-systems.org' },
    update: {},
    create: {
      id: 'user-super-admin',
      email: 'soporte@khesed-tek-systems.org',
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      churchId: null, // SUPER_ADMIN has no church
      isActive: true
    }
  })
  
  // Create church admin user
  const churchAdmin = await prisma.user.upsert({
    where: { email: 'admin@iglesiacentral.com' },
    update: {},
    create: {
      id: 'user-church-admin',
      email: 'admin@iglesiacentral.com',
      name: 'Administrador Iglesia',
      role: 'ADMINISTRADOR',
      churchId: church.id,
      isActive: true
    }
  })
  
  console.log('✅ Emergency users created:')
  console.log('  📧 SUPER_ADMIN:', superAdmin.email, '(churchId: null)')
  console.log('  📧 CHURCH_ADMIN:', churchAdmin.email, '(churchId:', church.id + ')')
  console.log()
  console.log('🎯 LOGIN CREDENTIALS:')
  console.log('  SUPER_ADMIN: soporte@khesed-tek-systems.org / Bendecido100%12946%')
  console.log('  CHURCH_ADMIN: admin@iglesiacentral.com / password123')
  console.log()
  console.log('🚀 Upload buttons should now work!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })