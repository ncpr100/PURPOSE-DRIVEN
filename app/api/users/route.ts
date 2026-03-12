import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/users - Returns church-scoped user list for role assignment
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    const whereCondition = session.user.role === 'SUPER_ADMIN'
      ? {}
      : { churchId: session.user.churchId }

    const users = await db.users.findMany({
      where: whereCondition,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        churchId: true,
        isActive: true,
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('GET /api/users error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
