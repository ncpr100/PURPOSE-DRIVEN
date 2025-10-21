/**
 * Server-Side URL Resolution Utility
 * 
 * Purpose: Provides consistent URL resolution for server-side API calls,
 * handling both local development and production environments.
 * 
 * Problem: AbacusAI platform injects production NEXTAUTH_URL even in local dev,
 * causing server-side internal API calls to fail with cross-domain errors.
 * 
 * Solution: Detect environment and construct appropriate base URL.
 */

/**
 * Gets the base URL for server-side API calls
 * 
 * Priority:
 * 1. NEXT_PUBLIC_APP_URL (if set, for explicit override)
 * 2. NEXTAUTH_URL (from environment)
 * 3. Localhost fallback (for local development)
 * 
 * @returns Base URL without trailing slash
 */
export function getServerBaseUrl(): string {
  // Option 1: Explicit public URL (highest priority)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
  }

  // Option 2: NEXTAUTH_URL (standard Next.js auth URL)
  if (process.env.NEXTAUTH_URL) {
    const url = process.env.NEXTAUTH_URL.replace(/\/$/, '')
    
    // Additional check: If URL contains localhost/127.0.0.1, it's local
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      return url
    }
    
    // Additional check: If NODE_ENV is development and URL is production,
    // override to localhost (workaround for platform injection)
    if (process.env.NODE_ENV === 'development' && !url.includes('localhost')) {
      console.warn(`⚠️ [Server URL] Development mode detected but NEXTAUTH_URL is production: ${url}`)
      console.warn(`⚠️ [Server URL] Overriding to localhost. Set NEXT_PUBLIC_APP_URL to disable this behavior.`)
      return 'http://localhost:3000'
    }
    
    return url
  }

  // Option 3: Localhost fallback (development default)
  const fallbackUrl = 'http://localhost:3000'
  console.warn(`⚠️ [Server URL] No NEXTAUTH_URL or NEXT_PUBLIC_APP_URL set, using fallback: ${fallbackUrl}`)
  return fallbackUrl
}

/**
 * Gets the full URL for a server-side API call
 * 
 * @param path - API path (with or without leading slash)
 * @returns Full URL for the API endpoint
 * 
 * @example
 * getServerUrl('/api/support-contact') 
 * // Returns: "http://localhost:3000/api/support-contact" (in dev)
 * // Returns: "https://your-app.com/api/support-contact" (in prod)
 */
export function getServerUrl(path: string): string {
  const baseUrl = getServerBaseUrl()
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}

/**
 * Checks if the application is running in local development mode
 * 
 * @returns true if running locally, false otherwise
 */
export function isLocalDevelopment(): boolean {
  // Check NODE_ENV first
  if (process.env.NODE_ENV === 'development') {
    return true
  }

  // Check if NEXTAUTH_URL points to localhost
  if (process.env.NEXTAUTH_URL) {
    const url = process.env.NEXTAUTH_URL
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      return true
    }
  }

  return false
}

/**
 * Checks if the application is running in production mode
 * 
 * @returns true if running in production, false otherwise
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * Gets environment-specific configuration
 * 
 * @returns Configuration object with environment details
 */
export function getEnvironmentConfig() {
  return {
    baseUrl: getServerBaseUrl(),
    isLocal: isLocalDevelopment(),
    isProd: isProduction(),
    nodeEnv: process.env.NODE_ENV || 'development',
    nextAuthUrl: process.env.NEXTAUTH_URL || 'not-set',
    publicAppUrl: process.env.NEXT_PUBLIC_APP_URL || 'not-set'
  }
}

// Export for debugging/logging purposes
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 [Server URL Utility] Configuration:', getEnvironmentConfig())
}
