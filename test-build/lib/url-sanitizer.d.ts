/**
 * URL Sanitization Utilities
 * Kḥesed-tek Church Management Systems
 *
 * Removes sensitive parameters from URLs before sharing
 * Prevents session token and sensitive data exposure
 */
/**
 * Sanitizes a URL for safe sharing by removing sensitive parameters
 * @param {string} url - The URL to sanitize
 * @returns {string} - The sanitized URL safe for sharing
 */
export declare function sanitizeUrlForSharing(url: string): string;
/**
 * Creates a safe sharing URL with minimal context
 * @param {string} moduleName - The module being shared (e.g., 'prayer-wall')
 * @param {string} description - Optional description for the share
 * @returns {object} - Sharing data object
 */
export declare function createSafeShareData(moduleName: string, description?: string): {
    title: string;
    text: string;
    url: string;
};
/**
 * Validates if a URL is safe for sharing (doesn't contain sensitive data)
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if URL is safe to share
 */
export declare function isUrlSafeForSharing(url: string): boolean;
/**
 * Generates a public shareable link for a specific module
 * @param {string} moduleName - The module name
 * @param {object} options - Additional options for the link
 * @returns {string} - Clean public URL
 */
export declare function generatePublicShareUrl(moduleName: string, options?: {
    includeDescription?: boolean;
    campaign?: string;
}): string;
/**
 * Logs sharing activity for security monitoring
 * @param {string} originalUrl - The original URL that was shared
 * @param {string} sanitizedUrl - The sanitized URL that was actually shared
 */
export declare function logSharingActivity(originalUrl: string, sanitizedUrl: string): void;
//# sourceMappingURL=url-sanitizer.d.ts.map