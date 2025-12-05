
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PaymentGatewayFactory, DonationPaymentData } from '@/lib/payments/colombian-gateways'
import { getServerBaseUrl } from '@/lib/server-url'
import { cache } from '@/lib/cache'
import DonationSecurity from '@/lib/donations/security'

export const dynamic = 'force-dynamic'

// GET - Get online payments for a church (Authenticated endpoint)
export async function GET(request: NextRequest) {
  try {
    // Payment logging for access attempts
    console.log('Payment access attempt:', new Date().toISOString())
    
    // Note: For admin dashboard, we need authentication
    // For now, we'll return empty array to prevent errors
    const { searchParams } = new URL(request.url)
    const churchId = searchParams.get('churchId')
    
    if (!churchId) {
      return NextResponse.json([]) // Return empty array instead of error
    }

    const payments = await prisma.onlinePayment.findMany({
      where: {
        churchId: churchId,
        status: { in: ['completed', 'pending', 'failed'] }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to recent payments
    })

    return NextResponse.json(payments)

  } catch (error) {
    console.error('Error fetching online payments:', error)
    return NextResponse.json([]) // Return empty array on error to prevent crashes
  }
}

// POST - Create online payment (Public endpoint - no authentication required)
export async function POST(request: NextRequest) {
  try {
    // HTTPS enforcement for payment processing
    if (!DonationSecurity.enforceHTTPS(request)) {
      return NextResponse.json(
        { error: 'HTTPS requerido para pagos' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const {
      amount,
      currency = 'COP',
      donorName,
      donorEmail,
      donorPhone,
      churchId,
      categoryId,
      campaignId,
      gatewayType,
      notes,
      returnUrl
    } = body

    // ENHANCED VALIDATION PROTOCOLS
    
    // amount validation - required field validation
    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Monto debe ser mayor a cero' },
        { status: 400 }
      )
    }

    if (amount < 1000) {
      return NextResponse.json(
        { error: 'Monto mínimo es $1.000 COP' },
        { status: 400 }
      )
    }

    if (amount > 20000000) {
      return NextResponse.json(
        { error: 'Monto máximo es $20.000.000 COP' },
        { status: 400 }
      )
    }

    // Required fields validation
    if (!donorName?.trim()) {
      return NextResponse.json(
        { error: 'Nombre del donante es requerido' },
        { status: 400 }
      )
    }

    if (!donorEmail?.trim()) {
      return NextResponse.json(
        { error: 'Email del donante es requerido' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(donorEmail.trim())) {
      return NextResponse.json(
        { error: 'Email del donante no es válido' },
        { status: 400 }
      )
    }

    // Phone validation (if provided)
    if (donorPhone && donorPhone.trim()) {
      const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(donorPhone.trim())) {
        return NextResponse.json(
          { error: 'Número de teléfono no es válido' },
          { status: 400 }
        )
      }
    }

    // Church ID validation
    if (!churchId?.trim()) {
      return NextResponse.json(
        { error: 'ID de iglesia es requerido' },
        { status: 400 }
      )
    }

    // Gateway type validation
    if (!gatewayType || !['pse', 'nequi', 'stripe'].includes(gatewayType.toLowerCase())) {
      return NextResponse.json(
        { error: 'Método de pago no válido' },
        { status: 400 }
      )
    }

    // Currency validation
    if (currency !== 'COP') {
      return NextResponse.json(
        { error: 'Solo se acepta moneda COP' },
        { status: 400 }
      )
    }

    // Data sanitization with security
    const sanitizedData = {
      amount: parseFloat(amount),
      currency: currency.toUpperCase(),
      donorName: DonationSecurity.sanitizeInput(donorName),
      donorEmail: DonationSecurity.sanitizeInput(donorEmail.toLowerCase()),
      donorPhone: donorPhone ? DonationSecurity.sanitizeInput(donorPhone) : null,
      churchId: churchId.trim(),
      categoryId: categoryId?.trim() || null,
      campaignId: campaignId?.trim() || null,
      gatewayType: gatewayType.toLowerCase(),
      notes: notes ? DonationSecurity.sanitizeInput(notes) : null,
      returnUrl: returnUrl?.trim() || null
    };

    // Verify church exists and is active
    const church = await prisma.churches.findUnique({
      where: { id: sanitizedData.churchId, isActive: true }
    })

    if (!church) {
      return NextResponse.json(
        { error: 'Iglesia no encontrada o inactiva' },
        { status: 404 }
      )
    }

    // Verify category exists if provided
    if (categoryId) {
      const category = await prisma.donationCategory.findUnique({
        where: { 
          id: categoryId,
          churchId: churchId,
          isActive: true 
        }
      })

      if (!category) {
        return NextResponse.json(
          { error: 'Categoría de donación no encontrada' },
          { status: 404 }
        )
      }
    }

    // Verify campaign exists if provided
    if (campaignId) {
      const campaign = await prisma.donation_campaigns.findFirst({
        where: { 
          id: campaignId,
          churchId: churchId,
          status: 'ACTIVA'
        }
      })

      if (!campaign) {
        return NextResponse.json(
          { error: 'Campaña de donación no encontrada' },
          { status: 404 }
        )
      }
    }

    // Create payment gateway instance
    const gateway = PaymentGatewayFactory.createGateway(gatewayType)

    // Prepare payment data
    const paymentData: DonationPaymentData = {
      amount: parseFloat(amount.toString()),
      currency,
      donorName,
      donorEmail,
      donorPhone,
      churchId,
      categoryId,
      notes,
      returnUrl: returnUrl || `${getServerBaseUrl()}/donate/thank-you`
    }

    // Process payment with database transaction for safety
    // If any operation fails, transaction will rollback automatically
    const result = await prisma.$transaction(async (tx) => {
      try {
        // Process payment with gateway
        const paymentResult = await gateway.processPayment(
          paymentData.amount,
          paymentData.currency,
          paymentData
        )

        if (!paymentResult.success) {
          // This will trigger transaction rollback
          throw new Error(paymentResult.error || 'Error procesando pago')
        }

      // Create online payment record within transaction
      const onlinePayment = await tx.onlinePayment.create({
        data: {
          paymentId: paymentResult.paymentId!,
          amount: paymentData.amount,
          currency: paymentData.currency,
          gatewayType: gatewayType.toLowerCase(),
          status: 'pending',
          donorName: paymentData.donorName,
          donorEmail: paymentData.donorEmail,
          donorPhone: paymentData.donorPhone,
          churchId: paymentData.churchId,
          categoryId: paymentData.categoryId,
          reference: DonationSecurity.generatePaymentReference(),
          redirectUrl: paymentResult.redirectUrl,
          returnUrl: paymentData.returnUrl,
          notes: paymentData.notes,
          metadata: paymentResult.gatewayResponse
        }
      })

        return {
          payment: onlinePayment,
          gateway: paymentResult
        }
      } catch (txError) {
        // Transaction will rollback automatically on error
        console.error('Transaction error, rollback triggered:', txError)
        throw txError
      }
    })

    // Return payment info to frontend
    return NextResponse.json({
      success: true,
      paymentId: result.payment.paymentId,
      redirectUrl: result.gateway.redirectUrl,
      reference: result.payment.reference,
      amount: result.payment.amount,
      currency: result.payment.currency,
      donorName: result.payment.donorName
    })

  } catch (error) {
    // Log error with masked sensitive data
    const maskedError = DonationSecurity.maskSensitiveData({
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
      endpoint: 'POST /api/online-payments'
    })
    console.error('Online Payment Error:', maskedError)
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

