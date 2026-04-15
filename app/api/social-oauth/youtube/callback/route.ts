/**
 * YOUTUBE OAUTH CALLBACK
 * 
 * Handles YouTube OAuth authorization via Google OAuth
 * Provides access to YouTube Data API v3 for channel management
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'
import { SOCIAL_PLATFORMS } from '@/types/social-media-v2'
import { encryptToken, decryptToken } from '@/lib/oauth-crypto'

export const dynamic = 'force-dynamic'

// Handle OAuth callback from YouTube (Google)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle OAuth errors
    if (error) {
      console.error('YouTube OAuth error:', error)
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/social-media?error=oauth_denied&platform=youtube`
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/social-media?error=invalid_callback&platform=youtube`
      )
    }

    // Verify state from memory storage
    ;(global as any).oauthStates = (global as any).oauthStates || new Map()
    const oauthState = (global as any).oauthStates.get(state)

    if (!oauthState || oauthState.platform !== 'YOUTUBE' || oauthState.expiresAt < new Date()) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/social-media?error=invalid_state&platform=youtube`
      )
    }

    const platformConfig = SOCIAL_PLATFORMS.YOUTUBE

    // Exchange authorization code for access token
    const tokenResponse = await fetch(platformConfig.oauth.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: platformConfig.oauth.clientId,
        client_secret: platformConfig.oauth.clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: platformConfig.oauth.redirectUri
      })
    })

    if (!tokenResponse.ok) {
      console.error('YouTube token exchange failed:', await tokenResponse.text())
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/social-media?error=token_exchange_failed&platform=youtube`
      )
    }

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      console.error('No access token received from YouTube')
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/social-media?error=no_access_token&platform=youtube`
      )
    }

    // Get YouTube channel info
    const channelResponse = await fetch(
      `${platformConfig.api.baseUrl}/channels?part=snippet,statistics,brandingSettings&mine=true&access_token=${tokenData.access_token}`
    )

    if (!channelResponse.ok) {
      console.error('Failed to get YouTube channel info')
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/social-media?error=channel_fetch_failed&platform=youtube`
      )
    }

    const channelData = await channelResponse.json()
    
    if (!channelData.items || channelData.items.length === 0) {
      console.error('No YouTube channel found for user')
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/social-media?error=no_channel_found&platform=youtube`
      )
    }

    const channel = channelData.items[0]
    const snippet = channel.snippet || {}
    const statistics = channel.statistics || {}

    // Get user profile from Google API
    const profileResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`
    )

    let userProfile = {}
    if (profileResponse.ok) {
      userProfile = await profileResponse.json()
    }

    // Encrypt tokens for storage
    const encryptedAccessToken = encryptToken(tokenData.access_token)
    const encryptedRefreshToken = tokenData.refresh_token 
      ? encryptToken(tokenData.refresh_token) 
      : null
    
    // Calculate token expiration (Google tokens typically expire in 1 hour)
    const expiresAt = tokenData.expires_in 
      ? new Date(Date.now() + tokenData.expires_in * 1000)
      : new Date(Date.now() + 3600 * 1000) // Default 1 hour

    // Store account in database
    const account = await db.social_media_accounts.create({
      data: {
        id: nanoid(),
        churchId: oauthState.churchId,
        platform: 'YOUTUBE',
        accountId: channel.id,
        username: snippet.customUrl || snippet.title,
        displayName: snippet.title,
        
        // Encrypted tokens
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        tokenExpiresAt: expiresAt,
        
        // Status
        isActive: true,
        lastSync: new Date(),
        accountData: JSON.stringify({ 
          channel, 
          snippet,
          channelId: channel.id,
          subscriberCount: parseInt(statistics.subscriberCount || '0'),
          videoCount: parseInt(statistics.videoCount || '0'),
          viewCount: parseInt(statistics.viewCount || '0'),
          country: snippet.country,
          language: snippet.defaultLanguage,
          customUrl: snippet.customUrl,
          publishedAt: snippet.publishedAt,
          tokenType: tokenData.token_type || 'Bearer',
          hasRefreshToken: !!tokenData.refresh_token
        }),
        connectedBy: oauthState.userId || oauthState.churchId
      }
    })

    // Clean up OAuth state from memory
    ;(global as any).oauthStates.delete(state)

    // Log successful connection
    console.log(`✅ YouTube channel connected for church ${oauthState.churchId}: ${snippet.title}`)

    // Redirect back to social media page with success
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/social-media?success=youtube_connected&account=${account.id}&channel=${encodeURIComponent(snippet.title)}`
    )

  } catch (error) {
    console.error('Error in YouTube OAuth callback:', error)
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/social-media?error=callback_error&platform=youtube`
    )
  }
}