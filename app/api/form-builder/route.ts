import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'
import { nanoid } from 'nanoid'

export const dynamic = 'force-dynamic'

const formBuilderSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  fields: z.array(z.object({
    id: z.number(),
    label: z.string(),
    type: z.enum(['text', 'email', 'number', 'checkbox', 'textarea', 'select']),
    options: z.array(z.string()).optional(),
    required: z.boolean().optional()
  })),
  bgColor: z.string(),
  textColor: z.string(),
  fontFamily: z.string(),
  bgImage: z.string().nullable(),
  qrConfig: z.object({
    foregroundColor: z.string(),
    backgroundColor: z.string(),
    logo: z.string().nullable(),
    size: z.number(),
    margin: z.number()
  }),
  qrCodeUrl: z.string().optional()
})

// GET - Fetch saved forms
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const forms = await db.custom_forms.findMany({
      where: {
        churchId: session.user.churchId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ forms })

  } catch (error) {
    console.error('Error fetching custom forms:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Save a new form
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = formBuilderSchema.parse(body)

    const form = await db.custom_forms.create({
      data: {
        id: nanoid(),
        title: validatedData.title,
        description: validatedData.description || '',
        fields: validatedData.fields,
        config: {
          bgColor: validatedData.bgColor,
          textColor: validatedData.textColor,
          fontFamily: validatedData.fontFamily,
          bgImage: validatedData.bgImage
        },
        qrConfig: validatedData.qrConfig,
        qrCodeUrl: validatedData.qrCodeUrl,
        churchId: session.user.churchId,
        createdBy: session.user.id,
        slug: `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
    })

    return NextResponse.json({ 
      success: true,
      form: {
        id: form.id,
        title: form.title,
        slug: form.slug,
        createdAt: form.createdAt
      }
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error saving custom form:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}