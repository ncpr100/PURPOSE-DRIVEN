import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyTOTP } from '@/lib/mfa';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    const userId = session.user.id;
    const { code } = await request.json();
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Código TOTP requerido (6 dígitos)' },
        { status: 400 }
      );
    }
    // Obtener configuración MFA
    const mfaSettings = await db.user_mfa_settings.findUnique({
      where: { userId },
    });
    if (!mfaSettings || !mfaSettings.totpSecret) {
      return NextResponse.json(
        { error: 'Configuración 2FA no encontrada. Inicia el setup primero.' },
        { status: 400 }
      );
    }
    if (mfaSettings.isEnabled) {
      return NextResponse.json(
        { error: '2FA ya está activo' },
        { status: 400 }
      );
    }
    // Verificar código TOTP
    const isValid = verifyTOTP(mfaSettings.totpSecret, code.trim());
    if (!isValid) {
      // Incrementar intentos fallidos
      await db.user_mfa_settings.update({
        where: { userId },
        data: { failedAttempts: { increment: 1 } },
      });
      return NextResponse.json(
        { error: 'Código TOTP inválido. Intenta de nuevo.' },
        { status: 400 }
      );
    }
    // Activar 2FA
    await db.user_mfa_settings.update({
      where: { userId },
      data: {
        isEnabled: true,
        failedAttempts: 0,
        lastUsedAt: new Date(),
      },
    });
    console.log(`[MFA] 2FA activado para usuario: ${userId}`);
    return NextResponse.json({
      success: true,
      message: '2FA activado correctamente',
    });
  } catch (error) {
    console.error('[MFA Verify] Error:', error);
    return NextResponse.json(
      { error: 'Error verificando código' },
      { status: 500 }
    );
  }
}
