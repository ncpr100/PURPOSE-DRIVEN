import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { SPIRITUAL_GIFT_CATEGORIES, MINISTRY_PASSIONS } from '@/lib/spiritual-gifts-config'

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Return the 8-category structure from config file
    // This ensures consistency with ENHANCED_SPIRITUAL_ASSESSMENT_IMPLEMENTATION.md spec
    const giftsByCategory = SPIRITUAL_GIFT_CATEGORIES.reduce((acc: any, category: any) => {
      acc[category.id] = {
        ...category,
        gifts: category.subcategories
      }
      return acc
    }, {})

    return NextResponse.json({
      categories: giftsByCategory,
      categoryList: SPIRITUAL_GIFT_CATEGORIES,
      ministryPassions: MINISTRY_PASSIONS,
      totalCategories: SPIRITUAL_GIFT_CATEGORIES.length,
      totalSubcategories: SPIRITUAL_GIFT_CATEGORIES.reduce((sum, cat) => sum + cat.subcategories.length, 0)
    })
  } catch (error) {
    console.error('Error fetching spiritual gifts:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
