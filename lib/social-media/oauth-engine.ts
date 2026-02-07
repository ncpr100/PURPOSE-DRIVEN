/**
 * SAAS PLATFORM OAUTH ENGINE 🚀
 * Buffer/Hootsuite-style centralized OAuth for ALL churches
 * NO technical setupRequired by tenants - truly one-click connections
 * Platform-managed OAuth credentials serve all church tenants
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'
import crypto from 'crypto'

// Enterprise OAuth Configuration
export interface SocialPlatformConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scopes: string[]
  authUrl: string
  tokenUrl: string
  apiBaseUrl: string
}

// Platform-specific configurations - Enterprise SaaS Multi-Tenant
export const SOCIAL_PLATFORMS: Record<string, SocialPlatformConfig> = {
  FACEBOOK: {
    clientId: process.env.FACEBOOK_CLIENT_ID || '',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    redirectUri: `${process.env.NEXTAUTH_URL}/api/oauth/facebook/callback`,
    scopes: [
      'pages_manage_posts',
      'pages_read_engagement', 
      'pages_show_list',
      'instagram_basic',
      'instagram_content_publish'
    ],
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    apiBaseUrl: 'https://graph.facebook.com/v18.0'
  },
  
  INSTAGRAM: {
    clientId: process.env.FACEBOOK_CLIENT_ID || '', // Instagram uses Facebook OAuth
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    redirectUri: `${process.env.NEXTAUTH_URL}/api/oauth/instagram/callback`,
    scopes: [
      'instagram_basic',
      'instagram_content_publish',
      'pages_show_list'
    ],
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    apiBaseUrl: 'https://graph.facebook.com/v18.0'
  },
  
  YOUTUBE: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: `${process.env.NEXTAUTH_URL}/api/oauth/youtube/callback`,
    scopes: [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube.force-ssl'
    ],
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    apiBaseUrl: 'https://www.googleapis.com/youtube/v3'
  }
}

// Encrypted Token Storage (AES-256) - Enterprise Security
export class SecureTokenManager {
  private static encryptionKey = process.env.SOCIAL_MEDIA_ENCRYPTION_KEY || 'default-key-change-in-production'
  
  private static validateEncryptionKey(): void {
    if (this.encryptionKey === 'default-key-change-in-production' && process.env.NODE_ENV === 'production') {
      console.warn('⚠️ SECURITY: Using default encryption key in production')
    }
  }
  
  static encrypt(text: string): string {
    this.validateEncryptionKey()
    try {
      const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey)
      let encrypted = cipher.update(text, 'utf8', 'hex')
      encrypted += cipher.final('hex')
      return encrypted
    } catch (error) {
      console.error('❌ Encryption failed:', error)
      throw new Error('Error de encriptación del token')
    }
  }
  
  static decrypt(encryptedText: string): string {
    const decipher = crypto.createDecipher('aes-256-cbc', this.encryptionKey)
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }
  
  // Store tokens securely in database
  static async storeTokens(
    churchId: string,
    platform: string,
    accessToken: string,
    refreshToken?: string,
    expiresAt?: Date,
    accountData?: any
  ) {
    const encryptedAccessToken = this.encrypt(accessToken)
    const encryptedRefreshToken = refreshToken ? this.encrypt(refreshToken) : null
    
    return await db.social_media_accounts.create({
      data: {
        id: nanoid(),
        churchId,
        platform,
        accountId: accountData?.accountId || nanoid(),
        username: accountData?.username || null,
        displayName: accountData?.name || null,
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        tokenExpiresAt: expiresAt,
        accountData: accountData ? JSON.stringify(accountData) : null,
        connectedBy: churchId, // Temporary - should be userId in real implementation
        isActive: true,
        lastSync: new Date(),
        createdAt: new Date()
      }
    })
  }
  
  // Retrieve and decrypt tokens
  static async getTokens(accountId: string) {
    const account = await db.social_media_accounts.findUnique({
      where: { id: accountId }
    })
    
    if (!account) return null
    
    return {
      ...account,
      accessToken: this.decrypt(account.accessToken),
      refreshToken: account.refreshToken ? this.decrypt(account.refreshToken) : null
    }
  }
}

// OAuth Flow Manager
export class OAuthFlowManager {
  // Generate OAuth authorization URL - SaaS Multi-Tenant Safe
  static generateAuthUrl(platform: string, churchId: string): string {
    const config = SOCIAL_PLATFORMS[platform]
    if (!config) throw new Error(`Plataforma no soportada: ${platform}`)
    if (!config.clientId) throw new Error(`OAuth no configurado para ${platform}`)
    
    const state = Buffer.from(JSON.stringify({ platform, churchId })).toString('base64')
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scopes.join(' '),
      response_type: 'code',
      state,
      access_type: 'offline', // For refresh tokens
      prompt: 'consent' // Force consent to get refresh token
    })
    
    return `${config.authUrl}?${params.toString()}`
  }
  
  // Exchange authorization code for access token
  static async exchangeCodeForToken(platform: string, code: string, state: string) {
    const config = SOCIAL_PLATFORMS[platform]
    if (!config) throw new Error(`Unsupported platform: ${platform}`)
    
    const { churchId } = JSON.parse(Buffer.from(state, 'base64').toString())
    
    const tokenParams = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: config.redirectUri
    })
    
    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString()
    })
    
    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`)
    }
    
    const tokenData = await response.json()
    
    // Get account information
    const accountData = await this.fetchAccountInfo(platform, tokenData.access_token)
    
    // Calculate expiration
    const expiresAt = tokenData.expires_in 
      ? new Date(Date.now() + tokenData.expires_in * 1000)
      : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // Default 60 days
    
    // Store securely
    const account = await SecureTokenManager.storeTokens(
      churchId,
      platform,
      tokenData.access_token,
      tokenData.refresh_token,
      expiresAt,
      accountData
    )
    
    return {
      success: true,
      account: {
        id: account.id,
        platform,
        username: accountData.username,
        displayName: accountData.name,
        isActive: true
      }
    }
  }
  
  // Fetch account information from platform
  static async fetchAccountInfo(platform: string, accessToken: string) {
    const config = SOCIAL_PLATFORMS[platform]
    
    switch (platform) {
      case 'FACEBOOK':
        const fbResponse = await fetch(`${config.apiBaseUrl}/me/accounts?access_token=${accessToken}`)
        const fbData = await fbResponse.json()
        return {
          username: fbData.data[0]?.name || 'Facebook Page',
          name: fbData.data[0]?.name || 'Facebook Page',
          accountId: fbData.data[0]?.id || 'unknown',
          pages: fbData.data
        }
        
      case 'INSTAGRAM':
        const igResponse = await fetch(`${config.apiBaseUrl}/me?fields=id,username&access_token=${accessToken}`)
        const igData = await igResponse.json()
        return {
          username: igData.username || 'Instagram Account',
          name: igData.username || 'Instagram Account',
          accountId: igData.id || 'unknown'
        }
        
      case 'YOUTUBE':
        const ytResponse = await fetch(`${config.apiBaseUrl}/channels?part=snippet&mine=true&access_token=${accessToken}`)
        const ytData = await ytResponse.json()
        return {
          username: ytData.items[0]?.snippet?.title || 'YouTube Channel',
          name: ytData.items[0]?.snippet?.title || 'YouTube Channel',
          accountId: ytData.items[0]?.id || 'unknown',
          channelId: ytData.items[0]?.id
        }
        
      default:
        throw new Error(`Account info fetch not implemented for ${platform}`)
    }
  }
  
  // Automatic token refresh
  static async refreshTokenIfNeeded(accountId: string): Promise<boolean> {
    const account = await SecureTokenManager.getTokens(accountId)
    if (!account || !account.refreshToken) return false
    
    // Check if token expires within next hour
    const expiresAt = new Date(account.tokenExpiresAt || Date.now())
    const needsRefresh = expiresAt.getTime() - Date.now() < 60 * 60 * 1000
    
    if (!needsRefresh) return true
    
    try {
      const config = SOCIAL_PLATFORMS[account.platform]
      const refreshParams = new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: account.refreshToken,
        grant_type: 'refresh_token'
      })
      
      const response = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: refreshParams.toString()
      })
      
      if (!response.ok) return false
      
      const tokenData = await response.json()
      const newExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000)
      
      // Update stored tokens
      await db.social_media_accounts.update({
        where: { id: accountId },
        data: {
          accessToken: SecureTokenManager.encrypt(tokenData.access_token),
          tokenExpiresAt: newExpiresAt,
          lastSync: new Date()
        }
      })
      
      return true
    } catch (error) {
      console.error('Token refresh failed:', error)
      return false
    }
  }
}

// Simple API for frontend
export const SocialOAuth = {
  // Get authorization URL for one-click connect
  getConnectUrl: (platform: string, churchId: string) => 
    OAuthFlowManager.generateAuthUrl(platform, churchId),
  
  // Process OAuth callback
  processCallback: (platform: string, code: string, state: string) =>
    OAuthFlowManager.exchangeCodeForToken(platform, code, state),
  
  // Check token validity
  validateToken: (accountId: string) => 
    OAuthFlowManager.refreshTokenIfNeeded(accountId),
    
  // Get decrypted account tokens
  getAccountTokens: (accountId: string) =>
    SecureTokenManager.getTokens(accountId)
}

export default SocialOAuth