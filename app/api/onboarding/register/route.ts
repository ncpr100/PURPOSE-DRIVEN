import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { ResendService } from "@/lib/integrations/resend";
import { resolveTemplate } from "@/lib/email/template-resolver";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { churchName, country, adminName, adminEmail, plan } = body;
    if (!churchName || !country || !adminName || !adminEmail || !plan) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
    }
    const existingUser = await db.users.findUnique({ where: { email: adminEmail } });
    if (existingUser) {
      return NextResponse.json({ error: "Este email ya está registrado" }, { status: 400 });
    }
    // 1. MAPEO ESTRICTO DE PAÍS A IDIOMA (Regla NON-NEGOTIABLE)
    const language = country === "BR" ? "pt" : country === "US" ? "en" : "es";
    const tempPassword = randomBytes(12).toString("base64").slice(0, 12);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    const paddlePriceIds: Record<string, string> = {
      semilla: process.env.PADDLE_PRICE_SEMILLA || "pri_semilla_test",
      cosecha: process.env.PADDLE_PRICE_COSECHA || "pri_cosecha_test",
      reino: process.env.PADDLE_PRICE_REINO || "pri_reino_test",
    };
    const priceId = paddlePriceIds[plan];
    if (!priceId) {
      return NextResponse.json({ error: "Plan no válido" }, { status: 400 });
    }
    // 2. Crear la iglesia con el idioma detectado
    const church = await db.churches.create({
      data: {
        name: churchName,
        country,
        language, // Campo G03
        plan,
        isActive: false,
      },
    });
    // 3. Crear el usuario administrador
    const user = await db.users.create({
      data: {
        email: adminEmail,
        name: adminName,
        password: hashedPassword,
        role: "ADMIN",
        churchId: church.id,
        isActive: true,
      },
    });
    // 4. G03: Resolver template en el idioma correcto usando template-resolver
    const emailTemplate = await resolveTemplate("welcome_church", language);
    const emailBody = emailTemplate?.body || "<p>Bienvenido a Khesed-Tek. Tu contraseña temporal es: {{tempPassword}}</p>";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const finalEmailBody = emailBody
      .replace("{{adminName}}", adminName)
      .replace("{{churchName}}", churchName)
      .replace("{{tempPassword}}", tempPassword)
      .replace("{{loginUrl}}", appUrl + "/auth/signin");
    // 5. ENVIAR EMAIL REAL CON RESEND
    const resendService = new ResendService();
    const emailResult = await resendService.sendEmail({
      to: adminEmail,
      subject: emailTemplate?.subject || "Bienvenido a Khesed-Tek CMS",
      html: finalEmailBody,
    });
    if (emailResult.success) {
      console.log(`[G03] ✅ Email de bienvenida enviado en idioma: ${language} a ${adminEmail}`);
      console.log(`[G03] Message ID: ${emailResult.messageId}`);
    } else {
      console.error(`[G03] ❌ Error enviando email: ${emailResult.error}`);
    }
    // 6. Generar URL de checkout de Paddle
    const paddleCheckoutUrl = (process.env.NEXT_PUBLIC_PADDLE_CHECKOUT_URL || "https://checkout.paddle.com") + "/checkout/custom?price_id=" + priceId + "&customer_email=" + encodeURIComponent(adminEmail) + "&church_id=" + church.id;
    console.log(`[Onboarding] Iglesia creada: ${churchName} (${church.id}) en idioma: ${language}`);
    console.log(`[Onboarding] Redirigiendo a Paddle Checkout...`);
    return NextResponse.json({
      success: true,
      churchId: church.id,
      userId: user.id,
      tempPassword,
      paddleCheckoutUrl,
      emailSent: emailResult.success,
    });
  } catch (error: any) {
    console.error("[Onboarding Register] Error:", error);
    return NextResponse.json({ error: "Error en el registro: " + error.message }, { status: 500 });
  }
}
