import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - Fetch conversions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const conversions = await prisma.funnel_conversions.findMany({
      where: {
        funnels: {
          is: {
            churchId: session.user.churchId
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })
    
    return NextResponse.json(conversions)
  } catch (error) {
    console.error('Error fetching conversions:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST - Create conversion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { funnelId, stepId, email, firstName, lastName } = body
    
    const conversion = await prisma.funnel_conversions.create({
      data: {
        funnelId,
        stepId,
        email,
        firstName,
        lastName,
        createdAt: new Date()
      }
    })
    
    return NextResponse.json({ success: true, conversion })
  } catch (error) {
    console.error('Error creating conversion:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
