
import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { 
  addConnection, 
  removeConnection, 
  broadcastToChurch, 
  hasUserConnections 
} from '@/lib/sse-broadcast'

export const dynamic = 'force-dynamic'

// GET - Server-Sent Events endpoint
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 })
  }

  let user: { id: string; name: string | null; email: string | null; role: string; churchId: string | null; isActive: boolean } | null
  try {
    user = await prisma.users.findUnique({
      where: { email: session.user.email! },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        churchId: true,
        isActive: true
      }
    })
  } catch (error) {
    console.log('⚠️ REALTIME: Database connection failed, using session data')
    // Fallback to session data when database unavailable
    user = {
      id: session.user.id,
      name: session.user.name ?? null,
      email: session.user.email ?? null,
      role: session.user.role,
      churchId: session.user.churchId,
      isActive: true
    }
  }

  if (!user || !user.isActive) {
    return new Response('User not found or inactive', { status: 403 })
  }

  // SUPER_ADMIN users don't need a churchId
  if (user.role !== 'SUPER_ADMIN' && !user.churchId) {
    return new Response('User not associated with a church', { status: 403 })
  }

  // Capture for TypeScript narrowing in closures
  const u = user

  const stream = new ReadableStream({
    start(controller) {
      const connectionId = `${u.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Store connection
      addConnection(connectionId, {
        userId: u.id,
        churchId: u.churchId || '',
        role: u.role,
        name: u.name || u.email || '',
        controller,
        startTime: new Date()
      })

      console.log(`📡 SSE connection established: ${u.name} (${u.role})`)

      // Send initial connection message
      const welcomeMessage = {
        type: 'connection',
        data: {
          message: 'Conectado al sistema de tiempo real',
          connectionId,
          timestamp: Date.now()
        }
      }
      
      controller.enqueue(
        new TextEncoder().encode(`data: ${JSON.stringify(welcomeMessage)}\n\n`)
      )

      // Send periodic heartbeat
      const heartbeat = setInterval(() => {
        try {
          const heartbeatMessage = {
            type: 'heartbeat',
            data: { timestamp: Date.now() }
          }
          controller.enqueue(
            new TextEncoder().encode(`data: ${JSON.stringify(heartbeatMessage)}\n\n`)
          )
        } catch (error) {
          clearInterval(heartbeat)
          removeConnection(connectionId)
        }
      }, 30000) // Every 30 seconds

      // Broadcast user presence
      if (u.churchId) {
        broadcastToChurch(u.churchId!, {
          type: 'presence',
          data: {
            userId: u.id,
            name: u.name,
            status: 'online',
            timestamp: Date.now()
          }
        })
      }

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat)
        removeConnection(connectionId)
        
        console.log(`📡 SSE connection closed: ${u.name}`)
        
        // Broadcast user offline if no more connections
        if (!hasUserConnections(u.id) && u.churchId) {
          broadcastToChurch(u.churchId!, {
            type: 'presence',
            data: {
              userId: u.id,
              name: u.name,
              status: 'offline',
              timestamp: Date.now()
            }
          })
        }
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  })
}
