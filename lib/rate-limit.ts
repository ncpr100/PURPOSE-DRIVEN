/**
 * Rate Limiting Utilities
 * Kḥesed-tek Church Management Systems
 * 
 * Provides rate limiting functionality for API endpoints
 * Prevents abuse and brute force attacks
 */

import { NextRequest } from 'next/server'

interface RateLimitData {
  count: number
  resetTime: number
  blocked: boolean
}

// In-memory storage for rate limiting (in production, use Redis or similar)
const rateStore = new Map<string, RateLimitData>()

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, data] of rateStore.entries()) {
    if (now > data.resetTime) {
      rateStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

/**
 * Rate limiting configuration for different endpoints
 */
const rateLimitConfigs = {
  'prayer-analytics': {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
    blockDuration: 5 * 60 * 1000, // 5 minutes block
    message: 'Demasiadas solicitudes de analytics. Intente nuevamente en unos minutos.'
  },
  'prayer-export': {
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minute
    blockDuration: 10 * 60 * 1000, // 10 minutes block
    message: 'Límite de exportación excedido. Intente nuevamente más tarde.'
  },
  'authentication': {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDuration: 30 * 60 * 1000, // 30 minutes block
    message: 'Demasiados intentos de autenticación. Cuenta temporalmente bloqueada.'
  },
  'api-general': {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
    blockDuration: 2 * 60 * 1000, // 2 minutes block
    message: 'Límite de solicitudes excedido. Intente nuevamente pronto.'
  },
  'members-read': {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minute
    blockDuration: 2 * 60 * 1000, // 2 minutes block
    message: 'Límite de consultas de miembros excedido. Intente nuevamente pronto.'
  },
  'members-create': {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute  
    blockDuration: 5 * 60 * 1000, // 5 minutes block
    message: 'Límite de creación de miembros excedido. Intente nuevamente más tarde.'
  }
}

/**
 * Generate a rate limit key based on IP and endpoint
 */
function generateRateLimitKey(request: NextRequest, endpoint: string): string {
  // Get client IP
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 
            request.headers.get('x-real-ip') || 
            'unknown'
  
  return `${ip}:${endpoint}`
}

/**
 * Check and update rate limit for a request
 */
export async function checkRateLimit(
  request: NextRequest, 
  endpoint: string = 'api-general'
): Promise<{
  success: boolean
  remaining: number
  resetTime: number
  blocked: boolean
  message?: string
}> {
  const config = (rateLimitConfigs as any)[endpoint] || rateLimitConfigs['api-general']
  const key = generateRateLimitKey(request, endpoint)
  const now = Date.now()
  
  let data = rateStore.get(key)
  
  // Initialize or reset if window expired
  if (!data || now > data.resetTime) {
    data = {
      count: 0,
      resetTime: now + config.windowMs,
      blocked: false
    }
  }
  
  // Check if currently blocked
  if (data.blocked && now < data.resetTime) {
    return {
      success: false,
      remaining: 0,
      resetTime: data.resetTime,
      blocked: true,
      message: config.message
    }
  }
  
  // Increment counter
  data.count++
  
  // Check if limit exceeded
  if (data.count > config.maxRequests) {
    data.blocked = true
    data.resetTime = now + config.blockDuration
    rateStore.set(key, data)
    
    // Log suspicious activity
    console.warn(`🚨 Rate limit exceeded for ${endpoint}:`, {
      ip: key.split(':')[0],
      endpoint,
      count: data.count,
      timestamp: new Date().toISOString()
    })
    
    return {
      success: false,
      remaining: 0,
      resetTime: data.resetTime,
      blocked: true,
      message: config.message
    }
  }
  
  // Update store and return success
  rateStore.set(key, data)
  
  return {
    success: true,
    remaining: config.maxRequests - data.count,
    resetTime: data.resetTime,
    blocked: false
  }
}

/**
 * Rate limiting middleware wrapper
 */
export function withRateLimit(endpoint: string = 'api-general') {
  return async function rateLimitMiddleware(
    request: NextRequest,
    handler: (request: NextRequest) => Promise<Response>
  ): Promise<Response> {
    const rateLimitResult = await checkRateLimit(request, endpoint)
    
    if (!rateLimitResult.success) {
      const headers = new Headers({
        'X-RateLimit-Limit': (rateLimitConfigs as any)[endpoint]?.maxRequests.toString() || '100',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': Math.ceil(rateLimitResult.resetTime / 1000).toString(),
        'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
        'Content-Type': 'application/json'
      })
      
      return new Response(
        JSON.stringify({
          error: rateLimitResult.message || 'Rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        }),
        {
          status: 429,
          headers
        }
      )
    }
    
    // Add rate limit headers to successful responses
    const response = await handler(request)
    
    response.headers.set('X-RateLimit-Limit', (rateLimitConfigs as any)[endpoint]?.maxRequests.toString() || '100')
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
    response.headers.set('X-RateLimit-Reset', Math.ceil(rateLimitResult.resetTime / 1000).toString())
    
    return response
  }
}

/**
 * Get current rate limit status for debugging
 */
export function getRateLimitStatus(request: NextRequest, endpoint: string): RateLimitData | null {
  const key = generateRateLimitKey(request, endpoint)
  return rateStore.get(key) || null
}

/**
 * Clear rate limit for a specific IP/endpoint (admin function)
 */
export function clearRateLimit(ip: string, endpoint: string): boolean {
  const key = `${ip}:${endpoint}`
  return rateStore.delete(key)
}

/**
 * Get all active rate limits (admin function)
 */
export function getAllRateLimits(): Array<{ key: string; data: RateLimitData }> {
  return Array.from(rateStore.entries()).map(([key, data]) => ({ key, data }))
}