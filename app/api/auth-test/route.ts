import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 AUTH TEST: Starting authentication test...')
    
    // Check session
    const session = await getServerSession(authOptions)
    console.log('🔍 AUTH TEST: Session result:', {
      hasSession: !!session,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      churchId: session?.user?.churchId,
      role: session?.user?.role
    })
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: 'No session found',
        debug: {
          session: !!session,
          user: !!session?.user,
          userId: session?.user?.id
        }
      }, { status: 401 })
    }
    
    // Check user in database
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, churchId: true, role: true, email: true }
    })
    
    console.log('🔍 AUTH TEST: Database user result:', user)
    
    if (!user?.churchId) {
      return NextResponse.json({ 
        error: 'Usuario sin iglesia asignada',
        debug: {
          foundUser: !!user,
          userHasChurchId: !!user?.churchId,
          user: user
        }
      }, { status: 403 })
    }
    
    // Test member count
    const memberCount = await db.member.count({
      where: { 
        churchId: user.churchId,
        isActive: true 
      }
    })
    
    console.log('🔍 AUTH TEST: Member count result:', memberCount)
    
    return NextResponse.json({
      success: true,
      sessionValid: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        churchId: user.churchId
      },
      memberCount,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ AUTH TEST ERROR:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error
    })
    
    return NextResponse.json({
      error: 'Error en test de autenticación',
      debug: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}