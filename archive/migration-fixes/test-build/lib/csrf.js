"use strict";
/**
 * CSRF Protection Utilities
 * Kḥesed-tek Church Management Systems
 *
 * Provides Cross-Site Request Forgery protection for API endpoints
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequestSecurity = exports.validateSameOrigin = exports.clearCSRFTokenForSession = exports.getCSRFTokenForClient = exports.withCSRFProtection = exports.validateCSRFToken = exports.generateCSRFTokenForSession = void 0;
const next_auth_1 = require("next-auth");
const auth_1 = require("@/lib/auth");
const crypto_1 = __importDefault(require("crypto"));
// CSRF token storage (in production, use Redis or database)
const csrfTokens = new Map();
// Cleanup expired tokens every 10 minutes
setInterval(() => {
    const now = Date.now();
    for (const [sessionId, data] of csrfTokens.entries()) {
        if (now > data.expires) {
            csrfTokens.delete(sessionId);
        }
    }
}, 10 * 60 * 1000);
/**
 * Generate a cryptographically secure CSRF token
 */
function generateCSRFToken() {
    return crypto_1.default.randomBytes(32).toString('hex');
}
/**
 * Generate or retrieve CSRF token for a session
 */
async function generateCSRFTokenForSession(request) {
    try {
        const session = await (0, next_auth_1.getServerSession)(auth_1.authOptions);
        if (!session?.user?.id) {
            return null;
        }
        const sessionId = session.user.id;
        const now = Date.now();
        const tokenExpiry = 2 * 60 * 60 * 1000; // 2 hours
        // Check if valid token exists
        const existingToken = csrfTokens.get(sessionId);
        if (existingToken && now < existingToken.expires) {
            return existingToken.token;
        }
        // Generate new token
        const token = generateCSRFToken();
        csrfTokens.set(sessionId, {
            token,
            expires: now + tokenExpiry
        });
        return token;
    }
    catch (error) {
        console.error('Error generating CSRF token:', error);
        return null;
    }
}
exports.generateCSRFTokenForSession = generateCSRFTokenForSession;
/**
 * Validate CSRF token from request
 */
async function validateCSRFToken(request) {
    try {
        const session = await (0, next_auth_1.getServerSession)(auth_1.authOptions);
        if (!session?.user?.id) {
            return false;
        }
        const sessionId = session.user.id;
        const providedToken = request.headers.get('x-csrf-token') ||
            request.headers.get('csrf-token');
        if (!providedToken) {
            console.warn('Missing CSRF token in request');
            return false;
        }
        const storedTokenData = csrfTokens.get(sessionId);
        if (!storedTokenData) {
            console.warn('No CSRF token found for session');
            return false;
        }
        const now = Date.now();
        if (now > storedTokenData.expires) {
            console.warn('CSRF token expired');
            csrfTokens.delete(sessionId);
            return false;
        }
        // Use crypto.timingSafeEqual to prevent timing attacks
        const providedBuffer = new Uint8Array(Buffer.from(providedToken, 'hex'));
        const storedBuffer = new Uint8Array(Buffer.from(storedTokenData.token, 'hex'));
        if (providedBuffer.length !== storedBuffer.length) {
            console.warn('CSRF token length mismatch');
            return false;
        }
        const isValid = crypto_1.default.timingSafeEqual(providedBuffer, storedBuffer);
        if (!isValid) {
            console.warn('Invalid CSRF token provided');
        }
        return isValid;
    }
    catch (error) {
        console.error('Error validating CSRF token:', error);
        return false;
    }
}
exports.validateCSRFToken = validateCSRFToken;
/**
 * CSRF protection middleware
 */
function withCSRFProtection() {
    return async function csrfMiddleware(request, handler) {
        // Skip CSRF check for GET requests (they should be safe)
        if (request.method === 'GET') {
            return handler(request);
        }
        // Skip CSRF check for OPTIONS requests (CORS preflight)
        if (request.method === 'OPTIONS') {
            return handler(request);
        }
        const isValid = await validateCSRFToken(request);
        if (!isValid) {
            return new Response(JSON.stringify({
                error: 'CSRF token inválido o ausente',
                code: 'CSRF_TOKEN_INVALID',
                timestamp: new Date().toISOString()
            }), {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Content-Type-Options': 'nosniff'
                }
            });
        }
        return handler(request);
    };
}
exports.withCSRFProtection = withCSRFProtection;
/**
 * Get CSRF token for client-side usage
 */
async function getCSRFTokenForClient(request) {
    const token = await generateCSRFTokenForSession(request);
    if (!token) {
        return new Response(JSON.stringify({ error: 'No se pudo generar token CSRF' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    return new Response(JSON.stringify({ csrfToken: token }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'X-Content-Type-Options': 'nosniff'
        }
    });
}
exports.getCSRFTokenForClient = getCSRFTokenForClient;
/**
 * Clear CSRF token for session (logout)
 */
async function clearCSRFTokenForSession(sessionId) {
    csrfTokens.delete(sessionId);
}
exports.clearCSRFTokenForSession = clearCSRFTokenForSession;
/**
 * Check if request comes from same origin (additional CSRF protection)
 */
function validateSameOrigin(request) {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const host = request.headers.get('host');
    // For API requests, check Origin header
    if (origin) {
        const originHost = new URL(origin).host;
        return originHost === host;
    }
    // For form submissions, check Referer header
    if (referer) {
        const refererHost = new URL(referer).host;
        return refererHost === host;
    }
    // If neither Origin nor Referer is present, allow (could be direct API call)
    return true;
}
exports.validateSameOrigin = validateSameOrigin;
/**
 * Combined CSRF and origin validation
 */
async function validateRequestSecurity(request) {
    // Check same origin
    if (!validateSameOrigin(request)) {
        return {
            valid: false,
            reason: 'Cross-origin request detected'
        };
    }
    // Skip CSRF for safe methods
    if (request.method === 'GET' || request.method === 'HEAD' || request.method === 'OPTIONS') {
        return { valid: true };
    }
    // Validate CSRF token for unsafe methods
    const csrfValid = await validateCSRFToken(request);
    if (!csrfValid) {
        return {
            valid: false,
            reason: 'Invalid or missing CSRF token'
        };
    }
    return { valid: true };
}
exports.validateRequestSecurity = validateRequestSecurity;
//# sourceMappingURL=csrf.js.map