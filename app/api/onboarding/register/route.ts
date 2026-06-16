import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
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
    // 4. CONSULTA G03: Obtener plantilla de email en el idioma correcto
    const emailTemplate = await db.email_templates.findFirst({
      where: { type: "welcome_church", language },
    }) ?? await db.email_templates.findFirst({
      where: { type: "welcome_church", language: "es" }, // Fallback a español
    });
    const emailBody = emailTemplate?.body || "<p>Bienvenido a Khesed-Tek. Tu contraseña temporal es: {{tempPassword}}</p>";
    const finalEmailBody = emailBody
      .replace("{{adminName}}", adminName)
      .replace("{{churchName}}", churchName)
      .replace("{{tempPassword}}", tempPassword)
      .replace("{{loginUrl}}", `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/signin`);
    // TODO: Aquí iría la llamada real a tu servicio de email (ej: Mailgun)
    // await sendEmail({ to: adminEmail, subject: emailTemplate?.subject || "Bienvenido", html: finalEmailBody });
    console.log(`[G03] Email de bienvenida preparado en idioma: ${language} para ${adminEmail}`);
    // 5. Generar URL de checkout de Paddle
    const paddleCheckoutUrl = `${process.env.NEXT_PUBLIC_PADDLE_CHECKOUT_URL || "https://checkout.paddle.com"}/checkout/custom?price_id=${priceId}&customer_email=${encodeURIComponent(adminEmail)}&church_id=${church.id}`;
    console.log(`[Onboarding] Iglesia creada: ${churchName} (${church.id}) en idioma: ${language}`);
    console.log(`[Onboarding] Redirigiendo a Paddle Checkout...`);
    return NextResponse.json({
      success: true,
      churchId: church.id,
      userId: user.id,
      tempPassword,
      paddleCheckoutUrl,
    });
  } catch (error: any) {
    console.error("[Onboarding Register] Error:", error);
    return NextResponse.json({ error: "Error en el registro: " + error.message }, { status: 500 });
  }
}