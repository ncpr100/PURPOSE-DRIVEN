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
import { SocialMediaPostV2, PostStatus, PlatformType } from '@/types/social-media-v2'
import { decryptToken } from '../social-oauth/facebook/callback/route'

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
      const aiAddon = await db.church_subscription_addons.findFirst({
        where: {
          churchId,
          addonId: 'social-media-ai',
          isActive: true,
          expiresAt: { gt: new Date() }
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
    const connectedAccounts = await db.social_media_accounts_v2.findMany({
      where: {
        churchId,
        platform: { in: platforms },
        isActive: true,
        connectionStatus: 'CONNECTED'
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
    const status: PostStatus = isScheduled ? 'SCHEDULED' : 'PENDING'

    // Create post record
    const postId = nanoid()
    const post = await db.social_media_posts_v2.create({
      data: {
        id: postId,
        churchId,
        authorId: session.user.id,
        
        // Content
        content: finalContent,
        originalContent: content !== finalContent ? content : null,
        mediaUrls,
        postType,
        targetAudience,
        
        // Scheduling
        status,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        createdAt: new Date(),
        
        // Platform targeting
        platforms,
        
        // AI metadata (Premium feature)
        aiGenerated: useAI,
        aiMetadata: aiMetadata ? JSON.stringify(aiMetadata) : null,
        
        // Analytics
        impressions: 0,
        engagement: 0,
        clicks: 0,
        shares: 0,
      }
    })

    // Create platform-specific post instances
    const platformPosts = await Promise.all(
      connectedAccounts.map(async (account) => {
        const platformSpecificContent = await optimizeContentForPlatform(
          finalContent,
          account.platform,
          mediaUrls
        )

        return db.social_media_platform_posts.create({
          data: {
            id: nanoid(),
            postId: post.id,
            accountId: account.id,
            platform: account.platform,
            
            content: platformSpecificContent.content,
            mediaUrls: platformSpecificContent.mediaUrls,
            
            status: 'PENDING',
            retryCount: 0,
            
            createdAt: new Date()
          }
        })
      })
    )

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
          platforms: post.platforms,
          aiGenerated: post.aiGenerated
        },
        platformPosts: platformPosts.map(pp => ({
          id: pp.id,
          platform: pp.platform,
          status: pp.status
        }))
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
      db.social_media_posts_v2.findMany({
        where: whereClause,
        include: {
          author: {
            select: { name: true, image: true }
          },
          platformPosts: {
            include: {
              account: {
                select: { platform: true, username: true, displayName: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      db.social_media_posts_v2.count({ where: whereClause })
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
          platforms: post.platforms,
          aiGenerated: post.aiGenerated,
          author: post.author,
          platformPosts: post.platformPosts.map(pp => ({
            id: pp.id,
            platform: pp.platform,
            status: pp.status,
            platformUrl: pp.platformPostUrl,
            account: pp.account
          }))
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
  platforms: PlatformType[]
  targetAudience: string
  churchId: string
}) {
  // In production, this would call GPT-4 API
  // For demo purposes, we'll enhance the content
  
  const church = await db.church.findUnique({
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
  platform: PlatformType,
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
    const post = await db.social_media_posts_v2.findUnique({
      where: { id: postId },
      include: {
        platformPosts: {
          include: {
            account: true
          }
        }
      }
    })

    if (!post) {
      console.error('Post not found for immediate publishing:', postId)
      return
    }

    // Update post status
    await db.social_media_posts_v2.update({
      where: { id: postId },
      data: { 
        status: 'PUBLISHING',
        publishedAt: new Date()
      }
    })

    // Publish to each platform
    const publishResults = await Promise.allSettled(
      post.platformPosts.map(platformPost => 
        publishToPlatform(platformPost)
      )
    )

    // Count successful publications
    const successCount = publishResults.filter(result => 
      result.status === 'fulfilled'
    ).length

    // Update final status
    const finalStatus = successCount > 0 ? 'PUBLISHED' : 'FAILED'
    await db.social_media_posts_v2.update({
      where: { id: postId },
      data: { status: finalStatus }
    })

    console.log(`✅ Post ${postId} published to ${successCount}/${post.platformPosts.length} platforms`)

  } catch (error) {
    console.error('Error in immediate publishing:', error)
    
    // Mark post as failed
    await db.social_media_posts_v2.update({
      where: { id: postId },
      data: { status: 'FAILED' }
    })
  }
}

/**
 * Publish to specific platform
 */
async function publishToPlatform(platformPost: any) {
  try {
    const { account, content, mediaUrls } = platformPost
    const accessToken = decryptToken(account.accessToken)

    let result
    
    switch (account.platform) {
      case 'FACEBOOK':
        result = await publishToFacebook(accessToken, content, mediaUrls, account)
        break
      case 'INSTAGRAM':
        result = await publishToInstagram(accessToken, content, mediaUrls, account)
        break
      case 'YOUTUBE':
        result = await publishToYouTube(accessToken, content, mediaUrls, account)
        break
      default:
        throw new Error(`Unsupported platform: ${account.platform}`)
    }

    // Update platform post with success
    await db.social_media_platform_posts.update({
      where: { id: platformPost.id },
      data: {
        status: 'PUBLISHED',
        platformPostId: result.postId,
        platformPostUrl: result.postUrl,
        publishedAt: new Date()
      }
    })

    return result

  } catch (error) {
    console.error(`Publishing failed for ${platformPost.account.platform}:`, error)
    
    // Update platform post with failure
    await db.social_media_platform_posts.update({
      where: { id: platformPost.id },
      data: {
        status: 'FAILED',
        errorMessage: error.message,
        retryCount: { increment: 1 }
      }
    })
    
    throw error
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