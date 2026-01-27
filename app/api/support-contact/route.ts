import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// POST /api/support-contact - Submit support contact request
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

    // Create support request
    const supportRequest = await db.support_requests.create({
      data: {
        subject,
        message,
        category: category || 'general',
        priority: priority || 'medium',
        status: 'open',
        contactEmail: contactEmail || user.email,
        contactPhone,
        churchId: user.churchId,
        userId: user.id,
        submittedAt: new Date()
      }
    })

    // Log the support request for admin tracking
    console.log('Support request submitted:', {
      id: supportRequest.id,
      churchId: user.churchId,
      userId: user.id,
      subject: subject,
      category: category || 'general',
      priority: priority || 'medium',
      userEmail: user.email,
      churchName: user.churches?.name,
      timestamp: new Date().toISOString()
    })

    // Enhanced success response
    return NextResponse.json({
      success: true,
      message: 'Solicitud de soporte enviada exitosamente',
      supportRequest: {
        id: supportRequest.id,
        subject: supportRequest.subject,
        category: supportRequest.category,
        priority: supportRequest.priority,
        status: supportRequest.status,
        submittedAt: supportRequest.submittedAt
      }
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

    const supportRequests = await db.support_requests.findMany({
      where: {
        churchId: user.churchId,
        userId: user.id
      },
      orderBy: { submittedAt: 'desc' },
      take: 50
    })

    return NextResponse.json({
      success: true,
      requests: supportRequests
    })
  } catch (error) {
    console.error('Error fetching support requests:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
