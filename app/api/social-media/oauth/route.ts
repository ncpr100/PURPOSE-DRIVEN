/**
 * ONE-CLICK OAUTH SYSTEM
 * 
 * GoHighLevel-style OAuth integration
 * Simplifies social media account connection to one click
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'
import { SOCIAL_PLATFORMS, type SocialPlatform } from '@/types/social-media-v2'

export const dynamic = 'force-dynamic'

// INITIATE OAuth flow for a platform
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { platform } = await request.json()

    if (!platform || !(platform in SOCIAL_PLATFORMS)) {
      return NextResponse.json({ 
        error: 'Invalid platform. Supported: FACEBOOK, INSTAGRAM, YOUTUBE' 
      }, { status: 400 })
    }

    const platformConfig = SOCIAL_PLATFORMS[platform as SocialPlatform]
    const churchId = session.user.churchId

    // Generate state for OAuth security
    const state = nanoid(32)

    // Store OAuth state temporarily (in memory for simplicity)
    global.oauthStates = global.oauthStates || new Map()
    global.oauthStates.set(state, {
      churchId,
      platform,
      userId: session.user.id,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    })

    // Clean up expired states
    for (const [key, value] of global.oauthStates.entries()) {
      if (value.expiresAt < new Date()) {
        global.oauthStates.delete(key)
      }
    }

    // Construct OAuth authorization URL
    const authUrl = new URL(platformConfig.oauth.authUrl)
    authUrl.searchParams.set('client_id', platformConfig.oauth.clientId)
    authUrl.searchParams.set('redirect_uri', platformConfig.oauth.redirectUri)
    authUrl.searchParams.set('scope', platformConfig.oauth.scopes.join(','))
    authUrl.searchParams.set('state', state)
    authUrl.searchParams.set('response_type', 'code')

    // Platform-specific parameters
    if (platform === 'FACEBOOK') {
      authUrl.searchParams.set('display', 'popup')
    }

    return NextResponse.json({
      authUrl: authUrl.toString(),
      state,
      platform,
      message: `Ready to connect ${platformConfig.name} account`
    })

  } catch (error) {
    console.error('Error initiating OAuth:', error)
    return NextResponse.json(
      { error: 'Failed to initiate OAuth flow' },
      { status: 500 }
    )
  }
}

// CHECK OAuth connection status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const churchId = session.user.churchId

    // Get all connected accounts for this church
    const connectedAccounts = await db.social_media_accounts.findMany({
      where: {
        churchId,
        isActive: true
      },
      select: {
        id: true,
        platform: true,
        username: true,
        displayName: true,
        isActive: true,
        lastSync: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Check which platforms are available to connect
    const availablePlatforms = Object.entries(SOCIAL_PLATFORMS).map(([key, config]) => ({
      platform: key,
      name: config.name,
      icon: config.icon,
      color: config.color,
      isConnected: connectedAccounts.some(acc => acc.platform === key && acc.isActive)
    }))

    return NextResponse.json({
      connectedAccounts,
      availablePlatforms,
      totalConnected: connectedAccounts.filter(acc => acc.isActive).length
    })

  } catch (error) {
    console.error('Error checking OAuth status:', error)  
    return NextResponse.json(
      { error: 'Failed to check connection status' },
      { status: 500 }
    )
  }
}