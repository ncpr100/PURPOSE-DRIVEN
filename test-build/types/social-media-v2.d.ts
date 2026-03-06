/**
 * HYBRID SOCIAL MEDIA SYSTEM ARCHITECTURE
 * GoHighLevel-Style User Experience with Base + Premium AI Tiers
 *
 * Enterprise-Level Social Media Management Platform
 * Base Tier: Professional social media management (included)
 * Premium Tier: AI-powered content generation (paid addon)
 */
export interface SocialMediaTier {
    BASE: 'social_media_base';
    PREMIUM_AI: 'social_media_ai_premium';
}
export declare const SOCIAL_MEDIA_TIERS: SocialMediaTier;
/**
 * SUPPORTED PLATFORMS (Phase 1: Facebook, Instagram, YouTube)
 */
export type SocialPlatform = 'FACEBOOK' | 'INSTAGRAM' | 'YOUTUBE';
export declare const SOCIAL_PLATFORMS: Record<SocialPlatform, SocialPlatformConfig>;
/**
 * PLATFORM CONFIGURATION INTERFACES
 */
export interface SocialPlatformConfig {
    id: SocialPlatform;
    name: string;
    icon: string;
    color: string;
    oauth: OAuthConfig;
    api: APIConfig;
    mediaRequirements: MediaRequirements;
}
export interface OAuthConfig {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scopes: string[];
    authUrl: string;
    tokenUrl: string;
}
export interface APIConfig {
    baseUrl: string;
    publishEndpoint: string;
    mediaEndpoint: string;
    rateLimit: {
        requests: number;
        window: number;
    };
}
export interface MediaRequirements {
    image?: MediaSpec;
    video?: MediaSpec;
    story?: MediaSpec;
    reel?: MediaSpec;
    short?: MediaSpec;
    thumbnail?: MediaSpec;
}
export interface MediaSpec {
    formats: string[];
    maxSize: string;
    aspectRatio: string;
    maxDuration?: number;
}
/**
 * SOCIAL MEDIA ACCOUNT (Connected Platform Account)
 */
export interface SocialMediaAccount {
    id: string;
    churchId: string;
    platform: SocialPlatform;
    platformAccountId: string;
    username?: string;
    displayName?: string;
    profileImageUrl?: string;
    accessToken: string;
    refreshToken?: string;
    tokenExpiresAt?: Date;
    isActive: boolean;
    connectionStatus: 'CONNECTED' | 'EXPIRED' | 'ERROR' | 'DISCONNECTED';
    lastSync?: Date;
    lastError?: string;
    permissions: string[];
    canPost: boolean;
    canSchedule: boolean;
    canAccessAnalytics: boolean;
    accountMetadata?: any;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * SOCIAL MEDIA POST (Content + Scheduling)
 */
export interface SocialMediaPost {
    id: string;
    churchId: string;
    title?: string;
    content: string;
    hashtags: string[];
    mentions: string[];
    mediaFiles: MediaFile[];
    platforms: SocialPlatform[];
    accountIds: string[];
    status: PostStatus;
    scheduledAt?: Date;
    publishedAt?: Date;
    publishResults: PlatformPublishResult[];
    campaignId?: string;
    generatedByAI: boolean;
    aiPrompt?: string;
    aiModelUsed?: string;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
}
export type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHING' | 'PUBLISHED' | 'PARTIALLY_PUBLISHED' | 'FAILED' | 'CANCELLED';
export interface MediaFile {
    id: string;
    url: string;
    type: 'IMAGE' | 'VIDEO';
    filename: string;
    fileSize: number;
    mimeType: string;
    optimizations: Record<SocialPlatform, OptimizedMedia>;
}
export interface OptimizedMedia {
    url: string;
    width: number;
    height: number;
    fileSize: number;
    format: string;
    processingStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
}
export interface PlatformPublishResult {
    platform: SocialPlatform;
    accountId: string;
    status: 'SUCCESS' | 'FAILED' | 'RETRY_SCHEDULED';
    platformPostId?: string;
    publishedAt?: Date;
    errorMessage?: string;
    retryCount: number;
    nextRetryAt?: Date;
}
/**
 * AI CONTENT GENERATION (Premium Tier)
 */
export interface AIContentRequest {
    churchId: string;
    userId: string;
    prompt: string;
    contentType: 'POST' | 'STORY' | 'REEL_DESCRIPTION' | 'VIDEO_SCRIPT';
    platforms: SocialPlatform[];
    tone: 'INSPIRATIONAL' | 'WELCOMING' | 'EDUCATIONAL' | 'CELEBRATORY' | 'EVANGELICAL';
    churchName: string;
    churchValues?: string[];
    targetAudience?: string;
    seasonalContext?: string;
    maxLength?: number;
    includeHashtags: boolean;
    includeMentions: boolean;
    includeCallToAction: boolean;
}
export interface AIContentResponse {
    requestId: string;
    content: string;
    adaptedContent: Record<SocialPlatform, string>;
    suggestedHashtags: string[];
    suggestedMentions: string[];
    callToAction?: string;
    modelUsed: string;
    processingTime: number;
    tokensUsed: number;
    cost: number;
    billingTier: string;
}
/**
 * SCHEDULING ENGINE
 */
export interface SchedulingEngine {
    addToQueue: (post: SocialMediaPost) => Promise<void>;
    removeFromQueue: (postId: string) => Promise<void>;
    processQueue: () => Promise<void>;
    publishPost: (post: SocialMediaPost) => Promise<PlatformPublishResult[]>;
    scheduleRetry: (post: SocialMediaPost, platform: SocialPlatform) => Promise<void>;
    suggestOptimalTimes: (churchId: string, platform: SocialPlatform) => Promise<Date[]>;
}
/**
 * MEDIA OPTIMIZATION ENGINE
 */
export interface MediaOptimizer {
    optimizeForPlatforms: (file: File, platforms: SocialPlatform[]) => Promise<Record<SocialPlatform, OptimizedMedia>>;
    resizeImage: (file: File, width: number, height: number) => Promise<File>;
    convertVideo: (file: File, format: string, aspectRatio: string) => Promise<File>;
    generateThumbnail: (videoFile: File) => Promise<File>;
    validateMediaForPlatform: (file: File, platform: SocialPlatform) => ValidationResult;
}
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    recommendations: string[];
}
/**
 * ANALYTICS ENGINE
 */
