import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { cacheManager } from '@/lib/redis-cache-manager';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can view cache metrics
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    if (action === 'metrics') {
      // Get cache performance metrics
      const metrics = await cacheManager.getMetrics();
      const health = await cacheManager.healthCheck();
      
      return NextResponse.json({
        metrics,
        health,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'health') {
      // Get cache health check
      const health = await cacheManager.healthCheck();
      return NextResponse.json(health);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Error accessing cache management:', error);
    return NextResponse.json(
      { error: 'Error accessing cache management' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only super admins can manage cache
    if (session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { action, pattern, churchId } = body;

    switch (action) {
      case 'clear':
        if (pattern) {
          const invalidated = await cacheManager.invalidate(pattern);
          return NextResponse.json({ 
            success: true, 
            message: `Invalidated ${invalidated} cache entries`,
            invalidated
          });
        } else {
          await cacheManager.clearAll();
          return NextResponse.json({ 
            success: true, 
            message: 'All cache cleared' 
          });
        }

      case 'warm':
        if (churchId) {
          await cacheManager.warmCache(churchId);
          return NextResponse.json({ 
            success: true, 
            message: `Cache warmed for church: ${churchId}` 
          });
        }
        return NextResponse.json({ error: 'churchId required for warm action' }, { status: 400 });

      case 'invalidate_church':
        if (churchId) {
          const patterns = [
            `analytics:*:${churchId}:*`,
            `stats:*:${churchId}`,
            `members:*:${churchId}:*`,
            `events:*:${churchId}:*`
          ];
          
          let totalInvalidated = 0;
          for (const pattern of patterns) {
            totalInvalidated += await cacheManager.invalidate(pattern);
          }
          
          return NextResponse.json({ 
            success: true, 
            message: `Invalidated ${totalInvalidated} cache entries for church: ${churchId}`,
            invalidated: totalInvalidated
          });
        }
        return NextResponse.json({ error: 'churchId required' }, { status: 400 });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error managing cache:', error);
    return NextResponse.json(
      { error: 'Error managing cache' },
      { status: 500 }
    );
  }
}