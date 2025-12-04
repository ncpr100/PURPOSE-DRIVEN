

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// POST - Check out a child
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.churchId) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Sin permisos' }, { status: 403 })
    }

    // Parse request body for pickup verification data
    const body = await request.json().catch(() => ({}))
    const { securityPin, parentPhoto, notes } = body

    const children_check_ins = await db.children_check_ins.findFirst({
      where: {
        id: params.id,
        churchId: session.user.churchId
      }
    })

    if (!children_check_ins) {
      return NextResponse.json(
        { message: 'Check-in de niño no encontrado' },
        { status: 404 }
      )
    }

    if (children_check_ins.checkedOut) {
      return NextResponse.json(
        { message: 'El niño ya fue retirado' },
        { status: 400 }
      )
    }

    // Create pickup attempt log entry
    const pickupAttempt = {
      timestamp: new Date().toISOString(),
      authorizedBy: session.user.id,
      authorizedByName: session.user.name || session.user.email || 'Unknown',
      securityPinProvided: !!securityPin,
      securityPinValid: securityPin === children_check_ins.securityPin,
      parentPhotoProvided: !!parentPhoto,
      notes: notes || 'Checkout authorized by staff',
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    }

    // Update pickup attempts log
    const currentAttempts = Array.isArray(children_check_ins.pickupAttempts) ? children_check_ins.pickupAttempts : []
    const updatedAttempts = [...currentAttempts, pickupAttempt]

    const updatedCheckIn = await db.children_check_ins.update({
      where: { id: params.id },
      data: {
        checkedOut: true,
        checkedOutAt: new Date(),
        checkedOutBy: session.user.id,
        pickupAttempts: updatedAttempts as any
      },
      include: {
        event: true
      }
    })

    return NextResponse.json(updatedCheckIn)

  } catch (error) {
    console.error('Error checking out child:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

