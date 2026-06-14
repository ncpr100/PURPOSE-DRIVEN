import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function fixPlanOrder() {
  console.log('🔧 Corrigiendo orden de planes...\n')
  try {
    // Actualizar GLORIA a sortOrder 4
    await prisma.subscription_plans.update({
      where: { name: 'GLORIA' },
      data: { sortOrder: 4 }
    })
    console.log('✅ GLORIA actualizado a sortOrder: 4')
    // Actualizar RED a sortOrder 5
    await prisma.subscription_plans.update({
      where: { name: 'RED' },
      data: { sortOrder: 5 }
    })
    console.log('✅ RED actualizado a sortOrder: 5')
    // Verificar orden final
    const plans = await prisma.subscription_plans.findMany({
      select: { name: true, displayName: true, sortOrder: true },
      orderBy: { sortOrder: 'asc' }
    })
    console.log('\n📋 Orden final de planes:')
    plans.forEach((plan, index) => {
      console.log(`   ${index + 1}. ${plan.displayName} (${plan.name}) - sortOrder: ${plan.sortOrder}`)
    })
    console.log('\n✅✅✅ ORDEN CORREGIDO EXITOSAMENTE ✅✅✅')
  } catch (error) {
    console.error('❌ Error al corregir orden:', error)
  } finally {
    await prisma.$disconnect()
  }
}
fixPlanOrder()