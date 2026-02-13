// Show actual environment variables being used in Vercel
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    nodeEnv: process.env.NODE_ENV,
    databaseUrlPresent: !!process.env.DATABASE_URL,
    databaseUrlFirst30: process.env.DATABASE_URL?.substring(0, 30) || 'NOT SET',
    databaseUrlLast30: process.env.DATABASE_URL?.slice(-30) || 'NOT SET',
    nextauthUrlPresent: !!process.env.NEXTAUTH_URL,
    nextauthUrl: process.env.NEXTAUTH_URL,
    vercelEnv: process.env.VERCEL_ENV,
    allEnvKeys: Object.keys(process.env).filter(k => 
      k.includes('DATABASE') || k.includes('NEXTAUTH') || k.includes('VERCEL')
    )
  })
}
