import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { FormAutomationEngine } from '@/lib/automation-engine'

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

    // If form doesn't exist, create it (for legacy compatibility)
    if (!form) {
      // Require churchId for form creation
      if (!churchId) {
        return NextResponse.json(
          { error: 'Church ID required for form creation' },
          { status: 400 }
        )
      }

      const createdForm = await db.custom_forms.create({
        data: {
          title: formTitle,
          slug: formSlug,
          fields: [],
          config: {},
          qrConfig: {},
          churchId: churchId!, // Non-null assertion since we validated above
          createdBy: 'system'
        }
      })
      
      // Fetch the created form with includes to maintain type consistency
      form = await db.custom_forms.findUnique({
        where: { id: createdForm.id },
        include: {
          churches: { select: { id: true, name: true } }
        }
      })
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
        formId: form.id,
        data: enrichedData,
        ipAddress: clientIp,
        userAgent,
        churchId: form.churchId
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