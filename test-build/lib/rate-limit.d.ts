/**
 * Rate Limiting Utilities
 * Kḥesed-tek Church Management Systems
 *
 * Provides rate limiting functionality for API endpoints
 * Prevents abuse and brute force attacks
 */
import { NextRequest } from 'next/server';
interface RateLimitData {
    count: number;
    resetTime: number;
    blocked: boolean;
}
/**
 * Check and update rate limit for a request
 */
export declare function checkRateLimit(request: NextRequest, endpoint?: string): Promise<{
    success: boolean;
    remaining: number;
    resetTime: number;
    blocked: boolean;
    message?: string;
}>;
/**
 * Rate limiting middleware wrapper
 */
export declare function withRateLimit(endpoint?: string): (request: NextRequest, handler: (request: NextRequest) => Promise<Response>) => Promise<Response>;
/**
 * Get current rate limit status for debugging
 */
export declare function getRateLimitStatus(request: NextRequest, endpoint: string): RateLimitData | null;
/**
 * Clear rate limit for a specific IP/endpoint (admin function)
 */
export declare function clearRateLimit(ip: string, endpoint: string): boolean;
/**
 * Get all active rate limits (admin function)
 */
export declare function getAllRateLimits(): Array<{
    key: string;
    data: RateLimitData;
}>;
export {};
//# sourceMappingURL=rate-limit.d.ts.map