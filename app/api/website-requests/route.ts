import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET /api/website-requests - Get all website requests
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

    const url = new URL(request.url)
    const status = url.searchParams.get('status')

    // Build where clause
    const whereClause: any = {
      churchId: user.churchId
    }

    if (status) {
      whereClause.status = status
    }

    const requests = await db.website_requests.findMany({
      where: whereClause,
      include: {
        users: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(requests)
  } catch (error) {
    console.error('Error fetching website requests:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/website-requests - Create new website request
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
    const {
      requestType,
      projectName,
      description,
      features,
      timeline,
      budget,
      priority,
      contactEmail,
      contactPhone,
      additionalNotes
    } = body

    // Validaciones básicas
    if (!requestType || !projectName || !description) {
      return NextResponse.json(
        { error: 'Campos requeridos faltantes' },
        { status: 400 }
      )
    }

    // Calcular prioridad y precio estimado basado en el tipo
    let calculatedPrice = 599 // Precio base
    let estimatedDays = 14 // Días base

    switch (requestType) {
      case 'basic':
        calculatedPrice = 599
        estimatedDays = 14
        break
      case 'professional':
        calculatedPrice = 1299
        estimatedDays = 21
        break
      case 'enterprise':
        calculatedPrice = 2499
        estimatedDays = 35
        break
      case 'custom':
        calculatedPrice = budget ? parseInt(budget) : 1999
        estimatedDays = timeline ? parseInt(timeline) : 28
        break
    }

    const websiteRequest = await db.website_requests.create({
      data: {
        requestType,
        projectName,
        description,
        features: features ? JSON.stringify(features) : null,
        timeline,
        budget,
        priority: priority || 'medium',
        status: 'pending',
        contactEmail: contactEmail || user.email,
        contactPhone,
        additionalNotes,
        estimatedPrice: calculatedPrice,
        estimatedDays,
        churchId: user.churchId,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        users: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    // Log the request for admin tracking
    console.log('Website request submitted:', {
      id: websiteRequest.id,
      requestType,
      projectName,
      churchId: user.churchId,
      userId: user.id,
      estimatedPrice: calculatedPrice,
      estimatedDays,
      priority: priority || 'medium'
    })

    return NextResponse.json({
      success: true,
      message: 'Solicitud de sitio web enviada exitosamente',
      request: websiteRequest
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating website request:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
