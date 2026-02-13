/**
 * SAAS PLATFORM OAUTH ENGINE 🚀
 * Buffer/Hootsuite-style centralized OAuth for ALL churches
 * NO technical setupRequired by tenants - truly one-click connections
 * Platform-managed OAuth credentials serve all church tenants
 */
export interface SocialPlatformConfig {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scopes: string[];
    authUrl: string;
    tokenUrl: string;
    apiBaseUrl: string;
}
export declare const SOCIAL_PLATFORMS: Record<string, SocialPlatformConfig>;
export declare class SecureTokenManager {
    private static encryptionKey;
    private static validateEncryptionKey;
    static encrypt(text: string): string;
    static decrypt(encryptedText: string): string;
    static storeTokens(churchId: string, platform: string, accessToken: string, refreshToken?: string, expiresAt?: Date, accountData?: any): Promise<any>;
    static getTokens(accountId: string): Promise<any>;
}
export declare class OAuthFlowManager {
    static generateAuthUrl(platform: string, churchId: string): string;
    static exchangeCodeForToken(platform: string, code: string, state: string): Promise<{
        success: boolean;
        account: {
            id: any;
            platform: string;
            username: any;
            displayName: any;
            isActive: boolean;
        };
    }>;
    static fetchAccountInfo(platform: string, accessToken: string): Promise<{
        username: any;
        name: any;
        accountId: any;
        pages: any;
        channelId?: undefined;
    } | {
        username: any;
        name: any;
        accountId: any;
        pages?: undefined;
        channelId?: undefined;
    } | {
        username: any;
        name: any;
        accountId: any;
        channelId: any;
        pages?: undefined;
    }>;
    static refreshTokenIfNeeded(accountId: string): Promise<boolean>;
}
export declare const SocialOAuth: {
    getConnectUrl: (platform: string, churchId: string) => string;
    processCallback: (platform: string, code: string, state: string) => Promise<{
        success: boolean;
        account: {
            id: any;
            platform: string;
            username: any;
            displayName: any;
            isActive: boolean;
        };
    }>;
    validateToken: (accountId: string) => Promise<boolean>;
    getAccountTokens: (accountId: string) => Promise<any>;
};
export default SocialOAuth;
//# sourceMappingURL=oauth-engine.d.ts.map