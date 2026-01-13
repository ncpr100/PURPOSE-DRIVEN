import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'

// GET /api/qr-codes - Get all QR codes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const where: any = {}
    
    // For church users, filter by churchId
    if (session.user.role !== 'SUPER_ADMIN' && session.user.churchId) {
      where.churchId = session.user.churchId
    }

    const qrCodes = await db.qr_codes.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { scans: true }
        }
      }
    })

    return NextResponse.json({ qrCodes })

  } catch (error) {
    console.error('Error fetching QR codes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/qr-codes - Create new QR code
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()

    const qrCode = await db.qr_codes.create({
      data: {
        id: nanoid(),
        name: body.name,
        type: body.type,
        data: body.data,
        formId: body.formId,
        config: {
          bgColor: body.bgColor,
          dotsColor: body.dotsColor,
          markerBorderColor: body.markerBorderColor,
          markerCenterColor: body.markerCenterColor,
          dotStyle: body.dotStyle,
          cornerSquareStyle: body.cornerSquareStyle,
          cornerDotStyle: body.cornerDotStyle,
          logo: body.logo,
          logoSize: body.logoSize,
          pageBackground: body.pageBackground
        },
        preview: body.preview,
        churchId: session.user.churchId || null,
        createdBy: session.user.id
      }
    })

    return NextResponse.json({ 
      success: true,
      qrCode: {
        id: qrCode.id,
        name: qrCode.name,
        type: qrCode.type
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating QR code:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/qr-codes/[id] - Delete QR code
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }

    const where: any = { id }
    
    // For church users, ensure they can only delete their own QR codes
    if (session.user.role !== 'SUPER_ADMIN' && session.user.churchId) {
      where.churchId = session.user.churchId
    }

    await db.qr_codes.delete({ where })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting QR code:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
