import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 MINIMAL TEST: Starting minimal test endpoint...')
    
    return NextResponse.json({
      success: true,
      message: 'Minimal test endpoint working',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ MINIMAL TEST ERROR:', error)
    return NextResponse.json({
      error: 'Error in minimal test',
      debug: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}