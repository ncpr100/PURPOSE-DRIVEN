/**
 * SOCIAL MEDIA SCHEDULING ENGINE
 * 
 * Core posting and scheduling system for hybrid social media
 * Handles Base tier (manual posts) and Premium tier (AI-generated)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'
import { SocialMediaPost, SocialPlatform, PostStatus } from '@/types/social-media-v2'
import { decryptToken } from '../../social-oauth/facebook/callback/route'

export const dynamic = 'force-dynamic'

// POST: Schedule new social media post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const churchId = session.user.churchId
    const body = await request.json()

    const {
      content,
      platforms,
      scheduledAt,
      title,
      hashtags = [],
      mediaUrls = [],
      postType = 'STANDARD',
      targetAudience = 'GENERAL',
      useAI = false // Premium feature
    } = body

    // Validate required fields
    if (!content && !mediaUrls.length) {
      return NextResponse.json(
        { error: 'Content or media is required' },
        { status: 400 }
      )
    }

    if (!platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'At least one platform is required' },
        { status: 400 }
      )
    }

    // Check AI addon subscription if AI features requested
    if (useAI) {
      // Get church subscription first
      const churchSubscription = await db.church_subscriptions.findUnique({
        where: { churchId }
      })

      if (!churchSubscription) {
        return NextResponse.json(
          { 
            error: 'AI Content Generation requires Premium addon',
            code: 'AI_ADDON_REQUIRED',
            upgradeUrl: '/social-media?upgrade=ai'
          },
          { status: 402 }
        )
      }

      const aiAddon = await db.church_subscription_addons.findFirst({
        where: {
          subscriptionId: churchSubscription.id,
          subscription_addons: {
            key: 'social_media_ai_premium'
          },
          isActive: true
        }
      })

      if (!aiAddon) {
        return NextResponse.json(
          { 
            error: 'AI Content Generation requires Premium addon',
            code: 'AI_ADDON_REQUIRED',
            upgradeUrl: '/social-media?upgrade=ai'
          },
          { status: 402 } // Payment Required
        )
      }
    }

    // Validate connected accounts for selected platforms
    const connectedAccounts = await db.social_media_accounts.findMany({
      where: {
        churchId,
        platform: { in: platforms },
        isActive: true
      }
    })

    const missingPlatforms = platforms.filter(
      platform => !connectedAccounts.some(account => account.platform === platform)
    )

    if (missingPlatforms.length > 0) {
      return NextResponse.json(
        {
          error: 'Not all platforms are connected',
          missingPlatforms,
          connectUrl: '/social-media?action=connect'
        },
        { status: 400 }
      )
    }

    // Generate AI content if requested (Premium feature)
    let finalContent = content
    let aiMetadata = null

    if (useAI && content) {
      try {
        const aiResult = await generateAIContent({
          baseContent: content,
          platforms,
          targetAudience,
          churchId
        })
        
        finalContent = aiResult.content
        aiMetadata = aiResult.metadata
      } catch (error) {
        console.error('AI content generation failed:', error)
        // Fallback to original content
        finalContent = content
      }
    }

    // Determine post status
    const isScheduled = scheduledAt && new Date(scheduledAt) > new Date()
    const status: PostStatus = isScheduled ? 'SCHEDULED' : 'DRAFT'

    // Create post record
    const postId = nanoid()
    const post = await db.social_media_posts.create({
      data: {
        id: postId,
        churchId,
        authorId: session.user.id,
        
        // Content
        content: finalContent,
        title: title || null,
        mediaUrls: mediaUrls.length > 0 ? JSON.stringify(mediaUrls) : null,
        hashtags: hashtags ? JSON.stringify(hashtags) : null,
        
        // Platform targeting
        platforms: JSON.stringify(platforms),
        accountIds: JSON.stringify(connectedAccounts.map(acc => acc.id)),
        
        // Scheduling
        status,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        publishedAt: null,
        postIds: null,
        engagement: null,
        mentions: null,
        campaignId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })


    // Schedule immediate publishing or queue for later
    if (!isScheduled) {
      // Publish immediately in background
      publishPostImmediately(postId).catch(error => {
        console.error('Immediate publish failed:', error)
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        post: {
          id: post.id,
          content: post.content,
          status: post.status,
          scheduledAt: post.scheduledAt,
          platforms: JSON.parse(post.platforms),
          accountIds: JSON.parse(post.accountIds)
        }
      }
    })

  } catch (error) {
    console.error('Error creating social media post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

// GET: Retrieve scheduled posts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const churchId = session.user.churchId
    const { searchParams } = new URL(request.url)
    
    const status = searchParams.get('status')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')

    const whereClause: any = { churchId }
    if (status) {
      whereClause.status = status.toUpperCase()
    }

    const [posts, total] = await Promise.all([
      db.social_media_posts.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      db.social_media_posts.count({ where: whereClause })
    ])

    return NextResponse.json({
      success: true,
      data: {
        posts: posts.map(post => ({
          id: post.id,
          content: post.content,
          status: post.status,
          scheduledAt: post.scheduledAt,
          createdAt: post.createdAt,
          publishedAt: post.publishedAt,
          platforms: typeof post.platforms === 'string' ? JSON.parse(post.platforms) : post.platforms,
          accountIds: typeof post.accountIds === 'string' ? JSON.parse(post.accountIds) : post.accountIds,
          authorId: post.authorId
        })),
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + posts.length < total
        }
      }
    })

  } catch (error) {
    console.error('Error fetching social media posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

/**
 * Generate AI content for Premium tier
 */
