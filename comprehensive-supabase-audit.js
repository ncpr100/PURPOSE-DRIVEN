const { PrismaClient } = require('@prisma/client')

async function comprehensiveSupabaseAudit() {
  console.log('🔍 COMPREHENSIVE SUPABASE SECURITY AUDIT\n')
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'postgresql://postgres.qxdwpihcmgctznvdfmbv:Bendecido100%25%24%24%25@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
      }
    }
  })

  try {
    console.log('📋 CHECKING ALL PUBLIC TABLES FOR RLS STATUS...\n')
    
    // Check ALL public tables for RLS
    const allTablesRLS = await prisma.$queryRaw`
      SELECT schemaname, tablename, rowsecurity as rls_enabled
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `
    
    console.log('🔒 ALL TABLES RLS STATUS:')
    const missingRLS = []
    allTablesRLS.forEach(table => {
      const status = table.rls_enabled ? '✅ ENABLED' : '❌ DISABLED'
      console.log(`  ${table.tablename}: ${status}`)
      if (!table.rls_enabled) {
        missingRLS.push(table.tablename)
      }
    })
    
    console.log(`\n⚠️  TABLES WITHOUT RLS: ${missingRLS.length}`)
    if (missingRLS.length > 0) {
      console.log('Tables missing RLS:', missingRLS.join(', '))
    }
    
    console.log('\n📋 CHECKING ALL POLICIES...\n')
    
    // Check all policies
    const allPolicies = await prisma.$queryRaw`
      SELECT tablename, policyname, cmd, qual
      FROM pg_policies 
      WHERE schemaname = 'public'
      ORDER BY tablename, policyname;
    `
    
    console.log('🛡️  ALL POLICIES:')
    const policyCount = {}
    allPolicies.forEach(policy => {
      if (!policyCount[policy.tablename]) {
        policyCount[policy.tablename] = 0
      }
      policyCount[policy.tablename]++
      console.log(`  ${policy.tablename}: ${policy.policyname} (${policy.cmd})`)
    })
    
    console.log('\n📊 POLICY SUMMARY:')
    Object.keys(policyCount).forEach(table => {
      console.log(`  ${table}: ${policyCount[table]} policies`)
    })
    
    console.log('\n🔍 CHECKING FOR UNSAFE FUNCTIONS...\n')
    
    // Check for functions that might have security issues
    const functions = await prisma.$queryRaw`
      SELECT proname, prosecdef, proisstrict
      FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'public'
      AND proname NOT LIKE 'pg_%'
      ORDER BY proname;
    `
    
    console.log('⚙️  CUSTOM FUNCTIONS:')
    functions.forEach(func => {
      const security = func.prosecdef ? '🔒 SECURE' : '⚠️  SECURITY DEFINER'
      console.log(`  ${func.proname}: ${security}`)
    })
    
    console.log('\n🗂️  CHECKING STORAGE AND AUTH TABLES...\n')
    
    // Check auth schema tables
    try {
      const authTables = await prisma.$queryRaw`
        SELECT schemaname, tablename, rowsecurity as rls_enabled
        FROM pg_tables 
        WHERE schemaname IN ('auth', 'storage', 'realtime')
        ORDER BY schemaname, tablename;
      `
      
      console.log('🔐 AUTH/STORAGE/REALTIME TABLES:')
      authTables.forEach(table => {
        const status = table.rls_enabled ? '✅ RLS' : '❌ NO RLS'
        console.log(`  ${table.schemaname}.${table.tablename}: ${status}`)
      })
    } catch (e) {
      console.log('📝 Auth tables check: Limited access (normal for service role)')
    }
    
    console.log('\n🚨 POTENTIAL SECURITY ISSUES:\n')
    
    // Identify potential issues
    const issues = []
    
    if (missingRLS.length > 0) {
      issues.push(`${missingRLS.length} tables without Row Level Security`)
    }
    
    const tablesWithoutPolicies = allTablesRLS.filter(table => 
      table.rls_enabled && !policyCount[table.tablename]
    )
    if (tablesWithoutPolicies.length > 0) {
      issues.push(`${tablesWithoutPolicies.length} tables with RLS but no policies`)
    }
    
    const unsafeFunctions = functions.filter(f => !f.prosecdef).length
    if (unsafeFunctions > 0) {
      issues.push(`${unsafeFunctions} functions without security definer`)
    }
    
    console.log(`📊 TOTAL POTENTIAL ISSUES: ${issues.length}`)
    issues.forEach((issue, index) => {
      console.log(`  ${index + 1}. ${issue}`)
    })
    
    if (issues.length === 0) {
      console.log('✅ NO OBVIOUS SECURITY ISSUES FOUND')
      console.log('\n💡 The 94 issues might be:')
      console.log('   - Performance warnings')
      console.log('   - Storage bucket policies')
      console.log('   - Edge function security')
      console.log('   - API key configurations')
      console.log('   - Realtime security rules')
    }
    
  } catch (error) {
    console.error('❌ Audit failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

// Run comprehensive audit
comprehensiveSupabaseAudit()
  .then(() => console.log('\n✅ Comprehensive audit complete'))
  .catch(err => console.error('Audit failed:', err))