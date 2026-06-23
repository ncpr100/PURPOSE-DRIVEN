import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'
import { communicationService } from '@/lib/integrations/communication'
import { resendService } from '@/lib/integrations/resend'
import { twilioService } from '@/lib/integrations/twilio'
import { whatsappBusinessService } from '@/lib/integrations/whatsapp'

// Marking the route as dynamic
export const dynamic = 'force-dynamic';
// GET - Get integration status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      console.error('Integration status: No session or email found');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    // Get full user data to check role
    const sessionUser = await prisma.users.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true, churchId: true }
    });
    
    if (!sessionUser) {
      console.error('Integration status: User not found in database');
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 });
    }
    
    // Only admins can view integration status
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA'].includes(sessionUser.role)) {
      return NextResponse.json({ error: 'Sin permisos para ver integraciones' }, { status: 403 });
    }
    
    const status = {
      communication: communicationService.getStatus(),
      services: {
        resend: resendService.getStatus(),
        twilio: twilioService.getStatus(),
        whatsapp: whatsappBusinessService.getStatus()
      },
      environment: {
        resend_configured: !!(process.env.RESEND_API_KEY && process.env.RESEND_DOMAIN),
        twilio_configured: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
        whatsapp_configured: !!(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID),
        providers_enabled: {
          resend: process.env.ENABLE_RESEND === 'true',
          twilio: process.env.ENABLE_TWILIO_SMS === 'true',
          whatsapp: process.env.ENABLE_WHATSAPP === 'true'
        }
      }
    };
    
    return NextResponse.json(status);
  } catch (error) {
    console.error('Error fetching integration status:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
