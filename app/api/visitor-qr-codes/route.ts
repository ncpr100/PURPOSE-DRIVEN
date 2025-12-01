import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const qrCodeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  formId: z.string().min(1, 'Form ID is required'),
  design: z.object({
    size: z.number().min(100).max(1000).optional().default(300),
    color: z.string().optional().default('#000000'),
    backgroundColor: z.string().optional().default('#ffffff'),
    logoUrl: z.string().optional(),
    logoSize: z.number().min(10).max(50).optional().default(20),
    margin: z.number().min(0).max(50).optional().default(10),
    errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']).optional().default('M'),
  }).optional(),
})

// GET - Fetch QR codes for a form or church
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const formId = searchParams.get('formId')

    const whereClause: any = { churchId: session.user.churchId }
    if (formId) {
      whereClause.formId = formId
    }

    const qrCodes = await db.visitorQRCode.findMany({
      where: whereClause,
      include: {
        form: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(qrCodes)
  } catch (error) {
    console.error('Error fetching QR codes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Generate a new QR code for a form
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = qrCodeSchema.parse(body)

    // Check if form exists and belongs to church
    const form = await db.visitorForm.findFirst({
      where: { 
        id: validatedData.formId, 
        churchId: session.user.churchId 
      }
    })

    if (!form) {
      return NextResponse.json({ error: 'Formulario no encontrado' }, { status: 404 })
    }

    // Generate unique QR code
    const qrCodeValue = `qr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const qrCode = await db.visitorQRCode.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        formId: validatedData.formId,
        code: qrCodeValue,
        design: validatedData.design || {},
        churchId: session.user.churchId,
      },
      include: {
        form: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    // Generate the QR code URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const qrUrl = `${baseUrl}/visitor-form/${form.slug}?qr=${qrCodeValue}`

    return NextResponse.json({ 
      ...qrCode, 
      url: qrUrl,
      qrValue: qrCodeValue
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating QR code:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a QR code
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

    // Check if QR code exists and belongs to church
    const existingQR = await db.visitorQRCode.findFirst({
      where: { id, churchId: session.user.churchId }
    })

    if (!existingQR) {
      return NextResponse.json({ error: 'Código QR no encontrado' }, { status: 404 })
    }

    await db.visitorQRCode.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting QR code:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}