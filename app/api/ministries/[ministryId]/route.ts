import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET single ministry
export async function GET(
  request: NextRequest,
  { params }: { params: { ministryId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.churchId) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    const ministry = await db.ministries.findFirst({
      where: {
        id: params.ministryId,
        churchId: session.user.churchId
      }
    })

    if (!ministry) {
      return NextResponse.json({ message: 'Ministerio no encontrado' }, { status: 404 })
    }

    return NextResponse.json(ministry)

  } catch (error) {
    console.error('Error fetching ministry:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// UPDATE ministry (full update)
export async function PUT(
  request: NextRequest,
  { params }: { params: { ministryId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.churchId) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Sin permisos' }, { status: 403 })
    }

    const { name, description, isActive } = await request.json()

    if (!name) {
      return NextResponse.json(
        { message: 'El nombre del ministerio es requerido' },
        { status: 400 }
      )
    }

    // Verify ministry belongs to church
    const existing = await db.ministries.findFirst({
      where: {
        id: params.ministryId,
        churchId: session.user.churchId
      }
    })

    if (!existing) {
      return NextResponse.json({ message: 'Ministerio no encontrado' }, { status: 404 })
    }

    const ministry = await db.ministries.update({
      where: { id: params.ministryId },
      data: {
        name,
        description,
        isActive: isActive !== undefined ? isActive : existing.isActive,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(ministry)

  } catch (error) {
    console.error('Error updating ministry:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PATCH ministry (partial update - typically for toggling isActive)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { ministryId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.churchId) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Sin permisos' }, { status: 403 })
    }

    const body = await request.json()

    // Verify ministry belongs to church
    const existing = await db.ministries.findFirst({
      where: {
        id: params.ministryId,
        churchId: session.user.churchId
      }
    })

    if (!existing) {
      return NextResponse.json({ message: 'Ministerio no encontrado' }, { status: 404 })
    }

    const ministry = await db.ministries.update({
      where: { id: params.ministryId },
      data: {
        ...body,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(ministry)

  } catch (error) {
    console.error('Error patching ministry:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE ministry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { ministryId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.churchId) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Sin permisos' }, { status: 403 })
    }

    // Verify ministry belongs to church
    const existing = await db.ministries.findFirst({
      where: {
        id: params.ministryId,
        churchId: session.user.churchId
      }
    })

    if (!existing) {
      return NextResponse.json({ message: 'Ministerio no encontrado' }, { status: 404 })
    }

    // Check if ministry is in use (has members or volunteers)
    const [memberCount, volunteerCount] = await Promise.all([
      db.member.count({
        where: {
          churchId: session.user.churchId,
          ministryInterests: {
            has: existing.name
          }
        }
      }),
      db.volunteer.count({
        where: {
          churchId: session.user.churchId,
          skills: {
            has: existing.name
          }
        }
      })
    ])

    if (memberCount > 0 || volunteerCount > 0) {
      return NextResponse.json(
        { 
          message: `No se puede eliminar. Este ministerio está siendo usado por ${memberCount} miembro(s) y ${volunteerCount} voluntario(s). Considera desactivarlo en lugar de eliminarlo.`,
          inUse: true,
          memberCount,
          volunteerCount
        },
        { status: 409 }
      )
    }

    await db.ministries.delete({
      where: { id: params.ministryId }
    })

    return NextResponse.json({ 
      message: 'Ministerio eliminado exitosamente',
      success: true 
    })

  } catch (error) {
    console.error('Error deleting ministry:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
