import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DB COUNT TEST: Checking actual database counts...')
    
    // Get all churches first
    const churches = await db.church.findMany({
      select: { id: true, name: true }
    })
    
    console.log('🔍 Churches found:', churches.length)
    
    const results = []
    
    for (const church of churches) {
      const memberCount = await db.member.count({
        where: { 
          churchId: church.id,
          isActive: true 
        }
      })
      
      const totalMembers = await db.member.count({
        where: { 
          churchId: church.id
        }
      })
      
      console.log(`🔍 Church ${church.name}: ${memberCount} active of ${totalMembers} total members`)
      
      results.push({
        churchId: church.id,
        churchName: church.name,
        activeMembers: memberCount,
        totalMembers: totalMembers
      })
    }
    
    return NextResponse.json({
      success: true,
      churches: results,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ DB COUNT TEST ERROR:', error)
    return NextResponse.json({
      error: 'Error checking database',
      debug: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}