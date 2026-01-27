import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - Fetch website services (SUPER_ADMIN only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Acceso denegado - Se requiere rol SUPER_ADMIN' },
        { status: 403 }
      )
    }

    // Fetch website requests
    const websiteRequests = await prisma.website_requests.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 100
    })

    // Fetch active websites
    const activeWebsites = await prisma.websites.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            web_pages: true,
            funnels: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json({
      requests: websiteRequests,
      activeWebsites: activeWebsites,
      success: true
    })
  } catch (error) {
    console.error('Error fetching website services:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
