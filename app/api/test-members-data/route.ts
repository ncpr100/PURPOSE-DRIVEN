import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 TEST ENDPOINT: /api/test-members-data called')
    
    const session = await getServerSession(authOptions)
    console.log('🔍 Session user:', session?.user?.email, session?.user?.role, session?.user?.churchId)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await db.users.findUnique({
      where: { id: session.user.id },
      select: { id: true, churchId: true, role: true, email: true }
    })
    
    console.log('🔍 User from DB:', user)

    if (!user?.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 403 })
    }

    // Test member count
    const memberCount = await db.members.count({
      where: { 
        churchId: user.churchId,
        isActive: true 
      }
    })
    
    console.log('🔍 Member count for church', user.churchId, ':', memberCount)

    // Test getting first few members
    const sampleMembers = await db.members.findMany({
      where: { 
        churchId: user.churchId,
        isActive: true 
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true
      },
      take: 5
    })
    
    console.log('🔍 Sample members:', sampleMembers)

    return NextResponse.json({
      success: true,
      user,
      memberCount,
      sampleMembers,
      churchId: user.churchId
    })
  } catch (error) {
    console.error('💥 Test endpoint error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}