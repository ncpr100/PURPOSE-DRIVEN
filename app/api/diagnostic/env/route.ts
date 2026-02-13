// Show actual environment variables being used in Vercel
import { NextResponse } from 'next/server'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || 'NOT_SET'
  const supabaseUrl = process.env.SUPABASE_DATABASE_URL || 'NOT_SET'
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    databaseUrl: {
      isSet: !!process.env.DATABASE_URL,
      first50: dbUrl.substring(0, 50),
      last50: dbUrl.slice(-50),
      containsRailway: dbUrl.includes('railway'),
      containsSupabase: dbUrl.includes('supabase'),
      host: dbUrl.match(/@([^:]+):/)?.[1] || 'NO_HOST'
    },
    supabaseDatabaseUrl: {
      isSet: !!process.env.SUPABASE_DATABASE_URL,
      first50: supabaseUrl.substring(0, 50),
      last50: supabaseUrl.slice(-50),
      containsSupabase: supabaseUrl.includes('supabase')
    },
    nextauthUrl: process.env.NEXTAUTH_URL,
    vercelEnv: process.env.VERCEL_ENV
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    }
  })
}
