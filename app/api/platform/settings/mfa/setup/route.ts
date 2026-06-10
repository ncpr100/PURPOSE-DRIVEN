import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateTOTPSecret, generateBackupCodes } from '@/lib/mfa';
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
    // Verificar si ya tiene 2FA activo
    const existing = await db.user_mfa_settings.findUnique({
      where: { userId },
    });
    if (existing?.isEnabled) {
      return NextResponse.json(
        { error: '2FA ya está activo. Desactívalo primero si quieres regenerar.' },
        { status: 400 }
      );
    }
    // Obtener email del usuario para el QR
    const user = await db.users.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    // Generar TOTP secret + QR + backup codes
    const totpData = generateTOTPSecret(user.email);
    const backupData = await generateBackupCodes();
    // Guardar/actualizar en DB (aún NO activado - isEnabled=false)
    await db.user_mfa_settings.upsert({
      where: { userId },
      update: {
        totpSecret: totpData.encryptedSecret,
        backupCodes: backupData.hashedCodes,
        isEnabled: false, // Se activará cuando el usuario verifique el código
        failedAttempts: 0,
        lockedUntil: null,
      },
      create: {
        userId,
        totpSecret: totpData.encryptedSecret,
        backupCodes: backupData.hashedCodes,
        isEnabled: false,
        failedAttempts: 0,
      },
    });
    console.log(`[MFA] Setup iniciado para usuario: ${userId}`);
    return NextResponse.json({
      success: true,
      qrCodeUrl: totpData.qrCodeUrl,
      otpauthUrl: totpData.otpauthUrl,
      secret: totpData.secret, // Solo para display, no guardar en cliente
      backupCodes: backupData.codes, // Códigos en claro (solo se muestran UNA vez)
    });
  } catch (error) {
    console.error('[MFA Setup] Error:', error);
    return NextResponse.json(
      { error: 'Error iniciando configuración 2FA' },
      { status: 500 }
    );
  }
}
