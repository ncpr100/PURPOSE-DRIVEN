const { PrismaClient } = require('@prisma/client')
const { nanoid } = require('nanoid')

const db = new PrismaClient()

async function seedSubscriptionPlans() {
  try {
    console.log('🌱 Seeding subscription plans with correct information...')
    
    // Plan 1: Iglesia Pequeña
    const planPequeña = await db.subscription_plans.upsert({
      where: { name: 'PEQUEÑA' },
      update: {},
      create: {
        id: nanoid(),
        name: 'PEQUEÑA',
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
          'WhatsApp integrado',
          'Hasta 5 licencias',
          'Soporte en español',
          'Pagos PSE',
          '14 días de prueba gratuita'
        ]
      }
    })

    // Plan 2: Iglesia Mediana (Most Popular)
    const planMediana = await db.subscription_plans.upsert({
      where: { name: 'MEDIANA' },
      update: {},
      create: {
        id: nanoid(),
        name: 'MEDIANA',
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
          'Todo lo anterior',
          'Hasta 10 licencias',
          'Eventos y actividades',
          'Reportes avanzados',
          'Transmisiones en vivo',
          'Analíticas inteligentes',
          'Gestión de donaciones',
          '14 días de prueba gratuita'
        ]
      }
    })

    // Plan 3: Iglesia Grande - Personalizado
    const planGrande = await db.subscription_plans.upsert({
      where: { name: 'GRANDE' },
      update: {},
      create: {
        id: nanoid(),
        name: 'GRANDE',
        displayName: 'Iglesia Grande - Personalizado',
        description: 'Plan empresarial personalizado para iglesias grandes con necesidades específicas',
        priceMonthly: 'Personalizado',
        priceYearly: null,
        maxChurches: 999, // Unlimited
        maxMembers: 999999, // Unlimited
        maxUsers: 999, // Unlimited
        sortOrder: 3,
        isActive: true,
        features: [
          'Todo lo anterior',
          'Licencias ilimitadas',
          'Miembros ilimitados',
          'Multi-campus',
          'API personalizada',
          'Soporte prioritario',
          'Implementación personalizada',
          'Entrenamiento dedicado'
        ]
      }
    })

    console.log('✅ Subscription plans seeded successfully:')
    console.log(`   1. ${planPequeña.displayName} - ${planPequeña.priceMonthly}/mes`)
    console.log(`   2. ${planMediana.displayName} - ${planMediana.priceMonthly}/mes`)
    console.log(`   3. ${planGrande.displayName} - ${planGrande.priceMonthly}`)
    
    console.log('\n🎯 Features summary:')
    console.log('Pequeña:', planPequeña.features)
    console.log('Mediana:', planMediana.features)
    console.log('Grande:', planGrande.features)
    
  } catch (error) {
    console.error('❌ Error seeding subscription plans:', error)
  } finally {
    await db.$disconnect()
  }
}

seedSubscriptionPlans()