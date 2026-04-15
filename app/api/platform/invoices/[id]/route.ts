

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

// GET - Fetch specific invoice
export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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
export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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
        },
        invoice_line_items: true,
        church_subscriptions: {
          include: { subscription_plans: { select: { displayName: true } } }
        }
      }
    })

    // Send email to church when invoice is marked SENT
    if (status === 'SENT' && invoice.churches?.email) {
      const church = invoice.churches
      const lineItemsHtml = invoice.invoice_line_items
        .map((item: any) => `
          <tr>
            <td style="padding:8px;border-bottom:1px solid #eee">${item.description}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${Number(item.unitPrice).toFixed(2)}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${(Number(item.quantity) * Number(item.unitPrice)).toFixed(2)}</td>
          </tr>`)
        .join('')

      const planName = invoice.church_subscriptions?.subscription_plans?.displayName || 'Suscripción'
      const dueDate = new Date(invoice.dueDate).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })

      await sendEmail({
        to: church.email!,
        subject: `Factura ${invoice.invoiceNumber} — ${church.name} | Khesed-Tek`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff">
            <div style="background:#6d28d9;padding:24px;text-align:center">
              <h1 style="color:#fff;margin:0;font-size:22px">Khesed-Tek Systems</h1>
              <p style="color:#ddd6fe;margin:4px 0 0;font-size:14px">Church Management Platform</p>
            </div>
            <div style="padding:32px">
              <h2 style="color:#1f2937;margin:0 0 8px">Factura ${invoice.invoiceNumber}</h2>
              <p style="color:#6b7280;margin:0 0 24px">Plan: ${planName}</p>
              <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
                <thead>
                  <tr style="background:#f3f4f6">
                    <th style="padding:10px;text-align:left;font-size:13px">Descripción</th>
                    <th style="padding:10px;text-align:center;font-size:13px">Cant.</th>
                    <th style="padding:10px;text-align:right;font-size:13px">Precio</th>
                    <th style="padding:10px;text-align:right;font-size:13px">Total</th>
                  </tr>
                </thead>
                <tbody>${lineItemsHtml}</tbody>
              </table>
              <div style="text-align:right;padding:16px;background:#f9fafb;border-radius:8px">
                <p style="margin:4px 0;color:#6b7280;font-size:14px">Subtotal: $${invoice.subtotal.toFixed(2)} USD</p>
                ${invoice.taxAmount > 0 ? `<p style="margin:4px 0;color:#6b7280;font-size:14px">Impuestos: $${invoice.taxAmount.toFixed(2)} USD</p>` : ''}
                <p style="margin:8px 0 0;color:#1f2937;font-size:18px;font-weight:bold">Total: $${invoice.totalAmount.toFixed(2)} USD</p>
              </div>
              <div style="margin-top:24px;padding:16px;border:1px solid #e5e7eb;border-radius:8px;text-align:center">
                <p style="color:#6b7280;font-size:14px;margin:0 0 4px">Fecha de vencimiento</p>
                <p style="color:#dc2626;font-weight:bold;font-size:16px;margin:0">${dueDate}</p>
              </div>
              <p style="color:#6b7280;font-size:13px;margin-top:24px">Para preguntas sobre esta factura, contáctenos a <a href="mailto:soporte@khesed-tek-systems.org" style="color:#6d28d9">soporte@khesed-tek-systems.org</a></p>
            </div>
            <div style="background:#f9fafb;padding:16px;text-align:center;border-top:1px solid #e5e7eb">
              <p style="color:#9ca3af;font-size:12px;margin:0">© ${new Date().getFullYear()} Khesed-Tek Systems LLC. Todos los derechos reservados.</p>
            </div>
          </div>`,
        churchName: church.name,
      })
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('Error updating invoice:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

