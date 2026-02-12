
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { sendEmail, emailQueue } from '@/lib/email'
import { getServerBaseUrl } from '@/lib/server-url'
import { nanoid } from 'nanoid'

// Supabase Admin API for creating Auth users
const supabaseAdminUrl = 'https://qxdwpihcmgctznvdfmbv.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

async function createSupabaseAuthUser(email: string, password: string, name: string) {
  if (!supabaseServiceKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not configured - skipping Auth user creation')
    return null
  }

  try {
    const response = await fetch(`${supabaseAdminUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
        email,
        password,
        user_metadata: {
          name,
          full_name: name
        },
        email_confirm: true
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Failed to create Supabase Auth user:', error)
      return null
    }

    const user = await response.json()
    console.log('✅ Supabase Auth user created:', email)
    return user
  } catch (error) {
    console.error('Error creating Supabase Auth user:', error)
    return null
  }
}

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Solo SUPER_ADMIN puede acceder a gestión de plataforma
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status !== 'all') {
      where.isActive = status === 'active'
    }

    // Obtener iglesias con datos agregados
    const [churches, total] = await Promise.all([
      db.churches.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              users: true,
              members: true,
              events: true,
              donations: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      db.churches.count({ where })
    ])

    // Calcular estadísticas para cada iglesia
    const churchesWithStats = await Promise.all(
      churches.map(async (church) => {
        const [totalDonations, activeUsers] = await Promise.all([
          db.donations.aggregate({
            where: { churchId: church.id },
            _sum: { amount: true }
          }),
          db.users.count({
            where: { churchId: church.id, isActive: true }
          })
        ])

        return {
          ...church,
          stats: {
            totalMembers: church._count.members,
            activeUsers,
            totalEvents: church._count.events,
            totalDonations: totalDonations._sum.amount || 0
          }
        }
      })
    )

    return NextResponse.json({
      churches: churchesWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching churches:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 })
    }

    const body = await request.json()
    const {
      name,
      address,
      phone,
      email,
      website,
      founded,
      description,
      adminUser
    } = body

    // Validaciones
    if (!name || !email || !adminUser?.email || !adminUser?.name) {
      return NextResponse.json(
        { message: 'Campos requeridos: name, email, adminUser.email, adminUser.name' },
        { status: 400 }
      )
    }

    // Verificar que el email del admin no exista
    const existingUser = await db.users.findUnique({
      where: { email: adminUser.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'El email del administrador ya está registrado' },
        { status: 400 }
      )
    }

    // Create church and admin user in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create church
      const church = await tx.churches.create({
        data: {
          id: nanoid(),
          name,
          address,
          phone,
          email,
          website,
          founded: founded ? new Date(founded) : null,
          description,
          isActive: true,
          updatedAt: new Date()
        }
      })

      // Create admin user password
      const bcrypt = require('bcryptjs')
      const temporaryPassword = adminUser.password || 'cambiarpassword123'
      const hashedPassword = await bcrypt.hash(temporaryPassword, 12)

      // Create admin user in database
      const admin = await tx.users.create({
        data: {
          id: nanoid(),
          name: adminUser.name,
          email: adminUser.email,
          password: hashedPassword,
          role: 'ADMIN_IGLESIA',
          churches: {
            connect: { id: church.id }
          },
          isActive: true,
          isFirstLogin: true,
          emailVerified: new Date(),
          updatedAt: new Date()
        }
      })

      // 🚀 AUTOMATICALLY CREATE SUPABASE AUTH USER
      const supabaseUser = await createSupabaseAuthUser(
        adminUser.email, 
        temporaryPassword,
        adminUser.name
      )

      if (supabaseUser) {
        console.log(`✅ Auto-created Supabase Auth user for ${adminUser.email}`)
      } else {
        console.warn(`⚠️ Could not create Supabase Auth user for ${adminUser.email} - will need manual creation`)
      }

      // Create corresponding member
      await tx.members.create({
        data: {
          id: nanoid(),
          firstName: adminUser.name.split(' ')[0] || adminUser.name,
          lastName: adminUser.name.split(' ').slice(1).join(' ') || '',
          email: adminUser.email,
          phone: adminUser.phone || '',
          churches: {
            connect: { id: church.id }
          },
          users: {
            connect: { id: admin.id }
          },
          membershipDate: new Date(),
          isActive: true,
          updatedAt: new Date()
        }
      })

      return { church, admin, supabaseUser }
    })

    // Send welcome email with temporary password to the new admin
    const temporaryPassword = adminUser.password || 'cambiarpassword123'
    const authStatusMessage = result.supabaseUser 
      ? '✅ Tu cuenta de autenticación ha sido creada automáticamente.'
      : '⚠️ Por favor contacta al soporte para activar tu cuenta de autenticación.'
      
    const welcomeEmailContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .credentials { background: #f8f9fa; padding: 15px; border-left: 4px solid #3B82F6; margin: 20px 0; }
            .auth-status { background: #d1ecf1; padding: 15px; border-left: 4px solid #3B82F6; margin: 20px 0; }
            .warning { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>¡Bienvenido a Kḥesed-tek!</h1>
          </div>
          <div class="content">
            <h2>Hola ${adminUser.name},</h2>
            
            <p>Tu cuenta de administrador ha sido creada exitosamente para la iglesia <strong>${name}</strong>.</p>
            
            <div class="auth-status">
              <h3>🔐 Estado de Autenticación:</h3>
              <p>${authStatusMessage}</p>
            </div>
            
            <div class="credentials">
              <h3>📧 Credenciales de Acceso:</h3>
              <p><strong>Usuario:</strong> ${adminUser.email}</p>
              <p><strong>Contraseña temporal:</strong> <code>${temporaryPassword}</code></p>
              <p><strong>URL de acceso:</strong> <a href="${getServerBaseUrl()}">${getServerBaseUrl()}</a></p>
            </div>
            
            <div class="warning">
              <h3>⚠️ Importante:</h3>
              <p>Por razones de seguridad, <strong>debes cambiar esta contraseña temporal</strong> en tu primer inicio de sesión.</p>
              <p>Ve a <strong>Perfil > Cambiar Contraseña</strong> una vez que ingreses al sistema.</p>
            </div>
            
            <h3>🚀 Primeros Pasos:</h3>
            <ol>
              <li>Inicia sesión con las credenciales proporcionadas</li>
              <li>Cambia tu contraseña temporal</li>
              <li>Configura el perfil de tu iglesia</li>
              <li>Comienza a agregar miembros y usuarios</li>
            </ol>
            
            <p>Si tienes preguntas, contacta al soporte técnico en <a href="mailto:soporte@khesed-tek-systems.org">soporte@khesed-tek-systems.org</a></p>
            
            <p>¡Bienvenido a la familia Kḥesed-tek!</p>
          </div>
          <div class="footer">
            <p>Kḥesed-tek Church Management Systems</p>
            <p>Sistema completo de gestión para iglesias</p>
          </div>
        </body>
      </html>
    `

    // Send email asynchronously (don't block the response)
    emailQueue.add({
      to: adminUser.email,
      subject: `🎉 Bienvenido a Kḥesed-tek - Credenciales de ${name}`,
      html: welcomeEmailContent,
      churchName: name,
      userName: adminUser.name
    }).catch(error => {
      console.error('Error sending welcome email:', error)
    })

    return NextResponse.json({
      message: 'Iglesia creada exitosamente',
      church: result.church,
      admin: {
        id: result.admin.id,
        name: result.admin.name,
        email: result.admin.email
      },
      supabaseAuth: {
        created: !!result.supabaseUser,
        message: result.supabaseUser 
          ? 'Usuario de autenticación creado automáticamente'
          : 'Usuario de autenticación pendiente - contactar soporte'
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating church:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
