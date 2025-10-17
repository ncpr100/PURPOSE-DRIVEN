import { db } from '../lib/db'
import bcrypt from 'bcryptjs'

/**
 * CHURCH MIGRATION SCRIPT - Planning Center to Khesed-tek
 * 
 * Creates a realistic church with 1,000 members migrated from Planning Center
 * 
 * ROLE HIERARCHY:
 * - SUPER_ADMIN: Platform owner (already exists: soporte@khesed-tek.com)
 * - ADMIN_IGLESIA: Church administrator (1 per church)
 * - PASTOR: Senior pastor and associate pastors
 * - LIDER: Ministry leaders
 * - MIEMBRO: Regular members
 */

// Sample data generators
const firstNames = [
  'Juan', 'María', 'Carlos', 'Ana', 'José', 'Carmen', 'Francisco', 'Isabel',
  'Miguel', 'Patricia', 'Pedro', 'Laura', 'Manuel', 'Rosa', 'Antonio', 'Marta',
  'David', 'Elena', 'Jorge', 'Lucía', 'Daniel', 'Sara', 'Rafael', 'Teresa',
  'Javier', 'Paula', 'Luis', 'Andrea', 'Fernando', 'Silvia', 'Roberto', 'Pilar',
  'Alejandro', 'Beatriz', 'Andrés', 'Cristina', 'Pablo', 'Raquel', 'Sergio', 'Nuria',
  'Ángel', 'Victoria', 'Ricardo', 'Monica', 'Alberto', 'Susana', 'Eduardo', 'Diana',
  'Tomás', 'Gabriela', 'Ignacio', 'Verónica', 'Ramón', 'Alicia', 'Felipe', 'Natalia',
  'Marcos', 'Irene', 'Arturo', 'Rocío', 'Guillermo', 'Claudia', 'Enrique', 'Valeria'
]

const lastNames = [
  'García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández', 'Pérez', 'Sánchez',
  'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales',
  'Reyes', 'Gutiérrez', 'Ortiz', 'Jiménez', 'Ruiz', 'Mendoza', 'Álvarez', 'Castillo',
  'Romero', 'Herrera', 'Medina', 'Aguilar', 'Vargas', 'Castro', 'Ramos', 'Silva'
]

const ministries = [
  'Alabanza y Adoración',
  'Ministerio Infantil',
  'Jóvenes',
  'Matrimonios',
  'Damas',
  'Caballeros',
  'Evangelismo',
  'Oración e Intercesión',
  'Ujieres y Recepción',
  'Multimedia',
  'Administración',
  'Misiones'
]

const membershipStatuses = ['ACTIVO', 'INACTIVO', 'VISITANTE', 'PROSPECTO']

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function generateEmail(firstName: string, lastName: string, index: number): string {
  const cleanFirst = firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const cleanLast = lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return `${cleanFirst}.${cleanLast}.${index}@planningcenter.com`
}