export interface SocialAnalytics {
    syncMetricsFromPlatforms: (accountId: string) => Promise<void>;
    getEngagementReport: (churchId: string, dateRange: DateRange) => Promise<EngagementReport>;
    getGrowthReport: (churchId: string, dateRange: DateRange) => Promise<GrowthReport>;
    getContentPerformanceReport: (churchId: string, dateRange: DateRange) => Promise<ContentReport>;
}
export interface EngagementReport {
    totalReach: number;
    totalImpressions: number;
    totalEngagement: number;
    engagementRate: number;
    byPlatform: Record<SocialPlatform, PlatformMetrics>;
    topPerformingPosts: SocialMediaPost[];
    engagementTrends: TimeSeries[];
}
export interface PlatformMetrics {
    reach: number;
    impressions: number;
    likes: number;
    shares: number;
    comments: number;
    clicks: number;
    saves: number;
}
export interface DateRange {
    start: Date;
    end: Date;
}
export interface TimeSeries {
    date: Date;
    value: number;
}
export interface GrowthReport {
    followerGrowth: Record<SocialPlatform, number>;
    reachGrowth: number;
    engagementGrowth: number;
    growthTrends: Record<SocialPlatform, TimeSeries[]>;
}
export interface ContentReport {
    totalPosts: number;
    postsPerPlatform: Record<SocialPlatform, number>;
    contentTypes: {
        images: number;
        videos: number;
        text: number;
    };
    bestPerformingContent: {
        images: SocialMediaPost[];
        videos: SocialMediaPost[];
        text: SocialMediaPost[];
    };
    hashtagPerformance: {
        hashtag: string;
        usage: number;
        avgEngagement: number;
    }[];
}
/**
 * FEATURE FLAGS (Base vs Premium)
 */
export interface SocialMediaFeatures {
    basicPosting: boolean;
    scheduling: boolean;
    multiPlatform: boolean;
    basicAnalytics: boolean;
    mediaUpload: boolean;
    aiContentGeneration: boolean;
    aiHashtagSuggestions: boolean;
    aiOptimalTiming: boolean;
    advancedAnalytics: boolean;
    aiInsights: boolean;
    contentTemplates: boolean;
}
export declare const BASE_TIER_FEATURES: SocialMediaFeatures;
export declare const PREMIUM_AI_FEATURES: SocialMediaFeatures;
//# sourceMappingURL=social-media-v2.d.ts.map