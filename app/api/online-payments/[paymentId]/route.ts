import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import DonationSecurity from '@/lib/donations/security'

export const dynamic = 'force-dynamic'

// PATCH - Update payment status (Protected endpoint)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    const { paymentId } = params
    const body = await request.json()
    const { status, metadata } = body

    // Find existing payment
    const existingPayment = await prisma.online_payments.findUnique({
      where: { paymentId }
    })

    if (!existingPayment) {
      return NextResponse.json(
        { error: 'Pago no encontrado' },
        { status: 404 }
      )
    }

    // Validate status transition
    if (!DonationSecurity.isValidStatusTransition(existingPayment.status, status)) {
      return NextResponse.json(
        { error: 'Transición de estado no válida' },
        { status: 400 }
      )
    }

    // Update payment status with transaction
    const updatedPayment = await prisma.$transaction(async (tx) => {
      const payment = await tx.onlinePayment.update({
        where: { paymentId },
        data: {
          status,
          metadata: metadata || existingPayment.metadata,
          updatedAt: new Date()
        }
      })

      // If payment completed, create donation record
      if (status === 'completed' && existingPayment.status !== 'completed') {
        // Find or create ONLINE payment method
        let onlinePaymentMethod = await tx.paymentMethod.findFirst({
          where: {
            churchId: payment.churchId,
            name: 'ONLINE'
          }
        })

        if (!onlinePaymentMethod) {
          onlinePaymentMethod = await tx.paymentMethod.create({
            data: {
              name: 'ONLINE',
              description: 'Pagos en línea',
              isDigital: true,
              isActive: true,
              churchId: payment.churchId
            }
          })
        }

        // Find or create default donation category if not provided
        let categoryId = payment.categoryId
        if (!categoryId) {
          let defaultCategory = await tx.donationCategory.findFirst({
            where: {
              churchId: payment.churchId,
              name: 'General'
            }
          })

          if (!defaultCategory) {
            defaultCategory = await tx.donationCategory.create({
              data: {
                name: 'General',
                description: 'Donaciones generales',
                isActive: true,
                churchId: payment.churchId
              }
            })
          }
          categoryId = defaultCategory.id
        }

        await tx.donation.create({
          data: {
            amount: payment.amount,
            currency: payment.currency,
            donorName: payment.donorName,
            donorEmail: payment.donorEmail,
            donorPhone: payment.donorPhone,
            churchId: payment.churchId,
            categoryId: categoryId,
            paymentMethodId: onlinePaymentMethod.id,
            notes: `Donación online - ${payment.gatewayType.toUpperCase()} - ID: ${payment.paymentId}`,
            reference: payment.reference
          }
        })
      }

      return payment
    })

    // Log status change with masked data
    const maskedLog = DonationSecurity.maskSensitiveData({
      paymentId: updatedPayment.paymentId,
      oldStatus: existingPayment.status,
      newStatus: status,
      timestamp: new Date().toISOString()
    })
    console.log('Payment status updated:', maskedLog)

    return NextResponse.json({
      success: true,
      paymentId: updatedPayment.paymentId,
      status: updatedPayment.status,
      updatedAt: updatedPayment.updatedAt
    })

  } catch (error) {
    const maskedError = DonationSecurity.maskSensitiveData({
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
      endpoint: 'PATCH /api/online-payments/[paymentId]'
    })
    console.error('Payment status update error:', maskedError)
    
    return NextResponse.json(
      { error: 'Error actualizando estado del pago' },
      { status: 500 }
    )
  }
}