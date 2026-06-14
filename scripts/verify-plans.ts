import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function verifyPlans() {
  console.log('🔍 Verificando planes en la base de datos...\n')
  try {
    const plans = await prisma.subscription_plans.findMany({
      orderBy: { sortOrder: 'asc' }
    })
    console.log(`✅ Se encontraron ${plans.length} planes:\n`)
    plans.forEach((plan, index) => {
      console.log(`${index + 1}. ${plan.displayName}`)
      console.log(`   ID: ${plan.id}`)
      console.log(`   Nombre: ${plan.name}`)
      console.log(`   Precio Mensual: $${plan.priceMonthly}`)
      console.log(`   Precio Anual: ${plan.priceYearly ? '$' + plan.priceYearly : 'N/A'}`)
      console.log(`   Máx Iglesias: ${plan.maxChurches}`)
      console.log(`   Máx Miembros: ${plan.maxMembers}`)
      console.log(`   Máx Usuarios: ${plan.maxUsers}`)
      console.log(`   Activo: ${plan.isActive ? 'Sí' : 'No'}`)
      console.log(`   Orden: ${plan.sortOrder}`)
      console.log(`   Features: ${plan.features ? plan.features.join(', ') : 'N/A'}`)
      console.log('')
    })
    console.log('✅ Verificación completada exitosamente')
  } catch (error) {
    console.error('❌ Error al verificar planes:', error)
  } finally {
    await prisma.$disconnect()
  }
}
verifyPlans()