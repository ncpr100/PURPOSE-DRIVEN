import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * Public Dynamic QR redirect endpoint.
 * /qr/[code]  → looks up DynamicQRCode, increments scanCount, redirects.
 *
 * This route must be registered in middleware.ts as a public route
 * (no auth check) so anyone who scans the QR can be redirected.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const { code } = params

  if (!code) {
    return NextResponse.json({ error: 'Código no especificado' }, { status: 400 })
  }

  const qr = await db.dynamicQRCode.findUnique({
    where: { shortCode: code },
  })

  if (!qr || !qr.isActive) {
    // Return a simple HTML page so the user sees something helpful
    return new NextResponse(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>QR no encontrado</title></head>
       <body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
         <div style="text-align:center">
           <h2>Código QR no disponible</h2>
           <p style="color:#666">Este código QR no existe o está desactivado.</p>
         </div>
       </body></html>`,
      { status: 404, headers: { 'Content-Type': 'text/html' } }
    )
  }

  // Fire-and-forget scan tracking (don't block the redirect)
  const userAgent = request.headers.get('user-agent') || undefined
  const ipRaw     = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined
  const ipAddress = ipRaw?.split(',')[0]?.trim()

  // Parallel: update counters + insert scan record
  Promise.all([
    db.dynamicQRCode.update({
      where: { id: qr.id },
      data:  { scanCount: { increment: 1 }, lastScannedAt: new Date() },
    }),
    db.dynamicQRScan.create({
      data: { qrCodeId: qr.id, userAgent, ipAddress },
    }),
  ]).catch((err) => console.error('[qr-redirect] tracking error:', err))

  return NextResponse.redirect(qr.destinationUrl, { status: 302 })
}
