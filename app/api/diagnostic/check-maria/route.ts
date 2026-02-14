import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('[DIAGNOSTIC] Checking María González user...')
    
    // Check if user exists
    const maria = await db.users.findUnique({
      where: { email: 'admin@iglesiacentral.com' },
      include: {
        churches: {
          select: { id: true, name: true, isActive: true }
        }
      }
    })
    
    if (!maria) {
      console.log('[DIAGNOSTIC] ❌ User NOT FOUND')
      
      // Check if church exists
      const church = await db.churches.findUnique({
        where: { id: 'iglesia-central' }
      })
      
      return NextResponse.json({
        status: 'USER_NOT_FOUND',
        userExists: false,
        churchExists: !!church,
        church: church ? {
          id: church.id,
          name: church.name,
          isActive: church.isActive
        } : null,
        message: 'María González user does not exist in database'
      })
    }
    
    console.log('[DIAGNOSTIC] ✅ User FOUND')
    
    // Test password
    const passwordMatch = await bcrypt.compare('password123', maria.password)
    
    console.log(`[DIAGNOSTIC] Password match: ${passwordMatch}`)
    
    // Generate new hash if needed
    let newHash = null
    if (!passwordMatch) {
      newHash = await bcrypt.hash('password123', 12)
    }
    
    return NextResponse.json({
      status: 'USER_FOUND',
      userExists: true,
      user: {
        id: maria.id,
        name: maria.name,
        email: maria.email,
        role: maria.role,
        churchId: maria.churchId,
        isActive: maria.isActive,
        createdAt: maria.createdAt,
        passwordHashPreview: maria.password.substring(0, 30) + '...'
      },
      church: maria.churches ? {
        id: maria.churches.id,
        name: maria.churches.name,
        isActive: maria.churches.isActive
      } : null,
      passwordCheck: {
        password: 'password123',
        matches: passwordMatch,
        newHashIfNeeded: newHash
      },
      sqlFixes: !passwordMatch ? [
        `UPDATE users SET password = '${newHash}' WHERE email = 'admin@iglesiacentral.com';`
      ] : !maria.isActive ? [
        `UPDATE users SET "isActive" = true WHERE email = 'admin@iglesiacentral.com';`
      ] : []
    })
    
  } catch (error) {
    console.error('[DIAGNOSTIC] Error:', error)
    return NextResponse.json({
      status: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
