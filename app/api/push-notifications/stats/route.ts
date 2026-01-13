import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'
import { PushNotificationService } from '@/lib/push-notifications'

// Mark the route as dynamic
export const dynamic = 'force-dynamic';
// GET - Get push notification statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    const user = await prisma.users.findUnique({
      where: { email: session.user.email },
      select: { id: true, churchId: true, role: true }
    })
    if (!user || !user.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 400 })
    // Check permissions - only admins can view stats
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA'].includes(user.role)) {
      return NextResponse.json({ error: 'Sin permisos para ver estadísticas' }, { status: 403 })
    // Get statistics using the service
    const stats = await PushNotificationService.getStats(user.churchId)
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error getting push notification stats:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
