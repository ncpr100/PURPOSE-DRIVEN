import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { subDays } from 'date-fns'
import { nanoid } from 'nanoid'

export const dynamic = 'force-dynamic'

// GET /api/social-media-metrics - Get social media metrics
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
    const days = parseInt(url.searchParams.get('days') || '30')
    const platform = url.searchParams.get('platform')

    const startDate = subDays(new Date(), days)
    const endDate = new Date()

    // Build where clause
    const whereClause: any = {
      churchId: user.churchId,
      date: {
        gte: startDate,
        lte: endDate
      }
    }

    if (platform) {
      whereClause.platform = platform
    }

    const metrics = await db.social_media_metrics.findMany({
      where: whereClause,
      include: {
        social_media_accounts: {
          select: {
            id: true,
            platform: true,
            username: true,
            displayName: true
          }
        }
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching social media metrics:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/social-media-metrics - Create social media metrics
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
    const { platform, accountId, date, metrics } = body

    if (!platform || !accountId || !date || !metrics) {
      return NextResponse.json({ error: 'Plataforma, cuenta, fecha y métricas son requeridos' }, { status: 400 })
    }

    // Verify account ownership
    const account = await db.social_media_accounts.findFirst({
      where: { id: accountId, churchId: user.churchId }
    })

    if (!account) {
      return NextResponse.json({ error: 'Cuenta no encontrada' }, { status: 404 })
    }

    // Store each metric as a separate row (schema uses metricType + value pattern)
    const metricDate = new Date(date)
    const createdMetrics = []

    // Process each metric type (followers, engagement, reach, etc.)
    for (const [metricType, value] of Object.entries(metrics)) {
      if (value !== null && value !== undefined) {
        // Check if metric already exists
        const existing = await db.social_media_metrics.findFirst({
          where: {
            accountId,
            metricType,
            date: metricDate,
            periodType: 'DAILY'
          }
        })

        if (existing) {
          // Update existing metric
          const updated = await db.social_media_metrics.update({
            where: { id: existing.id },
            data: {
              value: Number(value),
              collectedAt: new Date()
            }
          })
          createdMetrics.push(updated)
        } else {
          // Create new metric
          const newMetric = await db.social_media_metrics.create({
            data: {
              id: nanoid(),
              platform,
              accountId,
              churchId: user.churchId,
              metricType,
              value: Number(value),
              date: metricDate,
              periodType: 'DAILY'
            }
          })
          createdMetrics.push(newMetric)
        }
      }
    }

    return NextResponse.json({ metrics: createdMetrics, count: createdMetrics.length }, { status: 201 })
  } catch (error) {
    console.error('Error creating social media metrics:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
