import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET /api/social-media-accounts/[id] - Get specific social media account
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

    const account = await db.social_media_accounts.findUnique({
      where: {
        id: params.id,
        churchId: user.churchId
      },
      select: {
        id: true,
        platform: true,
        username: true,
        displayName: true,
        profilePicture: true,
        isActive: true,
        tokenExpiresAt: true,
        lastSync: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!account) {
      return NextResponse.json({ error: 'Cuenta no encontrada' }, { status: 404 })
    }

    return NextResponse.json(account)
  } catch (error) {
    console.error('Error fetching social media account:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/social-media-accounts/[id] - Update social media account
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

    const body = await request.json()
    const { isActive, accessToken, refreshToken, tokenExpiresAt, accountData } = body

    // Verify account ownership
    const existing = await db.social_media_accounts.findFirst({
      where: { id: params.id, churchId: user.churchId }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Cuenta no encontrada' }, { status: 404 })
    }

    const updated = await db.social_media_accounts.update({
      where: { id: params.id },
      data: {
        ...(typeof isActive === 'boolean' && { isActive }),
        ...(accessToken && { accessToken }),
        ...(refreshToken && { refreshToken }),
        ...(tokenExpiresAt && { tokenExpiresAt: new Date(tokenExpiresAt) }),
        ...(accountData && { accountData: JSON.stringify(accountData) }),
        lastSync: new Date()
      },
      select: {
        id: true,
        platform: true,
        username: true,
        displayName: true,
        isActive: true,
        tokenExpiresAt: true,
        lastSync: true,
        updatedAt: true
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating social media account:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
