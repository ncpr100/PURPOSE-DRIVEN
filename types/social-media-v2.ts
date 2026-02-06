/**
 * HYBRID SOCIAL MEDIA SYSTEM ARCHITECTURE
 * GoHighLevel-Style User Experience with Base + Premium AI Tiers
 * 
 * Enterprise-Level Social Media Management Platform
 * Base Tier: Professional social media management (included)
 * Premium Tier: AI-powered content generation (paid addon)
 */

export interface SocialMediaTier {
  BASE: 'social_media_base'
  PREMIUM_AI: 'social_media_ai_premium'
}

export const SOCIAL_MEDIA_TIERS: SocialMediaTier = {
  BASE: 'social_media_base',
  PREMIUM_AI: 'social_media_ai_premium'
}

/**
 * SUPPORTED PLATFORMS (Phase 1: Facebook, Instagram, YouTube)
 */
export type SocialPlatform = 'FACEBOOK' | 'INSTAGRAM' | 'YOUTUBE'

export const SOCIAL_PLATFORMS: Record<SocialPlatform, SocialPlatformConfig> = {
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
}

/**
 * PLATFORM CONFIGURATION INTERFACES
 */
export interface SocialPlatformConfig {
  id: SocialPlatform
  name: string
  icon: string
  color: string
  oauth: OAuthConfig
  api: APIConfig
  mediaRequirements: MediaRequirements
}

export interface OAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scopes: string[]
  authUrl: string
  tokenUrl: string
}

export interface APIConfig {
  baseUrl: string
  publishEndpoint: string
  mediaEndpoint: string
  rateLimit: { requests: number; window: number }
}

export interface MediaRequirements {
  image?: MediaSpec
  video?: MediaSpec
  story?: MediaSpec
  reel?: MediaSpec
  short?: MediaSpec
  thumbnail?: MediaSpec
}

export interface MediaSpec {
  formats: string[]
  maxSize: string
  aspectRatio: string
  maxDuration?: number // seconds
}

/**
 * SOCIAL MEDIA ACCOUNT (Connected Platform Account)
 */
export interface SocialMediaAccount {
  id: string
  churchId: string
  platform: SocialPlatform
  platformAccountId: string // Platform's user/page ID
  username?: string
  displayName?: string
  profileImageUrl?: string
  
  // OAuth Tokens (encrypted)
  accessToken: string
  refreshToken?: string
  tokenExpiresAt?: Date
  
  // Account Status
  isActive: boolean
  connectionStatus: 'CONNECTED' | 'EXPIRED' | 'ERROR' | 'DISCONNECTED'
  lastSync?: Date
  lastError?: string
  
  // Permissions
  permissions: string[] // Scopes granted
  canPost: boolean
  canSchedule: boolean
  canAccessAnalytics: boolean
  
  // Metadata
  accountMetadata?: any // Platform-specific data
  createdAt: Date
  updatedAt: Date
}

/**
 * SOCIAL MEDIA POST (Content + Scheduling)
 */
export interface SocialMediaPost {
  id: string
  churchId: string
  
  // Content
  title?: string
  content: string
  hashtags: string[]
  mentions: string[]
  
  // Media
  mediaFiles: MediaFile[]
  
  // Targeting & Publishing
  platforms: SocialPlatform[]
  accountIds: string[] // Which accounts to post to
  
  // Scheduling
  status: PostStatus
  scheduledAt?: Date
  publishedAt?: Date
  
  // Publishing Results
  publishResults: PlatformPublishResult[]
  
  // Campaign Association
  campaignId?: string
  
  // AI Generation (Premium Tier)
  generatedByAI: boolean
  aiPrompt?: string
  aiModelUsed?: string
  
  // Metadata
  authorId: string
  createdAt: Date
  updatedAt: Date
}

export type PostStatus = 
  | 'DRAFT'           // Being composed
  | 'SCHEDULED'       // Queued for publishing
  | 'PUBLISHING'      // Currently being published
  | 'PUBLISHED'       // Successfully published to all platforms
  | 'PARTIALLY_PUBLISHED' // Published to some platforms, failed on others
  | 'FAILED'          // Failed to publish to any platform
  | 'CANCELLED'       // User cancelled scheduled post

export interface MediaFile {
  id: string
  url: string
  type: 'IMAGE' | 'VIDEO'
  filename: string
  fileSize: number
  mimeType: string
  
  // Platform Optimizations
  optimizations: Record<SocialPlatform, OptimizedMedia>
}

export interface OptimizedMedia {
  url: string
  width: number
  height: number
  fileSize: number
  format: string
  processingStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
}

export interface PlatformPublishResult {
  platform: SocialPlatform
  accountId: string
  status: 'SUCCESS' | 'FAILED' | 'RETRY_SCHEDULED'
  platformPostId?: string // Platform's post ID
  publishedAt?: Date
  errorMessage?: string
  retryCount: number
  nextRetryAt?: Date
}

