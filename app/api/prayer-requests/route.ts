import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createPrayerRequestSchema, getPrayerRequestsSchema } from '@/lib/validations/prayer-request';
import { z } from 'zod';
import { randomUUID } from 'crypto';

// GET /api/prayer-requests - List prayer requests with filters
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
    });

    if (!user?.churchId) {
      return NextResponse.json({ error: 'Iglesia no encontrada' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validation = getPrayerRequestsSchema.safeParse(queryParams);

    if (!validation.success) {
      return NextResponse.json({ error: 'Parámetros de solicitud inválidos', details: validation.error.flatten() }, { status: 400 });
    }
    
    const { page, limit, status, categoryId, priority } = validation.data;
    const skip = (page - 1) * limit;

    const where = {
      churchId: user.churchId,
      ...(status && { status }),
      ...(categoryId && { categoryId }),
      ...(priority && { priority }),
    };

    const [requests, total] = await prisma.$transaction([
      prisma.prayer_requests.findMany({
        where,
        include: {
          contact: {
            select: {
              id: true,
              fullName: true,
              phone: true,
              email: true,
              preferredContact: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              icon: true,
              color: true,
            },
          },
          approval: {
            include: {
              approver: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.prayer_requests.count({ where }),
    ]);

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching prayer requests:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST /api/prayer-requests - Create new prayer request (public form submission)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = createPrayerRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Datos de solicitud inválidos', details: validation.error.flatten() }, { status: 400 });
    }

    const { 
      fullName, 
      phone, 
      email, 
      categoryId, 
      message,
      preferredContact,
      isAnonymous,
      priority,
      churchId,
      formId,
      qrCodeId
    } = validation.data;

    // Verify church and category in a single transaction to be more efficient
    const [church, category] = await prisma.$transaction([
      prisma.churches.findFirst({
        where: { id: churchId, isActive: true }
      }),
      prisma.prayer_categories.findFirst({
        where: { id: categoryId, churchId: churchId, isActive: true }
      })
    ]);

    if (!church) {
      return NextResponse.json({ error: 'Iglesia no encontrada o inactiva' }, { status: 404 });
    }

    if (!category) {
      return NextResponse.json({ error: 'Categoría no encontrada o inactiva para esta iglesia' }, { status: 404 });
    }

    // Upsert contact: find existing or create a new one
    const contact = await prisma.prayerContact.upsert({
      where: {
        churchId_phone_email: {
          churchId,
          phone: phone || '',
          email: email?.toLowerCase() || ''
        }
      },
      update: {
        fullName: fullName.trim(),
        preferredContact,
      },
      create: {
        id: randomUUID(),
        fullName: fullName.trim(),
        phone: phone?.trim(),
        email: email?.trim().toLowerCase(),
        preferredContact,
        churchId,
        source: formId ? 'prayer_form' : (qrCodeId ? 'qr_code' : 'direct'),
      }
    });

    // Create prayer request
    const prayer_requests = await prisma.prayer_requests.create({
      data: {
        id: randomUUID(),
        contactId: contact.id,
        churchId,
        categoryId,
        message,
        isAnonymous,
        priority,
        status: 'pending', // Default status
        source: formId ? 'prayer_form' : (qrCodeId ? 'qr_code' : 'direct'),
        formId,
        qrCodeId,
      },
      include: {
        contact: true,
        category: true,
      }
    });

    // TRIGGER AUTOMATION: Process through automation rules
    try {
      const { PrayerAutomation } = await import('@/lib/services/prayer-automation');
      await PrayerAutomation.processPrayerRequest(prayer_requests.id);
      console.log(`[Prayer Request API] Automation triggered for prayer request: ${prayer_requests.id}`);
    } catch (automationError) {
      // Don't fail the request if automation fails, just log it
      console.error('[Prayer Request API] Automation trigger failed:', automationError);
    }

    return NextResponse.json(prayer_requests, { status: 201 });

  } catch (error) {
    console.error('Error creating prayer request:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
