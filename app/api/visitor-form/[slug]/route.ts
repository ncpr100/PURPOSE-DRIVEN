import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const submissionSchema = z.object({
  data: z.record(z.any()),
  qrCode: z.string().optional()
})

// GET - Fetch a visitor form by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const { searchParams } = new URL(request.url)
    const qrCode = searchParams.get('qr')

    const form = await db.visitor_forms.findUnique({
      where: { slug },
      include: {
        churches: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            email: true
          }
        }
      }
    })

    if (!form || !form.isActive || !form.isPublic) {
      return NextResponse.json({ error: 'Formulario no encontrado' }, { status: 404 })
    }

    // Update QR scan count if accessed via QR
    if (qrCode) {
      await db.visitor_qr_codes.updateMany({
        where: { 
          code: qrCode,
          formId: form.id 
        },
        data: { 
          scanCount: { increment: 1 },
          lastScan: new Date()
        }
      })
    }

    return NextResponse.json({
      form: {
        id: form.id,
        name: form.name,
        description: form.description,
        fields: form.fields,
        style: form.style,
        settings: form.settings
      },
      church: form.churches,
      qrCode
    })

  } catch (error) {
    console.error('Error fetching visitor form:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Submit visitor form data
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const body = await request.json()
    const { data, qrCode } = submissionSchema.parse(body)

    // Get the form
    const form = await db.visitor_forms.findUnique({
      where: { slug },
      include: {
        churches: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!form || !form.isActive || !form.isPublic) {
      return NextResponse.json({ error: 'Formulario no encontrado' }, { status: 404 })
    }

    // Get client info
    const clientIp = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Save submission
    const submission = await db.visitor_submissions.create({
      data: {
        id: nanoid(),
        formId: form.id,
        data: {
          ...data,
          submittedVia: qrCode ? `QR: ${qrCode}` : 'Direct Link',
          submittedAt: new Date().toISOString()
        },
        ipAddress: clientIp,
        userAgent,
        churchId: form.churchId
      }
    })

    // 🔥 TRIGGER AUTOMATION for visitor form submission
    try {
      const { triggerAutomations, markAutomationTriggered } = await import('@/lib/automation-trigger-service')
      
      const result = await triggerAutomations({
        type: 'VISITOR_FORM_SUBMITTED',
        churchId: form.churchId,
        data: {
          submissionId: submission.id,
          formId: form.id,
          formName: form.name,
          qrCode: qrCode || undefined,
          visitorName: data.firstName || data.name || 'Visitante',
          visitorEmail: data.email,
          visitorPhone: data.phone,
          preferredContact: data.preferredContact || 'email',
          fields: data,
          source: qrCode ? 'qr_code' : 'direct_link',
          timestamp: new Date()
        }
      })
      
      if (result.success && result.rulesTriggered > 0) {
        await markAutomationTriggered('visitor_submission', submission.id, result.executionIds)
        console.log(`✅ Triggered ${result.rulesTriggered} automation rule(s) for visitor form ${form.name}`)
      }
    } catch (automationError) {
      console.error('❌ Automation trigger failed for visitor submission:', automationError)
    }

    // If form has auto-follow-up enabled, create a visitor check-in
    if (form.settings && (form.settings as any).autoFollowUp && data.email) {
      try {
        await db.check_ins.create({
          data: {
            id: nanoid(),
            firstName: data.firstName || data.name || 'Visitante',
            lastName: data.lastName || '',
            email: data.email,
            phone: data.phone || null,
            isFirstTime: true,
            churchId: form.churchId,
            checkedInAt: new Date(),
            visitorType: 'first_time',
            engagementScore: 70 // High engagement for form submission
          }
        })
      } catch (error) {
        console.log('Could not create check-in from form submission:', error)
      }
    }

    // Send notification if configured
    const settings = form.settings as any
    if (settings?.sendNotification && settings?.notificationEmail) {
      // TODO: Send notification email
      console.log('TODO: Send notification to', settings.notificationEmail)
    }

    return NextResponse.json({ 
      success: true,
      submissionId: submission.id,
      thankYouMessage: settings?.thankYouMessage || 'Gracias por su información',
      redirectUrl: settings?.redirectUrl
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error submitting visitor form:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}