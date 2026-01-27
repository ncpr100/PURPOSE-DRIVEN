import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { nanoid } from 'nanoid'

const createTemplateSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  triggerConfig: z.any(),
  conditionsConfig: z.array(z.any()).optional(),
  actionsConfig: z.array(z.any()),
  priorityLevel: z.enum(['URGENT', 'HIGH', 'NORMAL', 'LOW']).optional(),
  escalationConfig: z.any().optional(),
  businessHoursOnly: z.boolean().optional(),
  businessHoursConfig: z.any().optional(),
  urgentMode24x7: z.boolean().optional(),
  retryConfig: z.any().optional(),
  fallbackChannels: z.array(z.string()).optional(),
  createManualTaskOnFail: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional()
})
// GET - Get automation rule templates
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    const user = await prisma.users.findUnique({
      where: { email: session.user.email },
      select: { id: true, churchId: true, role: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: any = {
      isActive: true
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ]
    const templates = await prisma.automation_rule_templates.findMany({
      where,
      orderBy: [
        { isSystemTemplate: 'desc' }, // System templates first
        { installCount: 'desc' }, // Most used templates next
        { name: 'asc' }
      ],
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        subcategory: true,
        icon: true,
        color: true,
        isSystemTemplate: true,
        isActive: true,
        isPublic: true,
        priorityLevel: true,
        businessHoursOnly: true,
        urgentMode24x7: true,
        installCount: true,
        lastUsedAt: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        users: {
          select: {
            id: true,
            name: true
          }
        },
        // Include configs for template preview
        triggerConfig: true,
        conditionsConfig: true,
        actionsConfig: true,
        escalationConfig: true,
        businessHoursConfig: true,
        retryConfig: true
      }
    });

    // Map to match component interface
    const mappedTemplates = templates.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      category: t.category,
      usageCount: t.installCount,
      isSystem: t.isSystemTemplate,
      template: {
        triggers: t.triggerConfig,
        conditions: t.conditionsConfig,
        actions: t.actionsConfig
      },
      creator: t.users
    }))
    // Get categories for filtering
    const categories = await prisma.automation_rule_templates.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: {
        category: true
    return NextResponse.json({
      templates: mappedTemplates,
      categories: categories.map((cat: { category: string; _count: { category: number } }) => ({
        name: cat.category,
        count: cat._count.category
      }))
  } catch (error) {
    console.error('Error fetching automation templates:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
// POST - Create custom automation rule template (admin only)
export async function POST(request: NextRequest) {
      select: { id: true, role: true }
    // Only admins can create templates
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA'].includes(user.role)) {
      return NextResponse.json({ error: 'Sin permisos para crear plantillas' }, { status: 403 })
    const body = await request.json()
    const validatedData = createTemplateSchema.parse(body)
    const template = await prisma.automation_rule_templates.create({
      data: {
        id: randomUUID(),
        name: validatedData.name,
        description: validatedData.description,
        category: validatedData.category,
        subcategory: validatedData.subcategory,
        icon: validatedData.icon || '⚡',
        color: validatedData.color || '#3B82F6',
        isSystemTemplate: false,
        isPublic: validatedData.isPublic !== undefined ? validatedData.isPublic : false,
        createdBy: user.id,
        triggerConfig: validatedData.triggerConfig,
        conditionsConfig: validatedData.conditionsConfig || [],
        actionsConfig: validatedData.actionsConfig,
        priorityLevel: validatedData.priorityLevel || 'NORMAL',
        escalationConfig: validatedData.escalationConfig,
        businessHoursOnly: validatedData.businessHoursOnly || false,
        businessHoursConfig: validatedData.businessHoursConfig,
        urgentMode24x7: validatedData.urgentMode24x7 || false,
        retryConfig: validatedData.retryConfig,
        fallbackChannels: validatedData.fallbackChannels || [],
        createManualTaskOnFail: validatedData.createManualTaskOnFail || false,
        tags: validatedData.tags || []
      include: {
        }
    return NextResponse.json(template, { status: 201 })
    console.error('Error creating automation template:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos de entrada inválidos', details: error.errors },
        { status: 400 }
      )
