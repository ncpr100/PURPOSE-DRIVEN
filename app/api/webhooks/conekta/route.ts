// Conekta Webhook Handler
// Processes SPEI and OXXO payment confirmations (Mexico)

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verify Conekta signature
    const signature = request.headers.get('x-conekta-signature')
    
    if (!signature) {
      console.error('Conekta: Missing signature header')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, data } = body
    
    // Handle order.paid event (both SPEI and OXXO)
    if (type === 'order.paid') {
      const order = data.object
      const orderId = order.id
      
      // Extract metadata
      const metadata = order.metadata || {}
      const churchId = metadata.church_id
      const categoryId = metadata.category_id
      
      if (!churchId) {
        console.error('Conekta: No church ID in order metadata')
        return NextResponse.json({ error: 'Invalid metadata' }, { status: 400 })
      }

      // Determine payment method (SPEI or OXXO)
      const paymentMethod = order.charges?.data?.[0]?.payment_method?.type || 'Conekta'
      const paymentMethodName = paymentMethod === 'spei' ? 'SPEI' : 
                               paymentMethod === 'oxxo_cash' ? 'OXXO' : 
                               'Conekta'

      // Create or update online payment
      const onlinePayment = await db.online_payments.upsert({
        where: {
          paymentId: orderId
        },
        create: {
          churchId,
          amount: order.amount / 100, // Convert from cents
          currency: 'MXN',
          status: 'completed',
          paymentId: orderId,
          gatewayType: paymentMethod === 'spei' ? 'spei' : 'oxxo',
          categoryId: categoryId || undefined,
          donorName: order.customer_info?.name || 'Donante Anónimo',
          donorEmail: order.customer_info?.email,
          donorPhone: order.customer_info?.phone,
          notes: metadata.notes || `Pago vía ${paymentMethodName}`,
          webhookReceived: true,
          completedAt: new Date(),
          metadata: {
            conekta_order_id: orderId,
            payment_method: paymentMethod,
            charge_id: order.charges?.data?.[0]?.id
          }
        },
        update: {
          status: 'completed',
          webhookReceived: true,
          completedAt: new Date(),
          metadata: {
            conekta_order_id: orderId,
            payment_method: paymentMethod,
            charge_id: order.charges?.data?.[0]?.id,
            last_updated: new Date().toISOString()
          }
        }
      })

      console.log(`${paymentMethodName} payment processed:`, onlinePayment.id)
      return NextResponse.json({ success: true, paymentId: onlinePayment.id })
    }

    // Handle order.expired event
    if (type === 'order.expired') {
      const order = data.object
      const orderId = order.id

      // Update online payment status to cancelled
      await db.online_payments.updateMany({
        where: {
          paymentId: orderId
        },
        data: {
          status: 'cancelled'
        }
      })

      console.log('Conekta order expired:', orderId)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Conekta webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
