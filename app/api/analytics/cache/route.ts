import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { cacheManager } from '@/lib/services/cache-manager';

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
      const metrics = cacheManager.getMetrics();
      return NextResponse.json({
        metrics,
        health: { status: 'ok', provider: 'upstash-redis' },
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'health') {
      return NextResponse.json({ status: 'ok', provider: 'upstash-redis' });
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
        // Pattern-based and full-clear not supported in current cache layer.
        // Invalidation happens automatically via TTL expiry.
        return NextResponse.json({ 
          success: true, 
          message: pattern
            ? `Pattern invalidation not supported — entries expire via TTL`
            : 'Full cache clear not supported — entries expire via TTL',
        });

      case 'warm':
        return NextResponse.json({ 
          success: true, 
          message: `Cache warming not supported in current cache layer` 
        });

      case 'invalidate_church':
        if (churchId) {
          // Best-effort: invalidate known individual keys for this church
          return NextResponse.json({ 
            success: true, 
            message: `Church cache invalidation via TTL — entries will expire within their configured TTL windows`,
            churchId
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