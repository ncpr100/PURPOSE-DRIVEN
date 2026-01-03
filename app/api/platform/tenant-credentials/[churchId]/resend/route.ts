
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerBaseUrl } from '@/lib/server-url'

// POST - Resend tenant credentials
export async function POST(
  request: NextRequest,
  { params }: { params: { churchId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const credentials = await prisma.tenant_credentials.findUnique({
      where: { churchId: params.churchId },
      include: {
        churches: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    if (!credentials) {
      return NextResponse.json({ 
        error: 'Credenciales no encontradas para esta iglesia' 
      }, { status: 404 })
    }

    // Generate new temporary password
    const newPassword = Math.random().toString(36).slice(-8)
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update credentials
    await prisma.tenant_credentials.update({
      where: { churchId: params.churchId },
      data: {
        tempPassword: hashedPassword,
        isFirstLogin: true,
        lastSentAt: new Date()
      }
    })

    // Update user password
    await prisma.users.updateMany({
      where: { 
        email: credentials.loginEmail,
        churchId: params.churchId 
      },
      data: {
        password: hashedPassword,
        isActive: true
      }
    })

    // Send email
    try {
      await fetch('/api/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'TENANT_CREDENTIALS_RESEND',
          recipientEmail: credentials.loginEmail,
          recipientName: credentials.churches.name,
          subject: `Nuevas Credenciales de Acceso - ${credentials.churches.name}`,
          template: 'tenant-credentials',
          data: {
            churchName: credentials.churches.name,
            loginEmail: credentials.loginEmail,
            tempPassword: newPassword,
            platformUrl: getServerBaseUrl(),
            supportEmail: 'soporte@khesedtek.com'
          }
        })
      })
    } catch (emailError) {
      console.error('Error sending credentials email:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Credenciales reenviadas exitosamente',
      newPassword
    })
  } catch (error) {
    console.error('Error resending credentials:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

