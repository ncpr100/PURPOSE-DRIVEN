import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function cleanupLegacyPlans() {
  console.log('🗑️ Eliminando planes legacy de la base de datos...\n')
  try {
    // Contar planes antes de eliminar
    const beforeCount = await prisma.subscription_plans.count()
    console.log(`📊 Planes en BD antes: ${beforeCount}`)
    // Obtener el plan SEMILLA para usar como fallback
    const semillaPlan = await prisma.subscription_plans.findFirst({
      where: { name: 'SEMILLA' }
    })
    if (!semillaPlan) {
      throw new Error('No se encontró el plan SEMILLA para usar como fallback')
    }
    console.log(`✅ Plan fallback encontrado: ${semillaPlan.displayName} (${semillaPlan.id})`)
    // Actualizar suscripciones que referencian planes legacy
    console.log('\n🔄 Actualizando suscripciones legacy...')
    const updatedSubscriptions = await prisma.church_subscriptions.updateMany({
      where: {
        planId: {
          in: ['plan-basico', 'plan-profesional', 'plan-empresarial']
        }
      },
      data: {
        planId: semillaPlan.id
      }
    })
    console.log(`✅ Suscripciones actualizadas: ${updatedSubscriptions.count}`)
    // Eliminar planes legacy
    console.log('\n🗑️ Eliminando planes legacy...')
    const deleted = await prisma.subscription_plans.deleteMany({
      where: {
        name: {
          in: ['BÁSICO', 'PROFESIONAL', 'EMPRESARIAL']
        }
      }
    })
    console.log(`✅ Planes legacy eliminados: ${deleted.count}`)
    // Verificar planes restantes
    const remainingPlans = await prisma.subscription_plans.findMany({
      select: { name: true, displayName: true, priceMonthly: true },
      orderBy: { sortOrder: 'asc' }
    })
    console.log(`\n📋 Planes restantes en la base de datos:`)
    remainingPlans.forEach((plan, index) => {
      console.log(`   ${index + 1}. ${plan.displayName} (${plan.name}) - $${plan.priceMonthly}/mes`)
    })
    const afterCount = await prisma.subscription_plans.count()
    console.log(`\n📊 Planes en BD después: ${afterCount}`)
    if (afterCount === 5) {
      console.log('✅✅✅ VERIFICACIÓN EXITOSA: Solo quedan los 5 planes correctos ✅✅✅')
    } else {
      console.log(`⚠️ ADVERTENCIA: Se esperaban 5 planes, pero hay ${afterCount}`)
    }
  } catch (error) {
    console.error('❌ Error al eliminar planes legacy:', error)
  } finally {
    await prisma.$disconnect()
  }
}
cleanupLegacyPlans()