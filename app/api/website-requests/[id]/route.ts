import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET /api/website-requests/[id] - Get specific website request
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const websiteRequest = await db.website_requests.findFirst({
      where: {
        id: params.id,
        churchId: user.churchId
      },
      include: {
        users: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    if (!websiteRequest) {
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(websiteRequest)
  } catch (error) {
    console.error('Error fetching website request:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/website-requests/[id] - Update website request
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Check permissions for updates
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(user.role)) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    // Verify request ownership
    const existing = await db.website_requests.findFirst({
      where: { id: params.id, churchId: user.churchId }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
    }

    const body = await request.json()
    const { status, priority, adminNotes, estimatedPrice, estimatedCompletion, assignedTo } = body

    const updated = await db.website_requests.update({
      where: { id: params.id },
      data: {
        status: status || existing.status,
        priority: priority || existing.priority,
        adminNotes: adminNotes !== undefined ? adminNotes : existing.adminNotes,
        estimatedPrice: estimatedPrice !== undefined ? estimatedPrice : existing.estimatedPrice,
        estimatedCompletion: estimatedCompletion !== undefined ? estimatedCompletion : existing.estimatedCompletion,
        assignedTo: assignedTo !== undefined ? assignedTo : existing.assignedTo,
        updatedAt: new Date()
      },
      include: {
        users: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating website request:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/website-requests/[id] - Delete website request
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Check permissions
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA'].includes(user.role)) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    // Verify request ownership
    const existing = await db.website_requests.findFirst({
      where: { id: params.id, churchId: user.churchId }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
    }

    await db.website_requests.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true, message: 'Solicitud eliminada exitosamente' })
  } catch (error) {
    console.error('Error deleting website request:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
