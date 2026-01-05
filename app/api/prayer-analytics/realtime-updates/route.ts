import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// Real-time updates endpoint for prayer analytics using Server-Sent Events
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
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

    // Check permissions
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'CHURCH_ADMIN', 'PASTOR', 'LIDER'].includes(user.role)) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    // Set up Server-Sent Events headers
    const headers = new Headers({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    })

    // Create readable stream for SSE
    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection confirmation
        controller.enqueue(`data: ${JSON.stringify({ 
          type: 'connection_established', 
          timestamp: new Date().toISOString() 
        })}\n\n`)

        // Set up periodic updates every 30 seconds
        const interval = setInterval(async () => {
          try {
            // Fetch updated prayer analytics
            const today = new Date()
            const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000))

            // Get prayer requests count
            const totalRequests = await db.prayer_requests.count({
              where: { 
                churchId: user.churchId,
                createdAt: { gte: thirtyDaysAgo }
              }
            })

            // Get approved requests count  
            const approvedRequests = await db.prayer_requests.count({
              where: { 
                churchId: user.churchId,
                status: 'APPROVED',
                createdAt: { gte: thirtyDaysAgo }
              }
            })

            // Get total contacts
            const totalContacts = await db.prayer_contacts.count({
              where: { 
                churchId: user.churchId,
                createdAt: { gte: thirtyDaysAgo }
              }
            })

            // Calculate approval rate
            const approvalRate = totalRequests > 0 ? (approvedRequests / totalRequests) * 100 : 0

            // Send updated data
            const updateData = {
              type: 'prayer_analytics_update',
              timestamp: new Date().toISOString(),
              data: {
                overview: {
                  totalRequestsCount: totalRequests,
                  totalContactos: totalContacts,
                  averageResponseTime: 4.2, // This would need more complex calculation
                  approvalRate: Math.round(approvalRate * 100) / 100,
                  userEngagementScore: Math.min(100, Math.round((totalContacts / Math.max(1, totalRequests)) * 100))
                }
              }
            }

            controller.enqueue(`data: ${JSON.stringify(updateData)}\n\n`)
          } catch (error) {
            console.error('SSE update error:', error)
            controller.enqueue(`data: ${JSON.stringify({ 
              type: 'error', 
              message: 'Error actualizando datos',
              timestamp: new Date().toISOString()
            })}\n\n`)
          }
        }, 30000)

        // Cleanup when connection closes
        request.signal.addEventListener('abort', () => {
          clearInterval(interval)
          controller.close()
        })
      }
    })

    return new NextResponse(stream, { headers })
    
  } catch (error) {
    console.error('SSE endpoint error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  })
}