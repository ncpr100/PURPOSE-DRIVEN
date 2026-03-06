

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'

export const dynamic = 'force-dynamic'

// GET all payment methods for a church
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.churchId) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    let paymentMethods = await db.payment_methods.findMany({
      where: {
        churchId: session.user.churchId,
        isActive: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Auto-seed default payment methods if none exist for this church
    if (paymentMethods.length === 0) {
      // Fetch church country to seed region-appropriate payment methods
      const church = await db.churches.findUnique({
        where: { id: session.user.churchId },
        select: { country: true }
      })
      const country = church?.country || 'Colombia'

      // Universal methods for all countries
      const defaults: Array<{ name: string; isDigital: boolean; description: string }> = [
        { name: 'Efectivo', isDigital: false, description: 'Pago en efectivo' },
        { name: 'Transferencia Bancaria', isDigital: true, description: 'Transferencia o depósito bancario' },
        { name: 'Tarjeta de Crédito/Débito', isDigital: true, description: 'Pago con tarjeta' },
        { name: 'Cheque', isDigital: false, description: 'Pago con cheque' },
      ]

      // Country-specific methods
      if (country === 'Colombia') {
        defaults.push(
          { name: 'Nequi', isDigital: true, description: 'Billetera digital colombiana' },
          { name: 'Daviplata', isDigital: true, description: 'Billetera digital Davivienda' },
          { name: 'PSE', isDigital: true, description: 'Pagos Seguros en Línea' }
        )
      } else if (country === 'México') {
        defaults.push(
          { name: 'OXXO', isDigital: false, description: 'Pago en tiendas OXXO' },
          { name: 'SPEI', isDigital: true, description: 'Transferencia interbancaria SPEI' },
          { name: 'CoDi', isDigital: true, description: 'Cobro Digital del Banco de México' }
        )
      } else if (country === 'Brasil') {
        defaults.push(
          { name: 'PIX', isDigital: true, description: 'Pago instantáneo del Banco Central de Brasil' },
          { name: 'Boleto Bancário', isDigital: false, description: 'Boleto de pago bancario' }
        )
      } else if (country === 'Argentina') {
        defaults.push(
          { name: 'MercadoPago', isDigital: true, description: 'Billetera digital MercadoPago' },
          { name: 'Rapipago', isDigital: false, description: 'Pago en puntos Rapipago' },
          { name: 'Pago Fácil', isDigital: false, description: 'Pago en puntos Pago Fácil' }
        )
      } else if (country === 'Chile') {
        defaults.push(
          { name: 'Khipu', isDigital: true, description: 'Transferencia bancaria Khipu' },
          { name: 'Webpay', isDigital: true, description: 'Pago con tarjeta Transbank/Webpay' }
        )
      } else if (country === 'Perú') {
        defaults.push(
          { name: 'Yape', isDigital: true, description: 'Billetera digital Yape BCP' },
          { name: 'Plin', isDigital: true, description: 'Pago digital Plin' },
          { name: 'PagoEfectivo', isDigital: false, description: 'Pago en agentes y bancos' }
        )
      } else if (country === 'Uruguay') {
        defaults.push(
          { name: 'Abitab', isDigital: false, description: 'Pago en agencias Abitab' },
          { name: 'RedPagos', isDigital: false, description: 'Pago en puntos RedPagos' }
        )
      }

      await db.payment_methods.createMany({
        data: defaults.map(d => ({
          id: nanoid(),
          name: d.name,
          description: d.description,
          isDigital: d.isDigital,
          churchId: session.user.churchId,
          isActive: true,
          updatedAt: new Date()
        }))
      })
      paymentMethods = await db.payment_methods.findMany({
        where: { churchId: session.user.churchId, isActive: true },
        orderBy: { name: 'asc' }
      })
    }

    return NextResponse.json(paymentMethods)

  } catch (error) {
    console.error('Error fetching payment methods:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// CREATE a new payment method
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.churchId) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Sin permisos' }, { status: 403 })
    }

    const { name, description, isDigital = false } = await request.json()

    if (!name) {
      return NextResponse.json(
        { message: 'El nombre del método de pago es requerido' },
        { status: 400 }
      )
    }

    // Verificar que no exista otro método con el mismo nombre
    const existingMethod = await db.payment_methods.findFirst({
      where: {
        name,
        churchId: session.user.churchId,
        isActive: true
      }
    })

    if (existingMethod) {
      return NextResponse.json(
        { message: 'Ya existe un método de pago con este nombre' },
        { status: 409 }
      )
    }

    const paymentMethod = await db.payment_methods.create({
      data: {
        id: nanoid(),
        name,
        description,
        isDigital,
        churchId: session.user.churchId
      }
    })

    return NextResponse.json(paymentMethod, { status: 201 })

  } catch (error) {
    console.error('Error creating payment method:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

