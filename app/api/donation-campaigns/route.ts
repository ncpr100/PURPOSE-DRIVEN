
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET all donation campaigns for a church
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.churchId) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    
    const status = searchParams.get('status')
    const isPublic = searchParams.get('public') === 'true'

    const where: any = {
      churchId: session.user.churchId
    }

    if (status) {
      where.status = status
    }
    if (searchParams.has('public')) {
      where.isPublic = isPublic
    }

    const [campaigns, total] = await Promise.all([
      prisma.donation_campaigns.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              donations: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.donation_campaigns.count({ where })
    ])

    return NextResponse.json({
      campaigns,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// CREATE a new donation campaign
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.churchId) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Sin permisos' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      name,
      description,
      goalAmount,
      goal,
      categoryId,
      isPublic = true,
      startDate,
      endDate
    } = body

    const campaignName = name || title
    const campaignGoal = goal || goalAmount

    if (!campaignName) {
      return NextResponse.json(
        { message: 'El título es requerido' },
        { status: 400 }
      )
    }

    if (!campaignGoal || campaignGoal <= 0) {
      return NextResponse.json(
        { message: 'La meta de donación es requerida y debe ser mayor a 0' },
        { status: 400 }
      )
    }

    // Verify category exists if provided
    if (categoryId) {
      const category = await prisma.donationCategory.findUnique({
        where: { 
          id: categoryId,
          churchId: session.user.churchId 
        }
      })

      if (!category) {
        return NextResponse.json(
          { message: 'Categoría no encontrada' },
          { status: 404 }
        )
      }
    }

    const campaign = await prisma.donation_campaigns.create({
      data: {
        name: campaignName,
        description,
        goal: parseFloat(campaignGoal.toString()),
        categoryId,
        isPublic,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        churchId: session.user.churchId
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(campaign, { status: 201 })

  } catch (error) {
    console.error('Error creating campaign:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
