import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Store form analytics events (simplified - using client-side storage for now)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate event data
    const { formId, formType, event, sessionId, churchId } = body
    
    if (!formId || !formType || !event || !sessionId) {
      return NextResponse.json({ 
        error: 'Missing required fields: formId, formType, event, sessionId' 
      }, { status: 400 })
    }

    // For now, just acknowledge receipt - actual storage handled client-side
    console.log(`Form analytics event: ${event} for ${formType}:${formId}`)
    
    return NextResponse.json({ 
      success: true,
      message: 'Event logged successfully' 
    })
    
  } catch (error) {
    console.error('Form analytics error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}