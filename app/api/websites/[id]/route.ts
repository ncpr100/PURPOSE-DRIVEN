import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET /api/websites/[id] - Get specific website
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

    const website = await db.websites.findFirst({
      where: {
        id: params.id,
        churchId: user.churchId
      },
      include: {
        web_pages: {
          orderBy: { order: 'asc' }
        },
        funnels: true,
        _count: {
          web_pages: true,
          funnels: true
        }
      }
    })

    if (!website) {
      return NextResponse.json(
        { error: 'Sitio web no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(website)
  } catch (error) {
    console.error('Error fetching website:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/websites/[id] - Update website
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

    // Check permissions
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(user.role)) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    // Verify website ownership
    const existing = await db.websites.findFirst({
      where: { id: params.id, churchId: user.churchId }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Sitio web no encontrado' }, { status: 404 })
    }

    const body = await request.json()
    const { name, domain, subdomain, description, type, isActive, settings } = body

    const updated = await db.websites.update({
      where: { id: params.id },
      data: {
        name: name || existing.name,
        domain: domain || existing.domain,
        subdomain: subdomain || existing.subdomain,
        description: description || existing.description,
        type: type || existing.type,
        isActive: isActive !== undefined ? isActive : existing.isActive,
        settings: settings ? JSON.stringify(settings) : existing.settings,
        updatedAt: new Date()
      },
      include: {
        _count: {
          web_pages: true,
          funnels: true
        }
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating website:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/websites/[id] - Delete website
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

    // Verify website ownership
    const existing = await db.websites.findFirst({
      where: { id: params.id, churchId: user.churchId }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Sitio web no encontrado' }, { status: 404 })
    }

    // Check if website has content
    const pageCount = await db.web_pages.count({
      where: { websiteId: params.id }
    })

    if (pageCount > 0) {
      return NextResponse.json({ 
        error: 'No se puede eliminar un sitio web que tiene páginas. Elimina las páginas primero.' 
      }, { status: 400 })
    }

    await db.websites.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true, message: 'Sitio web eliminado exitosamente' })
  } catch (error) {
    console.error('Error deleting website:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
