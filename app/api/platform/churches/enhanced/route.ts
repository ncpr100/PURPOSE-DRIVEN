import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado - Se requiere rol SUPER_ADMIN' }, { status: 403 })
    }

    // Fetch enhanced church data with health metrics
    const churchesData = await db.churches.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        isActive: true,
        createdAt: true,
        members: {
          select: { id: true }
        },
        users: {
          select: { 
            id: true, 
            createdAt: true,
            isActive: true
          }
        },
        events: {
          select: { id: true, createdAt: true },
          where: { 
            createdAt: { 
              gte: new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)) // Last 30 days
            }
          }
        },
        donations: {
          select: { id: true, amount: true, createdAt: true },
          where: { 
            createdAt: { 
              gte: new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)) // Last 30 days
            }
          }
        },
        communications: {
          select: { id: true, createdAt: true },
          where: { 
            createdAt: { 
              gte: new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)) // Last 30 days
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate enhanced metrics for each church
    const enhancedChurches = churchesData.map(church => {
      const memberCount = church.members.length
      const totalUsers = church.users.length
      const recentEvents = church.events.length
      const recentDonations = church.donations.length
      const recentCommunications = church.communications.length
      
      // Calculate active users (use creation date as proxy for activity)
      const activeUsers = church.users.filter(user => 
        user.isActive &&
        user.createdAt > new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)) // Created in last 30 days
      ).length

      // Calculate total monthly revenue from donations
      const monthlyRevenue = church.donations.reduce((sum, donation) => sum + donation.amount, 0)
      
      // Calculate days since creation
      const daysSinceCreated = Math.floor((Date.now() - church.createdAt.getTime()) / (24 * 60 * 60 * 1000))
      
      // Calculate health score (0-100)
      let healthScore = 50 // Base score

      // Positive factors
      if (memberCount > 10) healthScore += 15
      if (memberCount > 50) healthScore += 10
      if (recentEvents > 2) healthScore += 10
      if (recentDonations > 5) healthScore += 10
      if (activeUsers > 2) healthScore += 10
      if (monthlyRevenue > 500) healthScore += 5
      if (recentCommunications > 1) healthScore += 5

      // Negative factors  
      if (daysSinceCreated > 30 && memberCount < 5) healthScore -= 20
      if (activeUsers === 0 && daysSinceCreated > 30) healthScore -= 25  // Changed from 7 to 30 days
      if (recentEvents === 0 && daysSinceCreated > 14) healthScore -= 10
      if (!church.isActive) healthScore -= 30

      // Ensure score is within bounds
      healthScore = Math.max(0, Math.min(100, healthScore))

      // Determine risk level
      let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'
      if (healthScore < 30) riskLevel = 'HIGH'
      else if (healthScore < 60) riskLevel = 'MEDIUM'

      // Get last activity date (use most recent creation dates as proxy)
      const allActivityDates = [
        ...church.events.map(e => e.createdAt),
        ...church.donations.map(d => d.createdAt),
        ...church.communications.map(c => c.createdAt),
        ...church.users.filter(u => u.isActive).map(u => u.createdAt)
      ]
      
      const lastActivity = allActivityDates.length > 0 
        ? new Date(Math.max(...allActivityDates.map(d => d.getTime())))
        : church.createdAt

      return {
        id: church.id,
        name: church.name,
        contactEmail: church.email || '',
        contactPhone: church.phone,
        city: church.address ? church.address.split(',')[0] : 'No especificado',
        country: 'No especificado', // Not available in schema
        isActive: church.isActive,
        subscription: 'free', // Default since no subscription field in schema
        createdAt: church.createdAt.toISOString(),
        memberCount,
        activeUsers,
        lastActivity: lastActivity.toISOString(),
        monthlyRevenue,
        healthScore,
        riskLevel,
        recentActivity: {
          events: recentEvents,
          donations: recentDonations,
          communications: recentCommunications
        }
      }
    })

    // Sort by health score (lowest first to highlight at-risk churches)
    enhancedChurches.sort((a, b) => {
      if (a.riskLevel === 'HIGH' && b.riskLevel !== 'HIGH') return -1
      if (b.riskLevel === 'HIGH' && a.riskLevel !== 'HIGH') return 1
      return a.healthScore - b.healthScore
    })

    const summary = {
      totalChurches: enhancedChurches.length,
      activeChurches: enhancedChurches.filter(c => c.isActive).length,
      healthyChurches: enhancedChurches.filter(c => c.healthScore >= 70).length,
      atRiskChurches: enhancedChurches.filter(c => c.riskLevel === 'HIGH').length,
      averageHealthScore: Math.round(
        enhancedChurches.reduce((sum, c) => sum + c.healthScore, 0) / enhancedChurches.length
      ),
      totalRevenue: enhancedChurches.reduce((sum, c) => sum + c.monthlyRevenue, 0)
    }

    return NextResponse.json({
      churches: enhancedChurches,
      summary,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching enhanced church data:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
}