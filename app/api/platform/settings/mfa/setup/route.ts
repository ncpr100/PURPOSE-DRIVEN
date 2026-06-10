import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateTOTPSecret } from "@/lib/mfa/totp";
import { encrypt } from "@/lib/mfa/encryption";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  console.log("🟢 [API SETUP] 1. Solicitud recibida");

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.log("🔴 [API SETUP] Error: Usuario no autenticado");
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    console.log("🟢 [API SETUP] 2. Usuario autenticado:", session.user.email);

    // Verificar si ya está habilitado
    const existing = await db.user_mfa_settings.findUnique({
      where: { userId: session.user.id },
    });

    if (existing?.isEnabled) {
      console.log("🟡 [API SETUP] 2FA ya está habilitado para este usuario");
      return NextResponse.json(
        { error: "2FA ya está habilitado" },
        { status: 400 },
      );
    }

    console.log("🟢 [API SETUP] 3. Generando secreto TOTP...");
    const { secret, qrCodeUrl } = generateTOTPSecret(
      session.user.email || "user@khesed-tek.com",
    );
    console.log(
      "🟢 [API SETUP] 4. Secreto generado correctamente. Longitud:",
      secret.length,
    );
    console.log(
      "🟢 [API SETUP] 4a. QR URL generado:",
      qrCodeUrl.substring(0, 50) + "...",
    );

    console.log("🟢 [API SETUP] 5. Encriptando secreto...");
    const encryptedSecret = encrypt(secret);
    console.log("🟢 [API SETUP] 6. Secreto encriptado correctamente");

    console.log("🟢 [API SETUP] 7. Guardando en base de datos (upsert)...");
    await db.user_mfa_settings.upsert({
      where: { userId: session.user.id },
      update: {
        totpSecret: encryptedSecret,
        isEnabled: false,
      },
      create: {
        userId: session.user.id,
        totpSecret: encryptedSecret,
        isEnabled: false,
      },
    });
    console.log("🟢 [API SETUP] 8. Guardado en base de datos exitoso");

    const responseData = {
      success: true,
      secret: secret,
      otpauthUrl: qrCodeUrl,
    };

    console.log("🟢 [API SETUP] 9. Respondiendo al cliente con datos");
    console.log("🟢 [API SETUP] Datos enviados:", {
      secret: secret.substring(0, 10) + "...",
      otpauthUrl: qrCodeUrl.substring(0, 50) + "...",
    });

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("🔴 [API SETUP] ERROR CRÍTICO:", error.message);
    console.error("🔴 [API SETUP] Stack:", error.stack);
    return NextResponse.json(
      { error: "Error interno del servidor: " + error.message },
      { status: 500 },
    );
  }
}
