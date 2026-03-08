import { db } from '../lib/db'

async function seedSubscriptionPlans() {
  console.log('🌱 Seeding subscription plans...')

  const plans = [
    {
      id: 'plan-basico',
      name: 'BASICO',
      displayName: 'Básico - Iglesia Pequeña',
      description: 'Plan ideal para iglesias pequeñas y en crecimiento.',
      priceMonthly: '149.99',
      priceYearly: '1499.99',
      maxChurches: 1,
      maxMembers: 500,
      maxUsers: 5,
      isActive: true,
      sortOrder: 1,
      features: [
        'Gestión básica de miembros',
        'WhatsApp integrado',
        'Hasta 5 licencias',
        'Soporte en español',
        'Pagos PSE'
      ]
    },
    {
      id: 'plan-profesional',
      name: 'PROFESIONAL',
      displayName: 'Profesional - Iglesia Mediana',
      description: 'Plan completo para iglesias medianas con funcionalidades avanzadas.',
      priceMonthly: '299.99',
      priceYearly: '2999.99',
      maxChurches: 1,
      maxMembers: 2000,
      maxUsers: 10,
      isActive: true,
      sortOrder: 2,
      features: [
        'Todo lo anterior',
        'Hasta 10 licencias',
        'Eventos y actividades',
        'Reportes avanzados',
        'Transmisiones en vivo'
      ]
    },
    {
      id: 'plan-empresarial',
      name: 'EMPRESARIAL',
      displayName: 'Empresarial - Iglesia Grande',
      description: 'Solución personalizada para iglesias grandes y grupos multi-campus.',
      priceMonthly: 'Personalizado',
      priceYearly: null,
      maxChurches: 99,
      maxMembers: 999999,
      maxUsers: 999,
      isActive: true,
      sortOrder: 3,
      features: [
        'Todo lo anterior',
        'Licencias ilimitadas',
        'Multi-campus',
        'API personalizada',
        'Soporte prioritario'
      ]
    }
  ]

  for (const plan of plans) {
    const result = await db.subscription_plans.upsert({
      where: { name: plan.name },
      update: {
        displayName: plan.displayName,
        description: plan.description,
        priceMonthly: plan.priceMonthly,
        priceYearly: plan.priceYearly,
        maxChurches: plan.maxChurches,
        maxMembers: plan.maxMembers,
        maxUsers: plan.maxUsers,
        isActive: plan.isActive,
        sortOrder: plan.sortOrder,
        features: plan.features,
        updatedAt: new Date()
      },
      create: {
        id: plan.id,
        name: plan.name,
        displayName: plan.displayName,
        description: plan.description,
        priceMonthly: plan.priceMonthly,
        priceYearly: plan.priceYearly,
        maxChurches: plan.maxChurches,
        maxMembers: plan.maxMembers,
        maxUsers: plan.maxUsers,
        isActive: plan.isActive,
        sortOrder: plan.sortOrder,
        features: plan.features,
        updatedAt: new Date()
      }
    })
    console.log(`✅ Plan ${result.displayName} creado/actualizado`)
  }

  console.log('✅ Subscription plans seeded successfully!')
}

seedSubscriptionPlans()
  .catch((e) => {
    console.error('❌ Error seeding subscription plans:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
