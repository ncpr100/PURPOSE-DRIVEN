
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/automation-rules - Get automation rules from database
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
      include: { churches: true }
    })

    if (!user?.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 403 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'CHURCH_ADMIN', 'PASTOR', 'LIDER'].includes(user.role)) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'
    const isActiveParam = searchParams.get('isActive')

    const where: any = { churchId: user.churchId }
    if (isActiveParam !== null && isActiveParam !== undefined && isActiveParam !== '') {
      where.isActive = isActiveParam === 'true'
    }

    const validSortFields = ['createdAt', 'updatedAt', 'name', 'priority', 'executionCount']
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt'

    const [rulesRaw, total] = await Promise.all([
      prisma.automation_rules.findMany({
        where,
        include: {
          automation_triggers: {
            where: { isActive: true },
            select: { id: true, type: true, eventSource: true, configuration: true }
          },
          automation_conditions: {
            where: { isActive: true },
            select: { id: true, type: true, field: true, operator: true, value: true, logicalOperator: true }
          },
          automation_actions: {
            where: { isActive: true },
            select: { id: true, type: true, configuration: true, orderIndex: true, delay: true },
            orderBy: { orderIndex: 'asc' }
          },
          users: { select: { id: true, name: true, email: true } },
          _count: { select: { automation_rule_executions: true } }
        },
        orderBy: { [safeSortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.automation_rules.count({ where })
    ])

    const automationRules = rulesRaw.map(rule => ({
      id: rule.id,
      name: rule.name,
      description: rule.description,
      isActive: rule.isActive,
      priority: rule.priority,
      priorityLevel: rule.priorityLevel,
      executeOnce: rule.executeOnce,
      maxExecutions: rule.maxExecutions,
      executionCount: rule.executionCount,
      lastExecuted: rule.lastExecuted?.toISOString() ?? null,
      createdAt: rule.createdAt.toISOString(),
      updatedAt: rule.updatedAt.toISOString(),
      triggers: rule.automation_triggers.map(t => ({
        id: t.id,
        type: t.type as string,
        eventSource: t.eventSource,
        configuration: t.configuration,
      })),
      conditions: rule.automation_conditions.map(c => ({
        id: c.id,
        type: c.type as string,
        field: c.field,
        operator: c.operator,
        value: c.value,
        logicalOperator: c.logicalOperator,
      })),
      actions: rule.automation_actions.map(a => ({
        id: a.id,
        type: a.type as string,
        configuration: a.configuration,
        orderIndex: a.orderIndex,
        delay: a.delay,
      })),
      creator: rule.users
        ? { id: rule.users.id, name: rule.users.name, email: rule.users.email }
        : { id: '', name: null, email: '' },
      _count: { executions: rule._count.automation_rule_executions },
    }))

    return NextResponse.json({
      automationRules,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching automation rules:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/automation-rules - Create new mock automation rule
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
      include: { churches: true }
    })

    if (!user?.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 403 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'CHURCH_ADMIN', 'PASTOR'].includes(user.role)) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, isActive, triggers, conditions, actions } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
    }

    const { nanoid } = await import('nanoid')
    const ruleId = nanoid()

    const rule = await prisma.automation_rules.create({
      data: {
        id: ruleId,
        name: name.trim(),
        description: description?.trim() || null,
        isActive: Boolean(isActive ?? true),
        churchId: user.churchId,
        createdBy: user.id,
        automation_triggers: triggers?.length
          ? {
              create: triggers.map((t: any) => ({
                id: nanoid(),
                type: t.type,
                eventSource: t.eventSource || null,
                configuration: t.configuration ?? {},
              })),
            }
          : undefined,
        automation_conditions: conditions?.length
          ? {
              create: conditions.map((c: any) => ({
                id: nanoid(),
                type: c.type,
                field: c.field,
                operator: c.operator,
                value: c.value,
                logicalOperator: c.logicalOperator || 'AND',
              })),
            }
          : undefined,
        automation_actions: actions?.length
          ? {
              create: actions.map((a: any, idx: number) => ({
                id: nanoid(),
                type: a.type,
                configuration: a.configuration ?? {},
                orderIndex: a.orderIndex ?? idx,
                delay: a.delay ?? 0,
              })),
            }
          : undefined,
      },
      include: {
        automation_triggers: { select: { id: true, type: true, eventSource: true, configuration: true } },
        automation_conditions: { select: { id: true, type: true, field: true, operator: true, value: true, logicalOperator: true } },
        automation_actions: { select: { id: true, type: true, configuration: true, orderIndex: true, delay: true }, orderBy: { orderIndex: 'asc' } },
        users: { select: { id: true, name: true, email: true } },
        _count: { select: { automation_rule_executions: true } },
      },
    })

    return NextResponse.json({
      automationRule: {
        ...rule,
        lastExecuted: rule.lastExecuted?.toISOString() ?? null,
        createdAt: rule.createdAt.toISOString(),
        updatedAt: rule.updatedAt.toISOString(),
        triggers: rule.automation_triggers.map(t => ({ id: t.id, type: t.type as string, eventSource: t.eventSource, configuration: t.configuration })),
        conditions: rule.automation_conditions.map(c => ({ id: c.id, type: c.type as string, field: c.field, operator: c.operator, value: c.value, logicalOperator: c.logicalOperator })),
        actions: rule.automation_actions.map(a => ({ id: a.id, type: a.type as string, configuration: a.configuration, orderIndex: a.orderIndex, delay: a.delay })),
        creator: rule.users ? { id: rule.users.id, name: rule.users.name, email: rule.users.email } : { id: '', name: null, email: '' },
        _count: { executions: rule._count.automation_rule_executions },
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating automation rule:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
