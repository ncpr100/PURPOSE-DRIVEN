import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can bulk update
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    const body = await request.json()
    const { updates } = body

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: 'No se proporcionaron actualizaciones' }, { status: 400 })
    }

    // Validate updates format
    for (const update of updates) {
      if (!update.id || !['masculino', 'femenino'].includes(update.gender)) {
        return NextResponse.json({ error: 'Formato de actualización inválido' }, { status: 400 })
      }
    }

    // Bulk update members
    const results = []
    let successCount = 0
    let errorCount = 0

    for (const update of updates) {
      try {
        await db.members.update({
          where: {
            id: update.id,
            churchId: session.user.churchId // Ensure church scoping
          },
          data: {
            gender: update.gender,
            updatedAt: new Date()
          }
        })
        results.push({ id: update.id, status: 'success' })
        successCount++
      } catch (error) {
        results.push({ id: update.id, status: 'error', error: error.message })
        errorCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Actualizadas ${successCount} miembros correctamente, ${errorCount} errores`,
      results,
      summary: {
        total: updates.length,
        success: successCount,
        errors: errorCount
      }
    })

  } catch (error) {
    console.error('Error in bulk gender update:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get members with missing gender data
    const membersWithoutGender = await db.members.findMany({
      where: {
        churchId: session.user.churchId,
        isActive: true,
        OR: [
          { gender: null },
          { gender: '' }
        ]
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        gender: true,
        createdAt: true
      },
      orderBy: {
        firstName: 'asc'
      }
    })

    return NextResponse.json({
      members: membersWithoutGender,
      total: membersWithoutGender.length,
      success: true
    })

  } catch (error) {
    console.error('Error fetching members without gender:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}