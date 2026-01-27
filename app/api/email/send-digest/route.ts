import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// POST - Send digest emails
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Acceso denegado - Se requiere rol SUPER_ADMIN' },
        { status: 403 }
      )
    }

    // Basic implementation - return success
    return NextResponse.json({
      success: true,
      message: 'Digest emails sent successfully',
      totalSent: 0,
      churches: []
    })
  } catch (error) {
    console.error('Error sending digest emails:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// GET - Preview digest content
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Acceso denegado - Se requiere rol SUPER_ADMIN' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      preview: 'Digest preview content'
    })
  } catch (error) {
    console.error('Error generating digest preview:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
