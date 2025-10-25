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
    const existingPayment = await prisma.onlinePayment.findUnique({
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
        await tx.donation.create({
          data: {
            amount: payment.amount,
            currency: payment.currency,
            donorName: payment.donorName,
            donorEmail: payment.donorEmail,
            donorPhone: payment.donorPhone,
            churchId: payment.churchId,
            categoryId: payment.categoryId,
            campaignId: payment.campaignId || null,
            paymentMethod: 'ONLINE',
            notes: `Donación online - ${payment.gatewayType.toUpperCase()}`,
            reference: payment.reference,
            metadata: {
              onlinePaymentId: payment.id,
              gatewayType: payment.gatewayType,
              paymentId: payment.paymentId
            }
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
      error: error.message,
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