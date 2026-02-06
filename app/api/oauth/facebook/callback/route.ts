/**
 * FACEBOOK OAUTH CALLBACK HANDLER
 * Processes Facebook/Instagram OAuth authorization and stores secure tokens
 */

import { NextRequest, NextResponse } from 'next/server'
import { SocialOAuth } from '@/lib/social-media/oauth-engine'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.redirect(new URL('/auth/signin?error=unauthorized', request.url))
    }

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle OAuth errors
    if (error) {
      console.error('Facebook OAuth error:', error)
      return NextResponse.redirect(
        new URL(`/social-media?error=oauth_failed&platform=facebook&reason=${error}`, request.url)
      )
    }

    // Validate required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/social-media?error=oauth_failed&platform=facebook&reason=missing_params', request.url)
      )
    }

    try {
      // Process OAuth callback with secure token exchange
      const result = await SocialOAuth.processCallback('FACEBOOK', code, state)
      
      if (result.success) {
        console.log('✅ Facebook account connected successfully:', result.account.displayName)
        
        // Redirect to social media page with success message
        return NextResponse.redirect(
          new URL(`/social-media?success=connected&platform=facebook&account=${encodeURIComponent(result.account.displayName)}`, request.url)
        )
      } else {
        throw new Error('OAuth processing failed')
      }
    } catch (processingError) {
      console.error('Facebook OAuth processing error:', processingError)
      return NextResponse.redirect(
        new URL('/social-media?error=oauth_failed&platform=facebook&reason=processing_failed', request.url)
      )
    }

  } catch (error) {
    console.error('Facebook OAuth callback error:', error)
    return NextResponse.redirect(
      new URL('/social-media?error=oauth_failed&platform=facebook&reason=server_error', request.url)
    )
  }
}