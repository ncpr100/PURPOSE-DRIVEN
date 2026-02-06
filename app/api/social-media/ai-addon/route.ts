/**
 * SOCIAL MEDIA AI CONTENT ADDON
 * 
 * Premium subscription addon for AI-powered content generation
 * Integrates with existing subscription system
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'

export const dynamic = 'force-dynamic'

// GET church's AI content subscription status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const churchId = session.user.churchId

    // Check if church has AI content addon
    const aiAddon = await db.church_subscription_addons.findFirst({
      where: {
        subscription: {
          churchId,
          status: 'ACTIVE'
        },
        subscription_addons: {
          key: 'social_media_ai_premium'
        },
        isActive: true
      },
      include: {
        subscription_addons: true
      }
    })

    const hasAIAccess = !!aiAddon

    // Get usage statistics if they have access
    let usage = null
    if (hasAIAccess) {
      const currentMonth = new Date()
      currentMonth.setDate(1)
      currentMonth.setHours(0, 0, 0, 0)

      const nextMonth = new Date(currentMonth)
      nextMonth.setMonth(nextMonth.getMonth() + 1)

      usage = await db.ai_content_usage.aggregate({
        where: {
          churchId,
          createdAt: {
            gte: currentMonth,
            lt: nextMonth
          }
        },
        _sum: {
          tokensUsed: true,
          cost: true
        },
        _count: {
          id: true
        }
      })
    }

    return NextResponse.json({
      hasAIAccess,
      addon: aiAddon?.subscription_addons || null,
      usage: usage ? {
        requestsThisMonth: usage._count.id,
        tokensUsedThisMonth: usage._sum.tokensUsed || 0,
        costThisMonth: usage._sum.cost || 0
      } : null
    })

  } catch (error) {
    console.error('Error checking AI addon status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// SUBSCRIBE to AI content addon
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    const user = await db.users.findUnique({
      where: { id: session.user.id }
    })

    if (!user || !['ADMIN_IGLESIA', 'PASTOR'].includes(user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const churchId = session.user.churchId

    // Get church's current subscription
    const churchSubscription = await db.church_subscriptions.findUnique({
      where: { churchId }
    })

    if (!churchSubscription) {
      return NextResponse.json({ 
        error: 'Church must have an active subscription plan first' 
      }, { status: 400 })
    }

    // Get AI content addon details
    const aiAddon = await db.subscription_addons.findUnique({
      where: { key: 'social_media_ai_premium' }
    })

    if (!aiAddon) {
      return NextResponse.json({ 
        error: 'AI content addon not found' 
      }, { status: 404 })
    }

    // Check if already subscribed
    const existingAddon = await db.church_subscription_addons.findFirst({
      where: {
        subscriptionId: churchSubscription.id,
        addonId: aiAddon.id
      }
    })

    if (existingAddon) {
      return NextResponse.json({ 
        error: 'Already subscribed to AI content addon' 
      }, { status: 400 })
    }

    // Add addon to church subscription
    const addedAddon = await db.church_subscription_addons.create({
      data: {
        id: nanoid(),
        subscriptionId: churchSubscription.id,
        addonId: aiAddon.id,
        quantity: 1,
        isActive: true
      },
      include: {
        subscription_addons: true
      }
    })

    // Log the subscription event
    console.log(`✅ AI Content addon activated for church ${churchId}`)

    return NextResponse.json({
      success: true,
      addon: addedAddon,
      message: 'AI Content addon activated successfully'
    })

  } catch (error) {
    console.error('Error subscribing to AI addon:', error)
    return NextResponse.json(
      { error: 'Failed to activate AI addon' },
      { status: 500 }
    )
  }
}

// UNSUBSCRIBE from AI content addon
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    const user = await db.users.findUnique({
      where: { id: session.user.id }
    })

    if (!user || !['ADMIN_IGLESIA', 'PASTOR'].includes(user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const churchId = session.user.churchId

    // Find and deactivate the addon
    const result = await db.church_subscription_addons.updateMany({
      where: {
        subscription: {
          churchId,
          status: 'ACTIVE'
        },
        subscription_addons: {
          key: 'social_media_ai_premium'
        }
      },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    })

    if (result.count === 0) {
      return NextResponse.json({ 
        error: 'AI content addon not found or already inactive' 
      }, { status: 404 })
    }

    // Log the unsubscription event
    console.log(`⚠️ AI Content addon deactivated for church ${churchId}`)

    return NextResponse.json({
      success: true,
      message: 'AI Content addon deactivated successfully'
    })

  } catch (error) {
    console.error('Error unsubscribing from AI addon:', error)
    return NextResponse.json(
      { error: 'Failed to deactivate AI addon' },
      { status: 500 }
    )
  }
}