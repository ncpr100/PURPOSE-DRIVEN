import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { broadcastToChurch } from '@/lib/sse-broadcast'
import { z } from 'zod'

const triggerSchema = z.object({
  type: z.enum(['member-added', 'donation-added', 'event-added', 'volunteer-added', 'manual-refresh']),
  data: z.any().optional()
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await prisma.users.findUnique({
      where: { email: session.user.email },
      select: { 
        id: true, 
        churchId: true, 
        role: true,
        churches: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!user?.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 400 })
    }

    const body = await request.json()
    const validatedData = triggerSchema.parse(body)

    // Fetch updated analytics data
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const [memberCount, donationCount, eventCount, volunteerCount] = await Promise.all([
      prisma.members.count({
        where: { churchId: user.churchId }
      }),
      prisma.donation.count({
        where: { 
          members: { churchId: user.churchId },
          donationDate: { gte: startOfDay }
        }
      }),
      prisma.event.count({
        where: { 
          churchId: user.churchId,
          startDate: { gte: startOfDay }
        }
      }),
      prisma.volunteer.count({
        where: { 
          members: { churchId: user.churchId }
        }
      })
    ])

    const analyticsData = {
      memberCount,
      donationCount,
      eventCount,
      volunteerCount,
      lastUpdated: now.toISOString(),
      changes: {
        members: validatedData.type === 'member-added' ? 1 : 0,
        donations: validatedData.type === 'donation-added' ? 1 : 0,
        events: validatedData.type === 'event-added' ? 1 : 0,
        volunteers: validatedData.type === 'volunteer-added' ? 1 : 0
      }
    }

    // Broadcast real-time update to all church users
    const realtimeMessage = {
      id: `analytics-${Date.now()}`,
      type: 'analytics-update',
      data: {
        analytics: analyticsData,
        eventType: validatedData.type,
        metadata: validatedData.data
      },
      userId: user.id,
      churchId: user.churchId,
      timestamp: Date.now()
    }

    // Send to all church members
    broadcastToChurch(user.churchId, realtimeMessage)

    console.log(`📊 Analytics update broadcast to church ${user.church?.name}: ${validatedData.type}`)

    return NextResponse.json({
      success: true,
      analytics: analyticsData,
      eventType: validatedData.type,
      broadcastTime: now.toISOString()
    })

  } catch (error) {
    console.error('Error triggering analytics update:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos de entrada inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}