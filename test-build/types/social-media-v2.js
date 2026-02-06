"use strict";
/**
 * HYBRID SOCIAL MEDIA SYSTEM ARCHITECTURE
 * GoHighLevel-Style User Experience with Base + Premium AI Tiers
 *
 * Enterprise-Level Social Media Management Platform
 * Base Tier: Professional social media management (included)
 * Premium Tier: AI-powered content generation (paid addon)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PREMIUM_AI_FEATURES = exports.BASE_TIER_FEATURES = exports.SOCIAL_PLATFORMS = exports.SOCIAL_MEDIA_TIERS = void 0;
exports.SOCIAL_MEDIA_TIERS = {
    BASE: 'social_media_base',
    PREMIUM_AI: 'social_media_ai_premium'
};
exports.SOCIAL_PLATFORMS = {
    FACEBOOK: {
        id: 'FACEBOOK',
        name: 'Facebook',
        icon: 'Facebook',
        color: 'bg-blue-500',
        oauth: {
            clientId: process.env.FACEBOOK_APP_ID || '',
            clientSecret: process.env.FACEBOOK_APP_SECRET || '',
            redirectUri: `${process.env.NEXTAUTH_URL}/api/social-oauth/facebook/callback`,
            scopes: ['pages_manage_posts', 'pages_read_engagement', 'pages_show_list'],
            authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
            tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token'
        },
        api: {
            baseUrl: 'https://graph.facebook.com/v18.0',
            publishEndpoint: '/me/feed',
            mediaEndpoint: '/me/photos',
            rateLimit: { requests: 200, window: 3600 } // 200 requests per hour
        },
        mediaRequirements: {
            image: { formats: ['JPG', 'PNG', 'GIF'], maxSize: '10MB', aspectRatio: '16:9' },
            video: { formats: ['MP4', 'MOV'], maxSize: '1GB', aspectRatio: '16:9', maxDuration: 240 }
        }
    },
    INSTAGRAM: {
        id: 'INSTAGRAM',
        name: 'Instagram',
        icon: 'Instagram',
        color: 'bg-pink-500',
        oauth: {
            clientId: process.env.INSTAGRAM_APP_ID || '',
            clientSecret: process.env.INSTAGRAM_APP_SECRET || '',
            redirectUri: `${process.env.NEXTAUTH_URL}/api/social-oauth/instagram/callback`,
            scopes: ['instagram_basic', 'instagram_content_publish'],
            authUrl: 'https://api.instagram.com/oauth/authorize',
            tokenUrl: 'https://api.instagram.com/oauth/access_token'
        },
        api: {
            baseUrl: 'https://graph.instagram.com/v18.0',
            publishEndpoint: '/me/media',
            mediaEndpoint: '/me/media_publish',
            rateLimit: { requests: 200, window: 3600 }
        },
        mediaRequirements: {
            image: { formats: ['JPG', 'PNG'], maxSize: '8MB', aspectRatio: '1:1' },
            video: { formats: ['MP4'], maxSize: '100MB', aspectRatio: '9:16', maxDuration: 60 },
            story: { formats: ['JPG', 'PNG', 'MP4'], maxSize: '30MB', aspectRatio: '9:16', maxDuration: 15 },
            reel: { formats: ['MP4'], maxSize: '100MB', aspectRatio: '9:16', maxDuration: 90 }
        }
    },
    YOUTUBE: {
        id: 'YOUTUBE',
        name: 'YouTube',
        icon: 'Youtube',
        color: 'bg-red-500',
        oauth: {
            clientId: process.env.YOUTUBE_CLIENT_ID || '',
            clientSecret: process.env.YOUTUBE_CLIENT_SECRET || '',
            redirectUri: `${process.env.NEXTAUTH_URL}/api/social-oauth/youtube/callback`,
            scopes: ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube'],
            authUrl: 'https://accounts.google.com/oauth/authorize',
            tokenUrl: 'https://oauth2.googleapis.com/token'
        },
        api: {
            baseUrl: 'https://www.googleapis.com/youtube/v3',
            publishEndpoint: '/videos',
            mediaEndpoint: '/thumbnails/set',
            rateLimit: { requests: 10000, window: 86400 } // 10K requests per day
        },
        mediaRequirements: {
            video: { formats: ['MP4', 'MOV', 'AVI'], maxSize: '15GB', aspectRatio: '16:9', maxDuration: 43200 },
            short: { formats: ['MP4'], maxSize: '15GB', aspectRatio: '9:16', maxDuration: 60 },
            thumbnail: { formats: ['JPG', 'PNG'], maxSize: '2MB', aspectRatio: '16:9' }
        }
    }
};
exports.BASE_TIER_FEATURES = {
    basicPosting: true,
    scheduling: true,
    multiPlatform: true,
    basicAnalytics: true,
    mediaUpload: true,
    aiContentGeneration: false,
    aiHashtagSuggestions: false,
    aiOptimalTiming: false,
    advancedAnalytics: false,
    aiInsights: false,
    contentTemplates: false
};
exports.PREMIUM_AI_FEATURES = {
    basicPosting: true,
    scheduling: true,
    multiPlatform: true,
    basicAnalytics: true,
    mediaUpload: true,
    aiContentGeneration: true,
    aiHashtagSuggestions: true,
    aiOptimalTiming: true,
    advancedAnalytics: true,
    aiInsights: true,
    contentTemplates: true
};
//# sourceMappingURL=social-media-v2.js.map