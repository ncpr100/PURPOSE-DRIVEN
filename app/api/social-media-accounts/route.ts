import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'

export const dynamic = 'force-dynamic'

// GET /api/social-media-accounts - Get all social media accounts
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

    const accounts = await db.social_media_accounts.findMany({
      where: { churchId: user.churchId },
      select: {
        id: true,
        platform: true,
        username: true,
        displayName: true,
        isActive: true,
        lastSync: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(accounts)
  } catch (error) {
    console.error('Error fetching social media accounts:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/social-media-accounts - Create social media account
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
    const { platform, accountId, username, displayName, accessToken, refreshToken, tokenExpiresAt, accountData } = body

    if (!platform || !accountId) {
      return NextResponse.json({ error: 'Plataforma y accountId son requeridos' }, { status: 400 })
    }

    // Check if account already exists
    const existing = await db.social_media_accounts.findFirst({
      where: { 
        churchId: user.churchId,
        platform,
        username
      }
    })

    if (existing) {
      return NextResponse.json({ error: 'Cuenta ya existe para esta plataforma' }, { status: 409 })
    }

    const account = await db.social_media_accounts.create({
      data: {
        id: nanoid(),
        platform,
        accountId,
        username,
        displayName,
        accessToken,
        refreshToken,
        tokenExpiresAt: tokenExpiresAt ? new Date(tokenExpiresAt) : null,
        accountData: accountData ? JSON.stringify(accountData) : null,
        isActive: true,
        churchId: user.churchId,
        connectedBy: user.id,
        lastSync: new Date()
      },
      select: {
        id: true,
        platform: true,
        username: true,
        displayName: true,
        isActive: true,
        createdAt: true
      }
    })

    return NextResponse.json(account, { status: 201 })
  } catch (error) {
    console.error('Error creating social media account:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
