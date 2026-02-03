const { PrismaClient } = require('@prisma/client')
const { nanoid } = require('nanoid')

const db = new PrismaClient()

async function seedSubscriptionPlans() {
  try {
    console.log('🌱 Seeding subscription plans with correct information...')
    
    // Plan 1: BÁSICO
    const planBasico = await db.subscription_plans.upsert({
      where: { name: 'BÁSICO' },
      update: {},
      create: {
        id: nanoid(),
        name: 'BÁSICO',
        displayName: 'Iglesia Pequeña',
        description: 'Plan ideal para iglesias hasta 500 miembros con funciones básicas de gestión',
        priceMonthly: '$149.99 USD',
        priceYearly: '$1,439.99 USD', // 20% discount approximately
        maxChurches: 1,
        maxMembers: 500,
        maxUsers: 5,
        sortOrder: 1,
        isActive: true,
        features: [
          'Gestión básica de miembros',
          'Donaciones manuales',
          'Eventos simples',
          'Comunicaciones por email',
          'Soporte por email'
        ]
      }
    })

    // Plan 2: PROFESIONAL (Most Popular)
    const planProfesional = await db.subscription_plans.upsert({
      where: { name: 'PROFESIONAL' },
      update: {},
      create: {
        id: nanoid(),
        name: 'PROFESIONAL',
        displayName: 'Iglesia Mediana',
        description: 'Plan más popular con todas las funciones anteriores más características avanzadas',
        priceMonthly: '$299.99 USD',
        priceYearly: '$2,879.99 USD', // 20% discount approximately
        maxChurches: 1,
        maxMembers: 2000, // Reasonable limit for medium churches
        maxUsers: 10,
        sortOrder: 2,
        isActive: true,
        features: [
          'Todas las funciones básicas',
          'Analytics avanzados',
          'Automatizaciones',
          'Reportes personalizados',
          'Soporte prioritario'
        ]
      }
    })

    // Plan 3: EMPRESARIAL - Personalizado
    const planEmpresarial = await db.subscription_plans.upsert({
      where: { name: 'EMPRESARIAL' },
      update: {},
      create: {
        id: nanoid(),
        name: 'EMPRESARIAL',
        displayName: 'Iglesia Grande',
        description: 'Plan empresarial personalizado para iglesias grandes con necesidades específicas',
        priceMonthly: 'Cotización personalizada',
        priceYearly: null,
        maxChurches: 999, // Unlimited
        maxMembers: 999999, // Unlimited
        maxUsers: 999, // Unlimited
        sortOrder: 3,
        isActive: true,
        features: [
          'Todas las funciones profesionales',
          'API personalizada',
          'Integraciones avanzadas',
          'Soporte telefónico',
          'Consultoría estratégica'
        ]
      }
    })

    console.log('✅ Subscription plans seeded successfully:')
    console.log(`   1. ${planBasico.displayName} - ${planBasico.priceMonthly}/mes`)
    console.log(`   2. ${planProfesional.displayName} - ${planProfesional.priceMonthly}/mes`)
    console.log(`   3. ${planEmpresarial.displayName} - ${planEmpresarial.priceMonthly}`)
    
    console.log('\n🎯 Features summary:')
    console.log('BÁSICO:', planBasico.features)
    console.log('PROFESIONAL:', planProfesional.features)
    console.log('EMPRESARIAL:', planEmpresarial.features)
    
  } catch (error) {
    console.error('❌ Error seeding subscription plans:', error)
  } finally {
    await db.$disconnect()
  }
}

seedSubscriptionPlans()