import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const visitorFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  fields: z.array(z.object({
    id: z.string(),
    type: z.enum(['text', 'textarea', 'email', 'phone', 'number', 'select', 'radio', 'checkbox']),
    label: z.string(),
    placeholder: z.string().optional(),
    required: z.boolean(),
    options: z.array(z.string()).optional(),
    validation: z.object({
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
      pattern: z.string().optional(),
    }).optional(),
  })),
  style: z.object({
    backgroundColor: z.string().optional(),
    primaryColor: z.string().optional(),
    fontFamily: z.string().optional(),
    logoUrl: z.string().optional(),
  }).optional(),
  settings: z.object({
    redirectUrl: z.string().optional(),
    thankYouMessage: z.string().optional(),
    sendNotification: z.boolean().optional(),
    notificationEmail: z.string().optional(),
    autoFollowUp: z.boolean().optional(),
  }).optional(),
  isActive: z.boolean(),
  isPublic: z.boolean(),
})

// GET - Fetch all visitor forms for a church
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const forms = await db.visitor_forms.findMany({
      where: { churchId: session.user.churchId },
      include: {
        _count: {
          select: {
            submissions: true,
            qrCodes: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json(forms)
  } catch (error) {
    console.error('Error fetching visitor forms:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Create a new visitor form
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = visitorFormSchema.parse(body)

    // Generate unique slug
    const baseSlug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    
    let slug = baseSlug
    let counter = 1
    
    while (await db.visitor_forms.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const form = await db.visitor_forms.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        fields: validatedData.fields,
        slug,
        churchId: session.user.churchId,
        style: validatedData.style || {},
        settings: validatedData.settings || {},
        isActive: validatedData.isActive,
        isPublic: validatedData.isPublic
      },
      include: {
        _count: {
          select: {
            submissions: true,
            qrCodes: true
          }
        }
      }
    })

    return NextResponse.json(form, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating visitor form:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Update a visitor form
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 })
    }

    const validatedData = visitorFormSchema.parse(updateData)

    // Check if form exists and belongs to church
    const existingForm = await db.visitor_forms.findFirst({
      where: { id, churchId: session.user.churchId }
    })

    if (!existingForm) {
      return NextResponse.json({ error: 'Formulario no encontrado' }, { status: 404 })
    }

    const updatedForm = await db.visitor_forms.update({
      where: { id },
      data: {
        ...validatedData,
        style: validatedData.style || {},
        settings: validatedData.settings || {},
        updatedAt: new Date()
      },
      include: {
        _count: {
          select: {
            submissions: true,
            qrCodes: true
          }
        }
      }
    })

    return NextResponse.json(updatedForm)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating visitor form:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a visitor form
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 })
    }

    // Check if form exists and belongs to church
    const existingForm = await db.visitor_forms.findFirst({
      where: { id, churchId: session.user.churchId }
    })

    if (!existingForm) {
      return NextResponse.json({ error: 'Formulario no encontrado' }, { status: 404 })
    }

    await db.visitor_forms.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting visitor form:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}