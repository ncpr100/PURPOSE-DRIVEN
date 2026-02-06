/**
 * ENTERPRISE OAUTH SIMPLIFICATION ENGINE
 * GoHighLevel-style one-click social media account connection
 * Handles Facebook, Instagram, YouTube OAuth flows with automatic token management
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
    static encrypt(text: string): string;
    static decrypt(encryptedText: string): string;
    static storeTokens(churchId: string, platform: string, accessToken: string, refreshToken?: string, expiresAt?: Date, accountData?: any): Promise<{
        id: string;
        churchId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        platform: string;
        accountId: string;
        username: string | null;
        displayName: string | null;
        accessToken: string;
        refreshToken: string | null;
        tokenExpiresAt: Date | null;
        lastSync: Date | null;
        accountData: string | null;
        connectedBy: string;
    }>;
    static getTokens(accountId: string): Promise<{
        accessToken: string;
        refreshToken: string | null;
        id: string;
        churchId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        platform: string;
        accountId: string;
        username: string | null;
        displayName: string | null;
        tokenExpiresAt: Date | null;
        lastSync: Date | null;
        accountData: string | null;
        connectedBy: string;
    } | null>;
}
export declare class OAuthFlowManager {
    static generateAuthUrl(platform: string, churchId: string): string;
    static exchangeCodeForToken(platform: string, code: string, state: string): Promise<{
        success: boolean;
        account: {
            id: string;
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
            id: string;
            platform: string;
            username: any;
            displayName: any;
            isActive: boolean;
        };
    }>;
    validateToken: (accountId: string) => Promise<boolean>;
    getAccountTokens: (accountId: string) => Promise<{
        accessToken: string;
        refreshToken: string | null;
        id: string;
        churchId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        platform: string;
        accountId: string;
        username: string | null;
        displayName: string | null;
        tokenExpiresAt: Date | null;
        lastSync: Date | null;
        accountData: string | null;
        connectedBy: string;
    } | null>;
};
export default SocialOAuth;
//# sourceMappingURL=oauth-engine.d.ts.map