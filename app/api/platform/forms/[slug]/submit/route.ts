import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

// Schema for form submission validation
const submissionSchema = z.object({
  formData: z.record(z.any()),
  source: z.string().optional(),
  referrer: z.string().optional(),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional()
})

// GET /api/platform/forms/[slug]/submit - Display form (public endpoint)
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const form = await db.platformForm.findUnique({
      where: {
        slug: params.slug,
        isActive: true,
        isPublic: true
      },
      select: {
        id: true,
        name: true,
        description: true,
        fields: true,
        style: true,
        settings: true,
        campaignTag: true
      }
    })

    if (!form) {
      return NextResponse.json(
        { error: 'Formulario no encontrado o no disponible' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      data: form,
      success: true
    })

  } catch (error) {
    console.error('Form display error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/platform/forms/[slug]/submit - Submit form (public endpoint)
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Get form details
    const form = await db.platformForm.findUnique({
      where: {
        slug: params.slug,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        fields: true,
        settings: true,
        campaignTag: true,
        leadScore: true
      }
    })

    if (!form) {
      return NextResponse.json(
        { error: 'Formulario no encontrado o no disponible' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = submissionSchema.parse(body)

    // Extract client information
    const userAgent = request.headers.get('user-agent') || validatedData.userAgent || ''
    const referrer = request.headers.get('referer') || validatedData.referrer || ''
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     validatedData.ipAddress || 'unknown'

    // Validate form data against form fields
    const formFields = Array.isArray(form.fields) ? form.fields : []
    const requiredFields = formFields.filter((field: any) => field.required)
    const missingFields = requiredFields.filter((field: any) => 
      !validatedData.formData[field.id] || 
      (typeof validatedData.formData[field.id] === 'string' && 
       validatedData.formData[field.id].trim() === '')
    )

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Campos requeridos faltantes',
          missingFields: missingFields.map((f: any) => f.label),
          code: 'MISSING_REQUIRED_FIELDS'
        },
        { status: 400 }
      )
    }

    // Calculate lead score based on form data and settings
    let calculatedLeadScore = form.leadScore || 50
    
    // Safely cast form.settings as object
    const settings = (form.settings && typeof form.settings === 'object' && !Array.isArray(form.settings)) 
      ? form.settings as any 
      : {}
    
    if (settings.leadScoring) {
      // Basic lead scoring algorithm
      let score = calculatedLeadScore
      
      // Email provides higher score
      if (validatedData.formData.email) score += 10
      
      // Phone provides higher score
      if (validatedData.formData.phone) score += 15
      
      // Church name/organization indicates serious inquiry
      if (validatedData.formData.church_name || validatedData.formData.organization) {
        score += 20
      }
      
      // Multiple contact methods
      const contactMethods = [
        validatedData.formData.email,
        validatedData.formData.phone,
        validatedData.formData.address
      ].filter(Boolean).length
      score += contactMethods * 5
      
      // Campaign-specific scoring
      if (form.campaignTag === 'church_acquisition') score += 25
      if (form.campaignTag === 'demo_request') score += 20
      if (form.campaignTag === 'consultation') score += 30
      
      calculatedLeadScore = Math.min(100, Math.max(0, score))
    }

    // Create submission record
    const submission = await db.platformFormSubmission.create({
      data: {
        formId: form.id,
        data: validatedData.formData,
        leadScore: calculatedLeadScore,
        source: validatedData.source || 'direct',
        referrer,
        userAgent,
        ipAddress,
        campaignTag: form.campaignTag,
        status: 'new'
      }
    })

    // Send notification if enabled
    if (settings.sendNotification && settings.notificationEmail) {
      try {
        // Here you would integrate with your email service
        // For now, we'll just log it
        console.log('Form submission notification:', {
          formName: form.name,
          submissionId: submission.id,
          leadScore: calculatedLeadScore,
          notificationEmail: settings.notificationEmail,
          campaignTag: form.campaignTag,
          data: validatedData.formData
        })
        
        // TODO: Integrate with Mailgun or similar email service
      } catch (notificationError) {
        console.error('Notification sending failed:', notificationError)
        // Don't fail the submission if notification fails
      }
    }

    // Schedule follow-up if enabled
    if (settings.autoFollowUp) {
      try {
        // Here you would schedule follow-up emails
        console.log('Scheduling follow-up for submission:', submission.id)
        // TODO: Integrate with email automation system
      } catch (followUpError) {
        console.error('Follow-up scheduling failed:', followUpError)
      }
    }

    // Response data
    const responseData = {
      submissionId: submission.id,
      message: settings.thankYouMessage || 'Gracias por tu envío. Nos pondremos en contacto pronto.',
      redirectUrl: settings.redirectUrl || null,
      campaignTag: form.campaignTag,
      leadScore: settings.leadScoring ? calculatedLeadScore : null
    }

    return NextResponse.json({
      data: responseData,
      success: true
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

    console.error('Form submission error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', code: 'SUBMISSION_ERROR' },
      { status: 500 }
    )
  }
}