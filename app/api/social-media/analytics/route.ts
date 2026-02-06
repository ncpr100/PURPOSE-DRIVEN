/**
 * SOCIAL MEDIA ANALYTICS SYNC API
 * 
 * Syncs engagement metrics from connected social media platforms
 * Provides unified analytics dashboard for all connected accounts
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { decryptToken } from '../../social-oauth/facebook/callback/route'
import { SocialPlatform } from '@/types/social-media-v2'

export const dynamic = 'force-dynamic'

// POST: Trigger analytics sync for all connected accounts
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const churchId = session.user.churchId
    const body = await request.json()
    const { platforms = [], forceSync = false } = body

    // Get connected accounts
    const accountsQuery: any = {
      churchId,
      isActive: true,
      connectionStatus: 'CONNECTED'
    }

    if (platforms.length > 0) {
      accountsQuery.platform = { in: platforms }
    }

    const connectedAccounts = await db.social_media_accounts.findMany({
      where: accountsQuery,
      orderBy: { lastSync: 'asc' }
    })

    if (connectedAccounts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No connected accounts to sync',
        data: { syncedAccounts: [] }
      })
    }

    // Sync analytics for each account
    const syncResults = await Promise.allSettled(
      connectedAccounts.map(account => syncAccountAnalytics(account, forceSync))
    )

    // Process results
    const successfulSyncs = []
    const failedSyncs = []

    syncResults.forEach((result, index) => {
      const account = connectedAccounts[index]
      
      if (result.status === 'fulfilled') {
        successfulSyncs.push({
          accountId: account.id,
          platform: account.platform,
          username: account.username,
          metrics: result.value
        })
      } else {
        failedSyncs.push({
          accountId: account.id,
          platform: account.platform,
          username: account.username,
          error: result.reason?.message || 'Unknown error'
        })
      }
    })

    // Update church-level analytics summary
    await updateChurchAnalyticsSummary(churchId)

    return NextResponse.json({
      success: true,
      data: {
        totalAccounts: connectedAccounts.length,
        successfulSyncs: successfulSyncs.length,
        failedSyncs: failedSyncs.length,
        syncedAccounts: successfulSyncs,
        errors: failedSyncs
      }
    })

  } catch (error) {
    console.error('Error syncing analytics:', error)
    return NextResponse.json(
      { error: 'Failed to sync analytics' },
      { status: 500 }
    )
  }
}

// GET: Get aggregated analytics for church
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const churchId = session.user.churchId
    const { searchParams } = new URL(request.url)
    
    const dateFrom = searchParams.get('dateFrom') 
      ? new Date(searchParams.get('dateFrom')!)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    
    const dateTo = searchParams.get('dateTo')
      ? new Date(searchParams.get('dateTo')!)
      : new Date()

    // Get account analytics
    const accounts = await db.social_media_accounts.findMany({
      where: {
        churchId,
        isActive: true
      },
      select: {
        id: true,
        platform: true,
        username: true,
        displayName: true,
        lastSync: true,
        accountData: true
      }
    })

    // Get post analytics
    const posts = await db.social_media_posts.findMany({
      where: {
        churchId,
        createdAt: {
          gte: dateFrom,
          lte: dateTo
        },
        status: 'PUBLISHED'
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate aggregated metrics from engagement JSON field
    const totalMetrics = posts.reduce((acc, post) => {
      const engagement = typeof post.engagement === 'string' ? JSON.parse(post.engagement) : (post.engagement || {})
      acc.impressions += engagement.impressions || 0
      acc.engagement += engagement.total || 0
      acc.clicks += engagement.clicks || 0
      acc.shares += engagement.shares || 0
      return acc
    }, { impressions: 0, engagement: 0, clicks: 0, shares: 0 })

    // Platform breakdown
    const platformBreakdown: Record<string, any> = {}
    
    accounts.forEach(account => {
      const platformPosts = posts.filter(post => 
        Array.isArray(post.platforms) && post.platforms.includes(account.platform)
      )
      
      const platformMetrics = platformPosts.reduce((acc, post) => {
        acc.posts += 1
        const engagement = typeof post.engagement === 'string' ? JSON.parse(post.engagement) : (post.engagement || {})
        acc.impressions += engagement.impressions || 0
        acc.engagement += engagement.total || 0
        acc.clicks += engagement.clicks || 0
        acc.shares += engagement.shares || 0
        return acc
      }, { posts: 0, impressions: 0, engagement: 0, clicks: 0, shares: 0 })

      if (platformMetrics.posts > 0) {
        platformBreakdown[account.platform] = {
          account: {
            username: account.username,
            displayName: account.displayName,
            profileImage: null
          },
          metrics: platformMetrics,
          averageEngagement: platformMetrics.posts > 0 
            ? Math.round(platformMetrics.engagement / platformMetrics.posts)
            : 0,
          lastSync: account.lastSync
        }
      }
    })

    // Top performing posts
    const topPosts = posts
      .map(post => {
        const engagement = typeof post.engagement === 'string' ? JSON.parse(post.engagement) : (post.engagement || {})
        const totalEngagement = typeof engagement === 'number' ? engagement : (engagement.total || 0)
        return { ...post, engagementValue: totalEngagement }
      })
      .filter(post => post.engagementValue > 0)
      .sort((a, b) => b.engagementValue - a.engagementValue)
      .slice(0, 5)
      .map(post => {
        const engagement = typeof post.engagement === 'string' ? JSON.parse(post.engagement) : (post.engagement || {})
        return {
          id: post.id,
          content: post.content,
          engagement: typeof engagement === 'number' ? engagement : (engagement.total || 0),
          platforms: typeof post.platforms === 'string' ? JSON.parse(post.platforms) : post.platforms,
          createdAt: post.createdAt,
          publishedAt: post.publishedAt
        }
      })

    // Engagement trends (last 30 days)
    const engagementTrends = await calculateEngagementTrends(churchId, dateFrom, dateTo)

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          connectedAccounts: accounts.length,
          totalPosts: posts.length,
          ...totalMetrics,
          averageEngagement: posts.length > 0 
            ? Math.round(totalMetrics.engagement / posts.length)
            : 0,
          engagementRate: totalMetrics.impressions > 0
            ? ((totalMetrics.engagement / totalMetrics.impressions) * 100).toFixed(2)
            : '0.00'
        },
        accounts,
        platformBreakdown,
        topPosts,
        engagementTrends,
        dateRange: { from: dateFrom, to: dateTo }
      }
    })

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

/**
 * Sync analytics for a single account
 */
