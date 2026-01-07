import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { sendEmail } from '@/lib/email'

/**
 * GET /api/platform/users/[userId]
 * Get user details (SUPER_ADMIN only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Acceso denegado - Solo SUPER_ADMIN' },
        { status: 403 }
      )
    }

    const user = await db.users.findUnique({
      where: { id: params.id },
      include: {
        churches: {
          select: { id: true, name: true, email: true }
        },
        members: {
          select: { id: true, firstName: true, lastName: true, phone: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })

  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/platform/users/[userId]
 * Update user information (SUPER_ADMIN only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Acceso denegado - Solo SUPER_ADMIN' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { 
      name, 
      email, 
      phone, 
      role, 
      isActive, 
      resetPassword,
      newPassword 
    } = body

    // Check if user exists
    const existingUser = await db.users.findUnique({
      where: { id: params.id },
      include: { members: true }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // If changing email, check uniqueness
    if (email && email !== existingUser.email) {
      const emailExists = await db.users.findUnique({
        where: { email }
      })

      if (emailExists) {
        return NextResponse.json(
          { error: 'El email ya está en uso' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date()
    }

    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (role !== undefined) updateData.role = role
    if (isActive !== undefined) updateData.isActive = isActive

    // Handle password reset
    if (resetPassword && newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 12)
      updateData.password = hashedPassword
      updateData.isFirstLogin = true // Force password change on next login
      updateData.lastPasswordChange = null
    }

    // Update user
    const updatedUser = await db.users.update({
      where: { id: params.id },
      data: updateData,
      include: {
        churches: {
          select: { id: true, name: true }
        }
      }
    })

    // Send email notification if password was reset
    if (resetPassword && newPassword) {
      const churchName = updatedUser.churches?.name || 'Kḥesed-tek'
      
      try {
        await sendEmail({
          to: updatedUser.email,
          subject: `Contraseña Temporal Restablecida - ${churchName}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .credentials-box { background: white; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 5px; }
                .password { font-size: 24px; font-weight: bold; color: #f59e0b; font-family: monospace; letter-spacing: 2px; }
                .warning { background: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
                .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🔐 Contraseña Restablecida</h1>
                  <p>${churchName}</p>
                </div>
                <div class="content">
                  <h2>Hola ${updatedUser.name},</h2>
                  
                  <p>Tu contraseña ha sido restablecida por un administrador del sistema. Utiliza la siguiente contraseña temporal para iniciar sesión:</p>
                  
                  <div class="credentials-box">
                    <p><strong>Email:</strong> ${updatedUser.email}</p>
                    <p><strong>Contraseña Temporal:</strong></p>
                    <p class="password">${newPassword}</p>
                  </div>
                  
                  <div class="warning">
                    <p><strong>⚠️ IMPORTANTE:</strong></p>
                    <ul>
                      <li>Esta es una contraseña temporal generada por el administrador</li>
                      <li>Se te pedirá que cambies esta contraseña al iniciar sesión</li>
                      <li>Por seguridad, elige una contraseña única y segura</li>
                      <li>Nunca compartas tu contraseña con nadie</li>
                    </ul>
                  </div>
                  
                  <div style="text-align: center;">
                    <a href="${process.env.NEXTAUTH_URL}/auth/signin" class="button">
                      Iniciar Sesión Ahora
                    </a>
                  </div>
                  
                  <p style="margin-top: 30px;">Si no solicitaste este cambio de contraseña, por favor contacta al administrador de tu iglesia inmediatamente.</p>
                  
                  <div class="footer">
                    <p>Kḥesed-tek Church Management Systems</p>
                    <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                  </div>
                </div>
              </div>
            </body>
            </html>
          `,
          text: `
Hola ${updatedUser.name},

Tu contraseña ha sido restablecida por un administrador del sistema.

CREDENCIALES:
Email: ${updatedUser.email}
Contraseña Temporal: ${newPassword}

IMPORTANTE:
- Esta es una contraseña temporal
- Deberás cambiarla al iniciar sesión
- Elige una contraseña única y segura
- Nunca compartas tu contraseña

Inicia sesión en: ${process.env.NEXTAUTH_URL}/auth/signin

Si no solicitaste este cambio, contacta al administrador inmediatamente.

---
Kḥesed-tek Church Management Systems
          `.trim()
        })
        
        console.log(`✅ Password reset email sent to ${updatedUser.email}`)
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError)
        // Don't fail the request if email fails - user is still updated
      }
    }

    // If member exists, update their info too
    if (existingUser.members) {
      const memberUpdateData: any = {
        updatedAt: new Date()
      }

      if (name) {
        const nameParts = name.split(' ')
        memberUpdateData.firstName = nameParts[0] || name
        memberUpdateData.lastName = nameParts.slice(1).join(' ') || ''
      }

      if (email) memberUpdateData.email = email
      if (phone) memberUpdateData.phone = phone

      await db.members.update({
        where: { id: existingUser.members.id },
        data: memberUpdateData
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      user: updatedUser
    })

  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/platform/users/[userId]
 * Deactivate user (soft delete) (SUPER_ADMIN only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Acceso denegado - Solo SUPER_ADMIN' },
        { status: 403 }
      )
    }

    // Soft delete - just deactivate
    const updatedUser = await db.users.update({
      where: { id: params.id },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    })

    // Also deactivate member if exists
    const member = await db.members.findFirst({
      where: { userId: params.id }
    })

    if (member) {
      await db.members.update({
        where: { id: member.id },
        data: {
          isActive: false,
          updatedAt: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario desactivado exitosamente'
    })

  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
