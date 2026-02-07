/**
 * SOCIAL MEDIA OAUTH CONNECTION ENDPOINT
 * Provides one-click OAuth URLs for platform connections
 * GoHighLevel-style user experience
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { SocialOAuth } from '@/lib/social-media/oauth-engine'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'

// GET /api/social-media/connect?platform=FACEBOOK
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')?.toUpperCase()
    
    if (!platform || !['FACEBOOK', 'INSTAGRAM', 'YOUTUBE'].includes(platform)) {
      return NextResponse.json(
        { error: 'Plataforma no válida. Use: FACEBOOK, INSTAGRAM, YOUTUBE' },
        { status: 400 }
      )
    }

    try {
      // Check if account already exists for this church
      const existingAccount = await db.social_media_accounts.findFirst({
        where: {
          churchId: session.user.churchId,
          platform,
          isActive: true
        }
      })

      if (existingAccount) {
        return NextResponse.json({
          error: 'Ya tienes una cuenta conectada para esta plataforma',
          accountId: existingAccount.id
        }, { status: 409 })
      }

      // Generate one-click OAuth URL - Enterprise SaaS Performance
      const startTime = Date.now()
      const authUrl = SocialOAuth.getConnectUrl(platform, session.user.churchId)
      const duration = Date.now() - startTime
      
      // Performance monitoring for enterprise scaling
      if (duration > 1000) {
        console.warn(`🚨 OAuth URL generation took ${duration}ms for ${platform}`)
      }
      
      return NextResponse.json({
        authUrl,
        platform,
        message: `URL de autorización generada para ${platform}`,
        performance: { duration }
      })

    } catch (error) {
      console.error('OAuth URL generation error:', error)
      return NextResponse.json(
        { error: 'Error generando URL de autorización' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Social media connect error:', error)
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/social-media/connect - Manual token entry (fallback)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { platform, accessToken, accountData } = body

    if (!platform || !accessToken) {
      return NextResponse.json(
        { error: 'Plataforma y token de acceso requeridos' },
        { status: 400 }
      )
    }

    // Check permissions
    const user = await db.users.findUnique({
      where: { id: session.user.id }
    })

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(user?.role || '')) {
      return NextResponse.json(
        { error: 'Permisos insuficientes para conectar cuentas sociales' },
        { status: 403 }
      )
    }

    // Store manually entered tokens (for advanced users)
    const accountId = accountData?.id || 'manual_' + Date.now()
    const account = await db.social_media_accounts.create({
      data: {
        id: nanoid(),
        churchId: session.user.churchId,
        platform: platform.toUpperCase(),
        accountId,
        username: accountData?.username || accountId,
        displayName: accountData?.name || accountId,
        accessToken, // Should be encrypted in production
        refreshToken: null,
        tokenExpiresAt: null,
        accountData: accountData ? JSON.stringify(accountData) : null,
        connectedBy: session.user.id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSync: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      account: {
        id: account.id,
        platform: account.platform,
        isActive: account.isActive,
        createdAt: account.createdAt
      }
    })

  } catch (error) {
    console.error('Manual social media connection error:', error)
    return NextResponse.json(
      { error: 'Error conectando cuenta manualmente' },
      { status: 500 }
    )
  }
}

// DELETE /api/social-media/connect?accountId=xxx - Disconnect account
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('accountId')
    
    if (!accountId) {
      return NextResponse.json({ error: 'ID de cuenta requerido' }, { status: 400 })
    }

    // Verify account belongs to church
    const account = await db.social_media_accounts.findFirst({
      where: {
        id: accountId,
        churchId: session.user.churchId
      }
    })

    if (!account) {
      return NextResponse.json({ error: 'Cuenta no encontrada' }, { status: 404 })
    }

    // Soft delete (deactivate)
    await db.social_media_accounts.update({
      where: { id: accountId },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Cuenta desconectada exitosamente'
    })

  } catch (error) {
    console.error('Social media disconnect error:', error)
    return NextResponse.json(
      { error: 'Error desconectando cuenta' },
      { status: 500 }
    )
  }
}