async function syncAccountAnalytics(account: any, forceSync: boolean = false) {
  try {
    // Skip if recently synced (within last hour) and not forced
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    if (!forceSync && account.lastSync && account.lastSync > oneHourAgo) {
      return { skipped: true, reason: 'Recently synced' }
    }

    const accessToken = decryptToken(account.accessToken)
    let metrics = {}

    switch (account.platform) {
      case 'FACEBOOK':
        metrics = await fetchFacebookAnalytics(accessToken, account)
        break
      case 'INSTAGRAM':
        metrics = await fetchInstagramAnalytics(accessToken, account)
        break
      case 'YOUTUBE':
        metrics = await fetchYouTubeAnalytics(accessToken, account)
        break
      default:
        throw new Error(`Unsupported platform: ${account.platform}`)
    }

    // Update account with latest metrics
    await db.social_media_accounts.update({
      where: { id: account.id },
      data: {
        lastSync: new Date(),
        accountData: {
          ...account.accountData,
          latestMetrics: metrics,
          lastMetricsUpdate: new Date().toISOString()
        }
      }
    })

    return metrics

  } catch (error) {
    console.error(`Analytics sync failed for ${account.platform} account ${account.id}:`, error)
    
    // Update account with error status
    await db.social_media_accounts.update({
      where: { id: account.id },
      data: {
        lastSync: new Date(),
        accountData: {
          ...account.accountData,
          lastSyncError: error.message,
          lastErrorAt: new Date().toISOString()
        }
      }
    })

    throw error
  }
}

/**
 * Platform-specific analytics fetching functions
 */
async function fetchFacebookAnalytics(accessToken: string, account: any) {
  // Mock implementation - in production, use Facebook Graph API
  // GET /me/insights?metric=page_fans,page_impressions,page_engaged_users
  return {
    followers: Math.floor(Math.random() * 5000) + 1000,
    impressions: Math.floor(Math.random() * 10000) + 2000,
    engagement: Math.floor(Math.random() * 500) + 100,
    reach: Math.floor(Math.random() * 8000) + 1500,
    platform: 'FACEBOOK',
    syncedAt: new Date().toISOString()
  }
}

