import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.church?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get Stripe configuration for the church
    const config = await prisma.paymentGatewayConfig.findFirst({
      where: {
        churchId: session.user.church.id,
        provider: 'STRIPE'
      }
    });

    if (!config) {
      return NextResponse.json({
        provider: 'STRIPE',
        enabled: false,
        config: {}
      });
    }

    // Don't expose sensitive data
    const sanitizedConfig = {
      provider: config.provider,
      enabled: config.isActive,
      config: {
        publicKey: config.config ? (config.config as any).publicKey : '',
        webhookEndpoint: '/api/webhooks/stripe'
      }
    };

    return NextResponse.json(sanitizedConfig);
  } catch (error) {
    console.error('Error fetching Stripe config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.church?.id || session.user.role === 'MEMBER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { config: stripeConfig } = body;

    if (!stripeConfig.publicKey || !stripeConfig.secretKey) {
      return NextResponse.json(
        { error: 'Public key and secret key are required' },
        { status: 400 }
      );
    }

    // Upsert payment gateway configuration
    const config = await prisma.paymentGatewayConfig.upsert({
      where: {
        churchId_provider: {
          churchId: session.user.church.id,
          provider: 'STRIPE'
        }
      },
      update: {
        config: stripeConfig,
        isActive: stripeConfig.enabled ?? true,
        updatedAt: new Date()
      },
      create: {
        churchId: session.user.church.id,
        provider: 'STRIPE',
        config: stripeConfig,
        isActive: stripeConfig.enabled ?? true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Stripe configuration saved successfully'
    });
  } catch (error) {
    console.error('Error saving Stripe config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}