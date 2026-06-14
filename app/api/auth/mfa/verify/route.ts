import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyTOTP, verifyBackupCode, markBackupCodeAsUsed } from '@/lib/mfa';
import { decrypt } from '@/lib/mfa/encryption';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutos
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    const userId = session.user.id;
    const { code, type } = await request.json();
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'CÃ³digo requerido' },
        { status: 400 }
      );
    }
    if (!type || !['totp', 'backup'].includes(type)) {
      return NextResponse.json(
        { error: 'Tipo de cÃ³digo invÃ¡lido (totp o backup)' },
        { status: 400 }
      );
    }
    // Obtener configuraciÃ³n MFA
    const mfaSettings = await db.user_mfa_settings.findUnique({
      where: { userId },
    });
    if (!mfaSettings || !mfaSettings.isEnabled) {
      return NextResponse.json(
        { error: '2FA no estÃ¡ activo para este usuario' },
        { status: 400 }
      );
    }
    // Verificar lockout
    if (mfaSettings.lockedUntil && new Date() < mfaSettings.lockedUntil) {
      const remainingMs = mfaSettings.lockedUntil.getTime() - Date.now();
      const remainingMin = Math.ceil(remainingMs / 60000);
      return NextResponse.json(
        { error: `Cuenta bloqueada. Intenta de nuevo en ${remainingMin} minutos.` },
        { status: 429 }
      );
    }
    let isValid = false;
    let backupIndex = -1;
    if (type === 'totp') {
      // Verificar cÃ³digo TOTP
      const decryptedSecret = decrypt(mfaSettings.totpSecret!);
      isValid = verifyTOTP(decryptedSecret, code.trim());
    } else if (type === 'backup') {
      // Verificar cÃ³digo de respaldo
      backupIndex = await verifyBackupCode(mfaSettings.backupCodes, code.trim());
      isValid = backupIndex !== -1;
    }
    if (!isValid) {
      // Incrementar intentos fallidos
      const failedAttempts = mfaSettings.failedAttempts + 1;
      const updateData: any = { failedAttempts };
      // Lockout si excede mÃ¡ximo
      if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
        updateData.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
        console.warn(`[MFA] Usuario ${userId} bloqueado por ${MAX_FAILED_ATTEMPTS} intentos fallidos`);
      }
      await db.user_mfa_settings.update({
        where: { userId },
        data: updateData,
      });
      const remaining = MAX_FAILED_ATTEMPTS - failedAttempts;
      return NextResponse.json(
        { 
          error: `CÃ³digo invÃ¡lido. ${remaining > 0 ? `${remaining} intentos restantes` : 'Cuenta bloqueada'}.`,
          remainingAttempts: Math.max(0, remaining),
        },
        { status: 400 }
      );
    }
    // Ã‰xito: resetear intentos y actualizar timestamp
    const updateData: any = {
      failedAttempts: 0,
      lockedUntil: null,
      lastUsedAt: new Date(),
    };
    // Si fue backup code, marcarlo como usado
    if (type === 'backup' && backupIndex !== -1) {
      updateData.backupCodes = markBackupCodeAsUsed(mfaSettings.backupCodes, backupIndex);
      console.log(`[MFA] Backup code usado por usuario: ${userId} (index: ${backupIndex})`);
    }
    await db.user_mfa_settings.update({
      where: { userId },
      data: updateData,
    });
    console.log(`[MFA] Login 2FA exitoso para usuario: ${userId} (type: ${type})`);
    // Establecer cookie de sesiÃ³n verificada
    const cookieStore = await cookies();
    cookieStore.set('mfa_verified', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 dÃ­as
    });
    return NextResponse.json({
      success: true,
      message: 'VerificaciÃ³n 2FA exitosa',
    });
  } catch (error) {
    console.error('[MFA Auth Verify] Error:', error);
    return NextResponse.json(
      { error: 'Error verificando 2FA' },
      { status: 500 }
    );
  }
}

