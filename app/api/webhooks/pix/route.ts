// Brazil PIX Webhook Handler
// Processes PIX payment confirmations

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // PIX webhook payload structure
    const { txid, valor, horario, pagador } = body
    
    if (!txid) {
      console.error('PIX: Missing transaction ID')
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Verify PIX payment via API
    const pixApiKey = process.env.PIX_API_KEY!
    const baseUrl = process.env.PIX_TEST_MODE === 'true' 
      ? 'https://sandbox.api.pix.bcb.gov.br/v1' 
      : 'https://api.pix.bcb.gov.br/v1'

    const response = await fetch(`${baseUrl}/cob/${txid}`, {
      headers: {
        'Authorization': `Bearer ${pixApiKey}`
      }
    })

    if (!response.ok) {
      console.error('PIX: Failed to verify payment')
      return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
    }

    const pixPayment = await response.json()
    
    // Extract church ID from info adicionais
    const churchInfo = pixPayment.infoAdicionais?.find((info: any) => info.nome === 'Igreja')
    const churchId = churchInfo?.valor
    
    if (!churchId) {
      console.error('PIX: No church ID in payment info')
      return NextResponse.json({ error: 'Invalid metadata' }, { status: 400 })
    }

    // Determine status
    let status: 'PENDIENTE' | 'COMPLETADA' | 'FALLIDA' | 'CANCELADA' = 'PENDIENTE'
    
    switch (pixPayment.status?.toUpperCase()) {
      case 'CONCLUIDA':
        status = 'COMPLETADA'
        break
      case 'REMOVIDO_PELO_USUARIO_RECEBEDOR':
      case 'REMOVIDO_PELO_PSP':
        status = 'CANCELADA'
        break
      default:
        status = 'PENDIENTE'
    }

    // Create or update donation
    const donation = await db.donations.upsert({
      where: {
        paymentId: txid
      },
      create: {
        churchId,
        amount: pixPayment.valor?.original ? parseFloat(pixPayment.valor.original) : 0,
        currency: 'BRL',
        status,
        paymentId: txid,
        paymentMethod: 'PIX',
        donorName: pagador?.nome || 'PIX - Doador Anônimo',
        donorEmail: pagador?.cpf ? `pix_${pagador.cpf}@example.com` : undefined,
        notes: 'Pagamento via PIX',
        metadata: {
          pix_txid: txid,
          pix_horario: horario,
          pix_cpf: pagador?.cpf
        }
      },
      update: {
        status,
        metadata: {
          pix_txid: txid,
          pix_horario: horario,
          pix_cpf: pagador?.cpf,
          last_updated: new Date().toISOString()
        }
      }
    })

    console.log('PIX donation processed:', donation.id)
    return NextResponse.json({ success: true, donationId: donation.id })
  } catch (error) {
    console.error('PIX webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
