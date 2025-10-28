/**
 * CSRF Protection Utilities
 * Kḥesed-tek Church Management Systems
 * 
 * Provides Cross-Site Request Forgery protection for API endpoints
 */

import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import crypto from 'crypto'

// CSRF token storage (in production, use Redis or database)
const csrfTokens = new Map<string, { token: string; expires: number }>()

// Cleanup expired tokens every 10 minutes
setInterval(() => {
  const now = Date.now()
  for (const [sessionId, data] of csrfTokens.entries()) {
    if (now > data.expires) {
      csrfTokens.delete(sessionId)
    }
  }
}, 10 * 60 * 1000)

/**
 * Generate a cryptographically secure CSRF token
 */
function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Generate or retrieve CSRF token for a session
 */
export async function generateCSRFTokenForSession(request: NextRequest): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return null
    }

    const sessionId = session.user.id
    const now = Date.now()
    const tokenExpiry = 2 * 60 * 60 * 1000 // 2 hours

    // Check if valid token exists
    const existingToken = csrfTokens.get(sessionId)
    if (existingToken && now < existingToken.expires) {
      return existingToken.token
    }

    // Generate new token
    const token = generateCSRFToken()
    csrfTokens.set(sessionId, {
      token,
      expires: now + tokenExpiry
    })

    return token
  } catch (error) {
    console.error('Error generating CSRF token:', error)
    return null
  }
}

/**
 * Validate CSRF token from request
 */
export async function validateCSRFToken(request: NextRequest): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return false
    }

    const sessionId = session.user.id
    const providedToken = request.headers.get('x-csrf-token') || 
                         request.headers.get('csrf-token')

    if (!providedToken) {
      console.warn('Missing CSRF token in request')
      return false
    }

    const storedTokenData = csrfTokens.get(sessionId)
    if (!storedTokenData) {
      console.warn('No CSRF token found for session')
      return false
    }

    const now = Date.now()
    if (now > storedTokenData.expires) {
      console.warn('CSRF token expired')
      csrfTokens.delete(sessionId)
      return false
    }

    // Use crypto.timingSafeEqual to prevent timing attacks
    const providedBuffer = new Uint8Array(Buffer.from(providedToken, 'hex'))
    const storedBuffer = new Uint8Array(Buffer.from(storedTokenData.token, 'hex'))

    if (providedBuffer.length !== storedBuffer.length) {
      console.warn('CSRF token length mismatch')
      return false
    }

    const isValid = crypto.timingSafeEqual(providedBuffer, storedBuffer)
    
    if (!isValid) {
      console.warn('Invalid CSRF token provided')
    }

    return isValid
  } catch (error) {
    console.error('Error validating CSRF token:', error)
    return false
  }
}

/**
 * CSRF protection middleware
 */
export function withCSRFProtection() {
  return async function csrfMiddleware(
    request: NextRequest,
    handler: (request: NextRequest) => Promise<Response>
  ): Promise<Response> {
    // Skip CSRF check for GET requests (they should be safe)
    if (request.method === 'GET') {
      return handler(request)
    }

    // Skip CSRF check for OPTIONS requests (CORS preflight)
    if (request.method === 'OPTIONS') {
      return handler(request)
    }

    const isValid = await validateCSRFToken(request)
    
    if (!isValid) {
      return new Response(
        JSON.stringify({
          error: 'CSRF token inválido o ausente',
          code: 'CSRF_TOKEN_INVALID',
          timestamp: new Date().toISOString()
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            'X-Content-Type-Options': 'nosniff'
          }
        }
      )
    }

    return handler(request)
  }
}

/**
 * Get CSRF token for client-side usage
 */
export async function getCSRFTokenForClient(request: NextRequest): Promise<Response> {
  const token = await generateCSRFTokenForSession(request)
  
  if (!token) {
    return new Response(
      JSON.stringify({ error: 'No se pudo generar token CSRF' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  return new Response(
    JSON.stringify({ csrfToken: token }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Content-Type-Options': 'nosniff'
      }
    }
  )
}

/**
 * Clear CSRF token for session (logout)
 */
export async function clearCSRFTokenForSession(sessionId: string): Promise<void> {
  csrfTokens.delete(sessionId)
}

/**
 * Check if request comes from same origin (additional CSRF protection)
 */
export function validateSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  const host = request.headers.get('host')

  // For API requests, check Origin header
  if (origin) {
    const originHost = new URL(origin).host
    return originHost === host
  }

  // For form submissions, check Referer header
  if (referer) {
    const refererHost = new URL(referer).host
    return refererHost === host
  }

  // If neither Origin nor Referer is present, allow (could be direct API call)
  return true
}

/**
 * Combined CSRF and origin validation
 */
export async function validateRequestSecurity(request: NextRequest): Promise<{
  valid: boolean
  reason?: string
}> {
  // Check same origin
  if (!validateSameOrigin(request)) {
    return {
      valid: false,
      reason: 'Cross-origin request detected'
    }
  }

  // Skip CSRF for safe methods
  if (request.method === 'GET' || request.method === 'HEAD' || request.method === 'OPTIONS') {
    return { valid: true }
  }

  // Validate CSRF token for unsafe methods
  const csrfValid = await validateCSRFToken(request)
  if (!csrfValid) {
    return {
      valid: false,
      reason: 'Invalid or missing CSRF token'
    }
  }

  return { valid: true }
}