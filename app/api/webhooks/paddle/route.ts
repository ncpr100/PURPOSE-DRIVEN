import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import * as crypto from 'crypto'

export const dynamic = 'force-dynamic'

// Verify Paddle webhook signature using HMAC-SHA256
function verifyPaddleSignature(rawBody: string, signatureHeader: string, secret: string): boolean {
  try {
    // Paddle signature format: "ts=<timestamp>;h1=<hash>"
    const parts = Object.fromEntries(
      signatureHeader.split(';').map(part => part.split('=') as [string, string])
    )
    const timestamp = parts['ts']
    const receivedHash = parts['h1']

    if (!timestamp || !receivedHash) return false

    // Build the signed payload: timestamp + ":" + raw body
    const signedPayload = `${timestamp}:${rawBody}`
    const expectedHash = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex')

    return crypto.timingSafeEqual(
      new Uint8Array(Buffer.from(receivedHash, 'hex')),
      new Uint8Array(Buffer.from(expectedHash, 'hex'))
    )
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error('[Paddle Webhook] Missing PADDLE_WEBHOOK_SECRET')
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
    }

    const rawBody = await request.text()
    const headersList = headers()
    const signatureHeader = headersList.get('paddle-signature')

    if (!signatureHeader) {
      console.error('[Paddle Webhook] Missing paddle-signature header')
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const isValid = verifyPaddleSignature(rawBody, signatureHeader, webhookSecret)
    if (!isValid) {
      console.error('[Paddle Webhook] Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(rawBody)
    const eventType: string = event.event_type || event.notification_type || ''

    console.log(`[Paddle Webhook] Event received: ${eventType}`)

    switch (eventType) {
      case 'subscription.created':
        await handleSubscriptionCreated(event.data)
        break

      case 'subscription.activated':
      case 'subscription.updated':
        await handleSubscriptionUpdated(event.data)
        break

      case 'subscription.canceled':
        await handleSubscriptionCanceled(event.data)
        break

      case 'subscription.past_due':
        await handleSubscriptionPastDue(event.data)
        break

      case 'transaction.completed':
        await handleTransactionCompleted(event.data)
        break

      case 'transaction.payment_failed':
        await handleTransactionFailed(event.data)
        break

      default:
        console.log(`[Paddle Webhook] Unhandled event type: ${eventType}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[Paddle Webhook] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleSubscriptionCreated(data: any) {
  try {
    const customData = data.custom_data || {}
    const churchId = customData.churchId

    if (!churchId) {
      console.warn('[Paddle] subscription.created — no churchId in custom_data')
      return
    }

    await db.church_subscriptions.upsert({
      where: { churchId },
      create: {
        id: crypto.randomUUID(),
        churchId,
        planId: customData.planId || 'free',
        status: 'ACTIVE',
        currentPeriodStart: new Date(data.current_billing_period?.starts_at || Date.now()),
        currentPeriodEnd: new Date(data.current_billing_period?.ends_at || Date.now()),
        paddleSubscriptionId: data.id,
        paddleCustomerId: data.customer_id ?? null,
        updatedAt: new Date(),
      },
      update: {
        status: 'ACTIVE',
        currentPeriodStart: new Date(data.current_billing_period?.starts_at || Date.now()),
        currentPeriodEnd: new Date(data.current_billing_period?.ends_at || Date.now()),
        paddleSubscriptionId: data.id,
        paddleCustomerId: data.customer_id ?? null,
        updatedAt: new Date(),
      },
    })

    console.log(`[Paddle] Subscription created for church: ${churchId}`)
  } catch (error) {
    console.error('[Paddle] handleSubscriptionCreated error:', error)
  }
}

async function handleSubscriptionUpdated(data: any) {
  try {
    const subscriptionId = data.id
    if (!subscriptionId) return

    const statusMap: Record<string, string> = {
      active: 'ACTIVE',
      trialing: 'TRIALING',
      past_due: 'PAST_DUE',
      paused: 'PAUSED',
      canceled: 'CANCELED',
    }

    const status = statusMap[data.status] || 'ACTIVE'

    await db.church_subscriptions.updateMany({
      where: { paddleSubscriptionId: subscriptionId },
      data: {
        status,
        currentPeriodStart: data.current_billing_period?.starts_at
          ? new Date(data.current_billing_period.starts_at)
          : undefined,
        currentPeriodEnd: data.current_billing_period?.ends_at
          ? new Date(data.current_billing_period.ends_at)
          : undefined,
        updatedAt: new Date(),
      },
    })

    console.log(`[Paddle] Subscription updated: ${subscriptionId} → ${status}`)
  } catch (error) {
    console.error('[Paddle] handleSubscriptionUpdated error:', error)
  }
}

async function handleSubscriptionCanceled(data: any) {
  try {
    const subscriptionId = data.id
    if (!subscriptionId) return

    await db.church_subscriptions.updateMany({
      where: { paddleSubscriptionId: subscriptionId },
      data: {
        status: 'CANCELED',
        cancelledAt: new Date(),
        updatedAt: new Date(),
      },
    })

    console.log(`[Paddle] Subscription canceled: ${subscriptionId}`)
  } catch (error) {
    console.error('[Paddle] handleSubscriptionCanceled error:', error)
  }
}

async function handleSubscriptionPastDue(data: any) {
  try {
    const subscriptionId = data.id
    if (!subscriptionId) return

    await db.church_subscriptions.updateMany({
      where: { paddleSubscriptionId: subscriptionId },
      data: {
        status: 'PAST_DUE',
        updatedAt: new Date(),
      },
    })

    console.log(`[Paddle] Subscription past due: ${subscriptionId}`)
  } catch (error) {
    console.error('[Paddle] handleSubscriptionPastDue error:', error)
  }
}

async function handleTransactionCompleted(data: any) {
  try {
    const customData = data.custom_data || {}
    const churchId = customData.churchId

    if (!churchId) {
      console.warn('[Paddle] transaction.completed — no churchId in custom_data')
      return
    }

    // Update invoice to paid if exists
    const invoiceId = customData.invoiceId
    if (invoiceId) {
      await db.invoices.updateMany({
        where: { id: invoiceId, churchId },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          updatedAt: new Date(),
        },
      })
    }

    console.log(`[Paddle] Transaction completed for church: ${churchId}`)
  } catch (error) {
    console.error('[Paddle] handleTransactionCompleted error:', error)
  }
}

async function handleTransactionFailed(data: any) {
  try {
    const customData = data.custom_data || {}
    const churchId = customData.churchId

    if (!churchId) return

    const invoiceId = customData.invoiceId
    if (invoiceId) {
      await db.invoices.updateMany({
        where: { id: invoiceId, churchId },
        data: {
          status: 'OVERDUE',
          updatedAt: new Date(),
        },
      })
    }

    console.log(`[Paddle] Transaction failed for church: ${churchId}`)
  } catch (error) {
    console.error('[Paddle] handleTransactionFailed error:', error)
  }
}
