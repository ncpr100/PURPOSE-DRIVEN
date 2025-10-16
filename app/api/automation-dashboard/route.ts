import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

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

    // Fetch today's executions
    const executions = await prisma.automationExecution.findMany({
      where: {
        churchId,
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      },
      select: {
        id: true,
        status: true,
        startedAt: true,
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
      e.status === 'PENDING'
    ).length
    const retryingExecutions = executions.filter(e => 
      e.status === 'RETRYING'
    ).length

    // Calculate success rate
    const successRate = totalExecutions > 0 
      ? (successfulExecutions / totalExecutions) * 100 
      : 0

    // Calculate average execution time
    const completedExecutions = executions.filter(e => e.completedAt && e.startedAt)
    const avgExecutionTime = completedExecutions.length > 0
      ? completedExecutions.reduce((sum, e) => {
          const duration = (new Date(e.completedAt!).getTime() - new Date(e.startedAt!).getTime()) / 1000
          return sum + duration
        }, 0) / completedExecutions.length
      : 0

    // Fetch recent executions (last 100)
    const recentExecutions = await prisma.automationExecution.findMany({
      where: { churchId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        automationRuleId: true,
        entityType: true,
        entityId: true,
        status: true,
        retryCount: true,
        startedAt: true,
        completedAt: true,
        error: true,
        automationRule: {
          select: {
            name: true
          }
        }
      }
    })

    // Fetch manual approval tasks (pending follow-ups)
    const manualTasks = await prisma.visitorFollowUp.findMany({
      where: {
        status: 'PENDING',
        visitorProfile: {
          churchId
        }
      },
      orderBy: { scheduledFor: 'asc' },
      take: 50,
      select: {
        id: true,
        visitorName: true,
        followUpType: true,
        status: true,
        priority: true,
        contactMethod: true,
        assignedToId: true,
        scheduledFor: true,
        assignedTo: {
          select: {
            name: true
          }
        }
      }
    })

    // Format response
    const stats = {
      totalRules,
      activeRules,
      inactiveRules,
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      pendingExecutions,
      retryingExecutions,
      avgExecutionTime,
      successRate
    }

    const formattedExecutions = recentExecutions.map(e => ({
      id: e.id,
      automationRuleId: e.automationRuleId,
      ruleName: e.automationRule?.name || 'Regla sin nombre',
      entityType: e.entityType,
      entityId: e.entityId,
      status: e.status,
      retryCount: e.retryCount || 0,
      startedAt: e.startedAt,
      completedAt: e.completedAt,
      error: e.error
    }))

    const formattedTasks = manualTasks.map(t => ({
      id: t.id,
      visitorName: t.visitorName,
      followUpType: t.followUpType,
      status: t.status,
      priority: t.priority,
      contactMethod: t.contactMethod,
      assignedTo: t.assignedTo?.name || null,
      scheduledFor: t.scheduledFor
    }))

    return NextResponse.json({
      stats,
      recentExecutions: formattedExecutions,
      manualTasks: formattedTasks
    })

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Error al cargar dashboard' },
      { status: 500 }
    )
  }
}
