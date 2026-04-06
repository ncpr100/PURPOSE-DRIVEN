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
    id: z.union([z.number(), z.string()]),   // accept both numeric (new fields) and string (template fields)
    label: z.string(),
    type: z.enum(['text', 'email', 'number', 'checkbox', 'textarea', 'select', 'tel', 'date', 'radio']),
    options: z.array(z.string()).optional(),
    required: z.boolean().optional()
  })),
  config: z.object({
    bgColor: z.string(),
    textColor: z.string(),
    fontFamily: z.string(),
    bgImage: z.string().nullable(),
    submitButtonText: z.string().optional(),
    submitButtonColor: z.string().optional(),
    submitButtonTextColor: z.string().optional(),
    // Church branding fields
    churchLogo: z.string().optional(),
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    headerTextColor: z.string().optional(),
    bodyTextColor: z.string().optional(),
    borderColor: z.string().optional(),
    inputBorderColor: z.string().optional(),
    inputFocusColor: z.string().optional(),
    // Typography sizing
    titleFontSize: z.string().optional(),
    bodyFontSize: z.string().optional(),
    fieldLabelFontSize: z.string().optional(),
    inputFontSize: z.string().optional(),
    // Layout
    borderRadius: z.string().optional(),
    formMaxWidth: z.string().optional()
  }),
  qrConfig: z.object({
    size: z.number().optional(),
    margin: z.number().optional(),
    backgroundColor: z.string().optional(),
    foregroundColor: z.string().optional(),
    dotType: z.string().optional(),
    cornerType: z.string().optional(),
    useGradient: z.boolean().optional(),
    gradientType: z.string().optional(),
    gradientColors: z.array(z.string()).optional(),
    gradientAngle: z.number().optional(),
    useBackgroundImage: z.boolean().optional(),
    backgroundImage: z.string().optional(),
    backgroundOpacity: z.number().optional(),
    logo: z.string().nullable().optional(),
    logoImage: z.string().optional(),
    logoSize: z.number().optional(),
    logoOpacity: z.number().optional(),
    logoMargin: z.number().optional(),
    logoShape: z.string().optional(),
    logoBackgroundColor: z.string().optional(),
    logoBackgroundOpacity: z.number().optional(),
    eyeColor: z.string().optional(),
    eyeBorderColor: z.string().optional(),
    eyeShape: z.string().optional()
  })
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
      include: {
        _count: {
          select: { custom_form_submissions: true }
        }
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

// POST - Save a new form with guaranteed short URL slug
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = formBuilderSchema.parse(body)

    // CRITICAL: Generate unique slug for short URLs (fixes QR code issue)
    const baseSlug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')         // Replace spaces with hyphens
      .substring(0, 50)             // Limit length

    let uniqueSlug = baseSlug
    let counter = 1

    // Ensure slug uniqueness
    while (await db.custom_forms.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`
      counter++
    }

    const form = await db.custom_forms.create({
      data: {
        id: nanoid(),
        title: validatedData.title,
        description: validatedData.description || '',
        fields: validatedData.fields,
        config: validatedData.config, // Use validated config object
        qrConfig: validatedData.qrConfig,
        qrCodeUrl: `${process.env.NEXTAUTH_URL || 'https://khesed-tek-cms-org.vercel.app'}/form-viewer?slug=${uniqueSlug}`,
        slug: uniqueSlug, // FIXED: Use the unique slug (remove duplicate)
        churchId: session.user.churchId,
        createdBy: session.user.id
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