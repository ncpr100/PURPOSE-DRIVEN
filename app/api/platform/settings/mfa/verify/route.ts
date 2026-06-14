import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { verifyTOTP } from "@/lib/mfa/totp";
import { decrypt } from "@/lib/mfa/encryption";
import { generateBackupCodes } from "@/lib/mfa/backup-codes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  console.log("ðŸ”µ [API VERIFY] 1. Solicitud recibida");

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.log("ðŸ”´ [API VERIFY] No autenticado");
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    console.log("ðŸ”µ [API VERIFY] 2. Usuario:", session.user.email);

    // VALIDACIÃ“N ROBUSTA DEL BODY
    let totpCode: string | undefined;
    try {
      const body = await request.json();
      totpCode = body.totpCode;
      console.log("ðŸ”µ [API VERIFY] 3. CÃ³digo recibido:", totpCode);
    } catch (parseError) {
      console.error("ðŸ”´ [API VERIFY] Error parseando JSON:", parseError);
      return NextResponse.json(
        {
          error:
            "Body de solicitud invÃ¡lido. Se espera JSON con { totpCode: string }",
        },
        { status: 400 },
      );
    }

    if (!totpCode || totpCode.length !== 6) {
      return NextResponse.json(
        { error: "El cÃ³digo debe tener 6 dÃ­gitos" },
        { status: 400 },
      );
    }

    // 1. Obtener configuraciÃ³n MFA del usuario
    const mfaSettings = await db.user_mfa_settings.findUnique({
      where: { userId: session.user.id },
    });

    if (!mfaSettings || !mfaSettings.totpSecret) {
      console.log(
        "ðŸ”´ [API VERIFY] No hay configuraciÃ³n MFA o falta totpSecret",
      );
      return NextResponse.json(
        { error: "2FA no estÃ¡ configurado. Inicia el setup primero." },
        { status: 400 },
      );
    }

    console.log(
      "ðŸ”µ [API VERIFY] 4. ConfiguraciÃ³n encontrada. isEnabled:",
      mfaSettings.isEnabled,
    );

    // 2. Verificar si estÃ¡ bloqueado por intentos fallidos
    if (mfaSettings.lockedUntil && mfaSettings.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil(
        (mfaSettings.lockedUntil.getTime() - Date.now()) / 60000,
      );
      console.log(
        `ðŸ”´ [API VERIFY] Cuenta bloqueada. Minutos restantes: ${minutesLeft}`,
      );
      return NextResponse.json(
        {
          error: `Demasiados intentos fallidos. Intenta de nuevo en ${minutesLeft} minutos.`,
        },
        { status: 429 },
      );
    }

    // 3. Verificar el cÃ³digo TOTP
    console.log("ðŸ”µ [API VERIFY] 5. Verificando cÃ³digo TOTP...");
    const decryptedSecret = decrypt(mfaSettings.totpSecret);
    const isValid = verifyTOTP(decryptedSecret, totpCode);

    if (!isValid) {
      console.log("ðŸ”´ [API VERIFY] 6. CÃ³digo TOTP invÃ¡lido");
      const newFailedAttempts = (mfaSettings.failedAttempts || 0) + 1;
      const updateData: any = { failedAttempts: newFailedAttempts };

      if (newFailedAttempts >= 5) {
        updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
        console.log("ðŸ”´ [API VERIFY] Cuenta bloqueada por 15 minutos");
      }

      await db.user_mfa_settings.update({
        where: { userId: session.user.id },
        data: updateData,
      });

      return NextResponse.json(
        {
          error: `CÃ³digo invÃ¡lido. Intentos restantes: ${Math.max(0, 5 - newFailedAttempts)}`,
        },
        { status: 400 },
      );
    }

    console.log("ðŸŸ¢ [API VERIFY] 7. CÃ³digo TOTP vÃ¡lido. Activando 2FA...");

    // 4. Ã‰XITO: Activar 2FA
    await db.user_mfa_settings.update({
      where: { userId: session.user.id },
      data: {
        isEnabled: true,
        failedAttempts: 0,
        lockedUntil: null,
        lastUsedAt: new Date(),
      },
    });

    // 5. Generar cÃ³digos de respaldo si no existen
    let backupCodes: string[] = [];
    if (!mfaSettings.backupCodes || mfaSettings.backupCodes.length === 0) {
      console.log("ðŸŸ¢ [API VERIFY] 8. Generando cÃ³digos de respaldo...");
      const { codes, hashedCodes } = await generateBackupCodes();
      backupCodes = codes;

      await db.user_mfa_settings.update({
        where: { userId: session.user.id },
        data: { backupCodes: hashedCodes },
      });
      console.log("ðŸŸ¢ [API VERIFY] 9. CÃ³digos de respaldo generados");
    } else {
      console.log("ðŸŸ¢ [API VERIFY] 8. CÃ³digos de respaldo ya existen");
    }

    console.log("ðŸŸ¢ [API VERIFY] 10. 2FA activado exitosamente");
    return NextResponse.json({
      success: true,
      message: "2FA verificado y activado correctamente",
      backupCodes: backupCodes,
    });
  } catch (error: any) {
    console.error("ðŸ”´ [API VERIFY] ERROR CRÃTICO:", error.message);
    console.error("ðŸ”´ [API VERIFY] Stack:", error.stack);
    return NextResponse.json(
      { error: "Error interno del servidor: " + error.message },
      { status: 500 },
    );
  }
}

