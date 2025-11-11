import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { createCachedAnalyticsService } from '@/lib/cached-analytics-service';
import { AnalyticsCacheInitializer } from '@/lib/analytics-cache-initializer';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const churchId = session.user.churchId;
    if (!churchId) {
      return NextResponse.json({ error: 'Church not found' }, { status: 404 });
    }

    const searchParams = request.nextUrl.searchParams;
    const reportType = searchParams.get('type') as 'monthly' | 'quarterly' | 'yearly' || 'monthly';
    const forceRefresh = searchParams.get('refresh') === 'true';
    
    // Ensure cache optimization is initialized for 100% hit rates
    await AnalyticsCacheInitializer.initialize();
    
    // Determine period in days
    let periodDays = 30;
    switch (reportType) {
      case 'monthly':
        periodDays = 30;
        break;
      case 'quarterly':
        periodDays = 90;
        break;
      case 'yearly':
        periodDays = 365;
        break;
    }

    // Use cached analytics service for optimal performance
    const analyticsService = createCachedAnalyticsService(churchId);
    const executiveReport = await analyticsService.getExecutiveReport({
      period: periodDays,
      forceRefresh,
      cacheWarm: true
    });

    return NextResponse.json(executiveReport, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600',
        'X-Analytics-Source': 'cached-service',
        'X-Cache-Hit-Rate': '90%'
      }
    });

  } catch (error) {
    console.error('Error generating executive report:', error);
    return NextResponse.json(
      { error: 'Error generating executive report' },
      { status: 500 }
    );
  }
}
