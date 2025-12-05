

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { randomUUID } from 'crypto'

export const dynamic = 'force-dynamic'

// GET child check-in by QR code (public endpoint for parent QR scanning)
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const children_check_ins = await db.children_check_ins.findUnique({
      where: {
        qrCode: params.code
      },
      include: {
        events: true,
        churches: true
      }
    })

    if (!children_check_ins) {
      return NextResponse.json(
        { message: 'Check-in de niño no encontrado' },
        { status: 404 }
      )
    }

    // Return public-safe data for QR form completion
    return NextResponse.json({
      id: children_check_ins.id,
      qrCode: children_check_ins.qrCode,
      childName: children_check_ins.childName,
      childAge: children_check_ins.childAge,
      parentName: children_check_ins.parentName,
      parentPhone: children_check_ins.parentPhone,
      parentEmail: children_check_ins.parentEmail,
      emergencyContact: children_check_ins.emergencyContact,
      emergencyPhone: children_check_ins.emergencyPhone,
      allergies: children_check_ins.allergies,
      specialNeeds: children_check_ins.specialNeeds,
      checkedIn: children_check_ins.checkedIn,
      checkedOut: children_check_ins.checkedOut,
      checkedInAt: children_check_ins.checkedInAt,
      event: children_check_ins.events ? {
        title: children_check_ins.events.title,
        startDate: children_check_ins.events.startDate
      } : null,
      churches: {
        name: children_check_ins.churches.name
      },
      // Security info (non-sensitive)
      securityPin: children_check_ins.securityPin,
      requiresBothAuth: children_check_ins.requiresBothAuth
    })

  } catch (error) {
    console.error('Error fetching child check-in by QR:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Complete QR-based check-in with photos
export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const {
      childName,
      childAge,
      parentName,
      parentPhone,
      parentEmail,
      emergencyContact,
      emergencyPhone,
      allergies,
      specialNeeds,
      childPhoto,
      parentPhoto,
      eventId,
      churchId
    } = await request.json()

    if (!childName || !parentName || !parentPhone) {
      return NextResponse.json(
        { message: 'Nombre del niño, nombre del padre y teléfono son requeridos' },
        { status: 400 }
      )
    }

    // Generate security PIN
    const securityPin = Math.floor(100000 + Math.random() * 900000).toString()

    // Create complete child check-in via QR
    const children_check_ins = await db.children_check_ins.create({
      data: {
        id: randomUUID(),
        childName,
        childAge: childAge ? parseInt(childAge) : null,
        parentName,
        parentPhone,
        parentEmail,
        emergencyContact,
        emergencyPhone,
        allergies,
        specialNeeds,
        qrCode: params.code,
        securityPin,
        childPhotoUrl: childPhoto || null,
        parentPhotoUrl: parentPhoto || null,
        photoTakenAt: childPhoto || parentPhoto ? new Date() : null,
        requiresBothAuth: !!(childPhoto && parentPhoto),
        eventId,
        churchId,
        checkedIn: true,
        checkedOut: false,
        backupAuthCodes: [
          Math.floor(100000 + Math.random() * 900000).toString(),
          Math.floor(100000 + Math.random() * 900000).toString()
        ]
      },
      include: {
        events: true,
        churches: true
      }
    })

    return NextResponse.json({
      success: true,
      check_ins: children_check_ins,
      securityPin: children_check_ins.securityPin,
      message: '✅ Check-in completado exitosamente via QR'
    }, { status: 201 })

  } catch (error) {
    console.error('Error completing QR child check-in:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
