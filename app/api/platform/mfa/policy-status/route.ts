import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    // Obtener política MFA
    const policy = await db.mfa_policy_settings.findFirst();
    if (!policy?.isEnabled) {
      return NextResponse.json({
        isEnabled: false,
        userHasMFA: false,
        hoursRemaining: null,
        isExpired: false,
      });
    }
    // Verificar si el rol del usuario requiere MFA
    const userRole = session.user.role;
    if (!policy.requiredRoles.includes(userRole)) {
      return NextResponse.json({
        isEnabled: false,
        userHasMFA: false,
        hoursRemaining: null,
        isExpired: false,
      });
    }
    // Verificar si el usuario tiene MFA activo
    const mfaSettings = await db.user_mfa_settings.findUnique({
      where: { userId: session.user.id },
      select: { isEnabled: true },
    });
    const userHasMFA = mfaSettings?.isEnabled || false;
    if (userHasMFA || !policy.enforcedAt) {
      return NextResponse.json({
        isEnabled: true,
        userHasMFA,
        hoursRemaining: null,
        isExpired: false,
        gracePeriodHours: policy.gracePeriodHours,
      });
    }
    // Calcular tiempo restante del período de gracia
    const enforcedDate = new Date(policy.enforcedAt);
    const deadline = new Date(enforcedDate.getTime() + policy.gracePeriodHours * 60 * 60 * 1000);
    const now = new Date();
    const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    const isExpired = hoursRemaining <= 0;
    return NextResponse.json({
      isEnabled: true,
      userHasMFA,
      hoursRemaining: Math.max(0, hoursRemaining),
      isExpired,
      gracePeriodHours: policy.gracePeriodHours,
      deadline: deadline.toISOString(),
    });
  } catch (error) {
    console.error('[MFA Policy Status] Error:', error);
    return NextResponse.json(
      { error: 'Error verificando política MFA' },
      { status: 500 }
    );
  }
}
