
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { VisitorAutomationService } from '@/lib/services/visitor-automation'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, checkInId, data } = await req.json()

    switch (action) {
      case 'trigger_automation':
        await VisitorAutomationService.processVisitor(checkInId)
        return NextResponse.json({ success: true })

      case 'manual_categorization':
        // Allow manual override of visitor category
        const { category } = data;
        await VisitorAutomationService.processVisitor(checkInId);
        return NextResponse.json({ success: true, category })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Visitor automation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

// Get visitor automation status
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const checkInId = searchParams.get('checkInId')

    if (!checkInId) {
      return NextResponse.json({ error: 'Check-in ID required' }, { status: 400 })
    }

    const { db: prisma } = await import('@/lib/db')
    
    const checkIn = await prisma.check_ins.findUnique({
      where: { id: checkInId },
      include: {
        visitor_follow_ups: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!checkIn) {
      return NextResponse.json({ error: 'Check-in not found' }, { status: 404 })
    }

    return NextResponse.json({
      visitorType: checkIn.visitorType,
      automationTriggered: checkIn.automationTriggered,
      engagementScore: checkIn.engagementScore,
      followUps: checkIn.visitor_follow_ups,
      lastContactDate: checkIn.lastContactDate
    })

  } catch (error) {
    console.error('Error fetching automation status:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
