/**
 * Paddle Billing integration — platform subscription billing for tenants.
 *
 * Client-side:  initializePaddle / openCheckout  (via @paddle/paddle-js)
 * Server-side:  REST calls to Paddle Billing API  (via fetch + PADDLE_API_KEY)
 *
 * Required environment variables:
 *   NEXT_PUBLIC_PADDLE_CLIENT_TOKEN  — client token from Paddle dashboard
 *   PADDLE_API_KEY                   — API key from Paddle dashboard
 *   PADDLE_WEBHOOK_SECRET            — webhook secret from Paddle dashboard
 *   PADDLE_ENVIRONMENT               — "sandbox" | "production" (default: sandbox)
 */

// ─── Environment ─────────────────────────────────────────────────────────────

export const isPaddleProduction =
  process.env.PADDLE_ENVIRONMENT === 'production'

export const PADDLE_API_BASE = isPaddleProduction
  ? 'https://api.paddle.com'
  : 'https://sandbox-api.paddle.com'

// ─── Server-side helpers (API key required) ──────────────────────────────────

function getPaddleApiKey(): string {
  const key = process.env.PADDLE_API_KEY
  if (!key) {
    throw new Error('[Paddle] PADDLE_API_KEY environment variable is not set')
  }
  return key
}

async function paddleRequest<T>(
  method: 'GET' | 'POST' | 'PATCH',
  path: string,
  body?: object
): Promise<T> {
  const res = await fetch(`${PADDLE_API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${getPaddleApiKey()}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(
      `[Paddle API] ${method} ${path} failed: ${res.status} — ${JSON.stringify(json?.error ?? json)}`
    )
  }

  return json.data as T
}

// ─── Customer ────────────────────────────────────────────────────────────────

export interface PaddleCustomer {
  id: string
  name: string
  email: string
  status: string
}

/**
 * Create a Paddle customer representing the church.
 * Called once when a church is first assigned a subscription.
 */
export async function createPaddleCustomer(
  churchName: string,
  email: string
): Promise<PaddleCustomer> {
  return paddleRequest<PaddleCustomer>('POST', '/customers', {
    name: churchName,
    email,
  })
}

/**
 * Retrieve an existing Paddle customer by ID.
 */
export async function getPaddleCustomer(customerId: string): Promise<PaddleCustomer> {
  return paddleRequest<PaddleCustomer>('GET', `/customers/${customerId}`)
}

// ─── Transaction / Checkout ─────────────────────────────────────────────────

export interface PaddleCheckoutItem {
  priceId: string
  quantity: number
}

export interface PaddleTransaction {
  id: string
  status: string
  checkout: {
    url: string
  }
  custom_data: Record<string, string> | null
}

/**
 * Look up a Paddle discount by its coupon code.
 * Returns the discount ID (dsc_xxx) or null if not found.
 */
export async function findPaddleDiscountByCode(
  code: string
): Promise<string | null> {
  try {
    const discounts = await paddleRequest<Array<{ id: string; code?: string; status: string }>>(
      'GET',
      `/discounts?code=${encodeURIComponent(code)}&status=active`
    )
    return Array.isArray(discounts) && discounts.length > 0 ? discounts[0].id : null
  } catch {
    return null
  }
}

/**
 * Create a Paddle transaction (draft → generates hosted checkout URL).
 * custom_data is passed through to webhooks so we can link back to our DB.
 */
export async function createPaddleCheckout(opts: {
  priceId: string
  customerId?: string
  billingCycle: 'MONTHLY' | 'YEARLY'
  customData: {
    churchId: string
    planId: string
    billingCycle: string
  }
  successUrl?: string
  discountId?: string
}): Promise<PaddleTransaction> {
  const body: Record<string, unknown> = {
    items: [{ price_id: opts.priceId, quantity: 1 }],
    custom_data: opts.customData,
    checkout: {
      url: opts.successUrl ?? process.env.NEXTAUTH_URL + '/platform/billing',
    },
  }

  if (opts.customerId) {
    body.customer_id = opts.customerId
  }

  if (opts.discountId) {
    body.discount_id = opts.discountId
  }

  return paddleRequest<PaddleTransaction>('POST', '/transactions', body)
}

// ─── Subscription management ─────────────────────────────────────────────────

export interface PaddleSubscription {
  id: string
  status: string
  customer_id: string
  current_billing_period: {
    starts_at: string
    ends_at: string
  } | null
}

export async function getPaddleSubscription(
  subscriptionId: string
): Promise<PaddleSubscription> {
  return paddleRequest<PaddleSubscription>('GET', `/subscriptions/${subscriptionId}`)
}

export async function cancelPaddleSubscription(
  subscriptionId: string,
  effectiveFrom: 'next_billing_period' | 'immediately' = 'next_billing_period'
): Promise<void> {
  await paddleRequest('POST', `/subscriptions/${subscriptionId}/cancel`, {
    effective_from: effectiveFrom,
  })
}

// ─── Status map helper ───────────────────────────────────────────────────────

export const PADDLE_STATUS_MAP: Record<string, string> = {
  active: 'ACTIVE',
  trialing: 'TRIALING',
  past_due: 'PAST_DUE',
  paused: 'PAUSED',
  canceled: 'CANCELED',
}
