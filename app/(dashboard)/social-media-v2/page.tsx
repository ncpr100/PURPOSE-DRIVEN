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

  // Fetch connected accounts with database fallback
  let connectedAccounts = []
  let aiAddon = null
  let recentPosts = []
  let church = null

  try {
    // Try to fetch data from database
    connectedAccounts = await db.socialMediaAccount?.findMany({
      where: {
        churchId,
        isActive: true
      },
      orderBy: { createdAt: 'desc' }
    }) || []

    // Check AI addon subscription
    aiAddon = await db.churchSubscriptionAddon?.findFirst({
      where: {
        addonId: 'social-media-ai',
        isActive: true
      }
    }) || null

    // Get recent posts
    recentPosts = await db.socialMediaPost?.findMany({
      where: { churchId },
      orderBy: { createdAt: 'desc' },
      take: 10
    }) || []

    // Get church info for AI context
    church = await db.church?.findUnique({
      where: { id: churchId },
      select: { 
        name: true, 
        description: true
      }
    }) || null

  } catch (error) {
    console.log('⚠️ Database unavailable for social media page, using fallback data')
    // Use fallback data when database fails
    connectedAccounts = []
    aiAddon = null
    recentPosts = []
    church = {
      name: session.user.churchId === 'church-emergency' ? 'Iglesia Central (Emergency)' : 'Mi Iglesia',
      description: 'Iglesia administrada por el sistema'
    }
  }

  return (
    <SocialMediaDashboardClient 
      connectedAccounts={connectedAccounts}
      recentPosts={recentPosts}
      aiAddonActive={!!aiAddon}
      aiAddonExpiry={aiAddon?.updatedAt}
      userRole={session.user.role}
      church={church}
    />
  )
}