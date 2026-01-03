import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - Fetch all visitor form submissions for a church
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const submissions = await db.visitor_submissions.findMany({
      where: { churchId: session.user.churchId },
      include: {
        visitor_forms: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: { submittedAt: 'desc' }
    })

    return NextResponse.json(submissions)
  } catch (error) {
    console.error('Error fetching visitor submissions:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}