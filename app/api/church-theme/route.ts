import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

/**
 * GET /api/church-theme
 * Returns the church's theme configuration including brand colors
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json(
        { error: 'Unauthorized - No church ID found' },
        { status: 401 }
      )
    }

    const churchId = session.user.churchId

    // Fetch church theme
    const churchTheme = await db.church_themes.findFirst({
      where: { churchId },
      select: {
        id: true,
        churchId: true,
        brandColors: true,
        template: true,
        customCss: true,
        isActive: true,
        updatedAt: true
      }
    })

    if (!churchTheme) {
      // Return default brand colors if no theme configured
      return NextResponse.json({
        brandColors: {
          prayerRequest: '#EC4899',    // Pink
          visitorFollowup: '#3B82F6',  // Blue
          socialMedia: '#8B5CF6',      // Purple
          events: '#F59E0B',           // Orange
          primary: '#8B5CF6',          // Purple
          secondary: '#3B82F6'         // Blue
        },
        isDefault: true
      })
    }

    return NextResponse.json({
      ...churchTheme,
      isDefault: false
    })

  } catch (error) {
    console.error('Error fetching church theme:', error)
    return NextResponse.json(
      { error: 'Failed to fetch church theme' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/church-theme
 * Updates the church's brand colors
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json(
        { error: 'Unauthorized - No church ID found' },
        { status: 401 }
      )
    }

    const churchId = session.user.churchId
    const body = await request.json()

    // Validate brand colors format
    const { brandColors } = body
    if (!brandColors || typeof brandColors !== 'object') {
      return NextResponse.json(
        { error: 'Invalid brandColors format' },
        { status: 400 }
      )
    }

    // Validate color values (basic hex color validation)
    const colorRegex = /^#[0-9A-F]{6}$/i
    const validColors = [
      'prayerRequest',
      'visitorFollowup', 
      'socialMedia',
      'events',
      'primary',
      'secondary'
    ]

    for (const colorKey of validColors) {
      if (brandColors[colorKey] && !colorRegex.test(brandColors[colorKey])) {
        return NextResponse.json(
          { error: `Invalid color format for ${colorKey}. Expected hex color (e.g., #FF5733)` },
          { status: 400 }
        )
      }
    }

    // Check if theme exists
    const existingTheme = await db.church_themes.findFirst({
      where: { churchId }
    })

    let updatedTheme

    if (existingTheme) {
      // Update existing theme
      updatedTheme = await db.church_themes.update({
        where: { id: existingTheme.id },
        data: {
          brandColors: brandColors as any, // Prisma Json type
          updatedAt: new Date()
        }
      })
    } else {
      // Create new theme
      updatedTheme = await db.church_themes.create({
        data: {
          churchId,
          brandColors: brandColors as any, // Prisma Json type
          template: 'default',
          isActive: true
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Brand colors updated successfully',
      theme: updatedTheme
    })

  } catch (error) {
    console.error('Error updating church theme:', error)
    return NextResponse.json(
      { error: 'Failed to update church theme' },
      { status: 500 }
    )
  }
}
