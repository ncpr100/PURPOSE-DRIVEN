import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { verifyTOTP } from "@/lib/mfa/totp";
import { generateBackupCodes } from "@/lib/mfa/backup-codes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  console.log("🔵 [API VERIFY] 1. Solicitud recibida");

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.log("🔴 [API VERIFY] No autenticado");
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    console.log("🔵 [API VERIFY] 2. Usuario:", session.user.email);

    // VALIDACIÓN ROBUSTA DEL BODY
    let totpCode: string | undefined;
    try {
      const body = await request.json();
      totpCode = body.totpCode;
      console.log("🔵 [API VERIFY] 3. Código recibido:", totpCode);
    } catch (parseError) {
      console.error("🔴 [API VERIFY] Error parseando JSON:", parseError);
      return NextResponse.json(
        {
          error:
            "Body de solicitud inválido. Se espera JSON con { totpCode: string }",
        },
        { status: 400 },
      );
    }

    if (!totpCode || totpCode.length !== 6) {
      return NextResponse.json(
        { error: "El código debe tener 6 dígitos" },
        { status: 400 },
      );
    }

    // 1. Obtener configuración MFA del usuario
    const mfaSettings = await db.user_mfa_settings.findUnique({
      where: { userId: session.user.id },
    });

    if (!mfaSettings || !mfaSettings.totpSecret) {
      console.log(
        "🔴 [API VERIFY] No hay configuración MFA o falta totpSecret",
      );
      return NextResponse.json(
        { error: "2FA no está configurado. Inicia el setup primero." },
        { status: 400 },
      );
    }

    console.log(
      "🔵 [API VERIFY] 4. Configuración encontrada. isEnabled:",
      mfaSettings.isEnabled,
    );

    // 2. Verificar si está bloqueado por intentos fallidos
    if (mfaSettings.lockedUntil && mfaSettings.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil(
        (mfaSettings.lockedUntil.getTime() - Date.now()) / 60000,
      );
      console.log(
        `🔴 [API VERIFY] Cuenta bloqueada. Minutos restantes: ${minutesLeft}`,
      );
      return NextResponse.json(
        {
          error: `Demasiados intentos fallidos. Intenta de nuevo en ${minutesLeft} minutos.`,
        },
        { status: 429 },
      );
    }

    // 3. Verificar el código TOTP
    console.log("🔵 [API VERIFY] 5. Verificando código TOTP...");
    const isValid = verifyTOTP(totpCode, mfaSettings.totpSecret);

    if (!isValid) {
      console.log("🔴 [API VERIFY] 6. Código TOTP inválido");
      const newFailedAttempts = (mfaSettings.failedAttempts || 0) + 1;
      const updateData: any = { failedAttempts: newFailedAttempts };

      if (newFailedAttempts >= 5) {
        updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
        console.log("🔴 [API VERIFY] Cuenta bloqueada por 15 minutos");
      }

      await db.user_mfa_settings.update({
        where: { userId: session.user.id },
        data: updateData,
      });

      return NextResponse.json(
        {
          error: `Código inválido. Intentos restantes: ${Math.max(0, 5 - newFailedAttempts)}`,
        },
        { status: 400 },
      );
    }

    console.log("🟢 [API VERIFY] 7. Código TOTP válido. Activando 2FA...");

    // 4. ÉXITO: Activar 2FA
    await db.user_mfa_settings.update({
      where: { userId: session.user.id },
      data: {
        isEnabled: true,
        failedAttempts: 0,
        lockedUntil: null,
        lastUsedAt: new Date(),
      },
    });

    // 5. Generar códigos de respaldo si no existen
    let backupCodes: string[] = [];
    if (!mfaSettings.backupCodes || mfaSettings.backupCodes.length === 0) {
      console.log("🟢 [API VERIFY] 8. Generando códigos de respaldo...");
      const { codes, hashedCodes } = await generateBackupCodes();
      backupCodes = codes;

      await db.user_mfa_settings.update({
        where: { userId: session.user.id },
        data: { backupCodes: hashedCodes },
      });
      console.log("🟢 [API VERIFY] 9. Códigos de respaldo generados");
    } else {
      console.log("🟢 [API VERIFY] 8. Códigos de respaldo ya existen");
    }

    console.log("🟢 [API VERIFY] 10. 2FA activado exitosamente");
    return NextResponse.json({
      success: true,
      message: "2FA verificado y activado correctamente",
      backupCodes: backupCodes,
    });
  } catch (error: any) {
    console.error("🔴 [API VERIFY] ERROR CRÍTICO:", error.message);
    console.error("🔴 [API VERIFY] Stack:", error.stack);
    return NextResponse.json(
      { error: "Error interno del servidor: " + error.message },
      { status: 500 },
    );
  }
}
