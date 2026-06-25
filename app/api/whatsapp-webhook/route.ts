import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')
  const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || ''
  if (mode === 'subscribe' && token === VERIFY_TOKEN && challenge) {
    console.log('[WHATSAPP] Webhook verified successfully')
    return new NextResponse(challenge, { status: 200 })
  }
  console.error('[WHATSAPP] Webhook verification failed')
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[WHATSAPP] Webhook received:', JSON.stringify(body, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[WHATSAPP] Webhook error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
