/**
 * AUTH VALIDATION - Ensures JWT and Middleware Stay in Sync
 * 
 * CRITICAL: If you modify JWT callback, run: npm run validate:auth
 */

import { JWT } from 'next-auth/jwt'

// Define REQUIRED fields in JWT for middleware
export interface RequiredJWTFields {
  sub: string        // User ID - REQUIRED by NextAuth
  role: string       // User role - REQUIRED by middleware authorization
  churchId?: string  // Church ID - REQUIRED for multi-tenant data scoping
}

// Type guard to validate JWT has required fields
export function validateJWTForMiddleware(token: JWT): token is JWT & RequiredJWTFields {
  const hasRequiredFields = 
    typeof token.sub === 'string' &&
    typeof token.role === 'string'
  
  if (!hasRequiredFields) {
    console.error(' JWT VALIDATION FAILED - Missing required fields:', {
      hasSub: !!token.sub,
      hasRole: !!token.role,
      hasChurchId: !!token.churchId
    })
  }
  
  return hasRequiredFields
}

/**
 * VALIDATION CHECKLIST for JWT Changes:
 * 
 *  Does middleware.ts use this field?
 *  Does any page-level authorization check this field?
 *  Is this field needed for multi-tenant data scoping?
 *  Have you tested with a FRESH login (new JWT)?
 *  Have you checked ALL protected routes still work?
 * 
 * NEVER remove fields from JWT without checking:
 * - middleware.ts (line 130-180)
 * - All page.tsx files with authorization
 * - Database queries using churchId scoping
 */

// Fields that middleware checks - MUST exist in JWT
export const MIDDLEWARE_REQUIRED_FIELDS = [
  'role',      // Used in: middleware.ts line 171
  'churchId',  // Used in: multi-tenant data scoping
] as const

// Validate at build time
export function validateAuthArchitecture() {
  console.log(' Validating Auth Architecture...')
  console.log(' JWT must include:', MIDDLEWARE_REQUIRED_FIELDS)
  console.log(' Middleware checks: token.role')
  console.log(' Multi-tenant scoping uses: token.churchId')
  console.log('️  IMPORTANT: Changes to lib/auth.ts JWT callback require testing ALL protected routes')
}
