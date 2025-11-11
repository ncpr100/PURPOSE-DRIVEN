"use strict";
/**
 * Rate Limiting Utilities
 * Kḥesed-tek Church Management Systems
 *
 * Provides rate limiting functionality for API endpoints
 * Prevents abuse and brute force attacks
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRateLimits = exports.clearRateLimit = exports.getRateLimitStatus = exports.withRateLimit = exports.checkRateLimit = void 0;
// In-memory storage for rate limiting (in production, use Redis or similar)
const rateStore = new Map();
// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, data] of rateStore.entries()) {
        if (now > data.resetTime) {
            rateStore.delete(key);
        }
    }
}, 5 * 60 * 1000);
/**
 * Rate limiting configuration for different endpoints
 */
const rateLimitConfigs = {
    'prayer-analytics': {
        maxRequests: 30,
        windowMs: 60 * 1000,
        blockDuration: 5 * 60 * 1000,
        message: 'Demasiadas solicitudes de analytics. Intente nuevamente en unos minutos.'
    },
    'prayer-export': {
        maxRequests: 5,
        windowMs: 60 * 1000,
        blockDuration: 10 * 60 * 1000,
        message: 'Límite de exportación excedido. Intente nuevamente más tarde.'
    },
    'authentication': {
        maxRequests: 5,
        windowMs: 15 * 60 * 1000,
        blockDuration: 30 * 60 * 1000,
        message: 'Demasiados intentos de autenticación. Cuenta temporalmente bloqueada.'
    },
    'api-general': {
        maxRequests: 100,
        windowMs: 60 * 1000,
        blockDuration: 2 * 60 * 1000,
        message: 'Límite de solicitudes excedido. Intente nuevamente pronto.'
    }
};
/**
 * Generate a rate limit key based on IP and endpoint
 */
function generateRateLimitKey(request, endpoint) {
    // Get client IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() :
        request.headers.get('x-real-ip') ||
            'unknown';
    return `${ip}:${endpoint}`;
}
/**
 * Check and update rate limit for a request
 */
async function checkRateLimit(request, endpoint = 'api-general') {
    const config = rateLimitConfigs[endpoint] || rateLimitConfigs['api-general'];
    const key = generateRateLimitKey(request, endpoint);
    const now = Date.now();
    let data = rateStore.get(key);
    // Initialize or reset if window expired
    if (!data || now > data.resetTime) {
        data = {
            count: 0,
            resetTime: now + config.windowMs,
            blocked: false
        };
    }
    // Check if currently blocked
    if (data.blocked && now < data.resetTime) {
        return {
            success: false,
            remaining: 0,
            resetTime: data.resetTime,
            blocked: true,
            message: config.message
        };
    }
    // Increment counter
    data.count++;
    // Check if limit exceeded
    if (data.count > config.maxRequests) {
        data.blocked = true;
        data.resetTime = now + config.blockDuration;
        rateStore.set(key, data);
        // Log suspicious activity
        console.warn(`🚨 Rate limit exceeded for ${endpoint}:`, {
            ip: key.split(':')[0],
            endpoint,
            count: data.count,
            timestamp: new Date().toISOString()
        });
        return {
            success: false,
            remaining: 0,
            resetTime: data.resetTime,
            blocked: true,
            message: config.message
        };
    }
    // Update store and return success
    rateStore.set(key, data);
    return {
        success: true,
        remaining: config.maxRequests - data.count,
        resetTime: data.resetTime,
        blocked: false
    };
}
exports.checkRateLimit = checkRateLimit;
/**
 * Rate limiting middleware wrapper
 */
function withRateLimit(endpoint = 'api-general') {
    return async function rateLimitMiddleware(request, handler) {
        const rateLimitResult = await checkRateLimit(request, endpoint);
        if (!rateLimitResult.success) {
            const headers = new Headers({
                'X-RateLimit-Limit': rateLimitConfigs[endpoint]?.maxRequests.toString() || '100',
                'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                'X-RateLimit-Reset': Math.ceil(rateLimitResult.resetTime / 1000).toString(),
                'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
                'Content-Type': 'application/json'
            });
            return new Response(JSON.stringify({
                error: rateLimitResult.message || 'Rate limit exceeded',
                code: 'RATE_LIMIT_EXCEEDED',
                retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
            }), {
                status: 429,
                headers
            });
        }
        // Add rate limit headers to successful responses
        const response = await handler(request);
        response.headers.set('X-RateLimit-Limit', rateLimitConfigs[endpoint]?.maxRequests.toString() || '100');
        response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
        response.headers.set('X-RateLimit-Reset', Math.ceil(rateLimitResult.resetTime / 1000).toString());
        return response;
    };
}
exports.withRateLimit = withRateLimit;
/**
 * Get current rate limit status for debugging
 */
function getRateLimitStatus(request, endpoint) {
    const key = generateRateLimitKey(request, endpoint);
    return rateStore.get(key) || null;
}
exports.getRateLimitStatus = getRateLimitStatus;
/**
 * Clear rate limit for a specific IP/endpoint (admin function)
 */
function clearRateLimit(ip, endpoint) {
    const key = `${ip}:${endpoint}`;
    return rateStore.delete(key);
}
exports.clearRateLimit = clearRateLimit;
/**
 * Get all active rate limits (admin function)
 */
function getAllRateLimits() {
    return Array.from(rateStore.entries()).map(([key, data]) => ({ key, data }));
}
exports.getAllRateLimits = getAllRateLimits;
//# sourceMappingURL=rate-limit.js.map