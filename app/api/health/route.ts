import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * Railway Health Check Endpoint
 * 
 * This endpoint is used by Railway to verify that the application is running
 * and can connect to essential services like the database.
 */
export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await db.$queryRaw`SELECT 1`
    
    // Return healthy status
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'khesed-tek-platform',
      version: process.env.npm_package_version || '1.1.0',
      environment: process.env.NODE_ENV || 'production',
      railway: !!process.env.RAILWAY_ENVIRONMENT
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    // Return unhealthy status
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'khesed-tek-platform',
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV || 'production'
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    })
  }
}

// Support HEAD requests for basic health checks
export async function HEAD(request: NextRequest) {
  try {
    // Quick health check without database query for HEAD requests
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    return new NextResponse(null, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  }
}