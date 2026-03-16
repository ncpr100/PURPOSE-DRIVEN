

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'
export const dynamic = 'force-dynamic'

// GET all subscription addons
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 })
    }

    const addons = await db.subscription_addons.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(addons)

  } catch (error) {
    console.error('Error fetching subscription addons:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// CREATE a new subscription addon
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 })
    }

    const {
      key,
      name,
      description,
      priceMonthly,
      priceYearly,
      billingType,
      pricePerUnit,
      unit
    } = await request.json()

    // Validations
    if (!key || !name || (!priceMonthly && !pricePerUnit)) {
      return NextResponse.json(
        { message: 'Clave, nombre y precio son requeridos' },
        { status: 400 }
      )
    }

    // Check if addon with same key already exists
    const existingAddon = await db.subscription_addons.findUnique({
      where: { key }
    })

    if (existingAddon) {
      return NextResponse.json(
        { message: 'Ya existe un complemento con esta clave' },
        { status: 400 }
      )
    }

    const addon = await db.subscription_addons.create({
      data: {
        id: nanoid(),
        key,
        name,
        description,
        priceMonthly: priceMonthly || '', // Direct string storage
        priceYearly: priceYearly || null, // Direct string storage
        billingType: billingType || 'MONTHLY',
        pricePerUnit: pricePerUnit || null, // Direct string storage
        unit
      }
    })

    return NextResponse.json(addon)

  } catch (error) {
    console.error('Error creating subscription addon:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// UPDATE a subscription addon
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 })
    }

    const {
      id,
      key,
      name,
      description,
      priceMonthly,
      priceYearly,
      billingType,
      pricePerUnit,
      unit,
      isActive
    } = await request.json()

    if (!id) {
      return NextResponse.json(
        { message: 'ID del complemento es requerido' },
        { status: 400 }
      )
    }

    const addon = await db.subscription_addons.update({
      where: { id },
      data: {
        ...(key && { key }),
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(priceMonthly !== undefined && { priceMonthly: priceMonthly || '' }),
        ...(priceYearly !== undefined && { priceYearly: priceYearly || null }),
        ...(billingType && { billingType }),
        ...(pricePerUnit !== undefined && { pricePerUnit: pricePerUnit || null }),
        ...(unit !== undefined && { unit }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json(addon)

  } catch (error) {
    console.error('Error updating subscription addon:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE a subscription addon
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
        { message: 'ID del complemento es requerido' },
        { status: 400 }
      )
    }

    // Check if addon has active subscriptions
    const activeSubscriptions = await db.church_subscription_addons.count({
      where: {
        addonId: id,
        isActive: true
      }
    })

    if (activeSubscriptions > 0) {
      return NextResponse.json(
        { message: `No se puede eliminar el complemento. Tiene ${activeSubscriptions} suscripciones activas.` },
        { status: 400 }
      )
    }

    await db.subscription_addons.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Complemento eliminado exitosamente' })

  } catch (error) {
    console.error('Error deleting subscription addon:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PATCH - Seed default subscription addons (idempotent: skips already-existing keys)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 })
    }

    const defaults = [
      {
        key: 'extra_churches',
        name: 'Iglesia Adicional',
        description: 'Agrega una iglesia adicional a tu plan actual',
        priceMonthly: '19.99',
        priceYearly: '199.99',
        billingType: 'MONTHLY',
        pricePerUnit: null,
        unit: null,
      },
      {
        key: 'extra_members',
        name: 'Bloque de Miembros Extra (+500)',
        description: 'Amplía tu límite de miembros en 500 adicionales',
        priceMonthly: '9.99',
        priceYearly: '99.99',
        billingType: 'MONTHLY',
        pricePerUnit: null,
        unit: null,
      },
      {
        key: 'sms_bundle',
        name: 'Paquete SMS',
        description: 'Envío de mensajes SMS para notificaciones y comunicaciones',
        priceMonthly: '',
        priceYearly: null,
        billingType: 'PER_USE',
        pricePerUnit: '0.05',
        unit: 'mensaje',
      },
      {
        key: 'priority_support',
        name: 'Soporte Prioritario',
        description: 'Acceso a soporte técnico prioritario con tiempo de respuesta garantizado de 4 horas',
        priceMonthly: '29.99',
        priceYearly: '299.99',
        billingType: 'MONTHLY',
        pricePerUnit: null,
        unit: null,
      },
      {
        key: 'white_label',
        name: 'Marca Blanca',
        description: 'Elimina la marca Kḥesed-tek y usa el logo e identidad de tu organización',
        priceMonthly: '49.99',
        priceYearly: '499.99',
        billingType: 'MONTHLY',
        pricePerUnit: null,
        unit: null,
      },
      {
        key: 'extra_storage',
        name: 'Almacenamiento Adicional (+10GB)',
        description: 'Amplía tu capacidad de almacenamiento para fotos, documentos y archivos',
        priceMonthly: '4.99',
        priceYearly: '49.99',
        billingType: 'MONTHLY',
        pricePerUnit: null,
        unit: null,
      },
    ]

    const existingKeys = new Set(
      (await db.subscription_addons.findMany({ select: { key: true } })).map(a => a.key)
    )

    const toCreate = defaults.filter(d => !existingKeys.has(d.key))

    if (toCreate.length === 0) {
      return NextResponse.json({ message: 'Todos los complementos por defecto ya existen', created: 0 })
    }

    await db.subscription_addons.createMany({
      data: toCreate.map(d => ({
        id: nanoid(),
        ...d,
      }))
    })

    return NextResponse.json({
      message: `${toCreate.length} complementos creados exitosamente`,
      created: toCreate.length,
    })
  } catch (error) {
    console.error('Error seeding subscription addons:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

