import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET /api/social-media-posts - Get all social media posts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await db.users.findUnique({
      where: { id: session.user.id },
      include: { churches: true }
    })

    if (!user?.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 403 })
    }

    const posts = await db.social_media_posts.findMany({
      where: { churchId: user.churchId },
      include: {
        marketing_campaigns: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching social media posts:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/social-media-posts - Create social media post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await db.users.findUnique({
      where: { id: session.user.id },
      include: { churches: true }
    })

    if (!user?.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 403 })
    }

    // Check permissions
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'].includes(user.role)) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    const body = await request.json()
    const { content, scheduledFor, accountIds, campaignId, mediaUrls, hashtags } = body

    if (!content) {
      return NextResponse.json({ error: 'Contenido es requerido' }, { status: 400 })
    }

    const post = await db.social_media_posts.create({
      data: {
        content,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        campaignId,
        mediaUrls: mediaUrls ? JSON.stringify(mediaUrls) : null,
        hashtags: hashtags ? JSON.stringify(hashtags) : null,
        status: 'DRAFT',
        churchId: user.churchId,
        createdBy: user.id
      },
      include: {
        social_media_accounts: {
          select: { id: true, platform: true, username: true }
        }
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating social media post:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
