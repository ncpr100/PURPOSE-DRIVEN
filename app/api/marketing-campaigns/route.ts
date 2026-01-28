import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'
import { nanoid } from 'nanoid'

export const dynamic = 'force-dynamic'

// GET - Fetch marketing campaigns
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const campaigns = await prisma.marketing_campaigns.findMany({
      where: {
        churchId: session.user.churchId
      },
      include: {
        marketing_campaign_posts: {
          select: {
            id: true,
            status: true
          }
        },
        social_media_posts: {
          select: {
            id: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(campaigns)
  } catch (error) {
    console.error('Error fetching marketing campaigns:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// POST - Create marketing campaign
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, objectives, startDate, platforms, targetAudience, budget, currency, endDate, status, metrics, tags } = body
    
    const campaign = await prisma.marketing_campaigns.create({
      data: {
        id: nanoid(),
        name,
        description,
        objectives,
        startDate: startDate ? new Date(startDate) : new Date(),
        platforms: platforms || 'FACEBOOK,INSTAGRAM',
        managerId: session.user.id,
        churchId: session.user.churchId,
        targetAudience,
        budget,
        currency: currency || 'USD',
        endDate: endDate ? new Date(endDate) : null,
        status: status || 'DRAFT',
        metrics,
        tags,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    
    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    console.error('Error creating marketing campaign:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
