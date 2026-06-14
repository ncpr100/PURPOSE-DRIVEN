import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function seedSubscriptionPlans() {
  console.log('🌱 Seeding subscription plans...')
  const plans = [
    {
      id: 'plan-semilla',
      name: 'SEMILLA',
      displayName: 'Semilla',
      description: 'Plan ideal para iglesias pequeñas y en crecimiento.',
      priceMonthly: '49.00',
      priceYearly: '528.00',
      maxChurches: 1,
      maxMembers: 150,
      maxUsers: 5,
      isActive: true,
      sortOrder: 1,
      features: [
        'Gestión básica de miembros',
        'WhatsApp integrado',
        'Hasta 5 licencias',
        'Soporte en español'
      ]
    },
    {
      id: 'plan-cosecha',
      name: 'COSECHA',
      displayName: 'Cosecha',
      description: 'Plan completo para iglesias medianas con funcionalidades avanzadas.',
      priceMonthly: '149.00',
      priceYearly: '1599.00',
      maxChurches: 1,
      maxMembers: 500,
      maxUsers: 10,
      isActive: true,
      sortOrder: 2,
      features: [
        'Todo lo anterior',
        '12 Agentes IA completos',
        '800 conversaciones WA incluidas',
        'Hasta 10 licencias'
      ]
    },
    {
      id: 'plan-reino',
      name: 'REINO',
      displayName: 'Reino',
      description: 'Solución robusta para iglesias grandes.',
      priceMonthly: '299.00',
      priceYearly: '3199.00',
      maxChurches: 1,
      maxMembers: 1500,
      maxUsers: 25,
      isActive: true,
      sortOrder: 3,
      features: [
        'Todo lo anterior',
        '2,500 conversaciones WA incluidas',
        'Licencias extendidas',
        'Reportes avanzados'
      ]
    },
    {
      id: 'plan-red',
      name: 'RED',
      displayName: 'Red',
      description: 'Plan especial para redes de iglesias y denominaciones.',
      priceMonthly: '94.90',
      priceYearly: '1019.00',
      maxChurches: 25,
      maxMembers: 500,
      maxUsers: 10,
      isActive: true,
      sortOrder: 4,
      features: [
        '12 Agentes por iglesia',
        'Panel centralizado',
        '1,200 conversaciones WA por iglesia',
        'Soporte prioritario'
      ]
    },
    {
      id: 'plan-gloria',
      name: 'GLORIA',
      displayName: 'Gloria - Bespoke (Unlimited Members/Users)',
      description: 'Solución personalizada para redes y denominaciones. El costo varía según el crecimiento de la red.',
      priceMonthly: '0.00',
      priceYearly: null,
      maxChurches: 25,
      maxMembers: 999999,
      maxUsers: 999999,
      isActive: true,
      sortOrder: 5,
      features: [
        '12 Agentes IA completos',
        'Panel centralizado para 25 iglesias',
        'API personalizada y Multi-campus',
        'Costo Bespoke basado en crecimiento'
      ]
    }
  ]
  try {
    for (const plan of plans) {
      const result = await prisma.subscription_plans.upsert({
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
      console.log(`✅ Created/Updated plan: ${result.name}`)
    }
    console.log('🎉 Subscription plans seeded successfully')
  } catch (error) {
    console.error('❌ Error seeding subscription plans:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}
seedSubscriptionPlans()