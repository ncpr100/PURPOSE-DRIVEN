/**
 * Cache Optimization API - 100% Hit Rate Monitoring
 * 
 * Provides real-time monitoring and control of cache optimization to achieve
 * and maintain 100% cache hit rates for critical operations.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cacheOptimizationController } from '@/lib/cache-optimization-controller';
import { cacheManager } from '@/lib/redis-cache-manager';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow admin users to access cache optimization
    if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN_IGLESIA') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'status';

    switch (action) {
      case 'status':
        const optimizationStatus = await cacheOptimizationController.getOptimizationStatus();
        const cacheMetrics = await cacheManager.getMetrics();
        
        return NextResponse.json({
          success: true,
          data: {
            optimization: optimizationStatus,
            metrics: cacheMetrics,
            timestamp: new Date().toISOString()
          }
        });

      case 'report':
        const latestReport = cacheOptimizationController.getLatestReport();
        
        return NextResponse.json({
          success: true,
          data: {
            report: latestReport,
            timestamp: new Date().toISOString()
          }
        });

      case 'cycle':
        // Trigger a new optimization cycle
        const report = await cacheOptimizationController.runOptimizationCycle();
        
        return NextResponse.json({
          success: true,
          data: {
            report,
            message: 'Optimization cycle completed successfully'
          }
        });

      case 'health':
        const healthCheck = await cacheManager.healthCheck();
        
        return NextResponse.json({
          success: true,
          data: {
            health: healthCheck,
            timestamp: new Date().toISOString()
          }
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: status, report, cycle, or health' }, 
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Cache optimization API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow super admin users to modify cache optimization
    if (session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { action, pattern, target } = body;

    switch (action) {
      case 'force_optimization':
        if (!pattern) {
          return NextResponse.json({ error: 'Pattern is required' }, { status: 400 });
        }
        
        await cacheOptimizationController.forceOptimization(pattern);
        
        return NextResponse.json({
          success: true,
          message: `Forced optimization completed for pattern: ${pattern}`
        });

      case 'add_target':
        if (!target) {
          return NextResponse.json({ error: 'Target configuration is required' }, { status: 400 });
        }
        
        cacheOptimizationController.addOptimizationTarget(target);
        
        return NextResponse.json({
          success: true,
          message: `Added optimization target: ${target.pattern}`
        });

      case 'remove_target':
        if (!pattern) {
          return NextResponse.json({ error: 'Pattern is required' }, { status: 400 });
        }
        
        cacheOptimizationController.removeOptimizationTarget(pattern);
        
        return NextResponse.json({
          success: true,
          message: `Removed optimization target: ${pattern}`
        });

      case 'clear_cache':
        await cacheManager.clearAll();
        
        return NextResponse.json({
          success: true,
          message: 'All cache data cleared successfully'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: force_optimization, add_target, remove_target, or clear_cache' }, 
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Cache optimization POST API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}