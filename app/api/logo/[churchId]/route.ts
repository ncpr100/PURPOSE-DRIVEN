import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { churchId: string } }
) {
  try {
    const { churchId } = params

    const church = await db.church.findUnique({
      where: { id: churchId },
      select: { logo: true }
    })

    if (!church || !church.logo) {
      return NextResponse.json({ error: 'Logo no encontrado' }, { status: 404 })
    }

    // If it's a data URL, extract the base64 data
    if (church.logo.startsWith('data:')) {
      const [header, base64Data] = church.logo.split(',')
      const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png'
      
      // Convert base64 to buffer
      const buffer = Buffer.from(base64Data, 'base64')
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      })
    }

    // If it's a regular URL, redirect to it
    return NextResponse.redirect(church.logo)

  } catch (error) {
    console.error('Error serving logo:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}