import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      environment: {
        OPENROUTER_API_KEY: {
          exists: !!process.env.OPENROUTER_API_KEY,
          prefix: process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY.substring(0, 15) + '...' : null,
          length: process.env.OPENROUTER_API_KEY?.length || 0
        },
        PADDLE_API_KEY: {
          exists: !!process.env.PADDLE_API_KEY,
          prefix: process.env.PADDLE_API_KEY ? process.env.PADDLE_API_KEY.substring(0, 15) + '...' : null,
          length: process.env.PADDLE_API_KEY?.length || 0,
          environment: process.env.PADDLE_API_KEY?.includes('test_') ? 'sandbox' : 'production'
        }
      },
      tests: {}
    }
    if (process.env.OPENROUTER_API_KEY) {
      try {
        const start = Date.now()
        const res = await fetch('https://openrouter.ai/api/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
            'X-Title': 'Khesed-Tek SRE Diagnostics'
          },
          signal: AbortSignal.timeout(5000)
        })
        const ms = Date.now() - start
        let body = null
        try { body = await res.json() } catch {}
        diagnostics.tests.openrouter = {
          status: res.status,
          statusText: res.statusText,
          responseTimeMs: ms,
          ok: res.ok,
          body: body ? { modelsCount: body.data?.length || 0 } : null,
          error: !res.ok ? await res.text().catch(() => 'No body') : null
        }
      } catch (err) {
        diagnostics.tests.openrouter = { error: err instanceof Error ? err.message : String(err) }
      }
    }
    if (process.env.PADDLE_API_KEY) {
      try {
        const start = Date.now()
        const res = await fetch('https://api.paddle.com/products?per_page=1', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.PADDLE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          signal: AbortSignal.timeout(5000)
        })
        const ms = Date.now() - start
        let body = null
        try { body = await res.json() } catch {}
        diagnostics.tests.paddle = {
          status: res.status,
          statusText: res.statusText,
          responseTimeMs: ms,
          ok: res.ok,
          body: body ? { productsCount: body.data?.length || 0 } : null,
          error: !res.ok ? await res.text().catch(() => 'No body') : null
        }
      } catch (err) {
        diagnostics.tests.paddle = { error: err instanceof Error ? err.message : String(err) }
      }
    }
    return NextResponse.json(diagnostics)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}