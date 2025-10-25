
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// Data retention policies - cleanup old communications
async function cleanupOldCommunications(churchId: string) {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  
  const deletedCount = await db.communication.deleteMany({
    where: {
      churchId: churchId,
      createdAt: {
        lt: sixMonthsAgo
      },
      status: 'ENVIADO' // Only delete successfully sent communications
    }
  })
  
  console.log(`Data retention cleanup: Deleted ${deletedCount.count} old communications for church ${churchId}`)
  return deletedCount.count
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const churchId = searchParams.get('churchId')

    if (!churchId) {
      return NextResponse.json({ error: 'Church ID es requerido' }, { status: 400 })
    }

    // Trigger data retention cleanup periodically
    if (Math.random() < 0.1) { // 10% chance to trigger cleanup
      cleanupOldCommunications(churchId).catch(console.error)
    }

    // Get communication history/logs
    const communications = await db.communication.findMany({
      where: {
        churchId: churchId,
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        template: true
      }
    })

    return NextResponse.json(communications)
  } catch (error) {
    console.error('Error fetching communications:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    // Communication logging for API access
    console.log(`Communication API POST request at ${new Date().toISOString()}`)
    
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const { 
      title, 
      content, 
      type, 
      targetGroup, 
      templateId, 
      churchId,
      scheduledAt 
    } = body

    // Message content validation
    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Título es requerido' }, { status: 400 })
    }

    if (!type || !targetGroup || !churchId) {
      return NextResponse.json({ error: 'Datos requeridos faltantes' }, { status: 400 })
    }

    // Sanitize input data
    const sanitizedTitle = title.trim().replace(/[<>\"'&]/g, '').substring(0, 255)
    const sanitizedContent = content ? content.trim().replace(/[<>\"'&]/g, '').substring(0, 1600) : ''

    // Create mass communication entry with message delivery status tracking
    const communication = await db.communication.create({
      data: {
        title: sanitizedTitle,
        content: sanitizedContent,
        type,
        targetGroup,
        churchId,
        sentBy: session.user.id,
        templateId: templateId || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: scheduledAt ? 'PROGRAMADO' : 'SENT', // Message delivery status tracking
        recipients: 0 // Will be updated after sending
      },
      include: {
        template: true
      }
    })

    // Communication logging for successful creation
    console.log(`Communication created: ${communication.id} by user ${session.user.id}`)

    return NextResponse.json(communication, { status: 201 })
  } catch (error) {
    console.error('Error creating communication:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
