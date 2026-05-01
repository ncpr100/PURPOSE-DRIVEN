import { db } from '../lib/db'
import bcrypt from 'bcryptjs'

// Realistic first names (Spanish/Latin)
const firstNames = [
  'José', 'María', 'Juan', 'Ana', 'Carlos', 'Carmen', 'Miguel', 'Rosa', 'Francisco', 'Isabel',
  'Antonio', 'Teresa', 'Manuel', 'Lucía', 'Pedro', 'Sofía', 'Alejandro', 'Patricia', 'Javier', 'Laura',
  'Daniel', 'Elena', 'David', 'Cristina', 'Rafael', 'Marta', 'Luis', 'Sandra', 'Jorge', 'Andrea',
  'Fernando', 'Beatriz', 'Ricardo', 'Gabriela', 'Roberto', 'Daniela', 'Alberto', 'Valeria', 'Eduardo', 'Natalia',
  'Sergio', 'Paula', 'Raúl', 'Victoria', 'Diego', 'Adriana', 'Héctor', 'Liliana', 'Marcos', 'Mónica',
  'Pablo', 'Claudia', 'Andrés', 'Silvia', 'Óscar', 'Alicia', 'Rubén', 'Carolina', 'Ignacio', 'Diana',
  'Guillermo', 'Marina', 'Felipe', 'Pilar', 'Jesús', 'Rocío', 'Salvador', 'Verónica', 'Sebastián', 'Alejandra',
  'Gabriel', 'Eva', 'Tomás', 'Julia', 'Víctor', 'Irene', 'Lorenzo', 'Raquel', 'Mateo', 'Paola',
]

// Realistic last names
const lastNames = [
  'García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández', 'Pérez', 'Sánchez', 'Ramírez', 'Torres',
  'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales', 'Reyes', 'Gutiérrez', 'Ortiz', 'Romero',
  'Álvarez', 'Mendoza', 'Jiménez', 'Ruiz', 'Vargas', 'Castro', 'Ramos', 'Vega', 'Fernández', 'Silva',
  'Medina', 'Aguilar', 'Navarro', 'Muñoz', 'Herrera', 'Castillo', 'Santos', 'Domínguez', 'Guerrero', 'Núñez',
]

// Member statuses weighted distribution
const memberStatuses = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'INACTIVE', 'VISITOR']

// Phone number generator
function generatePhone(): string {
  const area = Math.floor(Math.random() * 900) + 100
  const mid = Math.floor(Math.random() * 900) + 100
  const end = Math.floor(Math.random() * 9000) + 1000
  return `+1-${area}-${mid}-${end}`
}

// Email generator
function generateEmail(firstName: string, lastName: string, index: number): string {
  const cleanFirst = firstName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  const cleanLast = lastName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com']
  const domain = domains[Math.floor(Math.random() * domains.length)]
  
  const styles = [
    `${cleanFirst}.${cleanLast}@${domain}`,
    `${cleanFirst}${cleanLast}@${domain}`,
    `${cleanFirst}_${cleanLast}@${domain}`,
    `${cleanFirst}${index}@${domain}`,
    `${cleanFirst}.${cleanLast}${index}@${domain}`,
  ]
  
  return styles[Math.floor(Math.random() * styles.length)]
}

