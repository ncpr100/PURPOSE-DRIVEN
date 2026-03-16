

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'
export const dynamic = 'force-dynamic'

// GET all plan features
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 })
    }

    const features = await db.plan_features.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json(features)

  } catch (error) {
    console.error('Error fetching plan features:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// CREATE a new plan feature
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 })
    }

    const { key, name, description, category } = await request.json()

    // Validations
    if (!key || !name) {
      return NextResponse.json(
        { message: 'Clave y nombre son requeridos' },
        { status: 400 }
      )
    }

    // Check if feature with same key already exists
    const existingFeature = await db.plan_features.findUnique({
      where: { key }
    })

    if (existingFeature) {
      return NextResponse.json(
        { message: 'Ya existe una característica con esta clave' },
        { status: 400 }
      )
    }

    const feature = await db.plan_features.create({
      data: {
        id: nanoid(),
        key,
        name,
        description,
        category: category || 'core'
      }
    })

    return NextResponse.json(feature)

  } catch (error) {
    console.error('Error creating plan feature:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// UPDATE a plan feature
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 })
    }

    const { id, key, name, description, category, isActive } = await request.json()

    if (!id) {
      return NextResponse.json(
        { message: 'ID de la característica es requerido' },
        { status: 400 }
      )
    }

    const feature = await db.plan_features.update({
      where: { id },
      data: {
        ...(key && { key }),
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(category && { category }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json(feature)

  } catch (error) {
    console.error('Error updating plan feature:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE a plan feature
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { message: 'ID de la característica es requerido' },
        { status: 400 }
      )
    }

    await db.plan_features.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Característica eliminada exitosamente' })

  } catch (error) {
    console.error('Error deleting plan feature:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PATCH - Seed default plan features (idempotent: skips already-existing keys)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 })
    }

    const defaults = [
      { key: 'members_management',       name: 'Gestión de Miembros',              category: 'core',       description: 'Registro, perfiles y ciclo de vida de miembros' },
      { key: 'events_management',        name: 'Gestión de Eventos',               category: 'core',       description: 'Creación, calendario y registro de eventos' },
      { key: 'financial_tracking',       name: 'Seguimiento Financiero',           category: 'core',       description: 'Registro de donaciones y reportes financieros básicos' },
      { key: 'communication_tools',      name: 'Herramientas de Comunicación',     category: 'core',       description: 'Email y notificaciones internas' },
      { key: 'checkin_system',           name: 'Sistema de Asistencia',            category: 'core',       description: 'Registro de asistencia a eventos y servicios' },
      { key: 'prayer_wall',              name: 'Mural de Oración',                 category: 'core',       description: 'Gestión de peticiones de oración' },
      { key: 'form_builder',             name: 'Constructor de Formularios',       category: 'advanced',   description: 'Formularios personalizados con QR y CRM de visitantes' },
      { key: 'volunteer_management',     name: 'Gestión de Voluntarios',           category: 'advanced',   description: 'Coordinación de voluntarios y habilidades' },
      { key: 'advanced_analytics',       name: 'Analíticas Avanzadas',             category: 'advanced',   description: 'Estadísticas profundas y reportes de tendencias' },
      { key: 'social_media_automation',  name: 'Automatización Redes Sociales',    category: 'advanced',   description: 'Publicación automática en Facebook, Instagram, YouTube' },
      { key: 'custom_branding',          name: 'Marca Personalizada',              category: 'advanced',   description: 'Logo, colores y temas propios de la iglesia' },
      { key: 'data_export',              name: 'Exportación de Datos',             category: 'advanced',   description: 'Exportar datos en PDF, Excel y CSV' },
      { key: 'ai_insights',              name: 'Insights de Inteligencia Artificial', category: 'enterprise', description: 'Predicciones y recomendaciones basadas en IA' },
      { key: 'multi_church',             name: 'Multi-Iglesia',                    category: 'enterprise', description: 'Gestión de múltiples iglesias desde una cuenta' },
      { key: 'api_access',               name: 'Acceso API',                       category: 'enterprise', description: 'Integración con sistemas externos vía API REST' },
      { key: 'white_label',              name: 'Marca Blanca',                     category: 'enterprise', description: 'Ocultar marca Kḥesed-tek en la experiencia del usuario' },
    ]

    const existingKeys = new Set(
      (await db.plan_features.findMany({ select: { key: true } })).map(f => f.key)
    )

    const toCreate = defaults.filter(d => !existingKeys.has(d.key))

    if (toCreate.length === 0) {
      return NextResponse.json({ message: 'Todas las características por defecto ya existen', created: 0 })
    }

    await db.plan_features.createMany({
      data: toCreate.map(d => ({
        id: nanoid(),
        key: d.key,
        name: d.name,
        description: d.description,
        category: d.category,
      }))
    })

    return NextResponse.json({
      message: `${toCreate.length} características creadas exitosamente`,
      created: toCreate.length,
    })
  } catch (error) {
    console.error('Error seeding plan features:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

