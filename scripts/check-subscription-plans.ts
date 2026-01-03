import { db } from '../lib/db'

async function checkSubscriptionPlans() {
  try {
    console.log('🔍 Checking current subscription plans...')
    
    const plans = await db.subscription_plans.findMany({
      orderBy: { sortOrder: 'asc' }
    })
    
    console.log(`📊 Found ${plans.length} subscription plans:`)
    
    plans.forEach((plan, index) => {
      console.log(`\n${index + 1}. ${plan.displayName} (${plan.name})`)
      console.log(`   - ID: ${plan.id}`)
      console.log(`   - Price Monthly: ${plan.priceMonthly}`)
      console.log(`   - Price Yearly: ${plan.priceYearly || 'Not set'}`)
      console.log(`   - Max Members: ${plan.maxMembers}`)
      console.log(`   - Max Users: ${plan.maxUsers}`)
      console.log(`   - Max Churches: ${plan.maxChurches}`)
      console.log(`   - Sort Order: ${plan.sortOrder}`)
      console.log(`   - Active: ${plan.isActive}`)
      if (plan.features) {
        console.log(`   - Features: ${JSON.stringify(plan.features, null, 4)}`)
      }
      if (plan.description) {
        console.log(`   - Description: ${plan.description}`)
      }
    })
    
  } catch (error) {
    console.error('❌ Error checking subscription plans:', error)
  } finally {
    await db.$disconnect()
  }
}

checkSubscriptionPlans()