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

// Helper function to detect spiritual assessment forms
function detectSpiritualAssessmentForm(formData: any): boolean {
  const spiritualIndicators = [
    'spiritual_gifts', 'dones_espirituales', 'ministry_passions',
    'spiritual_calling', 'llamado_espiritual', 'experience_level',
    'ministerios_interes', 'evaluacion_espiritual', 'spiritual-assessment-public'
  ]
  
  const formText = JSON.stringify(formData).toLowerCase()
  const formSlug = formData.formSlug?.toLowerCase() || ''
  
  // Check for spiritual assessment indicators in form data or slug
  const hasSpiritualFields = spiritualIndicators.some(indicator => 
    formText.includes(indicator) || formSlug.includes(indicator)
  )
  
  // Check form title for spiritual assessment terms
  const hasSpiritualTitle = (
    formData.formTitle?.toLowerCase().includes('espiritual') ||
    formData.formTitle?.toLowerCase().includes('dones') ||
    formData.formTitle?.toLowerCase().includes('ministerio')
  )
  
  return hasSpiritualFields || hasSpiritualTitle
}

// Helper function to detect volunteer availability forms
function detectVolunteerForm(formData: any): boolean {
  const volunteerIndicators = [
    'volunteer', 'voluntario', 'disponibilidad', 'availability',
    'ministry_interest', 'skills', 'habilidades', 'time_commitment',
    'leadership_interest', 'availability_days', 'volunteer-availability-assessment'
  ]
  
  const formText = JSON.stringify(formData).toLowerCase()
  const formSlug = formData.formSlug?.toLowerCase() || ''
  
  // Check for volunteer indicators in form data or slug
  const hasVolunteerFields = volunteerIndicators.some(indicator => 
    formText.includes(indicator) || formSlug.includes(indicator)
  )
  
  // Check form title for volunteer terms
  const hasVolunteerTitle = (
    formData.formTitle?.toLowerCase().includes('voluntari') ||
    formData.formTitle?.toLowerCase().includes('disponibil') ||
    formData.formTitle?.toLowerCase().includes('servir')
  )
  
  return hasVolunteerFields || hasVolunteerTitle
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

// Helper function to create or update spiritual assessment from form data
async function createSpiritualAssessment(formData: any, churchId: string): Promise<string | null> {
  try {
    const assessmentData = extractSpiritualAssessmentData(formData)
    
    if (!assessmentData.name || !assessmentData.email) {
      console.log('⚠️ Insufficient spiritual assessment data, skipping creation')
      return null
    }
    
    // Enhanced member linking logic with multiple fallback strategies
    let member = await findOrCreateMember({
      name: assessmentData.name,
      email: assessmentData.email,
      phone: assessmentData.phone,
      churchId,
      source: 'Evaluación Espiritual Externa',
      lifecycle: 'VISITANTE'
    })
    
    if (!member) {
      console.log('❌ Failed to find or create member for spiritual assessment')
      return null
    }
    
    // Create or update spiritual assessment
    const existingAssessment = await db.spiritual_assessments.findFirst({
      where: {
        memberId: member.id,
        churchId
      }
    })
    
    const assessmentPayload = {
      memberId: member.id,
      churchId,
      primaryGifts: assessmentData.spiritualGifts || [],
      ministryPassions: assessmentData.ministryPassions || [],
      experienceLevel: assessmentData.experienceLevel || 'NOVATO',
      spiritualCalling: assessmentData.spiritualCalling,
      assessmentDate: new Date(),
      metadata: {
        source: 'External Form Submission',
        submissionDate: new Date().toISOString(),
        formData: formData
      }
    }
    
    if (existingAssessment) {
      console.log(`📝 Updating existing spiritual assessment: ${existingAssessment.id}`)
      await db.spiritual_assessments.update({
        where: { id: existingAssessment.id },
        data: assessmentPayload
      })
      return existingAssessment.id
    } else {
      console.log(`🙏 Creating new spiritual assessment for: ${member.name}`)
      const newAssessment = await db.spiritual_assessments.create({
        data: {
          id: nanoid(),
          ...assessmentPayload
        }
      })
      return newAssessment.id
    }
  } catch (error) {
    console.error('Error creating spiritual assessment:', error)
    return null
  }
}

// Helper function to create or update volunteer profile from form data
async function createVolunteerProfile(formData: any, churchId: string): Promise<string | null> {
  try {
    const volunteerData = extractVolunteerData(formData)
    
    if (!volunteerData.name || !volunteerData.email) {
      console.log('⚠️ Insufficient volunteer data, skipping creation')
      return null
    }
    
    // Enhanced member linking logic with multiple fallback strategies
    let member = await findOrCreateMember({
      name: volunteerData.name,
      email: volunteerData.email,
      phone: volunteerData.phone,
      churchId,
      source: 'Formulario de Voluntarios Externa',
      lifecycle: 'VISITANTE'
    })
    
    if (!member) {
      console.log('❌ Failed to find or create member for volunteer profile')
      return null
    }
    
    // Create or update volunteer record
    const existingVolunteer = await db.volunteers.findFirst({
      where: {
        memberId: member.id,
        churchId
      }
    })
    
    const volunteerPayload = {
      memberId: member.id,
      churchId,
      skills: volunteerData.skills || [],
      availability: volunteerData.availabilityDays || [],
      timeCommitment: volunteerData.timeCommitment,
      leadershipInterest: volunteerData.leadershipInterest === 'Sí, me interesa liderar',
      specialRequirements: volunteerData.specialRequirements,
      isActive: true,
      metadata: {
        source: 'External Form Submission',
        submissionDate: new Date().toISOString(),
        ministryInterests: volunteerData.ministryInterest,
        formData: formData
      }
    }
    
    if (existingVolunteer) {
      console.log(`📝 Updating existing volunteer: ${existingVolunteer.id}`)
      await db.volunteers.update({
        where: { id: existingVolunteer.id },
        data: volunteerPayload
      })
      return existingVolunteer.id
    } else {
      console.log(`🙋‍♂️ Creating new volunteer record for: ${member.name}`)
      const newVolunteer = await db.volunteers.create({
        data: {
          id: nanoid(),
          ...volunteerPayload
        }
      })
      return newVolunteer.id
    }
  } catch (error) {
    console.error('Error creating volunteer profile:', error)
    return null
  }
}

// Enhanced member linking function with sophisticated duplicate detection
async function findOrCreateMember(memberData: {
  name: string
  email: string
  phone?: string
  churchId: string
  source: string
  lifecycle: string
}) {
  try {
    console.log(`🔍 Searching for existing member: ${memberData.name} (${memberData.email})`)
    
    // Strategy 1: Exact email match (most reliable)
    let member = await db.member.findFirst({
      where: {
        churchId: memberData.churchId,
        email: memberData.email
      }
    })
    
    if (member) {
      console.log(`✅ Found member by email: ${member.id}`)
      // Update member info if phone number is provided and missing
      if (memberData.phone && !member.phone) {
        await db.member.update({
          where: { id: member.id },
          data: { phone: memberData.phone, updatedAt: new Date() }
        })
        console.log(`📞 Added phone number to existing member: ${memberData.phone}`)
      }
      return member
    }
    
    // Strategy 2: Name similarity + phone match (for cases without email initially)
    if (memberData.phone) {
      member = await db.member.findFirst({
        where: {
          churchId: memberData.churchId,
          phone: memberData.phone,
          name: { contains: memberData.name.split(' ')[0], mode: 'insensitive' }
        }
      })
      
      if (member) {
        console.log(`✅ Found member by phone + name similarity: ${member.id}`)
        // Update email if it was missing
        if (!member.email) {
          await db.member.update({
            where: { id: member.id },
            data: { email: memberData.email, updatedAt: new Date() }
          })
          console.log(`📧 Added email to existing member: ${memberData.email}`)
        }
        return member
      }
    }
    
    // Strategy 3: Fuzzy name matching for existing members (prevent duplicates)
    const nameWords = memberData.name.toLowerCase().split(' ').filter(word => word.length > 2)
    
    if (nameWords.length >= 2) {
      // Check for similar names (first name + last name combination)
      const members = await db.member.findMany({
        where: {
          churchId: memberData.churchId,
          OR: [
            { name: { contains: nameWords[0], mode: 'insensitive' } },
            { name: { contains: nameWords[nameWords.length - 1], mode: 'insensitive' } }
          ]
        }
      })
      
      // Check for potential matches
      for (const existingMember of members) {
        const existingWords = existingMember.name.toLowerCase().split(' ')
        const commonWords = nameWords.filter(word => 
          existingWords.some(existing => existing.includes(word) || word.includes(existing))
        )
        
        // If 2+ name words match and same church, likely the same person
        if (commonWords.length >= 2) {
          console.log(`⚠️ Potential duplicate detected: ${existingMember.name} vs ${memberData.name}`)
          console.log(`📞 Linking to existing member and updating contact info: ${existingMember.id}`)
          
          // Update existing member with new contact info
          await db.member.update({
            where: { id: existingMember.id },
            data: {
              email: memberData.email,
              phone: memberData.phone || existingMember.phone,
              updatedAt: new Date()
            }
          })
          
          return existingMember
        }
      }
    }
    
    // Strategy 4: Create new member if no matches found
    console.log(`👤 Creating new member: ${memberData.name}`)
    member = await db.member.create({
      data: {
        id: nanoid(),
        name: memberData.name,
        email: memberData.email,
        phone: memberData.phone,
        churchId: memberData.churchId,
        lifecycle: memberData.lifecycle,
        source: memberData.source,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    
    console.log(`✅ New member created: ${member.id}`)
    return member
    
  } catch (error) {
    console.error('Error in findOrCreateMember:', error)
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

// Helper function to extract spiritual assessment data from form submissions
function extractSpiritualAssessmentData(formData: any) {
  const data: any = {}
  
  for (const [key, value] of Object.entries(formData)) {
    const keyLower = key.toLowerCase()
    const stringValue = String(value || '').trim()
    
    if (!stringValue) continue
    
    // Name detection
    if (keyLower.includes('name') || keyLower.includes('nombre')) {
      data.name = stringValue
    }
    // Email detection
    else if (keyLower.includes('email') || keyLower.includes('correo')) {
      data.email = stringValue
    }
    // Phone detection
    else if (keyLower.includes('phone') || keyLower.includes('telefono')) {
      data.phone = stringValue
    }
    // Spiritual gifts detection (array handling)
    else if (keyLower.includes('spiritual_gifts') || keyLower.includes('dones_espirituales')) {
      data.spiritualGifts = Array.isArray(value) ? value : [stringValue]
    }
    // Ministry passions detection (array handling)
    else if (keyLower.includes('ministry_passions') || keyLower.includes('ministerios_interes')) {
      data.ministryPassions = Array.isArray(value) ? value : [stringValue]
    }
    // Experience level detection
    else if (keyLower.includes('experience_level') || keyLower.includes('experiencia')) {
      data.experienceLevel = mapExperienceLevel(stringValue)
    }
    // Spiritual calling detection
    else if (keyLower.includes('spiritual_calling') || keyLower.includes('llamado_espiritual')) {
      data.spiritualCalling = stringValue
    }
  }
  
  return data
}

// Helper function to extract volunteer data from form submissions
function extractVolunteerData(formData: any) {
  const data: any = {}
  
  for (const [key, value] of Object.entries(formData)) {
    const keyLower = key.toLowerCase()
    const stringValue = String(value || '').trim()
    
    if (!stringValue) continue
    
    // Name detection
    if (keyLower.includes('name') || keyLower.includes('nombre')) {
      data.name = stringValue
    }
    // Email detection
    else if (keyLower.includes('email') || keyLower.includes('correo')) {
      data.email = stringValue
    }
    // Phone detection
    else if (keyLower.includes('phone') || keyLower.includes('telefono')) {
      data.phone = stringValue
    }
    // Ministry interests detection (array handling)
    else if (keyLower.includes('ministry_interest') || keyLower.includes('ministerios_interes')) {
      data.ministryInterest = Array.isArray(value) ? value : [stringValue]
    }
    // Skills detection (array handling)
    else if (keyLower.includes('skills') || keyLower.includes('habilidades')) {
      data.skills = Array.isArray(value) ? value : [stringValue]
    }
    // Availability days detection (array handling)
    else if (keyLower.includes('availability_days') || keyLower.includes('dias_disponibles')) {
      data.availabilityDays = Array.isArray(value) ? value : [stringValue]
    }
    // Time commitment detection
    else if (keyLower.includes('time_commitment') || keyLower.includes('tiempo_dedicar')) {
      data.timeCommitment = stringValue
    }
    // Leadership interest detection
    else if (keyLower.includes('leadership_interest') || keyLower.includes('interes_liderazgo')) {
      data.leadershipInterest = stringValue
    }
    // Special requirements detection
    else if (keyLower.includes('special_requirements') || keyLower.includes('necesidades_especiales')) {
      data.specialRequirements = stringValue
    }
  }
  
  return data
}

// Helper function to map experience level from form strings to database enum
function mapExperienceLevel(experienceString: string): 'NOVATO' | 'INTERMEDIO' | 'AVANZADO' {
  if (!experienceString) return 'NOVATO'
  
  const expLower = experienceString.toLowerCase()
  
  if (expLower.includes('avanzado') || expLower.includes('5+')) {
    return 'AVANZADO'
  }
  if (expLower.includes('intermedio') || expLower.includes('2-5')) {
    return 'INTERMEDIO'
  }
  return 'NOVATO' // Default to novato for beginners/0-1 years
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

    // 🎯 DETECT FORM TYPES AND CREATE APPROPRIATE PROFILES
    const isVisitorForm = detectVisitorForm(enrichedData)
    const isSpiritualAssessment = detectSpiritualAssessmentForm(enrichedData)
    const isVolunteerForm = detectVolunteerForm(enrichedData)
    
    let visitorId = null
    let assessmentId = null
    let volunteerId = null
    let formTypeDetected = 'generic'
    
    // Process visitor forms
    if (isVisitorForm) {
      console.log('📝 Detected visitor form - creating visitor profile...')
      visitorId = await createVisitorProfile(enrichedData, form.churchId)
      
      if (visitorId) {
        console.log(`👤 Visitor profile created: ${visitorId}`)
        enrichedData.visitorId = visitorId
        enrichedData.automationType = 'visitor_form'
        formTypeDetected = 'visitor'
      }
    }
    
    // Process spiritual assessment forms
    if (isSpiritualAssessment) {
      console.log('🙏 Detected spiritual assessment form - creating/updating assessment...')
      assessmentId = await createSpiritualAssessment(enrichedData, form.churchId)
      
      if (assessmentId) {
        console.log(`✨ Spiritual assessment processed: ${assessmentId}`)
        enrichedData.assessmentId = assessmentId
        enrichedData.automationType = 'spiritual_assessment'
        formTypeDetected = 'spiritual_assessment'
      }
    }
    
    // Process volunteer forms
    if (isVolunteerForm) {
      console.log('🙋‍♂️ Detected volunteer form - creating/updating volunteer profile...')
      volunteerId = await createVolunteerProfile(enrichedData, form.churchId)
      
      if (volunteerId) {
        console.log(`🤝 Volunteer profile processed: ${volunteerId}`)
        enrichedData.volunteerId = volunteerId
        enrichedData.automationType = 'volunteer_form'
        formTypeDetected = 'volunteer'
      }
    }

    // 🔥 TRIGGER COMPLETE AUTOMATION SYSTEM
    await FormAutomationEngine.processCustomFormSubmission(
      form.id,
      formTypeDetected,
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

    // Determine response message based on form type
    let responseMessage = 'Formulario enviado exitosamente.'
    if (isVisitorForm) {
      responseMessage = 'Información recibida. Te hemos agregado a nuestro sistema de seguimiento.'
    } else if (isSpiritualAssessment) {
      responseMessage = 'Evaluación espiritual recibida. La información se ha agregado a tu perfil y notificaremos al liderazgo.'
    } else if (isVolunteerForm) {
      responseMessage = 'Información de voluntariado recibida. Nos pondremos en contacto contigo sobre oportunidades de servicio.'
    }

    return NextResponse.json({ 
      success: true,
      submissionId: submission.id,
      visitorId: visitorId,
      assessmentId: assessmentId,
      volunteerId: volunteerId,
      message: responseMessage,
      automation: {
        triggered: true,
        formType: formTypeDetected,
        churchId: form.churchId,
        visitorCreated: !!visitorId,
        assessmentCreated: !!assessmentId,
        volunteerCreated: !!volunteerId
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