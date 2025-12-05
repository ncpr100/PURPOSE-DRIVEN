import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'
import { randomUUID } from 'crypto'

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const theme = await prisma.church_themes.findUnique({
      where: {
        churchId: session.user.churchId
      }
    })

    return NextResponse.json({ theme })
  } catch (error) {
    console.error('Error fetching church theme:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const {
      primaryColor,
      secondaryColor,
      accentColor,
      primaryFont,
      headingFont,
      badgeStyle
    } = body

    // Prepare theme configuration
    const themeConfig = JSON.stringify({
      primaryColor,
      secondaryColor,
      accentColor,
      badgeStyle
    })

    const brandColors = JSON.stringify({
      primary: primaryColor,
      secondary: secondaryColor,
      accent: accentColor
    })

    // Upsert church theme (create or update) - Fixed for unique constraint
    let updatedTheme
    try {
      // Try to find existing theme first
      updatedTheme = await prisma.church_themes.findUnique({
        where: { churchId: session.user.churchId }
      })

      if (updatedTheme) {
        // Update existing theme
        updatedTheme = await prisma.church_themes.update({
          where: { churchId: session.user.churchId },
          data: {
            themeConfig,
            brandColors,
            primaryFont,
            headingFont,
            themeName: 'custom'
          }
        })
      } else {
        // Upsert theme (update if exists, create if not)
        updatedTheme = await prisma.church_themes.upsert({
          where: { churchId: session.user.churchId },
          update: {
            themeConfig,
            brandColors,
            primaryFont,
            headingFont,
            themeName: 'custom'
          },
          create: {
            id: randomUUID(),
            churchId: session.user.churchId,
            themeConfig,
            brandColors,
            primaryFont,
            headingFont,
            themeName: 'custom'
          }
        })
      }
    } catch (error) {
      console.error('Church theme operation error:', error)
      return NextResponse.json({ 
        message: 'Error al actualizar tema de iglesia',
        success: false
      }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Tema actualizado exitosamente',
      success: true,
      theme: updatedTheme
    })
  } catch (error) {
    console.error('Error updating church theme:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
