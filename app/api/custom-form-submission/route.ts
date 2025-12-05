import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { FormAutomationEngine } from '@/lib/automation-engine'
import { randomUUID } from 'crypto'

export const dynamic = 'force-dynamic'

const submissionSchema = z.object({
  formSlug: z.string(),
  formType: z.string().optional().default('generic'),
  formTitle: z.string(),
  formData: z.record(z.any()),
  timestamp: z.string(),
  churchId: z.string().optional() // Optional for public forms
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { formSlug, formType, formTitle, formData, timestamp, churchId } = submissionSchema.parse(body)
    
    console.log(`🔥 CUSTOM FORM SUBMISSION RECEIVED: ${formType} (${formSlug})`)

    // Get the custom form (fallback to creating if not exists)
    let form = await db.custom_forms.findUnique({
      where: { slug: formSlug },
      include: {
        churches: { select: { id: true, name: true } }
      }
    })

    // If form doesn't exist, return error (for security - don't auto-create forms from public API)
    if (!form) {
      return NextResponse.json(
        { error: 'Form not found. Please contact administrator to create this form.' },
        { status: 404 }
      )
    }

    // Get client info
    const clientIp = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Add form metadata to submission data
    const enrichedData = {
      ...formData,
      formTitle: formTitle,
      formSlug: formSlug,
      submittedAt: timestamp,
      submittedVia: 'Custom Form Builder'
    }

    // 🔥 TRIGGER COMPLETE AUTOMATION SYSTEM
    await FormAutomationEngine.processCustomFormSubmission(
      form.id,
      formType || 'visitor', // Default to visitor type
      enrichedData,
      form.churchId
    )

    // Save submission record for tracking
    const submission = await db.custom_form_submissions.create({
      data: {
        id: randomUUID(),
        formId: form.id,
        data: enrichedData,
        ipAddress: clientIp,
        userAgent: userAgent,
        churchId: form.churchId // Direct churchId assignment (not relation)
      }
    })

    console.log(`✅ FORM SUBMISSION AUTOMATION COMPLETED: ${submission.id}`)

    return NextResponse.json({ 
      success: true,
      submissionId: submission.id,
      message: 'Formulario enviado exitosamente. Procesando automáticamente...',
      automation: {
        triggered: true,
        formType: formType || 'visitor',
        churchId: form.churchId
      }
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error submitting custom form:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}