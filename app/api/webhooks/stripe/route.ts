import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = headers();
    const sig = headersList.get('stripe-signature');

    if (!sig) {
      console.error('Missing Stripe signature');
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Find the online payment record
    const onlinePayment = await prisma.onlinePayment.findFirst({
      where: { stripePaymentIntentId: paymentIntent.id }
    });

    if (!onlinePayment) {
      console.error('Online payment not found for PaymentIntent:', paymentIntent.id);
      return;
    }

    // Update payment status
    await prisma.onlinePayment.update({
      where: { id: onlinePayment.id },
      data: {
        status: 'completed',
        completedAt: new Date(),
        metadata: {
          ...(onlinePayment.metadata as any),
          stripePaymentIntent: paymentIntent
        }
      }
    });

    // Create donation record if not exists
    let donation = await prisma.donation.findFirst({
      where: { onlinePaymentId: onlinePayment.id }
    });

    if (!donation) {
      // Get payment method for Stripe
      let paymentMethod = await prisma.paymentMethod.findFirst({
        where: {
          churchId: onlinePayment.churchId,
          name: 'Stripe',
          isDigital: true
        }
      });

      // Create default Stripe payment method if it doesn't exist
      if (!paymentMethod) {
        paymentMethod = await prisma.paymentMethod.create({
          data: {
            churchId: onlinePayment.churchId,
            name: 'Stripe',
            description: 'Pagos online via Stripe',
            isDigital: true,
            isActive: true
          }
        });
      }

      donation = await prisma.donation.create({
        data: {
          churchId: onlinePayment.churchId,
          amount: onlinePayment.amount,
          currency: onlinePayment.currency,
          donorName: onlinePayment.donorName,
          donorEmail: onlinePayment.donorEmail,
          donorPhone: onlinePayment.donorPhone,
          categoryId: onlinePayment.categoryId,
          paymentMethodId: paymentMethod.id,
          reference: paymentIntent.id,
          notes: `Donación online procesada via Stripe - ${paymentIntent.id}`,
          donationDate: new Date(),
          onlinePaymentId: onlinePayment.id,
          isAnonymous: false
        }
      });
    }

    console.log('Payment processed successfully:', {
      paymentIntentId: paymentIntent.id,
      onlinePaymentId: onlinePayment.id,
      donationId: donation.id,
      amount: paymentIntent.amount / 100
    });

  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    const onlinePayment = await prisma.onlinePayment.findFirst({
      where: { stripePaymentIntentId: paymentIntent.id }
    });

    if (onlinePayment) {
      await prisma.onlinePayment.update({
        where: { id: onlinePayment.id },
        data: {
          status: 'failed',
          metadata: {
            ...(onlinePayment.metadata as any),
            failureReason: paymentIntent.last_payment_error?.message || 'Payment failed',
            stripePaymentIntent: paymentIntent
          }
        }
      });
    }

    console.log('Payment failed:', {
      paymentIntentId: paymentIntent.id,
      reason: paymentIntent.last_payment_error?.message
    });

  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    // Handle successful checkout session
    console.log('Checkout session completed:', session.id);
    
    // Find and update online payment
    const onlinePayment = await prisma.onlinePayment.findFirst({
      where: { stripeSessionId: session.id }
    });

    if (onlinePayment) {
      await prisma.onlinePayment.update({
        where: { id: onlinePayment.id },
        data: {
          status: 'completed',
          completedAt: new Date(),
          metadata: {
            ...(onlinePayment.metadata as any),
            stripeSession: session
          }
        }
      });
    }

  } catch (error) {
    console.error('Error handling checkout completed:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    // Handle recurring donation invoice payment
    console.log('Invoice payment succeeded:', invoice.id);
    
    // TODO: Handle recurring donations when implemented
    
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
}