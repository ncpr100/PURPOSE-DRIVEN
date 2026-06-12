import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// GET - Obtener política actual
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    let policy = await db.mfa_policy_settings.findFirst();
    if (!policy) {
      // Crear política por defecto
      policy = await db.mfa_policy_settings.create({
        data: {
          isEnabled: false,
          gracePeriodHours: 24,
          requiredRoles: ['ADMIN', 'SUPER_ADMIN'],
        },
      });
    }
    return NextResponse.json(policy);
  } catch (error) {
    console.error('[MFA Policy GET] Error:', error);
    return NextResponse.json({ error: 'Error obteniendo política' }, { status: 500 });
  }
}
// PUT - Actualizar política (Super_Admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    const { isEnabled, gracePeriodHours, requiredRoles } = await request.json();
    let policy = await db.mfa_policy_settings.findFirst();
    if (!policy) {
      policy = await db.mfa_policy_settings.create({
        data: {
          isEnabled: isEnabled || false,
          gracePeriodHours: gracePeriodHours || 24,
          requiredRoles: requiredRoles || ['ADMIN', 'SUPER_ADMIN'],
          enforcedAt: isEnabled ? new Date() : null,
        },
      });
    } else {
      // Si se está activando y no tenía enforcedAt, establecerlo ahora
      const wasDisabled = !policy.isEnabled;
      const willBeEnabled = isEnabled;
      policy = await db.mfa_policy_settings.update({
        where: { id: policy.id },
        data: {
          isEnabled: isEnabled ?? policy.isEnabled,
          gracePeriodHours: gracePeriodHours ?? policy.gracePeriodHours,
          requiredRoles: requiredRoles ?? policy.requiredRoles,
          enforcedAt: wasDisabled && willBeEnabled ? new Date() : policy.enforcedAt,
        },
      });
    }
    console.log(`[MFA Policy] Política actualizada por ${session.user.email}: isEnabled=${policy.isEnabled}`);
    return NextResponse.json(policy);
  } catch (error) {
    console.error('[MFA Policy PUT] Error:', error);
    return NextResponse.json({ error: 'Error actualizando política' }, { status: 500 });
  }
}
