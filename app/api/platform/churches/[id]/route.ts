

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Solo SUPER_ADMIN puede acceder a gestión de plataforma
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 })
    }

    const churchId = params.id

    // Obtener iglesia con datos completos
    const church = await db.churches.findUnique({
      where: { id: churchId },
      include: {
        _count: {
          select: {
            users: true,
            members: true,
            events: true,
            donations: true
          }
        }
      }
    })

    if (!church) {
      return NextResponse.json(
        { message: 'Iglesia no encontrada' },
        { status: 404 }
      )
    }

    // Calcular estadísticas adicionales
    const [totalDonations, activeUsers] = await Promise.all([
      db.donations.aggregate({
        where: { churchId: church.id },
        _sum: { amount: true }
      }),
      db.users.count({
        where: { churchId: church.id, isActive: true }
      })
    ])

    const churchWithStats = {
      ...church,
      stats: {
        totalMembers: church._count.members,
        activeUsers,
        totalEvents: church._count.events,
        totalDonations: totalDonations._sum.amount || 0
      }
    }

    return NextResponse.json({
      church: churchWithStats
    })

  } catch (error) {
    console.error('Error fetching church details:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 })
    }

    const churchId = params.id
    const body = await request.json()
    
    const {
      name,
      address,
      phone,
      email,
      website,
      founded,
      description,
      isActive
    } = body

    // Verificar que la iglesia existe
    const existingChurch = await db.churches.findUnique({
      where: { id: churchId }
    })

    if (!existingChurch) {
      return NextResponse.json(
        { message: 'Iglesia no encontrada' },
        { status: 404 }
      )
    }

    // Actualizar iglesia
    const updatedChurch = await db.churches.update({
      where: { id: churchId },
      data: {
        name: name || existingChurch.name,
        address: address !== undefined ? address : existingChurch.address,
        phone: phone !== undefined ? phone : existingChurch.phone,
        email: email || existingChurch.email,
        website: website !== undefined ? website : existingChurch.website,
        founded: founded ? new Date(founded) : existingChurch.founded,
        description: description !== undefined ? description : existingChurch.description,
        isActive: isActive !== undefined ? isActive : existingChurch.isActive
      },
      include: {
        _count: {
          select: {
            users: true,
            members: true,
            events: true,
            donations: true
          }
        }
      }
    })

    // Log de actividad: crear notificación y entregas para usuarios activos de la iglesia
    const activityNotification = await db.notification.create({
      data: {
        title: 'Iglesia actualizada',
        message: `Iglesia "${updatedChurch.name}" actualizada por SUPER_ADMIN`,
        type: 'info',
        churchId: updatedChurch.id
      }
    })

    const churchUsers = await db.users.findMany({
      where: { churchId: updatedChurch.id, isActive: true },
      select: { id: true }
    })

    if (churchUsers.length > 0) {
      await db.notificationDelivery.createMany({
        data: churchUsers.map(u => ({
          notificationId: activityNotification.id,
          userId: u.id,
          deliveryMethod: 'in-app',
          deliveryStatus: 'PENDING',
          deliveredAt: new Date()
        }))
      })
    }

    return NextResponse.json({
      message: 'Iglesia actualizada exitosamente',
      church: updatedChurch
    })

  } catch (error) {
    console.error('Error updating church:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 })
    }

    const churchId = params.id

    // Verificar que la iglesia existe
    const existingChurch = await db.churches.findUnique({
      where: { id: churchId },
      include: {
        _count: {
          select: {
            users: true,
            members: true
          }
        }
      }
    })

    if (!existingChurch) {
      return NextResponse.json(
        { message: 'Iglesia no encontrada' },
        { status: 404 }
      )
    }

    // En lugar de eliminar, desactivar la iglesia para preservar datos
    const deactivatedChurch = await db.churches.update({
      where: { id: churchId },
      data: { isActive: false }
    })

    // También desactivar usuarios asociados
    await db.users.updateMany({
      where: { churchId: churchId },
      data: { isActive: false }
    })

    // Log de actividad: crear notificación y entregas para usuarios activos de la iglesia
    const activityNotification = await db.notification.create({
      data: {
        title: 'Iglesia desactivada',
        message: `Iglesia "${existingChurch.name}" desactivada por SUPER_ADMIN`,
        type: 'warning',
        churchId: existingChurch.id
      }
    })

    const churchUsers = await db.users.findMany({
      where: { churchId: existingChurch.id, isActive: true },
      select: { id: true }
    })

    if (churchUsers.length > 0) {
      await db.notificationDelivery.createMany({
        data: churchUsers.map(u => ({
          notificationId: activityNotification.id,
          userId: u.id,
          deliveryMethod: 'in-app',
          deliveryStatus: 'PENDING',
          deliveredAt: new Date()
        }))
      })
    }

    return NextResponse.json({
      message: 'Iglesia desactivada exitosamente',
      church: deactivatedChurch
    })

  } catch (error) {
    console.error('Error deactivating church:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

