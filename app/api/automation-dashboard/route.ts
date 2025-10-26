import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Get user's church
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { churchId: true }
    })

    if (!user?.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 400 })
    }

    const churchId = user.churchId

    // Calculate date range (today)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Fetch all automation rules
    const allRules = await prisma.automationRule.findMany({
      where: { churchId },
      select: {
        id: true,
        name: true,
        isActive: true
      }
    })

    const totalRules = allRules.length
    const activeRules = allRules.filter(r => r.isActive).length
    const inactiveRules = totalRules - activeRules

    // Fetch today's executions from AutomationExecution table
    const executions = await prisma.automationExecution.findMany({
      where: {
        churchId,
        executedAt: {
          gte: today,
          lt: tomorrow
        }
      },
      select: {
        id: true,
        status: true,
        executedAt: true,
        completedAt: true
      }
    })

    const totalExecutions = executions.length
    const successfulExecutions = executions.filter(e => 
      e.status === 'SUCCESS' || e.status === 'COMPLETED'
    ).length
    const failedExecutions = executions.filter(e => 
      e.status === 'FAILED' || e.status === 'ERROR'
    ).length
    const pendingExecutions = executions.filter(e => 
      e.status === 'PENDING' || e.status === 'EJECUTANDO'
    ).length

    // Calculate success rate
    const successRate = totalExecutions > 0 
      ? (successfulExecutions / totalExecutions) * 100 
      : 0

    // Calculate average duration for completed executions
    const completedExecutions = executions.filter(e => e.completedAt && e.executedAt)
    const avgDuration = completedExecutions.length > 0
      ? completedExecutions.reduce((acc, e) => {
          const duration = (new Date(e.completedAt!).getTime() - new Date(e.executedAt).getTime()) / 1000
          return acc + duration
        }, 0) / completedExecutions.length
      : 0

    // Fetch recent executions (last 100) with full details
    const recentExecutions = await prisma.automationExecution.findMany({
      where: { churchId },
      orderBy: { executedAt: 'desc' },
      take: 100,
      select: {
        id: true,
        automationId: true,
        status: true,
        triggerData: true,
        results: true,
        executedAt: true,
        completedAt: true,
        churchId: true
      }
    })

    // Fetch pending follow-ups that require manual intervention
    const pendingFollowUps = await prisma.visitorFollowUp.findMany({
      where: {
        churchId,
        status: 'PENDING'
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        status: true,
        priority: true,
        createdAt: true,
        followUpType: true,
        notes: true
      }
    })

    return NextResponse.json({
      // Overall stats
      stats: {
        totalRules,
        activeRules,
        inactiveRules,
        totalExecutions,
        successfulExecutions,
        failedExecutions,
        pendingExecutions,
        successRate: Math.round(successRate * 10) / 10,
        avgDuration: Math.round(avgDuration * 10) / 10
      },

      // Recent executions (simplified - no retry/error fields as they don't exist)
      recentExecutions: recentExecutions.map(e => {
        // Parse triggerData if it exists
        let parsedTriggerData: any = null
        try {
          if (e.triggerData) {
            parsedTriggerData = JSON.parse(e.triggerData)
          }
        } catch (err) {
          // Invalid JSON, ignore
        }

        return {
          id: e.id,
          automationId: e.automationId,
          ruleName: 'Regla de automatización', // We'd need to join with Automation table to get name
          entityType: parsedTriggerData?.entityType || 'UNKNOWN',
          entityId: parsedTriggerData?.entityId || null,
          status: e.status,
          executedAt: e.executedAt,
          completedAt: e.completedAt,
          triggerData: parsedTriggerData
        }
      }),

      // Manual intervention queue (pending follow-ups)
      manualInterventionQueue: pendingFollowUps.map(t => ({
        id: t.id,
        type: t.followUpType,
        priority: t.priority,
        status: t.status,
        createdAt: t.createdAt,
        notes: t.notes
      }))
    })

  } catch (error) {
    console.error('Error fetching automation dashboard data:', error)
    return NextResponse.json(
      { error: 'Error al cargar datos del dashboard' },
      { status: 500 }
    )
  }
}
