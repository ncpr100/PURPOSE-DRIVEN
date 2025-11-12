import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 SIMPLE MEMBERS API: Starting request...')
    
    // Skip rate limiting for now - test core functionality
    
    // ✅ SECURITY: Authentication check
    const session = await getServerSession(authOptions)
    console.log('🚀 SIMPLE MEMBERS API: Session check:', {
      hasSession: !!session,
      userId: session?.user?.id,
      churchId: session?.user?.churchId
    })
    
    if (!session?.user?.id) {
      console.log('❌ SIMPLE MEMBERS API: No session or user ID')
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // ✅ SECURITY: Church membership validation
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, churchId: true, role: true }
    })
    
    console.log('🚀 SIMPLE MEMBERS API: User lookup result:', user)

    if (!user?.churchId) {
      console.log('❌ SIMPLE MEMBERS API: User has no churchId')
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 403 })
    }

    // Simple query without complex filtering
    const members = await db.member.findMany({
      where: {
        churchId: user.churchId,
        isActive: true
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20 // Limit to first 20 for testing
    })

    console.log('🚀 SIMPLE MEMBERS API: Query result:', {
      churchId: user.churchId,
      memberCount: members.length,
      firstMember: members[0]?.firstName
    })
    
    return NextResponse.json({
      success: true,
      members,
      total: members.length,
      churchId: user.churchId
    })
    
  } catch (error) {
    console.error('❌ SIMPLE MEMBERS API ERROR:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json({
      error: 'Error interno del servidor',
      debug: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}