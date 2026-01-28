import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET /api/qualification-settings - Get qualification settings
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

    // Get qualification settings
    const settings = await db.church_qualification_settings.findMany({
      where: {
        churchId: user.churchId
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ settings, success: true })
  } catch (error) {
    console.error('Error fetching qualification settings:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/qualification-settings - Create qualification setting
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

    // Check permissions
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(user.role)) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, criteria, isActive } = body

    if (!name || !description) {
      return NextResponse.json({ error: 'Nombre y descripción son requeridos' }, { status: 400 })
    }

    const setting = await db.church_qualification_settings.create({
      data: {
        name,
        description,
        criteria: criteria || {},
        isActive: isActive !== undefined ? isActive : true,
        churchId: user.churchId,
        createdById: user.id
      }
    })

    return NextResponse.json({ setting, success: true }, { status: 201 })
  } catch (error) {
    console.error('Error creating qualification setting:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/qualification-settings - Update qualification setting
export async function PUT(request: NextRequest) {
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
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(user.role)) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    const body = await request.json()
    const { id, name, description, criteria, isActive } = body

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 })
    }

    // Verify ownership
    const existing = await db.church_qualification_settings.findFirst({
      where: { id, churchId: user.churchId }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Configuración no encontrada' }, { status: 404 })
    }

    const updated = await db.church_qualification_settings.update({
      where: { id },
      data: {
        name: name || existing.name,
        description: description || existing.description,
        criteria: criteria !== undefined ? criteria : existing.criteria,
        isActive: isActive !== undefined ? isActive : existing.isActive,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ setting: updated, success: true })
  } catch (error) {
    console.error('Error updating qualification setting:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
