import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - Fetch a custom form by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const form = await db.customForm.findUnique({
      where: { slug },
      include: {
        church: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            email: true,
            logo: true
          }
        }
      }
    })

    if (!form || !form.isActive) {
      return NextResponse.json({ error: 'Formulario no encontrado' }, { status: 404 })
    }

    // Track form access
    console.log(`Form accessed: ${form.title} (${form.slug}) by church: ${form.church.name}`)

    return NextResponse.json({
      form: {
        id: form.id,
        title: form.title,
        description: form.description,
        fields: form.fields,
        config: form.config,
        qrConfig: form.qrConfig
      },
      church: form.church
    })

  } catch (error) {
    console.error('Error fetching custom form:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Submit custom form data
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const body = await request.json()

    // Get the form
    const form = await db.customForm.findUnique({
      where: { slug },
      include: {
        church: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!form || !form.isActive) {
      return NextResponse.json({ error: 'Formulario no encontrado' }, { status: 404 })
    }

    // Get client info
    const clientIp = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Extract visitor information from form data
    const formData = body.data || body
    const visitorInfo = extractVisitorInfo(formData)

    // Create visitor in check-ins table (visitor database)
    const visitor = await db.checkIn.create({
      data: {
        firstName: visitorInfo.firstName,
        lastName: visitorInfo.lastName,
        email: visitorInfo.email,
        phone: visitorInfo.phone,
        isFirstTime: true,
        checkedInAt: new Date(),
        visitorType: 'custom_form',
        engagementScore: 85, // High engagement for custom form submissions
        visitReason: `Form: ${form.title}`,
        prayerRequest: visitorInfo.prayerRequest,
        churchId: form.churchId,
      }
    })

    // Save form submission
    const submission = await db.customFormSubmission.create({
      data: {
        formId: form.id,
        data: {
          ...formData,
          visitorId: visitor.id,
          submittedAt: new Date().toISOString(),
          formTitle: form.title
        },
        ipAddress: clientIp,
        userAgent,
        churchId: form.churchId
      }
    })

    // Create automatic follow-up task
    try {
      await db.visitorFollowUp.create({
        data: {
          checkInId: visitor.id,
          followUpType: 'custom_form_submission',
          priority: 'high',
          status: 'pending',
          scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next day
          notes: `Nuevo visitante desde formulario personalizado "${form.title}". 
                  Email: ${visitorInfo.email || 'No proporcionado'}
                  Teléfono: ${visitorInfo.phone || 'No proporcionado'}
                  Contactar preferiblemente vía: ${visitorInfo.preferredContact || 'email'}`,
          churchId: form.churchId
        }
      })
    } catch (followUpError) {
      console.log('Could not create follow-up task:', followUpError)
    }

    return NextResponse.json({
      success: true,
      message: `¡Gracias por contactar a ${form.church.name}! Nos pondremos en contacto pronto.`,
      submissionId: submission.id,
      visitorId: visitor.id,
      church: form.church.name
    }, { status: 201 })

  } catch (error) {
    console.error('Error submitting custom form:', error)
    return NextResponse.json(
      { error: 'Error al procesar el formulario' },
      { status: 500 }
    )
  }
}

// Helper function to extract visitor info from dynamic form data
function extractVisitorInfo(formData: any) {
  // Common field mappings for visitor information
  const fieldMappings = {
    firstName: ['firstName', 'first_name', 'nombre', 'name'],
    lastName: ['lastName', 'last_name', 'apellido'],
    email: ['email', 'correo', 'correoelectronico', 'e-mail'],
    phone: ['phone', 'telefono', 'celular', 'mobile'],
    address: ['address', 'direccion'],
    interests: ['interests', 'intereses', 'ministerios'],
    prayerRequest: ['prayerRequest', 'prayer', 'oracion', 'peticion'],
    preferredContact: ['preferredContact', 'contacto_preferido', 'contact_preference']
  }

  const extracted: any = {}

  // Search for each field in the form data using the mappings
  Object.entries(fieldMappings).forEach(([key, possibleFields]) => {
    for (const field of possibleFields) {
      const value = findFieldValue(formData, field)
      if (value) {
        extracted[key] = value
        break
      }
    }
  })

  // Ensure we have at least a name
  if (!extracted.firstName && !extracted.lastName) {
    // Look for any name field
    const nameFields = ['name', 'nombre', 'fullName', 'nombreCompleto']
    for (const field of nameFields) {
      const value = findFieldValue(formData, field)
      if (value) {
        const nameParts = value.trim().split(' ')
        extracted.firstName = nameParts[0] || 'Visitante'
        extracted.lastName = nameParts.slice(1).join(' ') || ''
        break
      }
    }
  }

  // Default values
  extracted.firstName = extracted.firstName || 'Visitante'
  extracted.lastName = extracted.lastName || ''
  extracted.preferredContact = extracted.preferredContact || 'email'

  return extracted
}

// Helper function to find field value (case-insensitive)
function findFieldValue(data: any, fieldName: string): string | null {
  for (const [key, value] of Object.entries(data)) {
    if (key.toLowerCase() === fieldName.toLowerCase() && value) {
      return String(value)
    }
  }
  return null
}