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
export declare function getServerBaseUrl(): string;
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
export declare function getServerUrl(path: string): string;
/**
 * Checks if the application is running in local development mode
 *
 * @returns true if running locally, false otherwise
 */
export declare function isLocalDevelopment(): boolean;
/**
 * Checks if the application is running in production mode
 *
 * @returns true if running in production, false otherwise
 */
export declare function isProduction(): boolean;
/**
 * Gets environment-specific configuration
 *
 * @returns Configuration object with environment details
 */
export declare function getEnvironmentConfig(): {
    baseUrl: string;
    isLocal: boolean;
    isProd: boolean;
    nodeEnv: "development" | "production" | "test";
    nextAuthUrl: string;
    publicAppUrl: string;
};
//# sourceMappingURL=server-url.d.ts.map