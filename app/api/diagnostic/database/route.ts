// Diagnostic endpoint to test database connectivity in Vercel production
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL ? '✅ Configured' : '❌ NOT SET',
    databaseUrlPreview: process.env.DATABASE_URL?.substring(0, 30) + '...' || 'NOT SET',
    tests: {} as any
  }

  try {
    // Test 1: Database connection
    console.log('[Diagnostic] Testing database connection...')
    diagnostics.tests.connectionTest = 'Testing...'
    
    await db.$connect()
    diagnostics.tests.connectionTest = '✅ Connected'
    
    // Test 2: Count churches
    console.log('[Diagnostic] Counting churches...')
    const churchCount = await db.church.count()
    diagnostics.tests.churchCount = {
      status: '✅ Success',
      count: churchCount
    }
    
    // Test 3: Find "Iglesia Central"
    console.log('[Diagnostic] Finding Iglesia Central...')
    const iglesiacentral = await db.church.findFirst({
      where: {
        OR: [
          { name: { contains: 'Central', mode: 'insensitive' } },
          { name: { contains: 'Iglesia', mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            members: true,
            events: true,
            donations: true,
            volunteers: true
          }
        }
      }
    })
    
    diagnostics.tests.iglesiacentralTest = iglesiacentral ? {
      status: '✅ Found',
      churchId: iglesiacentral.id,
      churchName: iglesiacentral.name,
      memberCount: iglesiacentral._count.members,
      eventCount: iglesiacentral._count.events,
      donationCount: iglesiacentral._count.donations,
      volunteerCount: iglesiacentral._count.volunteers
    } : {
      status: '❌ Not Found',
      message: 'No church matching "Central" or "Iglesia" found in database'
    }
    
    // Test 4: Total members across all churches
    console.log('[Diagnostic] Counting all members...')
    const totalMembers = await db.member.count()
    diagnostics.tests.totalMembersTest = {
      status: '✅ Success',
      count: totalMembers
    }
    
    // Test 5: Sample members
    if (totalMembers > 0) {
      console.log('[Diagnostic] Fetching sample members...')
      const sampleMembers = await db.member.findMany({
        take: 3,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          church: { select: { name: true } }
        }
      })
      diagnostics.tests.sampleMembers = {
        status: '✅ Success',
        samples: sampleMembers.map(m => ({
          name: `${m.firstName} ${m.lastName}`,
          email: m.email,
          church: m.church.name
        }))
      }
    }
    
    diagnostics.tests.overallStatus = '✅ ALL TESTS PASSED'
    
    await db.$disconnect()
    
    return NextResponse.json(diagnostics, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    })
    
  } catch (error: any) {
    console.error('[Diagnostic] Database test failed:', error)
    
    diagnostics.tests.error = {
      status: '❌ FAILED',
      code: error.code,
      message: error.message,
      name: error.name
    }
    
    if (error.code === 'P1001') {
      diagnostics.tests.diagnosis = {
        issue: 'Cannot reach database server',
        possibleCauses: [
          'DATABASE_URL environment variable not set in Vercel',
          'Incorrect connection string in Vercel environment',
          'Supabase blocking Vercel IP addresses (unlikely)',
          'Database server is down'
        ],
        solution: 'Check Vercel Dashboard → Settings → Environment Variables → Verify DATABASE_URL is set correctly'
      }
    } else if (error.code === 'P1000') {
      diagnostics.tests.diagnosis = {
        issue: 'Authentication failed',
        possibleCauses: [
          'Wrong password in DATABASE_URL',
          'Wrong username in DATABASE_URL'
        ],
        solution: 'Verify connection string credentials match Supabase database'
      }
    }
    
    diagnostics.tests.overallStatus = '❌ TESTS FAILED'
    
    return NextResponse.json(diagnostics, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    })
  }
}
