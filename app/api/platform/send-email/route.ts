import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { sendEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

// POST - Send email to church user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Only SUPER_ADMIN can access platform features
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 })
    }

    const { to, userName, churchName } = await request.json()

    if (!to || !userName) {
      return NextResponse.json(
        { message: 'Email y nombre de usuario requeridos' },
        { status: 400 }
      )
    }

    // Send email via Resend
    const emailContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Mensaje de ${churchName}</h1>
          </div>
          <div class="content">
            <h2>Hola ${userName},</h2>
            
            <p>Te enviamos este mensaje desde el sistema de gestión de ${churchName}.</p>
            
            <p>Si tienes alguna pregunta o necesitas asistencia, por favor responde a este email.</p>
            
            <p>Bendiciones,<br>${churchName}</p>
          </div>
          <div class="footer">
            <p>Kḥesed-tek Church Management Systems</p>
            <p>Este email fue enviado desde la plataforma de administración</p>
          </div>
        </body>
      </html>
    `

    const success = await sendEmail({
      to,
      subject: `Mensaje de ${churchName}`,
      html: emailContent,
      churchName,
      userName
    })

    if (!success) {
      throw new Error('Failed to send email')
    }

    return NextResponse.json({
      message: 'Email enviado correctamente',
      to,
      success: true
    })

  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { message: 'Error al enviar email' },
      { status: 500 }
    )
  }
}