async function generateAIContent({
  baseContent,
  platforms,
  targetAudience,
  churchId
}: {
  baseContent: string
  platforms: SocialPlatform[]
  targetAudience: string
  churchId: string
}) {
  // In production, this would call GPT-4 API
  // For demo purposes, we'll enhance the content
  
  const church = await db.churches.findUnique({
    where: { id: churchId },
    select: { name: true, description: true }
  })

  const churchContext = church ? `${church.name} - ${church.description}` : 'our church community'
  
  // Mock AI enhancement (replace with actual GPT-4 call)
  const enhancedContent = `${baseContent}

🙏 Join us at ${churchContext} as we grow together in faith!

#Faith #Community #Church #Spiritual #Blessings`

  return {
    content: enhancedContent,
    metadata: {
      originalLength: baseContent.length,
      enhancedLength: enhancedContent.length,
      platformOptimization: platforms,
      targetAudience,
      generatedAt: new Date().toISOString()
    }
  }
}

/**
 * Optimize content for specific platforms
 */
async function optimizeContentForPlatform(
  content: string,
  platform: SocialPlatform,
  mediaUrls: string[]
) {
  const optimizations = {
    FACEBOOK: {
      maxLength: 63206,
      preferredLength: 500,
      hashtagLimit: 30
    },
    INSTAGRAM: {
      maxLength: 2200,
      preferredLength: 125,
      hashtagLimit: 30
    },
    YOUTUBE: {
      maxLength: 5000,
      preferredLength: 200,
      hashtagLimit: 15
    }
  }

  const config = optimizations[platform]
  let optimizedContent = content

  // Truncate if too long
  if (content.length > config.maxLength) {
    optimizedContent = content.substring(0, config.maxLength - 3) + '...'
  }

  // Platform-specific media handling
  let optimizedMediaUrls = mediaUrls

  if (platform === 'YOUTUBE' && mediaUrls.length > 0) {
    // YouTube needs video uploads, not just URLs
    optimizedMediaUrls = []
  }

  return {
    content: optimizedContent,
    mediaUrls: optimizedMediaUrls
  }
}

/**
 * Publish post immediately (background process)
 */
async function publishPostImmediately(postId: string) {
  try {
    const post = await db.social_media_posts.findUnique({
      where: { id: postId }
    })

    if (!post) {
      console.error('Post not found for immediate publishing:', postId)
      return
    }

    // Parse JSON fields
    const platforms = typeof post.platforms === 'string' ? JSON.parse(post.platforms) : post.platforms
    const accountIds = typeof post.accountIds === 'string' ? JSON.parse(post.accountIds) : post.accountIds
    const mediaUrls = post.mediaUrls ? (typeof post.mediaUrls === 'string' ? JSON.parse(post.mediaUrls) : post.mediaUrls) : []

    // Get all accounts for this post
    const accounts = await db.social_media_accounts.findMany({
      where: {
        id: { in: accountIds },
        isActive: true
      }
    })

    // Update post status
    await db.social_media_posts.update({
      where: { id: postId },
      data: { 
        status: 'PUBLISHING',
        publishedAt: new Date()
      }
    })

    // Publish to each platform
    const postIdsMap: Record<string, string> = {}
    let successCount = 0

    for (const account of accounts) {
      try {
        const accessToken = decryptToken(account.accessToken)

        switch (account.platform) {
          case 'FACEBOOK': {
            const result = await publishToFacebook(accessToken, post.content, mediaUrls, account)
            if (result && result.postId) {
              postIdsMap[account.platform] = result.postId
              successCount++
            }
            break
          }
          case 'INSTAGRAM': {
            const result = await publishToInstagram(accessToken, post.content, mediaUrls, account)
            if (result && result.postId) {
              postIdsMap[account.platform] = result.postId
              successCount++
            }
            break
          }
          case 'YOUTUBE': {
            const result = await publishToYouTube(accessToken, post.content, mediaUrls, account)
            if (result && result.postId) {
              postIdsMap[account.platform] = result.postId
              successCount++
            }
            break
          }
        }
      } catch (platformError) {
        console.error(`Failed to publish to ${account.platform}:`, platformError)
      }
    }

    // Update final status with platform post IDs
    const finalStatus = successCount > 0 ? 'PUBLISHED' : 'FAILED'
    await db.social_media_posts.update({
      where: { id: postId },
      data: { 
        status: finalStatus,
        postIds: JSON.stringify(postIdsMap)
      }
    })

    console.log(`✅ Post ${postId} published to ${successCount}/${accounts.length} platforms`)

  } catch (error) {
    console.error('Error in immediate publishing:', error)
    
    // Mark post as failed
    await db.social_media_posts.update({
      where: { id: postId },
      data: { status: 'FAILED' }
    })
  }
}

/**
 * Platform-specific publishing functions
 */
async function publishToFacebook(accessToken: string, content: string, mediaUrls: string[], account: any) {
  // Implementation would use Facebook Graph API
  // This is a placeholder for the actual API call
  return {
    postId: `fb_${Date.now()}`,
    postUrl: `https://facebook.com/posts/${Date.now()}`
  }
}

async function publishToInstagram(accessToken: string, content: string, mediaUrls: string[], account: any) {
  // Implementation would use Instagram Graph API
  // This is a placeholder for the actual API call
  return {
    postId: `ig_${Date.now()}`,
    postUrl: `https://instagram.com/p/${Date.now()}`
  }
}

async function publishToYouTube(accessToken: string, content: string, mediaUrls: string[], account: any) {
  // Implementation would use YouTube Data API
  // This is a placeholder for the actual API call
  return {
    postId: `yt_${Date.now()}`,
    postUrl: `https://youtube.com/watch?v=${Date.now()}`
  }
}
}