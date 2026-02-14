/**
 * API Endpoint: Create Fresh Test Tenant
 * 
 * URL: /api/admin/create-test-tenant
 * Method: POST
 * 
 * Creates a new test church + admin user to verify platform functionality
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    console.log('[CREATE-TEST-TENANT] Starting fresh tenant creation...');

    // Generate unique IDs with timestamp
    const timestamp = Date.now();
    const churchId = `iglesia-prueba-${timestamp}`;
    const userId = `user-test-admin-${timestamp}`;

    // Hash password
    const passwordHash = bcrypt.hashSync('TestPassword123!', 12);
    console.log('[CREATE-TEST-TENANT] Password hashed');

    // Create church
    const church = await db.churches.create({
      data: {
        id: churchId,
        name: 'Iglesia de Prueba',
        slug: 'iglesia-prueba',
        country: 'ES',
        timezone: 'Europe/Madrid',
        language: 'es',
        currency: 'EUR',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    console.log('[CREATE-TEST-TENANT] Church created:', church.id);

    // Create admin user
    const adminUser = await db.users.create({
      data: {
        id: userId,
        email: 'testadmin@prueba.com',
        password: passwordHash,
        name: 'Admin de Prueba',
        role: 'ADMIN_IGLESIA',
        churchId: church.id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    console.log('[CREATE-TEST-TENANT] Admin user created:', adminUser.email);

    // Verify creation
    const verification = await db.churches.findUnique({
      where: { id: church.id },
      include: { 
        users: {
          select: {
            id: true,
            email: true,
            role: true,
            churchId: true,
            isActive: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: '✅ Fresh test tenant created successfully!',
      data: {
        church: {
          id: church.id,
          name: church.name,
          slug: church.slug
        },
        adminUser: {
          email: adminUser.email,
          role: adminUser.role,
          churchId: adminUser.churchId,
          isActive: adminUser.isActive
        },
        credentials: {
          email: 'testadmin@prueba.com',
          password: 'TestPassword123!',
          loginUrl: 'https://khesed-tek-cms-org.vercel.app/auth/signin'
        },
        verification: {
          churchExists: !!verification,
          usersInChurch: verification?.users.length || 0,
          churchId: verification?.id,
          users: verification?.users
        }
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('[CREATE-TEST-TENANT] ERROR:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error,
      hint: 'Check if user email already exists or church slug is duplicated'
    }, { status: 500 });
  }
}

// GET method for easy browser testing
export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to create test tenant',
    example: 'POST /api/admin/create-test-tenant',
    willCreate: {
      church: 'Iglesia de Prueba',
      admin: 'testadmin@prueba.com',
      password: 'TestPassword123!'
    }
  });
}
