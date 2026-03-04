const { PrismaClient } = require('@prisma/client')

async function verifySupabaseSecurityFix() {
  console.log('🔍 SUPABASE SECURITY VERIFICATION\n')
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'postgresql://postgres.qxdwpihcmgctznvdfmbv:Bendecido100%25%24%24%25@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
      }
    }
  })

  try {
    console.log('📊 CHECKING RLS STATUS ON KEY TABLES...\n')
    
    // Check RLS status for critical tables
    const rlsStatus = await prisma.$queryRaw`
      SELECT schemaname, tablename, rowsecurity as rls_enabled
      FROM pg_tables 
      WHERE schemaname = 'public'
      AND tablename IN ('users', 'churches', 'members', 'events', 'donations', 'volunteers', 'check_ins', 'communications')
      ORDER BY tablename;
    `
    
    console.log('🔒 RLS STATUS:')
    rlsStatus.forEach(table => {
      const status = table.rls_enabled ? '✅ ENABLED' : '❌ DISABLED'
      console.log(`  ${table.tablename}: ${status}`)
    })
    
    console.log('\n📋 CHECKING POLICIES ON KEY TABLES...\n')
    
    // Check policies
    const policies = await prisma.$queryRaw`
      SELECT tablename, COUNT(*) as policy_count
      FROM pg_policies 
      WHERE schemaname = 'public'
      AND tablename IN ('users', 'churches', 'members', 'events', 'donations')
      GROUP BY tablename
      ORDER BY tablename;
    `
    
    console.log('🛡️  POLICY COUNT:')
    policies.forEach(table => {
      console.log(`  ${table.tablename}: ${table.policy_count} policies`)
    })
    
    console.log('\n🔍 TESTING DATA ACCESS WITH SERVICE ROLE...\n')
    
    // Test basic queries
    try {
      const userCount = await prisma.users.count()
      console.log(`✅ Users accessible: ${userCount} records`)
      
      const churchCount = await prisma.churches.count()
      console.log(`✅ Churches accessible: ${churchCount} records`)
      
      const memberCount = await prisma.members.count()
      console.log(`✅ Members accessible: ${memberCount} records`)
      
    } catch (e) {
      console.log(`❌ Data access error: ${e.message}`)
    }
    
    console.log('\n📈 CHECKING QUERY PERFORMANCE...\n')
    
    // Test query performance on indexed columns
    const start = Date.now()
    await prisma.members.findMany({
      where: { churchId: 'iglesia-central' },
      take: 10
    })
    const duration = Date.now() - start
    console.log(`⚡ Members by church query: ${duration}ms`)
    
    console.log('\n🎯 SECURITY ISSUE ASSESSMENT:')
    
    const tablesWithoutRLS = rlsStatus.filter(t => !t.rls_enabled).length
    const tablesWithPolicies = policies.length
    
    if (tablesWithoutRLS === 0 && tablesWithPolicies >= 5) {
      console.log('✅ EXCELLENT: Security issues should be resolved!')
      console.log('   - All critical tables have RLS enabled')
      console.log('   - Policies are in place for access control') 
    } else {
      console.log('⚠️  ISSUES STILL PRESENT:')
      if (tablesWithoutRLS > 0) {
        console.log(`   - ${tablesWithoutRLS} critical tables missing RLS`)
      }
      if (tablesWithPolicies < 5) {
        console.log(`   - Only ${tablesWithPolicies} tables have policies (need more)`)
      }
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

// Run verification
verifySupabaseSecurityFix()
  .then(() => console.log('\n✅ Verification complete'))
  .catch(err => console.error('Verification failed:', err))