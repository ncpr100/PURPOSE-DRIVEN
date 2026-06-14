import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function seedSubscriptionData() {
  console.log('🌱 Seeding subscription data...')
  try {
    // Create Plan Features
    console.log('📋 Creating plan features...')
    const features = await Promise.all([
      // Core Features (SEMILLA)
      prisma.planFeature.upsert({
        where: { key: 'members_management' },
        update: {},
        create: {
          key: 'members_management',
          name: 'Gestión de Miembros',
          description: 'Administración completa de miembros de la iglesia',
          category: 'core'
        }
      }),
      prisma.planFeature.upsert({
        where: { key: 'events_management' },
        update: {},
        create: {
          key: 'events_management',
          name: 'Gestión de Eventos',
          description: 'Creación y administración de eventos',
          category: 'core'
        }
      }),
      prisma.planFeature.upsert({
        where: { key: 'donations_basic' },
        update: {},
        create: {
          key: 'donations_basic',
          name: 'Donaciones Básicas',
          description: 'Sistema básico de registro de donaciones',
          category: 'core'
        }
      }),
      prisma.planFeature.upsert({
        where: { key: 'basic_reports' },
        update: {},
        create: {
          key: 'basic_reports',
          name: 'Reportes Básicos',
          description: 'Reportes simples de miembros y donaciones',
          category: 'core'
        }
      }),
      // Advanced Features (COSECHA/REINO)
      prisma.planFeature.upsert({
        where: { key: 'analytics_dashboard' },
        update: {},
        create: {
          key: 'analytics_dashboard',
          name: 'Dashboard de Analytics',
          description: 'Dashboard completo con métricas y gráficos',
          category: 'advanced'
        }
      }),
      prisma.planFeature.upsert({
        where: { key: 'automation_rules' },
        update: {},
        create: {
          key: 'automation_rules',
          name: 'Automatizaciones',
          description: 'Reglas de automatización y triggers',
          category: 'advanced'
        }
      }),
      prisma.planFeature.upsert({
        where: { key: 'advanced_reports' },
        update: {},
        create: {
          key: 'advanced_reports',
          name: 'Reportes Avanzados',
          description: 'Reportes personalizados y programables',
          category: 'advanced'
        }
      }),
      prisma.planFeature.upsert({
        where: { key: 'communications' },
        update: {},
        create: {
          key: 'communications',
          name: 'Sistema de Comunicaciones',
          description: 'Envío masivo de emails y notificaciones',
          category: 'advanced'
        }
      }),
      prisma.planFeature.upsert({
        where: { key: 'volunteer_management' },
        update: {},
        create: {
          key: 'volunteer_management',
          name: 'Gestión de Voluntarios',
          description: 'Administración completa de voluntarios y cobertura',
          category: 'advanced'
        }
      })
    ])
    console.log(`✅ Created ${features.length} plan features`)
    // Create Subscription Plans (Data already seeded by seed-subscription-plans.ts)
    console.log('✅ Subscription data seeded successfully')
  } catch (error) {
    console.error('❌ Error seeding subscription data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}
export default seedSubscriptionData