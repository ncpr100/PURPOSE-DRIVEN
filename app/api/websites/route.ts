import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'

export const dynamic = 'force-dynamic'

// GET /api/websites - Get all websites for church
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

    const websites = await db.websites.findMany({
      where: { churchId: user.churchId },
      include: {
        _count: {
          select: {
            web_pages: true,
            funnels: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(websites)
  } catch (error) {
    console.error('Error fetching websites:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/websites - Create new website
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
    const { name, domain, subdomain, description, type = 'institutional', settings = {} } = body

    if (!name) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
    }

    // Check for existing domain/subdomain
    if (domain) {
      const existingDomain = await db.websites.findFirst({
        where: { domain, id: { not: undefined } }
      })
      
      if (existingDomain) {
        return NextResponse.json(
          { error: 'Ya existe un sitio web con este dominio' },
          { status: 409 }
        )
      }
    }

    if (subdomain) {
      const existingSubdomain = await db.websites.findFirst({
        where: { subdomain, id: { not: undefined } }
      })
      
      if (existingSubdomain) {
        return NextResponse.json(
          { error: 'Ya existe un sitio web con este subdominio' },
          { status: 409 }
        )
      }
    }

    const website = await db.websites.create({
      data: {
        id: nanoid(),
        name,
        domain: domain || null,
        subdomain: subdomain || null,
        description: description || null,
        type,
        isActive: true,
        settings: JSON.stringify(settings),
        churchId: user.churchId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        _count: {
          select: {
            web_pages: true,
            funnels: true
          }
        }
      }
    })

    return NextResponse.json(website, { status: 201 })
  } catch (error) {
    console.error('Error creating website:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un sitio web con estos datos únicos' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
