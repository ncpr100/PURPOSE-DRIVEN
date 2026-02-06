/**
 * SOCIAL MEDIA V2 - MAIN PAGE
 * 
 * GoHighLevel-style social media management dashboard
 * Hybrid Base (free) + Premium AI (paid addon) architecture
 */

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import SocialMediaDashboardClient from './_components/social-media-dashboard-client'

export default async function SocialMediaV2Page() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.churchId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Acceso Requerido</h2>
          <p className="text-gray-600">Necesitas iniciar sesión para acceder al módulo de redes sociales.</p>
        </div>
      </div>
    )
  }

  const churchId = session.user.churchId

  // Fetch connected accounts
  const connectedAccounts = await db.social_media_accounts_v2.findMany({
    where: {
      churchId,
      isActive: true
    },
    orderBy: { createdAt: 'desc' }
  })

  // Check AI addon subscription
  const aiAddon = await db.church_subscription_addons.findFirst({
    where: {
      churchId,
      addonId: 'social-media-ai',
      isActive: true,
      expiresAt: { gt: new Date() }
    }
  })

  // Get recent posts
  const recentPosts = await db.social_media_posts_v2.findMany({
    where: { churchId },
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
    take: 10
  })

  // Get church info for AI context
  const church = await db.church.findUnique({
    where: { id: churchId },
    select: { 
      name: true, 
      description: true,
      settings: true,
      brandColors: true
    }
  })

  return (
    <SocialMediaDashboardClient 
      connectedAccounts={connectedAccounts}
      recentPosts={recentPosts}
      aiAddonActive={!!aiAddon}
      aiAddonExpiry={aiAddon?.expiresAt}
      userRole={session.user.role}
      church={church}
    />
  )
}