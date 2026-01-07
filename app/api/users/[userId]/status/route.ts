import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

/**
 * GET /api/users/[userId]/status
 * Get user status including first login flag
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Users can only check their own status
    if (session.user.id !== params.userId) {
      return NextResponse.json(
        { error: 'Acceso denegado' },
        { status: 403 }
      )
    }

    const user = await db.users.findUnique({
      where: { id: params.userId },
      select: {
        id: true,
        isFirstLogin: true,
        lastPasswordChange: true,
        isActive: true,
        emailVerified: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      isFirstLogin: user.isFirstLogin || false,
      lastPasswordChange: user.lastPasswordChange,
      isActive: user.isActive,
      emailVerified: user.emailVerified
    })

  } catch (error) {
    console.error('Error fetching user status:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
