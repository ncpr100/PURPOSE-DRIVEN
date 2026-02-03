import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { FormAutomationEngine } from '@/lib/automation-engine'
import { randomUUID } from 'crypto'

export const dynamic = 'force-dynamic'

// Helper function to detect if form contains visitor information
function detectVisitorForm(formData: any): boolean {
  const visitorIndicators = [
    'nombre', 'name', 'fullname', 'full_name',
    'telefono', 'phone', 'mobile', 'celular',
    'conociste', 'find', 'found', 'source', 'fuente',
    'primera', 'first', 'visit', 'visita'
  ]
  
  const formText = JSON.stringify(formData).toLowerCase()
  
  // Check if form has typical visitor fields
  const hasVisitorFields = visitorIndicators.some(indicator => 
    formText.includes(indicator)
  )
  
  // Additional check for form title containing visitor-related terms
  const hasVisitorTitle = (
    formData.formTitle?.toLowerCase().includes('visit') ||
    formData.formTitle?.toLowerCase().includes('bienven') ||
    formData.formTitle?.toLowerCase().includes('seguimiento')
  )
  
  return hasVisitorFields || hasVisitorTitle
}

// Helper function to create visitor profile from form data
async function createVisitorProfile(formData: any, churchId: string): Promise<string | null> {
  try {
    // Extract visitor information from form data
    const visitorData = extractVisitorData(formData)
    
    if (!visitorData.fullName) {
      console.log('⚠️ No full name found, skipping visitor profile creation')
      return null
    }
    
    // Check for existing visitor with same name and phone/email
    const existingVisitor = await db.visitor_profiles.findFirst({
      where: {
        fullName: visitorData.fullName,
        OR: [
          visitorData.phone ? { phone: visitorData.phone } : {},
          visitorData.email ? { email: visitorData.email } : {}
        ].filter(condition => Object.keys(condition).length > 0)
      }
    })
    
    if (existingVisitor) {
      console.log(`📝 Updating existing visitor: ${existingVisitor.id}`)
      
      // Update existing visitor
      await db.visitor_profiles.update({
        where: { id: existingVisitor.id },
        data: {
          visitCount: existingVisitor.visitCount + 1,
          lastVisitDate: new Date(),
          category: determineVisitorCategory(existingVisitor.visitCount + 1),
          source: visitorData.source || existingVisitor.source,
          // Update contact info if provided
          ...(visitorData.email && { email: visitorData.email }),
          ...(visitorData.phone && { phone: visitorData.phone }),
          updatedAt: new Date()
        }
      })
      
      return existingVisitor.id
    } else {
      console.log(`👤 Creating new visitor profile for: ${visitorData.fullName}`)
      
      // Create new visitor profile
      const newVisitor = await db.visitor_profiles.create({
        data: {
          id: nanoid(),
          fullName: visitorData.fullName,
          phone: visitorData.phone,
          email: visitorData.email,
          category: 'FIRST_TIME',
          visitCount: 1,
          source: visitorData.source,
          preferredContact: visitorData.email ? 'email' : 'phone',
          firstVisitDate: new Date(),
          lastVisitDate: new Date(),
          autoAddedToCRM: true,
          crmAddedAt: new Date(),
          metadata: {
            createdVia: 'Custom Form Builder',
            formData: formData,
            createdAt: new Date().toISOString()
          }
        }
      })
      
      return newVisitor.id
    }
  } catch (error) {
    console.error('Error creating visitor profile:', error)
    return null
  }
}

// Helper function to extract visitor data from form submissions
function extractVisitorData(formData: any) {
  const data: any = {}
  
  // Extract full name
  for (const [key, value] of Object.entries(formData)) {
    const keyLower = key.toLowerCase()
    const stringValue = String(value || '').trim()
    
    if (!stringValue) continue
    
    // Name detection
    if (
      keyLower.includes('nombre') ||
      keyLower.includes('name') ||
      keyLower === 'fullname' ||
      keyLower === 'full_name'
    ) {
      data.fullName = stringValue
    }
    
    // Phone detection
    else if (
      keyLower.includes('telefono') ||
      keyLower.includes('phone') ||
      keyLower.includes('mobile') ||
      keyLower.includes('celular')
    ) {
      data.phone = stringValue
    }
    
    // Email detection
    else if (
      keyLower.includes('email') ||
      keyLower.includes('correo')
    ) {
      data.email = stringValue
    }
    
    // Source detection
    else if (
      keyLower.includes('conociste') ||
      keyLower.includes('find') ||
      keyLower.includes('found') ||
      keyLower.includes('source') ||
      keyLower.includes('fuente') ||
      keyLower.includes('cómo')
    ) {
      data.source = stringValue
    }
  }
  
  return data
}

// Helper function to determine visitor category based on visit count
function determineVisitorCategory(visitCount: number): 'FIRST_TIME' | 'RETURNING' | 'REGULAR' | 'MEMBER_CANDIDATE' {
  if (visitCount === 1) return 'FIRST_TIME'
  if (visitCount <= 3) return 'RETURNING'
  if (visitCount <= 6) return 'REGULAR'
  return 'MEMBER_CANDIDATE'
}

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

    // 🎯 DETECT VISITOR FORMS AND CREATE VISITOR PROFILE
    const isVisitorForm = detectVisitorForm(enrichedData)
    let visitorId = null
    
    if (isVisitorForm) {
      console.log('📝 Detected visitor form - creating visitor profile...')
      visitorId = await createVisitorProfile(enrichedData, form.churchId)
      
      if (visitorId) {
        console.log(`👤 Visitor profile created: ${visitorId}`)
        enrichedData.visitorId = visitorId
        enrichedData.automationType = 'visitor_form'
      }
    }

    // 🔥 TRIGGER COMPLETE AUTOMATION SYSTEM
    await FormAutomationEngine.processCustomFormSubmission(
      form.id,
      isVisitorForm ? 'visitor' : (formType || 'generic'),
      enrichedData,
      form.churchId
    )

    // Save submission record for tracking
    const submission = await db.custom_form_submissions.create({
      data: {
        id: nanoid(),
        formId: form.id,
        data: enrichedData,
        ipAddress: clientIp,
        userAgent: userAgent,
        churchId: form.churchId // Direct churchId assignment (matches Prisma schema)
      }
    })

    console.log(`✅ FORM SUBMISSION AUTOMATION COMPLETED: ${submission.id}`)

    return NextResponse.json({ 
      success: true,
      submissionId: submission.id,
      visitorId: visitorId,
      message: isVisitorForm 
        ? 'Información recibida. Te hemos agregado a nuestro sistema de seguimiento.' 
        : 'Formulario enviado exitosamente.',
      automation: {
        triggered: true,
        formType: isVisitorForm ? 'visitor' : (formType || 'generic'),
        churchId: form.churchId,
        visitorCreated: !!visitorId
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