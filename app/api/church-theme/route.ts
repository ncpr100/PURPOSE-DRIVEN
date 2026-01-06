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
        themeName: true,
        isActive: true,
        updatedAt: true
      }
    })

    if (!churchTheme) {
      // Return default platform colors (from stats cards)
      return NextResponse.json({
        brandColors: {
          prayerRequest: '#8B5CF6',    // Purple-500 (platform stats)
          visitorFollowup: '#3B82F6',  // Blue-500 (platform stats)
          socialMedia: '#10B981',      // Green-500 (platform stats)
          events: '#F59E0B',           // Orange-500 (platform stats)
          primary: '#3B82F6',          // Blue-500
          secondary: '#10B981'         // Green-500
        },
        isDefault: true
      })
    }

    // Parse brandColors from JSON string if exists
    let parsedBrandColors = null
    if (churchTheme.brandColors) {
      try {
        parsedBrandColors = JSON.parse(churchTheme.brandColors)
      } catch (error) {
        console.error('Error parsing brandColors:', error)
      }
    }

    return NextResponse.json({
      ...churchTheme,
      brandColors: parsedBrandColors || {
        prayerRequest: '#8B5CF6',
        visitorFollowup: '#3B82F6',
        socialMedia: '#10B981',
        events: '#F59E0B',
        primary: '#3B82F6',
        secondary: '#10B981'
      },
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
          brandColors: JSON.stringify(brandColors), // Store as JSON string
          updatedAt: new Date()
        }
      })
    } else {
      // Create new theme
      updatedTheme = await db.church_themes.create({
        data: {
          id: `theme_${churchId}_${Date.now()}`,
          churches: {
            connect: { id: churchId }
          },
          brandColors: JSON.stringify(brandColors), // Store as JSON string
          themeName: 'custom',
          themeConfig: '{}',
          isActive: true,
          updatedAt: new Date()
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
