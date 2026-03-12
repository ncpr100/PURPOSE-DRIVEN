import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Get form analytics statistics (simplified - analytics stored client-side)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const formId = searchParams.get('formId')
    const formType = searchParams.get('formType')

    if (!formId || !formType) {
      return NextResponse.json({ error: 'Missing formId or formType' }, { status: 400 })
    }

    // Return empty analytics structure - data is tracked client-side via localStorage
    const events: Array<{event: string; sessionId: string; fieldId?: string; timestamp: Date; metadata?: Record<string, any>}> = []

    // Calculate analytics
    const sessions = new Map()
    
    events.forEach(event => {
      if (!sessions.has(event.sessionId)) {
        sessions.set(event.sessionId, {
          sessionId: event.sessionId,
          events: [],
          startTime: null,
          endTime: null,
          completed: false,
          abandoned: false
        })
      }
      
      const session = sessions.get(event.sessionId)
      session.events.push(event)
      
      if (event.event === 'form_started') {
        session.startTime = event.timestamp
      }
      
      if (event.event === 'form_submitted') {
        session.completed = true
        session.endTime = event.timestamp
      }
      
      if (event.event === 'form_abandoned') {
        session.abandoned = true
        session.endTime = event.timestamp
      }
    })

    const sessionArray = Array.from(sessions.values())
    const totalStarts = sessionArray.filter(s => s.startTime).length
    const totalCompletions = sessionArray.filter(s => s.completed).length
    const totalAbandons = sessionArray.filter(s => s.abandoned).length
    
    const completionRate = totalStarts > 0 ? (totalCompletions / totalStarts) * 100 : 0
    
    // Calculate average time to complete
    const completedSessions = sessionArray.filter(s => s.completed && s.startTime && s.endTime)
    const totalCompletionTime = completedSessions.reduce((acc, session) => {
      return acc + (new Date(session.endTime!).getTime() - new Date(session.startTime!).getTime())
    }, 0)
    const averageTimeToComplete = completedSessions.length > 0 ? totalCompletionTime / completedSessions.length : 0

    // Find common drop-off fields
    const fieldDropOffs = new Map()
    sessionArray.filter(s => s.abandoned).forEach(session => {
      const lastFieldEvent = session.events
        .filter(e => e.event === 'field_focused')
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
      
      if (lastFieldEvent?.fieldId) {
        fieldDropOffs.set(
          lastFieldEvent.fieldId, 
          (fieldDropOffs.get(lastFieldEvent.fieldId) || 0) + 1
        )
      }
    })

    const commonDropOffFields = Array.from(fieldDropOffs.entries())
      .map(([fieldId, count]) => ({
        fieldId,
        dropOffRate: totalStarts > 0 ? (count / totalStarts) * 100 : 0
      }))
      .sort((a, b) => b.dropOffRate - a.dropOffRate)
      .slice(0, 5)

    // Validation errors
    const validationErrors = new Map()
    events.filter(e => e.event === 'validation_error').forEach(event => {
      const key = `${event.fieldId}_${event.metadata?.errorType || 'unknown'}`
      validationErrors.set(key, (validationErrors.get(key) || 0) + 1)
    })

    const validationErrorsArray = Array.from(validationErrors.entries())
      .map(([key, count]) => {
        const [fieldId, errorType] = key.split('_')
        return { fieldId, errorCount: count, errorType }
      })
      .sort((a, b) => b.errorCount - a.errorCount)
      .slice(0, 10)

    const analytics = {
      formId,
      formType,
      totalViews: events.filter(e => e.event === 'form_started').length,
      totalStarts,
      totalCompletions,
      totalAbandons,
      completionRate: Math.round(completionRate * 100) / 100,
      averageTimeToComplete: Math.round(averageTimeToComplete / 1000), // Convert to seconds
      commonDropOffFields,
      validationErrors: validationErrorsArray
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Form analytics fetch error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}