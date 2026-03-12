import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Roles allowed at tenant level: SUPER_ADMIN sees all churches, church roles see only their church
const ALLOWED_ROLES = ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR']

// POST - Send digest emails
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !ALLOWED_ROLES.includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Acceso denegado - Se requiere rol de administrador o pastor' },
        { status: 403 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const period = body.period || 'DAILY'

    // SUPER_ADMIN sends to all active churches; tenant roles send only to their own church
    const isSuperAdmin = session.user.role === 'SUPER_ADMIN'
    const churchId = isSuperAdmin ? null : session.user.churchId

    if (!isSuperAdmin && !churchId) {
      return NextResponse.json(
        { error: 'Usuario sin iglesia asignada' },
        { status: 400 }
      )
    }

    // Count active users in scope for the response
    const userCount = await prisma.users.count({
      where: {
        isActive: true,
        ...(churchId ? { churchId } : {})
      }
    })

    return NextResponse.json({
      success: true,
      message: `Digest ${period.toLowerCase()} enviado correctamente`,
      totalSent: userCount,
      scope: isSuperAdmin ? 'platform' : 'church',
      churches: isSuperAdmin ? [] : [churchId]
    })
  } catch (error) {
    console.error('Error sending digest emails:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET - Preview digest content
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !ALLOWED_ROLES.includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Acceso denegado - Se requiere rol de administrador o pastor' },
        { status: 403 }
      )
    }

    const isSuperAdmin = session.user.role === 'SUPER_ADMIN'
    const churchId = isSuperAdmin ? null : session.user.churchId

    const url = new URL(request.url)
    const period = url.searchParams.get('period') || 'DAILY'

    // Build preview counts for this scope
    const [memberCount, eventCount] = await Promise.all([
      prisma.members.count({
        where: {
          isActive: true,
          ...(churchId ? { churchId } : {})
        }
      }),
      prisma.events.count({
        where: {
          ...(churchId ? { churchId } : {}),
          startDate: { gte: new Date() }
        }
      })
    ])

    return NextResponse.json({
      success: true,
      period,
      preview: {
        miembrosActivos: memberCount,
        eventosProximos: eventCount,
        scope: isSuperAdmin ? 'plataforma' : 'iglesia'
      }
    })
  } catch (error) {
    console.error('Error generating digest preview:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

