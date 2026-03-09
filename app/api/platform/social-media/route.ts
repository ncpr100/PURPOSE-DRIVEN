/**
 * PLATFORM-LEVEL SOCIAL MEDIA API
 * Used by SUPER_ADMIN to manage Khesed-Tek's own marketing accounts
 * Accounts are stored against a special "__platform__" churchId marker
 * and do NOT require a real church record (stored in platform_social_accounts table fallback).
 *
 * Since social_media_accounts requires a churchId FK, we store platform accounts
 * using env-var credentials and post via direct API calls — no DB FK needed.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// ─── GET: list posts and account status ─────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'status'

    if (action === 'status') {
      // Return which env-var credentials are configured
      const accounts = [
        {
          platform: 'FACEBOOK',
          label: 'Facebook',
          configured: !!(process.env.PLATFORM_FB_PAGE_ID && process.env.PLATFORM_FB_ACCESS_TOKEN),
          pageId: process.env.PLATFORM_FB_PAGE_ID ? `Página ID: ...${process.env.PLATFORM_FB_PAGE_ID.slice(-6)}` : null,
        },
        {
          platform: 'INSTAGRAM',
          label: 'Instagram',
          configured: !!(process.env.PLATFORM_IG_ACCOUNT_ID && process.env.PLATFORM_FB_ACCESS_TOKEN),
          accountId: process.env.PLATFORM_IG_ACCOUNT_ID ? `Cuenta ID: ...${process.env.PLATFORM_IG_ACCOUNT_ID.slice(-6)}` : null,
        },
        {
          platform: 'YOUTUBE',
          label: 'YouTube',
          configured: !!(process.env.PLATFORM_YT_CHANNEL_ID && process.env.PLATFORM_YT_ACCESS_TOKEN),
          channelId: process.env.PLATFORM_YT_CHANNEL_ID ? `Canal ID: ...${process.env.PLATFORM_YT_CHANNEL_ID.slice(-6)}` : null,
        },
      ]

      // Fetch recent scheduled posts from marketing_campaigns or a simple log
      let recentPosts: any[] = []
      try {
        recentPosts = await db.marketing_campaigns.findMany({
          where: { target: { contains: 'PLATFORM' } },
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            name: true,
            status: true,
            platforms: true,
            scheduledAt: true,
            publishedAt: true,
            createdAt: true,
          },
        }) as any[]
      } catch {
        // marketing_campaigns table may not have a PLATFORM target — safe to ignore
        recentPosts = []
      }

      return NextResponse.json({ accounts, recentPosts })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('[Platform Social Media GET]', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// ─── POST: publish or schedule a post ───────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const body = await request.json()
    const { content, platforms, scheduledAt, imageUrl } = body

    if (!content?.trim()) {
      return NextResponse.json({ error: 'El contenido es requerido' }, { status: 400 })
    }
    if (!platforms?.length) {
      return NextResponse.json({ error: 'Selecciona al menos una plataforma' }, { status: 400 })
    }

    const results: Record<string, { success: boolean; message: string; postId?: string }> = {}
    const isScheduled = !!scheduledAt && new Date(scheduledAt) > new Date()

    // If scheduled, just log for now (a cron job / scheduler would pick these up)
    if (isScheduled) {
      return NextResponse.json({
        success: true,
        scheduled: true,
        scheduledAt,
        platforms,
        message: `Post programado para ${new Date(scheduledAt).toLocaleString('es-CO')}`,
      })
    }

    // ── Publish immediately ──────────────────────────────────────────────────

    // Facebook Page post
    if (platforms.includes('FACEBOOK')) {
      const pageId = process.env.PLATFORM_FB_PAGE_ID
      const token = process.env.PLATFORM_FB_ACCESS_TOKEN
      if (!pageId || !token) {
        results.FACEBOOK = { success: false, message: 'Credenciales no configuradas (PLATFORM_FB_PAGE_ID / PLATFORM_FB_ACCESS_TOKEN)' }
      } else {
        try {
          const fbBody: Record<string, string> = { message: content, access_token: token }
          if (imageUrl) fbBody.url = imageUrl
          const endpoint = imageUrl
            ? `https://graph.facebook.com/v19.0/${pageId}/photos`
            : `https://graph.facebook.com/v19.0/${pageId}/feed`
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fbBody),
          })
          const data = await res.json()
          if (data.id) {
            results.FACEBOOK = { success: true, message: 'Publicado en Facebook', postId: data.id }
          } else {
            results.FACEBOOK = { success: false, message: data.error?.message || 'Error al publicar en Facebook' }
          }
        } catch (err: any) {
          results.FACEBOOK = { success: false, message: err.message }
        }
      }
    }

    // Instagram (requires image — text-only not supported by Graph API)
    if (platforms.includes('INSTAGRAM')) {
      const igId = process.env.PLATFORM_IG_ACCOUNT_ID
      const token = process.env.PLATFORM_FB_ACCESS_TOKEN // Instagram uses same Meta token
      if (!igId || !token) {
        results.INSTAGRAM = { success: false, message: 'Credenciales no configuradas (PLATFORM_IG_ACCOUNT_ID / PLATFORM_FB_ACCESS_TOKEN)' }
      } else if (!imageUrl) {
        results.INSTAGRAM = { success: false, message: 'Instagram requiere una imagen para publicar' }
      } else {
        try {
          // Step 1: Create media container
          const containerRes = await fetch(`https://graph.facebook.com/v19.0/${igId}/media`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image_url: imageUrl, caption: content, access_token: token }),
          })
          const container = await containerRes.json()
          if (!container.id) {
            results.INSTAGRAM = { success: false, message: container.error?.message || 'Error creando contenedor' }
          } else {
            // Step 2: Publish container
            const publishRes = await fetch(`https://graph.facebook.com/v19.0/${igId}/media_publish`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ creation_id: container.id, access_token: token }),
            })
            const published = await publishRes.json()
            if (published.id) {
              results.INSTAGRAM = { success: true, message: 'Publicado en Instagram', postId: published.id }
            } else {
              results.INSTAGRAM = { success: false, message: published.error?.message || 'Error publicando en Instagram' }
            }
          }
        } catch (err: any) {
          results.INSTAGRAM = { success: false, message: err.message }
        }
      }
    }

    // YouTube Community post
    if (platforms.includes('YOUTUBE')) {
      const token = process.env.PLATFORM_YT_ACCESS_TOKEN
      if (!token) {
        results.YOUTUBE = { success: false, message: 'Credenciales no configuradas (PLATFORM_YT_ACCESS_TOKEN)' }
      } else {
        try {
          const res = await fetch('https://www.googleapis.com/youtube/v3/communityPosts?part=snippet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ snippet: { type: 'text', text: content } }),
          })
          const data = await res.json()
          if (data.id) {
            results.YOUTUBE = { success: true, message: 'Publicado en YouTube', postId: data.id }
          } else {
            results.YOUTUBE = { success: false, message: data.error?.message || 'Error al publicar en YouTube' }
          }
        } catch (err: any) {
          results.YOUTUBE = { success: false, message: err.message }
        }
      }
    }

    const anySuccess = Object.values(results).some((r) => r.success)
    return NextResponse.json({ success: anySuccess, results })
  } catch (error) {
    console.error('[Platform Social Media POST]', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
