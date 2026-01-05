import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

// Schema for platform form validation
const platformFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  fields: z.array(z.object({
    id: z.string(),
    type: z.enum(['text', 'textarea', 'select', 'radio', 'checkbox', 'email', 'phone', 'number']),
    label: z.string().min(1),
    placeholder: z.string().optional(),
    required: z.boolean(),
    options: z.array(z.string()).optional(),
    validation: z.object({
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
      pattern: z.string().optional()
    }).optional()
  })),
  style: z.object({
    backgroundColor: z.string().optional(),
    primaryColor: z.string().optional(),
    fontFamily: z.string().optional(),
    logoUrl: z.string().optional()
  }),
  settings: z.object({
    redirectUrl: z.string().optional(),
    thankYouMessage: z.string().optional(),
    sendNotification: z.boolean().optional(),
    notificationEmail: z.string().email().optional(),
    autoFollowUp: z.boolean().optional(),
    leadScoring: z.boolean().optional(),
    campaignTag: z.string().optional(),
    conversionTracking: z.boolean().optional()
  }),
  isActive: z.boolean(),
  isPublic: z.boolean(),
  campaignTag: z.string().optional(),
  leadScore: z.number().optional()
})

// GET /api/platform/forms - Get all platform forms
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // SUPER_ADMIN only
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - SUPER_ADMIN access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const campaignTag = searchParams.get('campaignTag') || undefined
    const isActive = searchParams.get('isActive') === 'true' ? true : 
                     searchParams.get('isActive') === 'false' ? false : undefined

    const where: any = {}
    if (campaignTag) where.campaignTag = campaignTag
    if (isActive !== undefined) where.isActive = isActive

    const [forms, totalCount] = await Promise.all([
      db.platformForm.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          submissions: {
            select: { id: true, createdAt: true, leadScore: true },
            orderBy: { createdAt: 'desc' }
          },
          _count: {
            select: { submissions: true }
          }
        }
      }),
      db.platformForm.count({ where })
    ])

    // Calculate analytics for each form
    const formsWithAnalytics = forms.map(form => {
      const submissions = form.submissions || []
      const totalSubmissions = submissions.length
      const lastWeekSubmissions = submissions.filter(
        s => new Date(s.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length
      
      const avgLeadScore = submissions.length > 0 
        ? submissions.reduce((acc, s) => acc + (s.leadScore || 0), 0) / submissions.length
        : 0

      return {
        ...form,
        analytics: {
          totalSubmissions,
          lastWeekSubmissions,
          conversionRate: totalSubmissions > 0 ? (lastWeekSubmissions / totalSubmissions) * 100 : 0,
          averageLeadScore: Math.round(avgLeadScore),
          lastSubmission: submissions[0]?.createdAt || null
        }
      }
    })

    return NextResponse.json({
      data: formsWithAnalytics,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      },
      success: true
    })

  } catch (error) {
    console.error('Platform forms fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'FETCH_ERROR' },
      { status: 500 }
    )
  }
}

// POST /api/platform/forms - Create new platform form
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - SUPER_ADMIN access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = platformFormSchema.parse(body)

    // Generate unique slug for the form
    const baseSlug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    let slug = baseSlug
    let counter = 1
    while (await db.platformForm.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const platformForm = await db.platformForm.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        slug,
        fields: validatedData.fields,
        style: validatedData.style,
        settings: validatedData.settings,
        isActive: validatedData.isActive,
        isPublic: validatedData.isPublic,
        campaignTag: validatedData.campaignTag,
        leadScore: validatedData.leadScore || 50,
        createdById: session.user.id
      },
      include: {
        submissions: true,
        _count: {
          select: { submissions: true }
        }
      }
    })

    return NextResponse.json({
      data: platformForm,
      success: true,
      message: 'Formulario de plataforma creado exitosamente'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Datos de entrada inválidos',
          details: error.errors,
          code: 'VALIDATION_ERROR' 
        },
        { status: 400 }
      )
    }

    console.error('Platform form creation error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', code: 'CREATE_ERROR' },
      { status: 500 }
    )
  }
}

// PUT /api/platform/forms - Update existing platform form
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - SUPER_ADMIN access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { error: 'Form ID is required', code: 'MISSING_ID' },
        { status: 400 }
      )
    }

    const validatedData = platformFormSchema.parse(updateData)

    // Verify form exists
    const existingForm = await db.platformForm.findUnique({
      where: { id }
    })

    if (!existingForm) {
      return NextResponse.json(
        { error: 'Formulario no encontrado', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // Update slug if name changed
    let newSlug = existingForm.slug
    if (validatedData.name !== existingForm.name) {
      const baseSlug = validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      
      let slug = baseSlug
      let counter = 1
      while (await db.platformForm.findFirst({ 
        where: { slug, NOT: { id } }
      })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }
      newSlug = slug
    }

    const updatedForm = await db.platformForm.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        slug: newSlug,
        fields: validatedData.fields,
        style: validatedData.style,
        settings: validatedData.settings,
        isActive: validatedData.isActive,
        isPublic: validatedData.isPublic,
        campaignTag: validatedData.campaignTag,
        leadScore: validatedData.leadScore || existingForm.leadScore,
        updatedAt: new Date()
      },
      include: {
        submissions: true,
        _count: {
          select: { submissions: true }
        }
      }
    })

    return NextResponse.json({
      data: updatedForm,
      success: true,
      message: 'Formulario actualizado exitosamente'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Datos de entrada inválidos',
          details: error.errors,
          code: 'VALIDATION_ERROR' 
        },
        { status: 400 }
      )
    }

    console.error('Platform form update error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', code: 'UPDATE_ERROR' },
      { status: 500 }
    )
  }
}

// DELETE /api/platform/forms - Delete platform form
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - SUPER_ADMIN access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Form ID is required', code: 'MISSING_ID' },
        { status: 400 }
      )
    }

    // Check if form exists and has submissions
    const formWithSubmissions = await db.platformForm.findUnique({
      where: { id },
      include: {
        _count: {
          select: { submissions: true }
        }
      }
    })

    if (!formWithSubmissions) {
      return NextResponse.json(
        { error: 'Formulario no encontrado', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // If form has submissions, soft delete by setting isActive to false
    if (formWithSubmissions._count.submissions > 0) {
      const softDeletedForm = await db.platformForm.update({
        where: { id },
        data: {
          isActive: false,
          name: `${formWithSubmissions.name} (Eliminado)`,
          deletedAt: new Date()
        }
      })

      return NextResponse.json({
        data: softDeletedForm,
        success: true,
        message: 'Formulario desactivado (tiene envíos registrados)',
        type: 'soft_delete'
      })
    }

    // Hard delete if no submissions
    await db.platformForm.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Formulario eliminado exitosamente',
      type: 'hard_delete'
    })

  } catch (error) {
    console.error('Platform form deletion error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', code: 'DELETE_ERROR' },
      { status: 500 }
    )
  }
}