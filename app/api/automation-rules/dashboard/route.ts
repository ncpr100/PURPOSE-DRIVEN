import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { churchId: true, role: true }
    })

    if (!user?.churchId) {
      return NextResponse.json({ error: 'No church associated' }, { status: 403 })
    }

    // Get active rules count
    const activeRulesCount = await prisma.automationRule.count({
      where: {
        churchId: user.churchId,
        isActive: true
      }
    })

    // Get executions from last 24 hours using AutomationExecution table
    const last24Hours = new Date()
    last24Hours.setHours(last24Hours.getHours() - 24)

    const executions = await prisma.automationExecution.findMany({
      where: {
        churchId: user.churchId,
        executedAt: {
          gte: last24Hours
        }
      },
      include: {
        automation: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        executedAt: 'desc'
      },
      take: 100
    })

    // Calculate stats based on status
    const totalExecutions = executions.length
    const successfulExecutions = executions.filter(e => 
      e.status === 'COMPLETADO' || e.status === 'COMPLETED'
    ).length
    const failedExecutions = executions.filter(e => 
      e.status === 'FALLIDO' || e.status === 'FAILED'
    ).length
    const pendingExecutions = executions.filter(e => 
      e.status === 'PENDIENTE' || e.status === 'PENDING' || e.status === 'EJECUTANDO'
    ).length
    const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0

    const stats = {
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      pendingExecutions,
      activeRules: activeRulesCount,
      successRate
    }

    return NextResponse.json({
      stats,
      executions: executions.map(exec => ({
        id: exec.id,
        automationRuleId: exec.automationId,
        automationRule: {
          name: exec.automation?.name || 'Unknown Automation',
          priorityLevel: 'NORMAL'
        },
        status: exec.status,
        entityType: 'AUTOMATION',
        startedAt: exec.executedAt,
        completedAt: exec.completedAt,
        error: null,
        retryCount: 0,
        createdAt: exec.executedAt
      }))
    })
  } catch (error) {
    console.error('[AUTOMATION_DASHBOARD_API_ERROR]', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
