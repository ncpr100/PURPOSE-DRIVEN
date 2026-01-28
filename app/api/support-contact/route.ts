import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// POST /api/support-contact - Submit support contact request
// NOTE: Stub implementation - support_requests model not yet implemented in schema
// TODO: Create support_requests model for ticket system
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await db.users.findUnique({
      where: { id: session.user.id },
      include: { churches: true }
    })

    if (!user?.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 403 })
    }

    const body = await request.json()
    const { subject, message, category, priority, contactEmail, contactPhone } = body

    if (!subject || !message) {
      return NextResponse.json({ error: 'Asunto y mensaje son requeridos' }, { status: 400 })
    }

    // STUB: Log support request until model implemented
    console.log('Support request received (NOT SAVED - model unimplemented):', {
      subject,
      message,
      category: category || 'general',
      priority: priority || 'medium',
      contactEmail: contactEmail || user.email,
      contactPhone,
      churchId: user.churchId,
      userId: user.id,
      submittedAt: new Date()
    })

    // Return stub success response
    const stubResponse = {
      id: `stub-${Date.now()}`,
      subject,
      message,
      category: category || 'general',
      priority: priority || 'medium',
      status: 'pending',
      contactEmail: contactEmail || user.email,
      contactPhone,
      submittedAt: new Date().toISOString()
    }

    // Enhanced success response
    return NextResponse.json({
      success: true,
      message: 'Solicitud de soporte enviada exitosamente (modo stub - no persistente)',
      supportRequest: stubResponse
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating support request:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET /api/support-contact - Get user's support requests
// NOTE: Stub implementation - returns empty array until model implemented
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await db.users.findUnique({
      where: { id: session.user.id },
      include: { churches: true }
    })

    if (!user?.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 403 })
    }

    // STUB: Return empty array until support_requests model implemented
    console.log('Support requests GET called (stub - returning empty array)')

    return NextResponse.json({
      success: true,
      requests: [],
      message: 'Support requests feature not yet implemented'
    })
  } catch (error) {
    console.error('Error fetching support requests:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
