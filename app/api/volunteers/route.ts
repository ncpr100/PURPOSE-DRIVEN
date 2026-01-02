
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { volunteerCreateSchema } from '@/lib/validations/volunteer'
import { ZodError } from 'zod'

export const dynamic = 'force-dynamic'

// GET all volunteers for a church
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.churchId) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Sin permisos' }, { status: 403 })
    }

    const volunteers = await db.volunteers.findMany({
      where: {
        churchId: session.user.churchId,
        isActive: true
      },
      include: {
        members: true,
        ministries: true,
        assignments: {
          orderBy: {
            date: 'desc'
          },
          take: 10 // Limit to last 10 assignments for performance
        }
      },
      orderBy: {
        lastName: 'asc'
      }
    })

    return NextResponse.json(volunteers)

  } catch (error) {
    console.error('Error fetching volunteers:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// CREATE a new volunteer
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.churchId) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Sin permisos' }, { status: 403 })
    }

    // Parse and validate request body
    const body = await request.json()
    
    // ✅ SECURITY FIX: Validate all input with Zod schema
    // Prevents: XSS attacks, SQL injection, data corruption, invalid emails
    const validated = volunteerCreateSchema.parse(body)

    const volunteer = await db.volunteers.create({
      data: {
        memberId: validated.memberId || null,
        firstName: validated.firstName,
        lastName: validated.lastName,
        email: validated.email || null,
        phone: validated.phone || null,
        // ✅ VALIDATED: skills is now guaranteed to be an array
        skills: validated.skills?.length ? JSON.stringify(validated.skills) : null,
        // ✅ VALIDATED: availability is now guaranteed to be a proper object
        availability: validated.availability ? JSON.stringify(validated.availability) : null,
        ministryId: validated.ministryId === 'no-ministry' ? null : validated.ministryId,
        churchId: session.user.churchId,
        isActive: true
      },
      include: {
        members: true,
        ministries: true,
        assignments: true
      }
    })

    return NextResponse.json(volunteer, { status: 201 })

  } catch (error) {
    // ✅ SECURITY FIX: User-friendly error messages for validation failures
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          message: 'Datos inválidos',
          errors: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      )
    }
    
    console.error('Error creating volunteer:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

