import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// POST /api/social-media-posts/[id]/publish - Publish a social media post
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Get the post
    const post = await db.social_media_posts.findFirst({
      where: {
        id: params.id,
        churchId: user.churchId
      }
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (post.status === 'PUBLISHED') {
      return NextResponse.json({ error: 'Post already published' }, { status: 400 })
    }

    // Update post status to published
    const updatedPost = await db.social_media_posts.update({
      where: { id: params.id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        publishedBy: user.id
      },
      include: {
        social_media_accounts: {
          select: {
            id: true,
            platform: true,
            username: true,
            displayName: true
          }
        }
      }
    })

    // Here you would integrate with actual social media APIs
    // For now, we just update the database
    
    return NextResponse.json({
      message: 'Post published successfully',
      post: updatedPost
    })
  } catch (error) {
    console.error('Error publishing post:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
