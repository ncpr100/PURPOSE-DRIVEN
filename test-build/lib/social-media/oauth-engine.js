"use strict";
/**
 * ENTERPRISE OAUTH SIMPLIFICATION ENGINE
 * GoHighLevel-style one-click social media account connection
 * Handles Facebook, Instagram, YouTube OAuth flows with automatic token management
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialOAuth = exports.OAuthFlowManager = exports.SecureTokenManager = exports.SOCIAL_PLATFORMS = void 0;
const db_1 = require("@/lib/db");
const nanoid_1 = require("nanoid");
const crypto_1 = __importDefault(require("crypto"));
// Platform-specific configurations
exports.SOCIAL_PLATFORMS = {
    FACEBOOK: {
        clientId: process.env.FACEBOOK_CLIENT_ID || '',
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/oauth/facebook/callback`,
        scopes: [
            'pages_manage_posts',
            'pages_read_engagement',
            'pages_show_list',
            'instagram_basic',
            'instagram_content_publish'
        ],
        authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
        tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
        apiBaseUrl: 'https://graph.facebook.com/v18.0'
    },
    INSTAGRAM: {
        clientId: process.env.FACEBOOK_CLIENT_ID || '',
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/oauth/instagram/callback`,
        scopes: [
            'instagram_basic',
            'instagram_content_publish',
            'pages_show_list'
        ],
        authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
        tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
        apiBaseUrl: 'https://graph.facebook.com/v18.0'
    },
    YOUTUBE: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/oauth/youtube/callback`,
        scopes: [
            'https://www.googleapis.com/auth/youtube.upload',
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/youtube.force-ssl'
        ],
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        apiBaseUrl: 'https://www.googleapis.com/youtube/v3'
    }
};
// Encrypted Token Storage (AES-256)
class SecureTokenManager {
    static encrypt(text) {
        const cipher = crypto_1.default.createCipher('aes-256-cbc', this.encryptionKey);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }
    static decrypt(encryptedText) {
        const decipher = crypto_1.default.createDecipher('aes-256-cbc', this.encryptionKey);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    // Store tokens securely in database
    static async storeTokens(churchId, platform, accessToken, refreshToken, expiresAt, accountData) {
        const encryptedAccessToken = this.encrypt(accessToken);
        const encryptedRefreshToken = refreshToken ? this.encrypt(refreshToken) : null;
        return await db_1.db.social_media_accounts.create({
            data: {
                id: (0, nanoid_1.nanoid)(),
                churchId,
                platform,
                accountId: accountData?.accountId || (0, nanoid_1.nanoid)(),
                username: accountData?.username || null,
                displayName: accountData?.name || null,
                accessToken: encryptedAccessToken,
                refreshToken: encryptedRefreshToken,
                tokenExpiresAt: expiresAt,
                accountData: accountData ? JSON.stringify(accountData) : null,
                connectedBy: churchId,
                isActive: true,
                lastSync: new Date(),
                createdAt: new Date()
            }
        });
    }
    // Retrieve and decrypt tokens
    static async getTokens(accountId) {
        const account = await db_1.db.social_media_accounts.findUnique({
            where: { id: accountId }
        });
        if (!account)
            return null;
        return {
            ...account,
            accessToken: this.decrypt(account.accessToken),
            refreshToken: account.refreshToken ? this.decrypt(account.refreshToken) : null
        };
    }
}
exports.SecureTokenManager = SecureTokenManager;
SecureTokenManager.encryptionKey = process.env.SOCIAL_MEDIA_ENCRYPTION_KEY || 'default-key-change-in-production';
// OAuth Flow Manager
class OAuthFlowManager {
    // Generate OAuth authorization URL
    static generateAuthUrl(platform, churchId) {
        const config = exports.SOCIAL_PLATFORMS[platform];
        if (!config)
            throw new Error(`Unsupported platform: ${platform}`);
        const state = Buffer.from(JSON.stringify({ platform, churchId })).toString('base64');
        const params = new URLSearchParams({
            client_id: config.clientId,
            redirect_uri: config.redirectUri,
            scope: config.scopes.join(' '),
            response_type: 'code',
            state,
            access_type: 'offline',
            prompt: 'consent' // Force consent to get refresh token
        });
        return `${config.authUrl}?${params.toString()}`;
    }
    // Exchange authorization code for access token
    static async exchangeCodeForToken(platform, code, state) {
        const config = exports.SOCIAL_PLATFORMS[platform];
        if (!config)
            throw new Error(`Unsupported platform: ${platform}`);
        const { churchId } = JSON.parse(Buffer.from(state, 'base64').toString());
        const tokenParams = new URLSearchParams({
            client_id: config.clientId,
            client_secret: config.clientSecret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: config.redirectUri
        });
        const response = await fetch(config.tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: tokenParams.toString()
        });
        if (!response.ok) {
            throw new Error(`Token exchange failed: ${response.statusText}`);
        }
        const tokenData = await response.json();
        // Get account information
        const accountData = await this.fetchAccountInfo(platform, tokenData.access_token);
        // Calculate expiration
        const expiresAt = tokenData.expires_in
            ? new Date(Date.now() + tokenData.expires_in * 1000)
            : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // Default 60 days
        // Store securely
        const account = await SecureTokenManager.storeTokens(churchId, platform, tokenData.access_token, tokenData.refresh_token, expiresAt, accountData);
        return {
            success: true,
            account: {
                id: account.id,
                platform,
                username: accountData.username,
                displayName: accountData.name,
                isActive: true
            }
        };
    }
    // Fetch account information from platform
    static async fetchAccountInfo(platform, accessToken) {
        const config = exports.SOCIAL_PLATFORMS[platform];
        switch (platform) {
            case 'FACEBOOK':
                const fbResponse = await fetch(`${config.apiBaseUrl}/me/accounts?access_token=${accessToken}`);
                const fbData = await fbResponse.json();
                return {
                    username: fbData.data[0]?.name || 'Facebook Page',
                    name: fbData.data[0]?.name || 'Facebook Page',
                    accountId: fbData.data[0]?.id || 'unknown',
                    pages: fbData.data
                };
            case 'INSTAGRAM':
                const igResponse = await fetch(`${config.apiBaseUrl}/me?fields=id,username&access_token=${accessToken}`);
                const igData = await igResponse.json();
                return {
                    username: igData.username || 'Instagram Account',
                    name: igData.username || 'Instagram Account',
                    accountId: igData.id || 'unknown'
                };
            case 'YOUTUBE':
                const ytResponse = await fetch(`${config.apiBaseUrl}/channels?part=snippet&mine=true&access_token=${accessToken}`);
                const ytData = await ytResponse.json();
                return {
                    username: ytData.items[0]?.snippet?.title || 'YouTube Channel',
                    name: ytData.items[0]?.snippet?.title || 'YouTube Channel',
                    accountId: ytData.items[0]?.id || 'unknown',
                    channelId: ytData.items[0]?.id
                };
            default:
                throw new Error(`Account info fetch not implemented for ${platform}`);
        }
    }
    // Automatic token refresh
    static async refreshTokenIfNeeded(accountId) {
        const account = await SecureTokenManager.getTokens(accountId);
        if (!account || !account.refreshToken)
            return false;
        // Check if token expires within next hour
        const expiresAt = new Date(account.tokenExpiresAt || Date.now());
        const needsRefresh = expiresAt.getTime() - Date.now() < 60 * 60 * 1000;
        if (!needsRefresh)
            return true;
        try {
            const config = exports.SOCIAL_PLATFORMS[account.platform];
            const refreshParams = new URLSearchParams({
                client_id: config.clientId,
                client_secret: config.clientSecret,
                refresh_token: account.refreshToken,
                grant_type: 'refresh_token'
            });
            const response = await fetch(config.tokenUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: refreshParams.toString()
            });
            if (!response.ok)
                return false;
            const tokenData = await response.json();
            const newExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
            // Update stored tokens
            await db_1.db.social_media_accounts.update({
                where: { id: accountId },
                data: {
                    accessToken: SecureTokenManager.encrypt(tokenData.access_token),
                    tokenExpiresAt: newExpiresAt,
                    lastSync: new Date()
                }
            });
            return true;
        }
        catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }
}
exports.OAuthFlowManager = OAuthFlowManager;
// Simple API for frontend
exports.SocialOAuth = {
    // Get authorization URL for one-click connect
    getConnectUrl: (platform, churchId) => OAuthFlowManager.generateAuthUrl(platform, churchId),
    // Process OAuth callback
    processCallback: (platform, code, state) => OAuthFlowManager.exchangeCodeForToken(platform, code, state),
    // Check token validity
    validateToken: (accountId) => OAuthFlowManager.refreshTokenIfNeeded(accountId),
    // Get decrypted account tokens
    getAccountTokens: (accountId) => SecureTokenManager.getTokens(accountId)
};
exports.default = exports.SocialOAuth;
//# sourceMappingURL=oauth-engine.js.map