

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch specific invoice
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const invoice = await prisma.invoices.findUnique({
      where: { id: params.id },
      include: {
        churches: {
          select: { id: true, name: true, email: true, phone: true }
        },
        church_subscriptions: {
          include: {
            subscription_plans: {
              select: { displayName: true }
            }
          }
        },
        invoice_line_items: true,
        invoice_payments: {
          include: {
            users: {
              select: { id: true, name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        invoice_communications: {
          include: {
            users: {
              select: { id: true, name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Factura no encontrada' }, { status: 404 })
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('Error fetching invoice:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// PUT - Update invoice status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const data = await request.json()
    const { status, notes } = data

    const updateData: any = { status }
    if (notes) updateData.notes = notes
    if (status === 'SENT') updateData.sentAt = new Date()
    if (status === 'PAID') updateData.paidAt = new Date()

    const invoice = await prisma.invoices.update({
      where: { id: params.id },
      data: updateData,
      include: {
        churches: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('Error updating invoice:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