// Random date generator
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Generate address
function generateAddress(): string {
  const streets = ['Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine Rd', 'Elm St', 'Washington Blvd', 'Park Ave', 'Church St', 'Hill Rd']
  const cities = ['Springfield', 'Riverside', 'Greenville', 'Fairview', 'Madison', 'Georgetown', 'Franklin', 'Clinton', 'Arlington', 'Salem']
  const states = ['CA', 'TX', 'FL', 'NY', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI']
  
  const number = Math.floor(Math.random() * 9000) + 1000
  const street = streets[Math.floor(Math.random() * streets.length)]
  const city = cities[Math.floor(Math.random() * cities.length)]
  const state = states[Math.floor(Math.random() * states.length)]
  const zip = Math.floor(Math.random() * 90000) + 10000
  
  return `${number} ${street}, ${city}, ${state} ${zip}`
}

async function migratePlanningCenterChurch() {
  try {
    console.log(' CHURCH MIGRATION - Planning Center Import')
    console.log('━'.repeat(80))
    console.log('Starting migration of large church with 1,000 members...\n')

    // 1. Create the church
    console.log(' Step 1/5: Creating church...')
    const church = await db.church.create({
      data: {
        name: 'Iglesia Comunidad de Fe',
        email: 'contacto@comunidadfe.org',
        phone: '+1-555-0150',
        address: '456 Faith Avenue, Austin, TX 78701',
        website: 'https://comunidadfe.org',
        founded: new Date('2010-03-15'),
        description: 'Iglesia dinámica con enfoque en jóvenes y familias. Migrada desde Planning Center.',
        isActive: true
      }
    })
    console.log(` Church created: ${church.name} (ID: ${church.id})\n`)

    // 2. Create church admin
    console.log(' Step 2/5: Creating church admin...')
    const adminPassword = await bcrypt.hash('Pastor2024!', 10)
    const admin = await db.user.create({
      data: {
        email: 'pastor@comunidadfe.org',
        name: 'Pastor Miguel Ramírez',
        password: adminPassword,
        role: 'ADMIN_IGLESIA',
        churchId: church.id,
        isActive: true,
        emailVerified: new Date()
      }
    })
    console.log(` Admin created: ${admin.name}\n`)

    // 3. Create staff users
    console.log(' Step 3/5: Creating staff members (10)...')
    const staffRoles = [
      { name: 'Pastora Ana Torres', email: 'ana.torres@comunidadfe.org', role: 'PASTOR' as const },
      { name: 'David González', email: 'david.gonzalez@comunidadfe.org', role: 'LIDER' as const },
      { name: 'María Flores', email: 'maria.flores@comunidadfe.org', role: 'LIDER' as const },
      { name: 'Carlos Medina', email: 'carlos.medina@comunidadfe.org', role: 'LIDER' as const },
      { name: 'Laura Sánchez', email: 'laura.sanchez@comunidadfe.org', role: 'LIDER' as const },
      { name: 'Roberto Silva', email: 'roberto.silva@comunidadfe.org', role: 'LIDER' as const },
      { name: 'Elena Díaz', email: 'elena.diaz@comunidadfe.org', role: 'MIEMBRO' as const },
      { name: 'Javier Ortiz', email: 'javier.ortiz@comunidadfe.org', role: 'MIEMBRO' as const },
      { name: 'Patricia Cruz', email: 'patricia.cruz@comunidadfe.org', role: 'MIEMBRO' as const },
      { name: 'Andrés Vargas', email: 'andres.vargas@comunidadfe.org', role: 'MIEMBRO' as const },
    ]

    const staffPassword = await bcrypt.hash('Staff2024!', 10)
    for (const staff of staffRoles) {
      await db.user.create({
        data: {
          email: staff.email,
          name: staff.name,
          password: staffPassword,
          role: staff.role,
          churchId: church.id,
          isActive: true,
          emailVerified: new Date()
        }
      })
    }
    console.log(` Created ${staffRoles.length} staff members\n`)

    // 4. Create 1,000 members in batches
    console.log('‍‍‍ Step 4/5: Creating 1,000 members...')
    const batchSize = 100
    const totalMembers = 1000
    let created = 0

    for (let batch = 0; batch < totalMembers / batchSize; batch++) {
      const membersData = []
      
      for (let i = 0; i < batchSize; i++) {
        const memberIndex = batch * batchSize + i
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
        const fullName = `${firstName} ${lastName}`
        const email = generateEmail(firstName, lastName, memberIndex)
        
        // Random dates for membership
        const joinDate = randomDate(new Date('2010-01-01'), new Date('2024-10-01'))
        const birthDate = randomDate(new Date('1940-01-01'), new Date('2010-01-01'))
        
        // Member status distribution: 70% active, 20% inactive, 10% visitor
        const status = memberStatuses[Math.floor(Math.random() * memberStatuses.length)]
        
        // Gender distribution
        const gender = Math.random() > 0.5 ? 'MALE' : 'FEMALE'
        
        // Random marital status
        const maritalStatuses = ['SINGLE', 'MARRIED', 'MARRIED', 'WIDOWED', 'DIVORCED']
        const maritalStatus = maritalStatuses[Math.floor(Math.random() * maritalStatuses.length)]

        membersData.push({
          churchId: church.id,
          firstName,
          lastName,
          fullName,
          email,
          phone: generatePhone(),
          address: generateAddress(),
          dateOfBirth: birthDate,
          gender,
          maritalStatus,
          status,
          joinDate,
          membershipType: status === 'ACTIVE' ? 'MEMBER' : 'ATTENDEE',
          isActive: status === 'ACTIVE',
          notes: `Migrated from Planning Center on ${new Date().toISOString().split('T')[0]}`
        })
      }

      await db.member.createMany({
        data: membersData
      })

      created += batchSize
      console.log(`    Progress: ${created}/${totalMembers} members created`)
    }
    console.log(` All ${totalMembers} members created successfully\n`)

    // 5. Generate summary statistics
    console.log(' Step 5/5: Generating migration summary...\n')
    
    const stats = await db.member.groupBy({
      by: ['status'],
      where: { churchId: church.id },
      _count: true
    })

    const genderStats = await db.member.groupBy({
      by: ['gender'],
      where: { churchId: church.id },
      _count: true
    })

    console.log('━'.repeat(80))
    console.log(' MIGRATION COMPLETED SUCCESSFULLY!')
    console.log('━'.repeat(80))
    console.log('\n MIGRATION SUMMARY:')
    console.log(`Church: ${church.name}`)
    console.log(`Church ID: ${church.id}`)
    console.log(`Total Members: ${totalMembers}`)
    console.log(`Staff Users: ${staffRoles.length + 1} (including admin)`)
    console.log('\nMember Status Distribution:')
    stats.forEach(s => {
      console.log(`  - ${s.status}: ${s._count} members`)
    })
    console.log('\nGender Distribution:')
    genderStats.forEach(s => {
      console.log(`  - ${s.gender}: ${s._count} members`)
    })

    console.log('\n LOGIN CREDENTIALS:')
    console.log('━'.repeat(80))
    console.log('CHURCH ADMIN:')
    console.log('  Email: pastor@comunidadfe.org')
    console.log('  Password: Pastor2024!')
    console.log('  Role: ADMIN_IGLESIA')
    console.log('\nSTAFF ACCOUNTS (all use same password):')
    console.log('  Password: Staff2024!')
    staffRoles.forEach(staff => {
      console.log(`  - ${staff.email} (${staff.role})`)
    })
    console.log('━'.repeat(80))

    console.log('\n READY TO TEST:')
    console.log('  1. Login at: https://khesed-tek-cms.up.railway.app/auth/signin')
    console.log('  2. Use pastor@comunidadfe.org / Pastor2024!')
    console.log('  3. Access Members: /members')
    console.log('  4. Test Automation: /automation-rules')
    console.log('  5. Create Check-ins: /check-ins')
    console.log('  6. Prayer Requests: /prayer-wall')

  } catch (error) {
    console.error('\n MIGRATION FAILED:', error)
    throw error
  } finally {
    await db.$disconnect()
  }
}

// Run migration
migratePlanningCenterChurch()