async function fetchInstagramAnalytics(accessToken: string, account: any) {
  // Mock implementation - in production, use Instagram Graph API
  // GET /{instagram-business-account-id}/insights
  return {
    followers: Math.floor(Math.random() * 3000) + 500,
    impressions: Math.floor(Math.random() * 8000) + 1000,
    engagement: Math.floor(Math.random() * 400) + 50,
    reach: Math.floor(Math.random() * 6000) + 800,
    platform: 'INSTAGRAM',
    syncedAt: new Date().toISOString()
  }
}

async function fetchYouTubeAnalytics(accessToken: string, account: any) {
  // Mock implementation - in production, use YouTube Analytics API
  // GET /youtube/analytics/v2/reports
  return {
    subscribers: Math.floor(Math.random() * 2000) + 200,
    views: Math.floor(Math.random() * 15000) + 3000,
    watchTime: Math.floor(Math.random() * 5000) + 1000, // minutes
    engagement: Math.floor(Math.random() * 300) + 30,
    platform: 'YOUTUBE',
    syncedAt: new Date().toISOString()
  }
}

/**
 * Update church-level analytics summary
 */
async function updateChurchAnalyticsSummary(churchId: string) {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    // Aggregate metrics across all platforms
    const [posts, accounts] = await Promise.all([
      db.social_media_posts.findMany({
        where: {
          churchId,
          createdAt: { gte: thirtyDaysAgo },
          status: 'PUBLISHED'
        }
      }),
      db.social_media_accounts.findMany({
        where: {
          churchId,
          isActive: true
        }
      })
    ])

    const summary = {
      totalPosts: posts.length,
      totalImpressions: posts.reduce((sum, post) => {
        const engagement = typeof post.engagement === 'string' ? JSON.parse(post.engagement) : (post.engagement || {})
        return sum + (engagement.impressions || 0)
      }, 0),
      totalEngagement: posts.reduce((sum, post) => {
        const engagement = typeof post.engagement === 'string' ? JSON.parse(post.engagement) : (post.engagement || {})
        return sum + (typeof engagement === 'number' ? engagement : (engagement.total || 0))
      }, 0),
      totalClicks: posts.reduce((sum, post) => {
        const engagement = typeof post.engagement === 'string' ? JSON.parse(post.engagement) : (post.engagement || {})
        return sum + (engagement.clicks || 0)
      }, 0),
      totalShares: posts.reduce((sum, post) => {
        const engagement = typeof post.engagement === 'string' ? JSON.parse(post.engagement) : (post.engagement || {})
        return sum + (engagement.shares || 0)
      }, 0),
      connectedAccounts: accounts.length,
      lastUpdated: new Date()
    }

    // Store summary in database (you might want to create a separate table for this)
    console.log(`📊 Updated analytics summary for church ${churchId}:`, summary)

    return summary

  } catch (error) {
    console.error('Error updating church analytics summary:', error)
    throw error
  }
}

/**
 * Calculate engagement trends over time
 */
async function calculateEngagementTrends(churchId: string, dateFrom: Date, dateTo: Date) {
  try {
    const posts = await db.social_media_posts.findMany({
      where: {
        churchId,
        createdAt: { gte: dateFrom, lte: dateTo },
        status: 'PUBLISHED'
      },
      select: {
        createdAt: true,
        engagement: true
      },
      orderBy: { createdAt: 'asc' }
    })

    // Group by day and calculate daily metrics
    const dailyMetrics: Record<string, any> = {}
    
    posts.forEach(post => {
      const day = post.createdAt.toISOString().split('T')[0]
      
      if (!dailyMetrics[day]) {
        dailyMetrics[day] = {
          date: day,
          posts: 0,
          engagement: 0,
          impressions: 0
        }
      }
      
      const engagement = typeof post.engagement === 'string' ? JSON.parse(post.engagement) : (post.engagement || {})
      const totalEngagement = typeof engagement === 'number' ? engagement : (engagement.total || 0)
      const impressions = typeof engagement === 'object' ? (engagement.impressions || 0) : 0
      
      dailyMetrics[day].posts += 1
      dailyMetrics[day].engagement += totalEngagement
      dailyMetrics[day].impressions += impressions
    })

    // Convert to array and calculate engagement rates
    const trends = Object.values(dailyMetrics).map((day: any) => ({
      ...day,
      engagementRate: day.impressions > 0 
        ? ((day.engagement / day.impressions) * 100).toFixed(2)
        : '0.00',
      averageEngagement: day.posts > 0 
        ? Math.round(day.engagement / day.posts)
        : 0
    }))

    return trends

  } catch (error) {
    console.error('Error calculating engagement trends:', error)
    return []
  }
}