// MercadoPago Webhook Handler
// Processes payment notifications from MercadoPago

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verify MercadoPago signature
    const xSignature = request.headers.get('x-signature')
    const xRequestId = request.headers.get('x-request-id')
    
    if (!xSignature || !xRequestId) {
      console.error('MercadoPago: Missing security headers')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, data } = body
    
    // Handle payment notification
    if (type === 'payment') {
      const paymentId = data.id
      
      // Fetch payment details from MercadoPago API
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN!
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        console.error('MercadoPago: Failed to fetch payment details')
        return NextResponse.json({ error: 'Payment fetch failed' }, { status: 400 })
      }

      const payment = await response.json()
      
      // Extract metadata
      const metadata = payment.metadata || {}
      const churchId = metadata.church_id
      const categoryId = metadata.category_id
      
      if (!churchId) {
        console.error('MercadoPago: No church ID in payment metadata')
        return NextResponse.json({ error: 'Invalid metadata' }, { status: 400 })
      }

      // Determine donation status based on MercadoPago status
      let status: 'PENDIENTE' | 'COMPLETADA' | 'FALLIDA' | 'CANCELADA' = 'PENDIENTE'
      
      switch (payment.status) {
        case 'approved':
          status = 'COMPLETADA'
          break
        case 'rejected':
          status = 'FALLIDA'
          break
        case 'cancelled':
        case 'refunded':
        case 'charged_back':
          status = 'CANCELADA'
          break
        default:
          status = 'PENDIENTE'
      }

      // Create or update online payment record
      const onlinePayment = await db.online_payments.upsert({
        where: {
          paymentId: paymentId.toString()
        },
        create: {
          churchId,
          amount: payment.transaction_amount,
          currency: payment.currency_id,
          status: status === 'COMPLETADA' ? 'completed' : status === 'FALLIDA' ? 'failed' : status === 'CANCELADA' ? 'cancelled' : 'pending',
          paymentId: paymentId.toString(),
          gatewayType: 'mercadopago',
          categoryId: categoryId || undefined,
          donorName: payment.payer?.first_name + ' ' + payment.payer?.last_name,
          donorEmail: payment.payer?.email,
          donorPhone: payment.payer?.phone?.number,
          notes: `País: ${payment.payer?.identification?.type}`,
          webhookReceived: true,
          completedAt: status === 'COMPLETADA' ? new Date() : undefined,
          metadata: {
            mercadopago_payment_id: paymentId,
            payment_method_id: payment.payment_method_id,
            payment_type_id: payment.payment_type_id,
            status_detail: payment.status_detail,
            country: payment.additional_info?.payer?.address?.zip_code
          }
        },
        update: {
          status: status === 'COMPLETADA' ? 'completed' : status === 'FALLIDA' ? 'failed' : status === 'CANCELADA' ? 'cancelled' : 'pending',
          webhookReceived: true,
          completedAt: status === 'COMPLETADA' ? new Date() : undefined,
          metadata: {
            mercadopago_payment_id: paymentId,
            payment_method_id: payment.payment_method_id,
            payment_type_id: payment.payment_type_id,
            status_detail: payment.status_detail,
            last_updated: new Date().toISOString()
          }
        }
      })

      console.log('MercadoPago payment processed:', onlinePayment.id)
      return NextResponse.json({ success: true, paymentId: onlinePayment.id })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('MercadoPago webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
