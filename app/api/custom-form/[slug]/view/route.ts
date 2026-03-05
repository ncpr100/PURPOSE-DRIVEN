import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// POST /api/custom-form/[slug]/view — lightweight view tracker (no auth needed, public)
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const form = await db.custom_forms.findUnique({
      where: { slug, isActive: true },
      select: { id: true, config: true }
    })

    if (!form) {
      return NextResponse.json({ ok: false }, { status: 404 })
    }

    const config = (form.config as Record<string, any>) || {}
    const newViewCount = (config.viewCount || 0) + 1

    await db.custom_forms.update({
      where: { id: form.id },
      data: {
        config: { ...config, viewCount: newViewCount }
      }
    })

    return NextResponse.json({ ok: true, viewCount: newViewCount })
  } catch (error) {
    // Silent fail — never break the form load for analytics
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
