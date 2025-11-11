/**
 * CSRF Protection Utilities
 * Kḥesed-tek Church Management Systems
 *
 * Provides Cross-Site Request Forgery protection for API endpoints
 */
import { NextRequest } from 'next/server';
/**
 * Generate or retrieve CSRF token for a session
 */
export declare function generateCSRFTokenForSession(request: NextRequest): Promise<string | null>;
/**
 * Validate CSRF token from request
 */
export declare function validateCSRFToken(request: NextRequest): Promise<boolean>;
/**
 * CSRF protection middleware
 */
export declare function withCSRFProtection(): (request: NextRequest, handler: (request: NextRequest) => Promise<Response>) => Promise<Response>;
/**
 * Get CSRF token for client-side usage
 */
export declare function getCSRFTokenForClient(request: NextRequest): Promise<Response>;
/**
 * Clear CSRF token for session (logout)
 */
export declare function clearCSRFTokenForSession(sessionId: string): Promise<void>;
/**
 * Check if request comes from same origin (additional CSRF protection)
 */
export declare function validateSameOrigin(request: NextRequest): boolean;
/**
 * Combined CSRF and origin validation
 */
export declare function validateRequestSecurity(request: NextRequest): Promise<{
    valid: boolean;
    reason?: string;
}>;
//# sourceMappingURL=csrf.d.ts.map