/**
 * INSTAGRAM OAUTH CALLBACK
 * 
 * Handles Instagram OAuth authorization via Facebook Graph API
 * Instagram Business accounts require Facebook Page connection
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'
import { SOCIAL_PLATFORMS } from '@/types/social-media-v2'
import { decryptToken } from '../facebook/callback/route'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

// Handle OAuth callback from Instagram (via Facebook)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle OAuth errors
    if (error) {
      console.error('Instagram OAuth error:', error)
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/social-media?error=oauth_denied&platform=instagram`
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/social-media?error=invalid_callback&platform=instagram`
      )
    }

    // Verify state and get OAuth session
    const oauthState = await db.oauth_states.findFirst({
      where: {
        state,
        platform: 'INSTAGRAM',
        expiresAt: { gt: new Date() }
      }
    })

    if (!oauthState) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/social-media?error=invalid_state&platform=instagram`
      )
    }

    const platformConfig = SOCIAL_PLATFORMS.INSTAGRAM

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
      console.error('Instagram token exchange failed:', await tokenResponse.text())
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/social-media?error=token_exchange_failed&platform=instagram`
      )
    }

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      console.error('No access token received from Instagram')
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/social-media?error=no_access_token&platform=instagram`
      )
    }

    // Get user profile via Facebook Graph API
    const profileResponse = await fetch(
      `${platformConfig.api.baseUrl}/me?fields=id,username,name,profile_picture_url&access_token=${tokenData.access_token}`
    )

    if (!profileResponse.ok) {
      console.error('Failed to get Instagram profile')
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/social-media?error=profile_fetch_failed&platform=instagram`
      )
    }

    const profile = await profileResponse.json()

    // Get Instagram Business accounts via Facebook Pages
    let businessAccounts = []
    try {
      // First get Facebook Pages
      const pagesResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/accounts?fields=id,name,instagram_business_account&access_token=${tokenData.access_token}`
      )

      if (pagesResponse.ok) {
        const pagesData = await pagesResponse.json()
        const pages = pagesData.data || []
        
        // Filter pages that have Instagram Business accounts
        businessAccounts = pages
          .filter(page => page.instagram_business_account)
          .map(page => ({
            pageId: page.id,
            pageName: page.name,
            instagramBusinessAccountId: page.instagram_business_account.id
          }))
      }
    } catch (error) {
      console.warn('Could not fetch Instagram Business accounts:', error)
    }

    // Encrypt access token for storage
    const encryptedToken = encryptToken(tokenData.access_token)
    
    // Calculate token expiration (Instagram tokens expire in 60 days)
    const expiresAt = tokenData.expires_in 
      ? new Date(Date.now() + tokenData.expires_in * 1000)
      : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // Default 60 days

    // Store account in database
    const account = await db.social_media_accounts_v2.create({
      data: {
        id: nanoid(),
        churchId: oauthState.churchId,
        platform: 'INSTAGRAM',
        platformAccountId: profile.id,
        username: profile.username || profile.name,
        displayName: profile.name || profile.username,
        profileImageUrl: profile.profile_picture_url,
        
        // Encrypted tokens
        accessToken: encryptedToken,
        refreshToken: tokenData.refresh_token ? encryptToken(tokenData.refresh_token) : null,
        tokenExpiresAt: expiresAt,
        
        // Status
        isActive: true,
        connectionStatus: 'CONNECTED',
        lastSync: new Date(),
        
        // Permissions
        permissions: platformConfig.oauth.scopes,
        canPost: businessAccounts.length > 0, // Can only post via Business accounts
        canSchedule: businessAccounts.length > 0,
        canAccessAnalytics: businessAccounts.length > 0,
        
        // Metadata
        accountMetadata: {
          businessAccounts: businessAccounts,
          accountType: businessAccounts.length > 0 ? 'BUSINESS' : 'PERSONAL',
          tokenType: tokenData.token_type || 'Bearer',
          canPublishContent: businessAccounts.length > 0
        }
      }
    })

    // Clean up OAuth state
    await db.oauth_states.delete({
      where: { id: oauthState.id }
    })

    // Log successful connection
    const accountType = businessAccounts.length > 0 ? 'Business' : 'Personal'
    console.log(`✅ Instagram ${accountType} account connected for church ${oauthState.churchId}: ${profile.username || profile.name}`)

    // Redirect back to social media page with success
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/social-media?success=instagram_connected&account=${account.id}&type=${accountType.toLowerCase()}`
    )

  } catch (error) {
    console.error('Error in Instagram OAuth callback:', error)
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/social-media?error=callback_error&platform=instagram`
    )
  }
}

/**
 * Encrypt access token for secure storage
 * Uses AES-256-GCM encryption
 */
function encryptToken(token: string): string {
  const algorithm = 'aes-256-gcm'
  const secretKey = process.env.OAUTH_ENCRYPTION_KEY || 'your-32-character-encryption-key-here'
  
  if (secretKey.length !== 32) {
    throw new Error('OAUTH_ENCRYPTION_KEY must be 32 characters long')
  }

  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipher(algorithm, secretKey)
  
  let encrypted = cipher.update(token, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  // Combine IV, authTag, and encrypted data
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
}