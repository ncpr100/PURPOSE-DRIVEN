import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET /api/social-media-posts/[id] - Get specific social media post
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const post = await db.social_media_posts.findFirst({
      where: {
        id: params.id,
        churchId: user.churchId
      }
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching social media post:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/social-media-posts/[id] - Update social media post
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Verify post ownership
    const existing = await db.social_media_posts.findFirst({
      where: { id: params.id, churchId: user.churchId }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (existing.status === 'PUBLISHED') {
      return NextResponse.json({ error: 'Cannot update published post' }, { status: 400 })
    }

    const body = await request.json()
    const { content, scheduledAt, accountIds, mediaUrls, hashtags, status } = body

    const updated = await db.social_media_posts.update({
      where: { id: params.id },
      data: {
        content: content || existing.content,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : existing.scheduledAt,
        mediaUrls: mediaUrls !== undefined ? JSON.stringify(mediaUrls) : existing.mediaUrls,
        hashtags: hashtags !== undefined ? JSON.stringify(hashtags) : existing.hashtags,
        status: status || existing.status,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating social media post:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/social-media-posts/[id] - Delete social media post
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(user.role)) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    // Verify post ownership
    const existing = await db.social_media_posts.findFirst({
      where: { id: params.id, churchId: user.churchId }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (existing.status === 'PUBLISHED') {
      return NextResponse.json({ error: 'Cannot delete published post' }, { status: 400 })
    }

    await db.social_media_posts.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true, message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting social media post:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
