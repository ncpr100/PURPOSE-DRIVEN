
/**
 * ✅ SECURITY-HARDENED: Members API Endpoint
 * 
 * Security Features:
 * - Authentication and authorization checks
 * - Role-based access control
 * - Input validation and sanitization
 * - Rate limiting
 * - CSRF protection
 * - SQL injection prevention
 * - Data exposure limitation
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'
import { checkRateLimit } from '@/lib/rate-limit'
import { validateCSRFToken } from '@/lib/csrf'
import { memberSchema, paginationSchema, searchSchema } from '@/lib/validation-schemas'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // ✅ SECURITY: Rate limiting
    const rateLimitResult = await checkRateLimit(request, 'members-read')
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Demasiadas solicitudes. Intente nuevamente más tarde.',
          code: 'RATE_LIMIT_EXCEEDED' 
        },
        { status: 429 }
      )
    }

    // ✅ SECURITY: Authentication check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // ✅ SECURITY: Church membership validation
    const user = await db.users.findUnique({
      where: { id: session.user.id },
      select: { id: true, churchId: true, role: true }
    })

    if (!user?.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 403 })
    }

    // ✅ SECURITY: Role-based access control
    const allowedRoles = ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER']
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    // ✅ SECURITY: Query parameter validation
    const url = new URL(request.url)
    
    // Handle pagination with proper defaults
    const paginationParams = paginationSchema.parse({
      page: url.searchParams.get('page') || '1',
      limit: url.searchParams.get('limit') || '2000'
    })
    
    // Parse search params with member-specific validation
    const rawSearchParams = {
      q: url.searchParams.get('q'),
      status: url.searchParams.get('status'),
      sortBy: url.searchParams.get('sortBy'),
      sortOrder: url.searchParams.get('sortOrder')
    }
    
    // Map sortBy values to actual Member model columns
    const sortByMapping: { [key: string]: string } = {
      'name': 'firstName',
      'date': 'createdAt',
      'status': 'isActive',
      'category': 'ministryId'
    }
    
    const queryParams = {
      ...paginationParams,
      q: rawSearchParams.q?.trim(),
      status: rawSearchParams.status || 'all',
      sortBy: sortByMapping[rawSearchParams.sortBy || 'date'] || 'createdAt',
      sortOrder: (rawSearchParams.sortOrder === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc'
    }

    // ✅ SECURITY: Build secure where clause
    const whereClause: any = {
      churchId: user.churchId,
      isActive: queryParams.status === 'inactive' ? false : true
    }

    if (queryParams.q) {
      const searchTerm = queryParams.q.trim()
      whereClause.OR = [
        { firstName: { contains: searchTerm, mode: 'insensitive' } },
        { lastName: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } }
      ]
    }

    // ✅ SECURITY: Limited data exposure with secure select
    const members = await db.members.findMany({
      where: whereClause,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        gender: true,
        maritalStatus: true,
        membershipDate: true,
        isActive: true,
        spiritualGifts: true,
        secondaryGifts: true,
        spiritualCalling: true,
        ministryPassion: true,
        experienceLevel: true,
        leadershipReadiness: true,
        createdAt: true,
        updatedAt: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        birthDate: true,
        baptismDate: true,
        ministryId: true,
        member_spiritual_profiles: {
          select: {
            id: true,
            primaryGifts: true,
            secondaryGifts: true,
            spiritualCalling: true,
            ministryPassions: true,
            experienceLevel: true,
            volunteerReadinessScore: true,
            leadershipReadinessScore: true,
            assessmentDate: true
          }
        }
        // Exclude sensitive fields like notes, emergency contacts for list view
      },
      orderBy: {
        [queryParams.sortBy]: queryParams.sortOrder
      },
      skip: (queryParams.page - 1) * queryParams.limit,
      take: queryParams.limit
    })

    // ✅ SECURITY: Get total count for pagination
    const totalCount = await db.members.count({
      where: whereClause
    })

    console.log('📊 Members API returning:', members.length, 'of', totalCount, 'members')
    
    return NextResponse.json({
      success: true,
      members,
      pagination: {
        page: queryParams.page,
        limit: queryParams.limit,
        total: totalCount,
        pages: Math.ceil(totalCount / queryParams.limit)
      }
    })
  } catch (error) {
    console.error('❌ Error in Members API:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error,
      details: error
    })
    
    // Send more specific error information in development
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        { 
          error: 'Error interno del servidor',
          debug: error instanceof Error ? error.message : 'Unknown error',
          type: typeof error
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // ✅ SECURITY: Rate limiting for member creation
    const rateLimitResult = await checkRateLimit(request, 'members-create')
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Demasiadas solicitudes. Intente nuevamente más tarde.',
          code: 'RATE_LIMIT_EXCEEDED' 
        },
        { status: 429 }
      )
    }

    // ✅ SECURITY: CSRF protection
    const csrfValidation = await validateCSRFToken(request)
    if (!csrfValidation) {
      return NextResponse.json(
        { 
          error: 'Solicitud de seguridad inválida',
          code: 'CSRF_VALIDATION_FAILED' 
        },
        { status: 403 }
      )
    }

    // ✅ SECURITY: Authentication check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // ✅ SECURITY: User validation and role check
    const user = await db.users.findUnique({
      where: { id: session.user.id },
      select: { id: true, churchId: true, role: true }
    })

    if (!user?.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 403 })
    }

    // ✅ SECURITY: Role-based access control for creation
    const allowedRoles = ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'CHURCH_ADMIN', 'PASTOR', 'LIDER']
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Permisos insuficientes para crear miembros' }, { status: 403 })
    }

    const body = await request.json()

    // ✅ SECURITY: Input validation and sanitization
    let validatedData
    try {
      validatedData = memberSchema.parse(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { 
            error: 'Datos inválidos',
            code: 'VALIDATION_ERROR',
            details: error.errors
          },
          { status: 400 }
        )
      }
      throw error
    }

    // ✅ SECURITY: Check for duplicate email within church
    if (validatedData.email) {
      const existingMember = await db.members.findFirst({
        where: {
          email: validatedData.email,
          churchId: user.churchId,
          isActive: true
        },
        select: { id: true, email: true }
      })

      if (existingMember) {
        return NextResponse.json(
          { 
            error: 'Ya existe un miembro con este email en la iglesia',
            code: 'EMAIL_ALREADY_EXISTS' 
          },
          { status: 409 }
        )
      }
    }

    // ✅ SECURITY: Create member with validated data
    const member = await db.members.create({
      data: {
        ...validatedData,
        churchId: user.churchId,
        isActive: true
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        membershipDate: true,
        isActive: true,
        createdAt: true
      }
    })

    // ✅ SECURITY: Trigger automation securely
    try {
      const { AutomationTriggers } = await import('@/lib/automation-engine')
      await AutomationTriggers.memberJoined({
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phone: member.phone,
        membershipDate: member.membershipDate,
        isActive: member.isActive
      }, user.churchId)
      
      console.log(`🤖 Triggered member joined automation for ${member.firstName} ${member.lastName}`)
    } catch (automationError) {
      console.error('Error triggering member joined automation:', automationError)
      // Don't fail the member creation if automation fails
    }

    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    console.error('Error creating member:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
