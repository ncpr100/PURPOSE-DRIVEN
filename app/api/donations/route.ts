

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { nanoid } from 'nanoid'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db';
import DonationSecurity from '@/lib/donations/security'

export const dynamic = 'force-dynamic'

// GET all donations for a church
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.churchId) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Sin permisos' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const paymentMethodId = searchParams.get('paymentMethodId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const whereClause: any = {
      churchId: session.user.churchId
    }

    if (categoryId) whereClause.categoryId = categoryId
    if (paymentMethodId) whereClause.paymentMethodId = paymentMethodId
    if (status) whereClause.status = status
    if (startDate || endDate) {
      whereClause.donationDate = {}
      if (startDate) whereClause.donationDate.gte = new Date(startDate)
      if (endDate) whereClause.donationDate.lte = new Date(endDate)
    }

    const [donations, total] = await Promise.all([
      db.donations.findMany({
        where: whereClause,
        include: {
          donation_categories: true,
          payment_methods: true,
          members: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: {
          donationDate: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.donations.count({ where: whereClause })
    ])

    return NextResponse.json({
      donations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching donations:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// CREATE a new donation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.churchId) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Sin permisos' }, { status: 403 })
    }

    const {
      amount,
      currency = 'COP',
      donorName,
      donorEmail,
      donorPhone,
      memberId,
      categoryId,
      paymentMethodId,
      reference,
      notes,
      isAnonymous = false,
      donationDate
    } = await request.json()

    // ENHANCED VALIDATION
    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { message: 'El monto debe ser mayor a cero' },
        { status: 400 }
      )
    }

    if (amount < 1) {
      return NextResponse.json(
        { message: 'El monto mínimo es $1' },
        { status: 400 }
      )
    }

    if (amount > 20000000) {
      return NextResponse.json(
        { message: 'El monto máximo es $20.000.000' },
        { status: 400 }
      )
    }

    if (!categoryId || !paymentMethodId) {
      return NextResponse.json(
        { message: 'Categoría y método de pago son requeridos' },
        { status: 400 }
      )
    }

    // Email validation (if provided)
    if (donorEmail && donorEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(donorEmail.trim())) {
        return NextResponse.json(
          { message: 'Email no es válido' },
          { status: 400 }
        )
      }
    }

    // Phone validation (if provided)
    if (donorPhone && donorPhone.trim()) {
      const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(donorPhone.trim())) {
        return NextResponse.json(
          { message: 'Número de teléfono no es válido' },
          { status: 400 }
        )
      }
    }

    // Verificar que la categoría y método de pago pertenezcan a la iglesia
    const [category, paymentMethod] = await Promise.all([
      db.donation_categories.findFirst({
        where: { id: categoryId, churchId: session.user.churchId, isActive: true }
      }),
      db.payment_methods.findFirst({
        where: { id: paymentMethodId, churchId: session.user.churchId, isActive: true }
      })
    ])

    if (!category || !paymentMethod) {
      return NextResponse.json(
        { message: 'Categoría o método de pago inválido' },
        { status: 400 }
      )
    }

    // DATABASE TRANSACTION for data integrity
    // Use database transaction to ensure atomicity
    const donation = await db.$transaction(async (tx) => {
      // Create the donation within transaction
      const newDonation = await tx.donations.create({
        data: {
          id: nanoid(),
          amount: parseFloat(amount),
          currency,
          donorName: isAnonymous ? null : (donorName ? DonationSecurity.sanitizeInput(donorName) : null),
          donorEmail: isAnonymous ? null : (donorEmail ? DonationSecurity.sanitizeInput(donorEmail.toLowerCase()) : null),
          donorPhone: isAnonymous ? null : (donorPhone ? DonationSecurity.sanitizeInput(donorPhone) : null),
          memberId: isAnonymous || !memberId ? null : undefined,
          members: isAnonymous || !memberId ? undefined : {
            connect: { id: memberId }
          },
          categoryId,
          paymentMethodId,
          reference: reference ? DonationSecurity.sanitizeInput(reference) : DonationSecurity.generatePaymentReference(),
          notes: notes ? DonationSecurity.sanitizeInput(notes) : null,
          isAnonymous,
          donationDate: donationDate ? new Date(donationDate) : new Date(),
          churches: {
            connect: { id: session.user.churchId! }
          },
          status: 'COMPLETADA', // Status tracking for donations
          updatedAt: new Date()
        },
        include: {
          donation_categories: true,
          payment_methods: true,
          members: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      return newDonation;
    });

    // Trigger automation for donation received
    try {
      const { AutomationTriggers } = await import('@/lib/automation-engine')
      await AutomationTriggers.donationReceived({
        id: donation.id,
        amount: donation.amount,
        currency: donation.currency,
        donorName: donation.donorName,
        donorEmail: donation.donorEmail,
        categoryName: donation.donation_categories?.name,
        paymentMethod: donation.payment_methods?.name,
        donationDate: donation.donationDate,
        isAnonymous: donation.isAnonymous
      }, session.user.churchId!)
      
      // Payment logging for successful donation
      console.log(`Payment processed: ${donation.amount} ${donation.currency}`)
    } catch (automationError) {
      console.error('Automation trigger failed:', automationError)
      // Don't fail the donation creation if automation fails
    }

    return NextResponse.json(donation, { status: 201 })

  } catch (error) {
    console.error('Error creating donation:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

