import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET /api/web-pages - Get web pages for a website
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

    const { searchParams } = new URL(request.url)
    const websiteId = searchParams.get('websiteId')

    if (!websiteId) {
      return NextResponse.json(
        { error: 'ID del sitio web es requerido' },
        { status: 400 }
      )
    }

    // Verificar que el sitio web pertenece a la iglesia
    const website = await db.websites.findFirst({
      where: {
        id: websiteId,
        churchId: user.churchId
      }
    })

    if (!website) {
      return NextResponse.json({ error: 'Sitio web no encontrado' }, { status: 404 })
    }

    const webPages = await db.web_pages.findMany({
      where: { websiteId },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(webPages)
  } catch (error) {
    console.error('Error fetching web pages:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/web-pages - Create new web page
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
    const { websiteId, title, slug, content, templateId, isPublished, order } = body

    if (!websiteId || !title || !slug) {
      return NextResponse.json({ error: 'Website ID, título y slug son requeridos' }, { status: 400 })
    }

    // Verify website ownership
    const website = await db.websites.findFirst({
      where: {
        id: websiteId,
        churchId: user.churchId
      }
    })

    if (!website) {
      return NextResponse.json({ error: 'Sitio web no encontrado' }, { status: 404 })
    }

    // Check if slug already exists for this website
    const existingPage = await db.web_pages.findFirst({
      where: {
        websiteId,
        slug
      }
    })

    if (existingPage) {
      return NextResponse.json({ error: 'Ya existe una página con este slug' }, { status: 409 })
    }

    const webPage = await db.web_pages.create({
      data: {
        websiteId,
        title,
        slug,
        content: content || '',
        isPublished: isPublished !== undefined ? isPublished : false,
        order: order || 0
      }
    })

    return NextResponse.json(webPage, { status: 201 })
  } catch (error) {
    console.error('Error creating web page:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
