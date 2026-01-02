
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const category = searchParams.get('category') || 'all'
    const isPublic = searchParams.get('public') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = {
      churchId: session.user.churchId
    }

    if (status !== 'all') {
      where.status = status
    }

    if (category !== 'all') {
      where.category = category
    }

    if (isPublic) {
      where.isPublic = true
      where.status = 'approved'
    }

    const testimonies = await prisma.prayer_testimonies.findMany({
      where,
      include: {
        contact: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true
          }
        },
        prayer_requests: {
          select: {
            id: true,
            message: true,
            category: {
              select: {
                id: true,
                name: true,
                color: true
              }
            }
          }
        },
        approver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    const totalCount = await prisma.prayer_testimonies.count({ where })

    return NextResponse.json({
      testimonies,
      totalCount,
      hasMore: offset + limit < totalCount
    })
  } catch (error) {
    console.error('Error fetching testimonies:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()

    const {
      title,
      message,
      contactId,
      prayer_requestsId,
      category = 'general',
      isAnonymous = false,
      imageUrl,
      tags = [],
      formId,
      qrCodeId
    } = body

    // Validate required fields
    if (!title?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Título y mensaje son requeridos' },
        { status: 400 }
      )
    }

    let churchId = session?.user?.churchId

    // If no session (public submission), get churchId from contact or form
    if (!churchId) {
      if (contactId) {
        const contact = await prisma.prayer_contacts.findUnique({
          where: { id: contactId },
          select: { churchId: true }
        })
        churchId = contact?.churchId
      } else if (formId) {
        const form = await prisma.testimony_forms.findUnique({
          where: { id: formId },
          select: { churchId: true }
        })
        churchId = form?.churchId
      }

      if (!churchId) {
        return NextResponse.json(
          { error: 'No se pudo determinar la iglesia' },
          { status: 400 }
        )
      }
    }

    const testimony = await prisma.prayer_testimonies.create({
      data: {
        title: title.trim(),
        message: message.trim(),
        contactId: contactId || null,
        prayer_requestsId: prayer_requestsId || null,
        category,
        isAnonymous,
        imageUrl: imageUrl || null,
        tags: tags,
        churchId,
        formId: formId || null,
        qrCodeId: qrCodeId || null
      },
      include: {
        contact: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true
          }
        },
        prayer_requests: {
          select: {
            id: true,
            message: true,
            category: {
              select: {
                id: true,
                name: true,
                color: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ testimony }, { status: 201 })
  } catch (error) {
    console.error('Error creating testimony:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
