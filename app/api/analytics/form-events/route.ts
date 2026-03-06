import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'

// Store form analytics events
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { formId, formType, event, fieldId, sessionId, metadata, churchId } = body

    // Create form analytics event record
    await db.form_analytics_events.create({
      data: {
        id: nanoid(),
        formId,
        formType,
        event,
        fieldId,
        sessionId,
        userId: session.user.id,
        churchId: session.user.churchId,
        metadata: metadata || {},
        timestamp: new Date()
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Form analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}