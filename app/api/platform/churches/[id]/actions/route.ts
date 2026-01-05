import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado - Se requiere rol SUPER_ADMIN' }, { status: 403 })
    }

    const { id: churchId } = params
    const { action } = await request.json()

    if (!action || !['activate', 'deactivate', 'reset'].includes(action)) {
      return NextResponse.json({ error: 'Acción inválida' }, { status: 400 })
    }

    // Verify church exists
    const church = await db.churches.findUnique({
      where: { id: churchId }
    })

    if (!church) {
      return NextResponse.json({ error: 'Iglesia no encontrada' }, { status: 404 })
    }

    let result

    switch (action) {
      case 'activate':
        result = await db.churches.update({
          where: { id: churchId },
          data: { 
            isActive: true,
            updatedAt: new Date()
          }
        })
        break

      case 'deactivate':
        result = await db.churches.update({
          where: { id: churchId },
          data: { 
            isActive: false,
            updatedAt: new Date()
          }
        })
        break

      case 'reset':
        // Reset church data (be very careful with this action)
        // For now, just update the lastResetAt field if it exists
        result = await db.churches.update({
          where: { id: churchId },
          data: { 
            updatedAt: new Date()
            // Add other reset logic here if needed
          }
        })
        break

      default:
        return NextResponse.json({ error: 'Acción no implementada' }, { status: 400 })
    }

    // Log the action for audit purposes
    console.log(`SUPER_ADMIN ${session.user.email} performed ${action} on church ${churchId}`)

    return NextResponse.json({
      success: true,
      action,
      churchId,
      church: result,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error performing church action:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
}