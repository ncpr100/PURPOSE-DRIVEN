import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  // Direct environment variable read with no processing
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    deploymentId: process.env.VERCEL_DEPLOYMENT_ID || 'unknown',
    
    // Raw environment variable checks
    DATABASE_URL_exists: !!process.env.DATABASE_URL,
    DATABASE_URL_first_30: process.env.DATABASE_URL?.substring(0, 30) || 'NOT_SET',
    
    SUPABASE_DATABASE_URL_exists: !!process.env.SUPABASE_DATABASE_URL,
    SUPABASE_DATABASE_URL_first_30: process.env.SUPABASE_DATABASE_URL?.substring(0, 30) || 'NOT_SET',
    
    // All env vars that contain 'DATABASE'
    all_database_env_vars: Object.keys(process.env).filter(key => key.includes('DATABASE')),
    
    // Direct check
    raw_supabase_url: process.env.SUPABASE_DATABASE_URL || 'NOT_FOUND_IN_ENV',
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  })
}
