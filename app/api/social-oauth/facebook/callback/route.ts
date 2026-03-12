/**
 * FACEBOOK OAUTH CALLBACK
 * 
 * Handles Facebook OAuth authorization code exchange
 * Stores encrypted access tokens and sets up account
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'
import { SOCIAL_PLATFORMS } from '@/types/social-media-v2'
import { encryptToken, decryptToken } from '@/lib/oauth-crypto'

export const dynamic = 'force-dynamic'

// Handle OAuth callback from Facebook
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle OAuth errors
    if (error) {
      console.error('Facebook OAuth error:', error)
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/social-media?error=oauth_denied&platform=facebook`
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/social-media?error=invalid_callback&platform=facebook`
      )
    }

    // Verify state from memory storage
    global.oauthStates = global.oauthStates || new Map()
    const oauthState = global.oauthStates.get(state)

    if (!oauthState || oauthState.platform !== 'FACEBOOK' || oauthState.expiresAt < new Date()) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/social-media?error=invalid_state&platform=facebook`
      )
    }

    const platformConfig = SOCIAL_PLATFORMS.FACEBOOK

    // Exchange authorization code for access token
    const tokenResponse = await fetch(platformConfig.oauth.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: platformConfig.oauth.clientId,
        client_secret: platformConfig.oauth.clientSecret,
        code: code,
        redirect_uri: platformConfig.oauth.redirectUri
      })
    })

    if (!tokenResponse.ok) {
      console.error('Facebook token exchange failed:', await tokenResponse.text())
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/social-media?error=token_exchange_failed&platform=facebook`
      )
    }

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      console.error('No access token received from Facebook')
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/social-media?error=no_access_token&platform=facebook`
      )
    }

    // Get user profile from Facebook
    const profileResponse = await fetch(
      `${platformConfig.api.baseUrl}/me?fields=id,name,picture&access_token=${tokenData.access_token}`
    )

    if (!profileResponse.ok) {
      console.error('Failed to get Facebook profile')
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/social-media?error=profile_fetch_failed&platform=facebook`
      )
    }

    const profile = await profileResponse.json()

    // Get Facebook Pages (for posting)
    const pagesResponse = await fetch(
      `${platformConfig.api.baseUrl}/me/accounts?access_token=${tokenData.access_token}`
    )

    let pages = []
    if (pagesResponse.ok) {
      const pagesData = await pagesResponse.json()
      pages = pagesData.data || []
    }

    // Encrypt access token for storage
    const encryptedToken = encryptToken(tokenData.access_token)
    
    // Calculate token expiration
    const expiresAt = tokenData.expires_in 
      ? new Date(Date.now() + tokenData.expires_in * 1000)
      : null

    // Store account in database
    const account = await db.social_media_accounts.create({
      data: {
        id: nanoid(),
        churchId: oauthState.churchId,
        platform: 'FACEBOOK',
        accountId: profile.id,
        username: profile.name,
        displayName: profile.name,
        
        // Encrypted tokens
        accessToken: encryptedToken,
        refreshToken: tokenData.refresh_token ? encryptToken(tokenData.refresh_token) : null,
        tokenExpiresAt: expiresAt,
        
        // Status  
        isActive: true,
        lastSync: new Date(),
        accountData: JSON.stringify({
          profile,
          pages: pages.slice(0, 5),
          profileType: 'USER',
          tokenType: tokenData.token_type || 'Bearer',
          scopes: platformConfig.oauth.scopes
        }),
        connectedBy: oauthState.userId || oauthState.churchId
      }
    })

    // Clean up OAuth state from memory
    global.oauthStates.delete(state)

    // Log successful connection
    console.log(`✅ Facebook account connected for church ${oauthState.churchId}: ${profile.name}`)

    // Redirect back to social media page with success
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/social-media?success=facebook_connected&account=${account.id}`
    )

  } catch (error) {
    console.error('Error in Facebook OAuth callback:', error)
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/social-media?error=callback_error&platform=facebook`
    )
  }
}