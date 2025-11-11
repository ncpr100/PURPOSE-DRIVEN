"use strict";
/**
 * URL Sanitization Utilities
 * Kḥesed-tek Church Management Systems
 *
 * Removes sensitive parameters from URLs before sharing
 * Prevents session token and sensitive data exposure
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logSharingActivity = exports.generatePublicShareUrl = exports.isUrlSafeForSharing = exports.createSafeShareData = exports.sanitizeUrlForSharing = void 0;
/**
 * Sanitizes a URL for safe sharing by removing sensitive parameters
 * @param {string} url - The URL to sanitize
 * @returns {string} - The sanitized URL safe for sharing
 */
function sanitizeUrlForSharing(url) {
    try {
        const urlObj = new URL(url);
        // List of sensitive parameters to remove
        const sensitiveParams = [
            'token',
            'session',
            'auth',
            'key',
            'id',
            'userId',
            'churchId',
            'memberId',
            'access_token',
            'refresh_token',
            'api_key',
            'secret',
            'password',
            'credential',
            'jwt',
            'bearer',
            'sessionid',
            'csrftoken',
            'csrf',
            'nonce',
            'state',
            'code',
            'authorization',
            'signature',
            'hash',
            'temp',
            'temporary',
            'private',
            'internal'
        ];
        // Remove all sensitive parameters
        sensitiveParams.forEach(param => {
            urlObj.searchParams.delete(param);
            // Also check for variations with different cases
            urlObj.searchParams.delete(param.toUpperCase());
            urlObj.searchParams.delete(param.toLowerCase());
        });
        // For prayer wall, create a clean public URL
        if (urlObj.pathname.includes('/prayer-wall')) {
            return `${urlObj.origin}/prayer-wall`;
        }
        // For other dashboard pages, use the base path
        if (urlObj.pathname.includes('/dashboard/')) {
            const pathParts = urlObj.pathname.split('/');
            const cleanPath = pathParts.slice(0, 3).join('/'); // Keep only /dashboard/module
            return `${urlObj.origin}${cleanPath}`;
        }
        // Remove any remaining query parameters for maximum security
        return `${urlObj.origin}${urlObj.pathname}`;
    }
    catch (error) {
        console.error('Error sanitizing URL:', error);
        // Fallback to safe default
        return typeof window !== 'undefined' ? window.location.origin : '/';
    }
}
exports.sanitizeUrlForSharing = sanitizeUrlForSharing;
/**
 * Creates a safe sharing URL with minimal context
 * @param {string} moduleName - The module being shared (e.g., 'prayer-wall')
 * @param {string} description - Optional description for the share
 * @returns {object} - Sharing data object
 */
function createSafeShareData(moduleName, description) {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shareData = {
        title: `Kḥesed-tek Church Management - ${moduleName}`,
        text: description || 'Sistema de gestión eclesiástica moderna',
        url: `${baseUrl}/${moduleName.toLowerCase().replace(/\s+/g, '-')}`
    };
    return shareData;
}
exports.createSafeShareData = createSafeShareData;
/**
 * Validates if a URL is safe for sharing (doesn't contain sensitive data)
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if URL is safe to share
 */
function isUrlSafeForSharing(url) {
    try {
        const urlObj = new URL(url);
        // Check for sensitive parameters in the URL
        const sensitivePatterns = [
            /token/i,
            /session/i,
            /auth/i,
            /key/i,
            /password/i,
            /secret/i,
            /credential/i,
            /jwt/i,
            /bearer/i,
            /csrf/i,
            /nonce/i,
            /signature/i,
            /hash/i,
            /private/i,
            /internal/i
        ];
        // Check URL parameters
        for (const [key, value] of urlObj.searchParams.entries()) {
            if (sensitivePatterns.some(pattern => pattern.test(key) || pattern.test(value))) {
                return false;
            }
        }
        // Check URL path for sensitive information
        const pathSegments = urlObj.pathname.split('/');
        for (const segment of pathSegments) {
            if (sensitivePatterns.some(pattern => pattern.test(segment))) {
                return false;
            }
        }
        return true;
    }
    catch (error) {
        console.error('Error validating URL safety:', error);
        return false;
    }
}
exports.isUrlSafeForSharing = isUrlSafeForSharing;
/**
 * Generates a public shareable link for a specific module
 * @param {string} moduleName - The module name
 * @param {object} options - Additional options for the link
 * @returns {string} - Clean public URL
 */
function generatePublicShareUrl(moduleName, options = {}) {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    let shareUrl = `${baseUrl}/${moduleName.toLowerCase().replace(/\s+/g, '-')}`;
    // Add safe tracking parameters only if needed
    if (options.campaign) {
        shareUrl += `?ref=${encodeURIComponent(options.campaign)}`;
    }
    return shareUrl;
}
exports.generatePublicShareUrl = generatePublicShareUrl;
/**
 * Logs sharing activity for security monitoring
 * @param {string} originalUrl - The original URL that was shared
 * @param {string} sanitizedUrl - The sanitized URL that was actually shared
 */
function logSharingActivity(originalUrl, sanitizedUrl) {
    // Only log in development for debugging
    if (process.env.NODE_ENV === 'development') {
        console.log('🔗 URL Sharing Activity:', {
            original: originalUrl,
            sanitized: sanitizedUrl,
            wasSanitized: originalUrl !== sanitizedUrl,
            timestamp: new Date().toISOString()
        });
    }
    // In production, this could send to analytics/monitoring service
    // without exposing the actual URLs for privacy
}
exports.logSharingActivity = logSharingActivity;
//# sourceMappingURL=url-sanitizer.js.map