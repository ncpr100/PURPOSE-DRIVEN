import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET /api/support-contact - Get support contact information (PUBLIC for all authenticated users)
export async function GET(request: NextRequest) {
  try {
    // Allow authenticated users (tenants) to view contact info
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Fetch support contact info from database
    let contactInfo = await db.support_contact_info.findUnique({
      where: { id: 'default' }
    })

    // If no record exists, create default one
    if (!contactInfo) {
      contactInfo = await db.support_contact_info.create({
        data: {
          id: 'default',
          whatsappNumber: '+57 302 123 4410',
          whatsappUrl: 'https://wa.me/573021234410',
          email: 'soporte@khesed-tek-systems.org',
          schedule: 'Lun-Vie 9AM-6PM (Colombia)',
          companyName: 'Khesed-tek Systems',
          location: 'Barranquilla Atlántico, Colombia',
          website: 'https://khesed-tek-systems.org',
          updatedAt: new Date()
        }
      })
    }

    return NextResponse.json(contactInfo, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
  } catch (error) {
    console.error('GET /api/support-contact error:', error)
    return NextResponse.json(
      { error: 'Error al obtener información de contacto' },
      { status: 500 }
    )
  }
}

// PUT /api/support-contact - Update support contact information (SUPER_ADMIN only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'NO_SESSION' }, { status: 401 })
    }

    const user = await db.users.findUnique({
      where: { id: session.user.id },
      select: { role: true, isActive: true }
    })

    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'INSUFFICIENT_ROLE' }, { status: 403 })
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'INACTIVE_USER' }, { status: 403 })
    }

    const body = await request.json()
    const { whatsappNumber, whatsappUrl, email, schedule, companyName, location, website } = body

    // Validate required fields
    if (!email || !whatsappNumber) {
      return NextResponse.json(
        { error: 'Email y número de WhatsApp son requeridos' },
        { status: 400 }
      )
    }

    // Update or create contact info
    const contactInfo = await db.support_contact_info.upsert({
      where: { id: 'default' },
      update: {
        whatsappNumber,
        whatsappUrl,
        email,
        schedule: schedule || 'Lun-Vie 9AM-6PM (Colombia)',
        companyName: companyName || 'Khesed-tek Systems',
        location: location || 'Bogotá, Colombia',
        website: website || 'https://khesedtek.com',
        updatedAt: new Date()
      },
      create: {
        id: 'default',
        whatsappNumber,
        whatsappUrl,
        email,
        schedule: schedule || 'Lun-Vie 9AM-6PM (Colombia)',
        companyName: companyName || 'Khesed-tek Systems',
        location: location || 'Bogotá, Colombia',
        website: website || 'https://khesedtek.com',
        updatedAt: new Date()
      }
    })

    console.log('✅ Support contact info updated by SUPER_ADMIN:', user.role)

    return NextResponse.json({
      success: true,
      message: 'Información de contacto actualizada exitosamente',
      data: contactInfo
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate'
      }
    })
  } catch (error) {
    console.error('PUT /api/support-contact error:', error)
    return NextResponse.json(
      { error: 'Error al actualizar información de contacto' },
      { status: 500 }
    )
  }
}

// POST /api/support-contact - Submit support ticket (STUB - not yet implemented)
// NOTE: Stub implementation - support_requests model not yet implemented in schema
// TODO: Create support_requests model for ticket system
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await db.users.findUnique({
      where: { id: session.user.id },
      include: { churches: true }
    })

    if (!user?.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 403 })
    }

    const body = await request.json()
    const { subject, message, category, priority, contactEmail, contactPhone } = body

    if (!subject || !message) {
      return NextResponse.json({ error: 'Asunto y mensaje son requeridos' }, { status: 400 })
    }

    // STUB: Log support request until model implemented
    console.log('Support request received (NOT SAVED - model unimplemented):', {
      subject,
      message,
      category: category || 'general',
      priority: priority || 'medium',
      contactEmail: contactEmail || user.email,
      contactPhone,
      churchId: user.churchId,
      userId: user.id,
      submittedAt: new Date()
    })

    // Return stub success response
    const stubResponse = {
      id: `stub-${Date.now()}`,
      subject,
      message,
      category: category || 'general',
      priority: priority || 'medium',
      status: 'pending',
      contactEmail: contactEmail || user.email,
      contactPhone,
      submittedAt: new Date().toISOString()
    }

    // Enhanced success response
    return NextResponse.json({
      success: true,
      message: 'Solicitud de soporte enviada exitosamente (modo stub - no persistente)',
      supportRequest: stubResponse
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating support request:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