function generatePhone(): string {
  const area = Math.floor(Math.random() * 900) + 100
  const prefix = Math.floor(Math.random() * 900) + 100
  const line = Math.floor(Math.random() * 9000) + 1000
  return `+1-${area}-${prefix}-${line}`
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

async function createMigratedChurch() {
  console.log('🚀 CHURCH MIGRATION FROM PLANNING CENTER')
  console.log('━'.repeat(80))
  console.log('Creating large church with 1,000 members...\n')

  try {
    // 0. CLEANUP: Check if church already exists and clean up
    console.log('🧹 Step 0: Checking for existing church...')
    const existingChurch = await db.church.findFirst({
      where: { name: 'Iglesia Comunidad de Fe' }
    })
    
    if (existingChurch) {
      console.log(`   Found existing church (ID: ${existingChurch.id}). Cleaning up...`)
      
      // Delete all members first (due to foreign key constraints)
      const deletedMembers = await db.member.deleteMany({
        where: { churchId: existingChurch.id }
      })
      console.log(`   ✅ Deleted ${deletedMembers.count} members`)
      
      // Delete ministries
      const deletedMinistries = await db.ministry.deleteMany({
        where: { churchId: existingChurch.id }
      })
      console.log(`   ✅ Deleted ${deletedMinistries.count} ministries`)
      
      // Delete users associated with this church
      const deletedUsers = await db.user.deleteMany({
        where: { churchId: existingChurch.id }
      })
      console.log(`   ✅ Deleted ${deletedUsers.count} users`)
      
      // Delete the church
      await db.church.delete({
        where: { id: existingChurch.id }
      })
      console.log(`   ✅ Deleted church\n`)
    } else {
      console.log(`   ✅ No existing church found. Proceeding with fresh migration.`)
    }
    
    // Also check for orphaned admin user with this email
    const existingAdmin = await db.user.findUnique({
      where: { email: 'admin@comunidaddefe.org' }
    })
    
    if (existingAdmin) {
      console.log(`   Found orphaned admin user. Deleting...`)
      await db.user.delete({
        where: { email: 'admin@comunidaddefe.org' }
      })
      console.log(`   ✅ Deleted orphaned admin\n`)
    }

    // 1. CREATE CHURCH
    console.log('📍 Step 1: Creating church...')
    const church = await db.church.create({
      data: {
        name: 'Iglesia Comunidad de Fe',
        email: 'contacto@comunidaddefe.org',
        phone: '+1-555-0200',
        address: '456 Faith Avenue, Los Angeles, CA 90001',
        website: 'https://comunidaddefe.org',
        description: 'Iglesia grande migrada desde Planning Center con 1,000 miembros',
        founded: new Date('2010-01-15'),
        isActive: true
      }
    })
    console.log(`✅ Church created: ${church.name} (ID: ${church.id})\n`)

    // 2. CREATE CHURCH ADMIN (ADMIN_IGLESIA) - Only 1 per church
    console.log('👤 Step 2: Creating church administrator (ADMIN_IGLESIA)...')
    const hashedPassword = await bcrypt.hash('ChurchAdmin2025!', 10)
    
    const churchAdmin = await db.user.create({
      data: {
        email: 'admin@comunidaddefe.org',
        name: 'Pastor Juan Rodríguez',
        password: hashedPassword,
        role: 'ADMIN_IGLESIA', // Church administrator role
        churchId: church.id,
        isActive: true,
        emailVerified: new Date()
      }
    })
    console.log(`✅ Church Admin created: ${churchAdmin.name}`)
    console.log(`   Email: admin@comunidaddefe.org`)
    console.log(`   Password: ChurchAdmin2025!`)
    console.log(`   Role: ADMIN_IGLESIA (manages this church only)\n`)

    // 3. CREATE MINISTRIES
    console.log('🎯 Step 3: Creating ministries...')
    const createdMinistries = await Promise.all(
      ministries.map(name =>
        db.ministry.create({
          data: {
            name,
            description: `Ministerio de ${name}`,
            churchId: church.id,
            isActive: true
          }
        })
      )
    )
    console.log(`✅ Created ${createdMinistries.length} ministries\n`)

    // 4. CREATE MEMBERS WITH PROPER ROLE DISTRIBUTION
    console.log('👥 Step 4: Creating 1,000 members...')
    console.log('   Role distribution:')
    console.log('   - ADMIN_IGLESIA: 1 (already created)')
    console.log('   - PASTOR: 5 (senior + associate pastors)')
    console.log('   - LIDER: 50 (ministry leaders)')
    console.log('   - MIEMBRO: 944 (regular members)\n')

    const members = []
    let memberCount = 0

    // Create 5 PASTORS (senior + associate)
    console.log('   Creating pastors...')
    for (let i = 0; i < 5; i++) {
      const firstName = randomElement(firstNames)
      const lastName = randomElement(lastNames)
      const email = generateEmail(firstName, lastName, i + 1000)
      
      const member = await db.member.create({
        data: {
          churchId: church.id,
          firstName,
          lastName,
          email,
          phone: generatePhone(),
          birthDate: randomDate(new Date('1960-01-01'), new Date('1985-12-31')),
          gender: Math.random() > 0.5 ? 'Masculino' : 'Femenino',
          maritalStatus: Math.random() > 0.3 ? 'Casado' : 'Soltero',
          membershipDate: randomDate(new Date('2010-01-01'), new Date('2020-12-31')),
          address: `${Math.floor(Math.random() * 9999)} Church St`,
          city: 'Los Angeles',
          state: 'CA',
          zipCode: String(90000 + Math.floor(Math.random() * 9999)),
          notes: `Pastor migrado desde Planning Center - ${i === 0 ? 'Senior Pastor' : 'Associate Pastor'}`,
          isActive: true
        }
      })

      // Create user account for pastor
      await db.user.create({
        data: {
          email,
          name: `${firstName} ${lastName}`,
          password: hashedPassword,
          role: 'PASTOR',
          churchId: church.id,
          isActive: true,
          emailVerified: new Date()
        }
      })

      members.push(member)
      memberCount++
    }
    console.log(`   ✅ Created ${memberCount} pastors`)

    // Create 50 LIDERES (ministry leaders)
    console.log('   Creating ministry leaders...')
    for (let i = 0; i < 50; i++) {
      const firstName = randomElement(firstNames)
      const lastName = randomElement(lastNames)
      const email = generateEmail(firstName, lastName, i + 2000)
      
      const member = await db.member.create({
        data: {
          churchId: church.id,
          firstName,
          lastName,
          email,
          phone: generatePhone(),
          birthDate: randomDate(new Date('1970-01-01'), new Date('1995-12-31')),
          gender: Math.random() > 0.5 ? 'Masculino' : 'Femenino',
          maritalStatus: randomElement(['Casado', 'Soltero', 'Divorciado', 'Viudo']),
          membershipDate: randomDate(new Date('2012-01-01'), new Date('2023-12-31')),
          address: `${Math.floor(Math.random() * 9999)} Faith Blvd`,
          city: 'Los Angeles',
          state: 'CA',
          zipCode: String(90000 + Math.floor(Math.random() * 9999)),
          notes: `Líder de ministerio - Migrado desde Planning Center`,
          isActive: true
        }
      })

      // Create user account for leader
      await db.user.create({
        data: {
          email,
          name: `${firstName} ${lastName}`,
          password: hashedPassword,
          role: 'LIDER',
          churchId: church.id,
          isActive: true,
          emailVerified: new Date()
        }
      })

      members.push(member)
      memberCount++
    }
    console.log(`   ✅ Created ${memberCount} total (including leaders)`)

    // Create 944 MIEMBROS (regular members) - in batches for performance
    console.log('   Creating regular members (in batches of 100)...')
    const batchSize = 100
    const totalMembers = 944

    for (let batch = 0; batch < Math.ceil(totalMembers / batchSize); batch++) {
      const batchMembers = []
      const startIdx = batch * batchSize
      const endIdx = Math.min(startIdx + batchSize, totalMembers)

      for (let i = startIdx; i < endIdx; i++) {
        const firstName = randomElement(firstNames)
        const lastName = randomElement(lastNames)
        const email = generateEmail(firstName, lastName, i + 3000)

        batchMembers.push({
          churchId: church.id,
          firstName,
          lastName,
          email,
          phone: generatePhone(),
          birthDate: randomDate(new Date('1950-01-01'), new Date('2010-12-31')),
          gender: Math.random() > 0.5 ? 'Masculino' : 'Femenino',
          maritalStatus: randomElement(['Casado', 'Soltero', 'Divorciado', 'Viudo']),
          membershipDate: randomDate(new Date('2010-01-01'), new Date('2025-10-01')),
          address: `${Math.floor(Math.random() * 9999)} Hope Street`,
          city: 'Los Angeles',
          state: 'CA',
          zipCode: String(90000 + Math.floor(Math.random() * 9999)),
          notes: `Miembro migrado desde Planning Center`,
          isActive: true
        })
      }

      await db.member.createMany({ data: batchMembers })
      memberCount += batchMembers.length
      
      console.log(`   ✅ Batch ${batch + 1}: ${memberCount} members created...`)
    }

    console.log(`✅ Total members created: ${memberCount}\n`)

    // 5. SUMMARY
    console.log('━'.repeat(80))
    console.log('✅ MIGRATION COMPLETE!')
    console.log('━'.repeat(80))
    console.log('\n📊 MIGRATION SUMMARY:')
    console.log(`   Church: ${church.name}`)
    console.log(`   Total Members: ${memberCount}`)
    console.log(`   Ministries: ${createdMinistries.length}`)
    console.log(`   Admins: 1 (ADMIN_IGLESIA)`)
    console.log(`   Pastors: 5 (PASTOR)`)
    console.log(`   Leaders: 50 (LIDER)`)
    console.log(`   Members: 944 (MIEMBRO)`)
    console.log('')
    console.log('🔐 CHURCH ADMIN CREDENTIALS:')
    console.log('━'.repeat(80))
    console.log('   URL: https://khesed-tek-cms.up.railway.app/auth/signin')
    console.log('   Email: admin@comunidaddefe.org')
    console.log('   Password: ChurchAdmin2025!')
    console.log('   Role: ADMIN_IGLESIA (manages this church only)')
    console.log('   Church: Iglesia Comunidad de Fe')
    console.log('━'.repeat(80))
    console.log('')
    console.log('📝 NOTE: SUPER_ADMIN (soporte@khesed-tek.com) can manage ALL churches')
    console.log('         ADMIN_IGLESIA can only manage their specific church')
    console.log('')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await db.$disconnect()
  }
}

// Run migration
createMigratedChurch()