/**
 * AI CONTENT GENERATION (Premium Tier)
 */
export interface AIContentRequest {
  churchId: string
  userId: string
  
  // Input
  prompt: string
  contentType: 'POST' | 'STORY' | 'REEL_DESCRIPTION' | 'VIDEO_SCRIPT'
  platforms: SocialPlatform[]
  tone: 'INSPIRATIONAL' | 'WELCOMING' | 'EDUCATIONAL' | 'CELEBRATORY' | 'EVANGELICAL'
  
  // Church Context
  churchName: string
  churchValues?: string[]
  targetAudience?: string
  seasonalContext?: string // Christmas, Easter, etc.
  
  // Generation Settings
  maxLength?: number
  includeHashtags: boolean
  includeMentions: boolean
  includeCallToAction: boolean
}

export interface AIContentResponse {
  requestId: string
  content: string
  adaptedContent: Record<SocialPlatform, string> // Platform-specific versions
  suggestedHashtags: string[]
  suggestedMentions: string[]
  callToAction?: string
  
  // AI Metadata
  modelUsed: string
  processingTime: number
  tokensUsed: number
  
  // Billing
  cost: number // in cents
  billingTier: string
}

/**
 * SCHEDULING ENGINE
 */
export interface SchedulingEngine {
  // Queue Management 
  addToQueue: (post: SocialMediaPost) => Promise<void>
  removeFromQueue: (postId: string) => Promise<void>
  
  // Publishing
  processQueue: () => Promise<void>
  publishPost: (post: SocialMediaPost) => Promise<PlatformPublishResult[]>
  
  // Retry Logic
  scheduleRetry: (post: SocialMediaPost, platform: SocialPlatform) => Promise<void>
  
  // Optimal Timing
  suggestOptimalTimes: (churchId: string, platform: SocialPlatform) => Promise<Date[]>
}

/**
 * MEDIA OPTIMIZATION ENGINE
 */
export interface MediaOptimizer {
  // Auto-format for platforms
  optimizeForPlatforms: (file: File, platforms: SocialPlatform[]) => Promise<Record<SocialPlatform, OptimizedMedia>>
  
  // Specific optimizations
  resizeImage: (file: File, width: number, height: number) => Promise<File>
  convertVideo: (file: File, format: string, aspectRatio: string) => Promise<File>
  generateThumbnail: (videoFile: File) => Promise<File>
  
  // Validation
  validateMediaForPlatform: (file: File, platform: SocialPlatform) => ValidationResult
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  recommendations: string[]
}

/**
 * ANALYTICS ENGINE 
 */
export interface SocialAnalytics {
  // Metrics Collection
  syncMetricsFromPlatforms: (accountId: string) => Promise<void>
  
  // Reporting
  getEngagementReport: (churchId: string, dateRange: DateRange) => Promise<EngagementReport>
  getGrowthReport: (churchId: string, dateRange: DateRange) => Promise<GrowthReport>
  getContentPerformanceReport: (churchId: string, dateRange: DateRange) => Promise<ContentReport>
}

export interface EngagementReport {
  totalReach: number
  totalImpressions: number
  totalEngagement: number
  engagementRate: number
  
  byPlatform: Record<SocialPlatform, PlatformMetrics>
  topPerformingPosts: SocialMediaPost[]
  engagementTrends: TimeSeries[]
}

export interface PlatformMetrics {
  reach: number
  impressions: number
  likes: number
  shares: number 
  comments: number
  clicks: number
  saves: number
}

export interface DateRange {
  start: Date
  end: Date
}

export interface TimeSeries {
  date: Date
  value: number
}

export interface GrowthReport {
  followerGrowth: Record<SocialPlatform, number>
  reachGrowth: number
  engagementGrowth: number
  
  growthTrends: Record<SocialPlatform, TimeSeries[]>
}

export interface ContentReport {
  totalPosts: number
  postsPerPlatform: Record<SocialPlatform, number>
  
  contentTypes: {
    images: number
    videos: number
    text: number
  }
  
  bestPerformingContent: {
    images: SocialMediaPost[]
    videos: SocialMediaPost[]
    text: SocialMediaPost[]
  }
  
  hashtagPerformance: {
    hashtag: string
    usage: number
    avgEngagement: number
  }[]
}

/**
 * FEATURE FLAGS (Base vs Premium)
 */
export interface SocialMediaFeatures { 
  // Base Tier (Free)
  basicPosting: boolean
  scheduling: boolean
  multiPlatform: boolean
  basicAnalytics: boolean
  mediaUpload: boolean
  
  // Premium Tier (AI Addon)
  aiContentGeneration: boolean
  aiHashtagSuggestions: boolean
  aiOptimalTiming: boolean
  advancedAnalytics: boolean
  aiInsights: boolean
  contentTemplates: boolean
}

export const BASE_TIER_FEATURES: SocialMediaFeatures = {
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
}

export const PREMIUM_AI_FEATURES: SocialMediaFeatures = {
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
}