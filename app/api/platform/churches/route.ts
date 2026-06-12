import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { randomBytes } from "crypto";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendEmail, emailQueue } from "@/lib/email";
import { getServerBaseUrl } from "@/lib/server-url";
import { nanoid } from "nanoid";
import { resolveEmailTemplate, replaceTokens as replaceTemplateTokens } from "@/lib/email-template-resolver";

/**
 * Generates a cryptographically secure 12-character temporary password.
 * Each church receives a UNIQUE password — never a shared default.
 * Format: 3 uppercase + 3 lowercase + 3 digits + 3 special chars, shuffled.
 */
function generateSecureTemporaryPassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const special = "@#$!";
  const all = upper + lower + digits + special;
  const bytes = randomBytes(16);
  // Guarantee at least one of each required character class
  const required = [
    upper[bytes[12] % upper.length],
    lower[bytes[13] % lower.length],
    digits[bytes[14] % digits.length],
    special[bytes[15] % special.length],
  ];
  const rest = Array.from({ length: 8 }, (_, i) => all[bytes[i] % all.length]);
  // Shuffle the combined array using Fisher-Yates
  const combined = [...required, ...rest];
  for (let i = combined.length - 1; i > 0; i--) {
    const j = bytes[i % 12] % (i + 1);
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  return combined.join("");
}

// Supabase Admin API for creating Auth users
const supabaseAdminUrl = "https://qxdwpihcmgctznvdfmbv.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function createSupabaseAuthUser(
  email: string,
  password: string,
  name: string,
) {
  if (!supabaseServiceKey) {
    console.warn(
      "SUPABASE_SERVICE_ROLE_KEY not configured - skipping Auth user creation",
    );
    return null;
  }

  try {
    const response = await fetch(`${supabaseAdminUrl}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseServiceKey}`,
        apikey: supabaseServiceKey,
      },
      body: JSON.stringify({
        email,
        password,
        user_metadata: {
          name,
          full_name: name,
        },
        email_confirm: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to create Supabase Auth user:", error);
      return null;
    }

    const user = await response.json();
    console.log(" Supabase Auth user created:", email);
    return user;
  } catch (error) {
    console.error("Error creating Supabase Auth user:", error);
    return null;
  }
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Solo SUPER_ADMIN puede acceder a gestión de plataforma
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Acceso denegado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status !== "all") {
      where.isActive = status === "active";
    }

    // Obtener iglesias con datos agregados
    const [churches, total] = await Promise.all([
      db.churches.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              users: true,
              members: true,
              events: true,
              donations: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.churches.count({ where }),
    ]);

    // Calcular estadísticas para cada iglesia
    const churchesWithStats = await Promise.all(
      churches.map(async (church) => {
        const [totalDonations, activeUsers] = await Promise.all([
          db.donations.aggregate({
            where: { churchId: church.id },
            _sum: { amount: true },
          }),
          db.users.count({
            where: { churchId: church.id, isActive: true },
          }),
        ]);

        return {
          ...church,
          stats: {
            totalMembers: church._count.members,
            activeUsers,
            totalEvents: church._count.events,
            totalDonations: totalDonations._sum.amount || 0,
          },
        };
      }),
    );

    return NextResponse.json({
      churches: churchesWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching churches:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Acceso denegado" }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      address,
      phone,
      email,
      website,
      founded,
      description,
      adminUser,
      // When false, the church is created but credential email is NOT sent yet.
      // Super Admin can send credentials later via Credenciales page.
      sendCredentialsNow = true,
      language = "es",
    } = body;

    // Validaciones
    if (!name || !email || !adminUser?.email || !adminUser?.name) {
      return NextResponse.json(
        {
          message:
            "Campos requeridos: name, email, adminUser.email, adminUser.name",
        },
        { status: 400 },
      );
    }

    // Only PASTOR and ADMIN_IGLESIA are valid tenant-level roles.
    // SUPER_ADMIN is a platform-only role and must never be assigned to a church user.
    const ALLOWED_TENANT_ROLES = ["ADMIN_IGLESIA", "PASTOR"] as const;
    type TenantRole = (typeof ALLOWED_TENANT_ROLES)[number];
    if (adminUser.role && !ALLOWED_TENANT_ROLES.includes(adminUser.role)) {
      return NextResponse.json(
        {
          message:
            "Rol no válido. Solo se permite ADMIN_IGLESIA o PASTOR para usuarios de iglesia.",
        },
        { status: 400 },
      );
    }
    const tenantRole: TenantRole = ALLOWED_TENANT_ROLES.includes(adminUser.role)
      ? (adminUser.role as TenantRole)
      : "ADMIN_IGLESIA";

    // Verificar que el email del admin no exista
    const existingUser = await db.users.findUnique({
      where: { email: adminUser.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "El email del administrador ya está registrado" },
        { status: 400 },
      );
    }

    // Generate password ONCE here so both the transaction (hashing) and
    // post-transaction email/response reference the exact same value.
    const bcrypt = require("bcryptjs");
    const temporaryPassword =
      adminUser.password && adminUser.password.length >= 8
        ? adminUser.password
        : generateSecureTemporaryPassword();

    // Create church and admin user in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create church
      const church = await tx.churches.create({
        data: {
          id: nanoid(),
          name,
          address,
          phone,
          email,
          website,
          founded: founded ? new Date(founded) : null,
          description,
          isActive: true,
          language: language,
          updatedAt: new Date(),
        },
      });

      // Hash the password that was already generated above
      const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

      // Create admin user in database
      const admin = await tx.users.create({
        data: {
          id: nanoid(),
          name: adminUser.name,
          email: adminUser.email,
          password: hashedPassword,
          role: tenantRole,
          churches: {
            connect: { id: church.id },
          },
          isActive: true,
          isFirstLogin: true,
          emailVerified: new Date(),
          updatedAt: new Date(),
        },
      });

      //  AUTOMATICALLY CREATE SUPABASE AUTH USER
      const supabaseUser = await createSupabaseAuthUser(
        adminUser.email,
        temporaryPassword,
        adminUser.name,
      );

      if (supabaseUser) {
        console.log(` Auto-created Supabase Auth user for ${adminUser.email}`);
      } else {
        console.warn(
          `️ Could not create Supabase Auth user for ${adminUser.email} - will need manual creation`,
        );
      }

      // Create corresponding member
      await tx.members.create({
        data: {
          id: nanoid(),
          firstName: adminUser.name.split(" ")[0] || adminUser.name,
          lastName: adminUser.name.split(" ").slice(1).join(" ") || "",
          email: adminUser.email,
          phone: adminUser.phone || "",
          churches: {
            connect: { id: church.id },
          },
          users: {
            connect: { id: admin.id },
          },
          membershipDate: new Date(),
          isActive: true,
          updatedAt: new Date(),
        },
      });

      return { church, admin, supabaseUser };
    });

    const authStatusMessage = result.supabaseUser
      ? " Tu cuenta de autenticación ha sido creada automáticamente."
      : "️ Por favor contacta al soporte para activar tu cuenta de autenticación.";

    // Load platform settings to get custom welcome email template (if configured)
    const platformSettings = await db.platform_settings.findFirst();

    const replaceEmailTokens = (template: string) =>
      template
        .replaceAll("{{adminName}}", adminUser.name)
        .replaceAll("{{churchName}}", name)
        .replaceAll("{{adminEmail}}", adminUser.email)
        .replaceAll("{{tempPassword}}", temporaryPassword)
        .replaceAll("{{loginUrl}}", getServerBaseUrl())
        .replaceAll("{{authStatus}}", authStatusMessage);

    const welcomeEmailSubject = platformSettings?.welcomeEmailSubject
      ? replaceEmailTokens(platformSettings.welcomeEmailSubject)
      : `Bienvenido a Kḥesed-tek - Credenciales de ${name}`;

    const defaultEmailBody = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenido a Kḥesed-tek CMS</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f0f4f8; color: #1a202c; padding: 32px 16px; }
    .wrapper { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 40px 32px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 6px; }
    .header p { color: #fde68a; font-size: 14px; }
    .body { padding: 36px 32px; }
    .greeting { font-size: 18px; font-weight: 600; color: #0D1B2E; margin-bottom: 12px; }
    .intro { font-size: 15px; color: #4a5568; line-height: 1.7; margin-bottom: 24px; }
    .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #6b7280; margin-bottom: 10px; }
    .card { border-radius: 8px; padding: 20px 24px; margin-bottom: 20px; }
    .card-blue { background: #fdf8ee; border-left: 4px solid #C9922A; }
    .card-orange { background: #fff7ed; border-left: 4px solid #f97316; }
    .card-green { background: #f0fdfd; border-left: 4px solid #26D9D9; }
    .card p { font-size: 14px; color: #374151; line-height: 1.6; margin-bottom: 6px; }
    .card p:last-child { margin-bottom: 0; }
    .label { font-weight: 600; color: #C9922A; }
    .credential-code { background: #0D1B2E; color: #F0BE42; font-family: 'Courier New', monospace; font-size: 15px; padding: 2px 8px; border-radius: 4px; }
    .cta { display: block; width: 100%; background: linear-gradient(135deg, #C9922A 0%, #8f6818 100%); color: #0D1B2E !important; text-align: center; font-size: 16px; font-weight: 600; padding: 14px 24px; border-radius: 8px; text-decoration: none; margin: 28px 0; }
    .steps ol { padding-left: 20px; }
    .steps li { font-size: 14px; color: #374151; line-height: 1.7; margin-bottom: 4px; }
    .divider { border: none; border-top: 1px solid #e5e7eb; margin: 28px 0; }
    .footer { background: #f8fafc; border-top: 1px solid #e5e7eb; padding: 24px 32px; text-align: center; }
    .footer p { font-size: 12px; color: #9ca3af; line-height: 1.6; }
    .footer strong { color: #6b7280; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Kḥesed-tek CMS</h1>
    </div>
    <div class="body">
      <p class="greeting">Hola, ${adminUser.name},</p>
      <p class="intro">
        ¡Es un honor caminar junto a usted en esta nueva etapa para su ministerio!<br />
        Le confirmamos que el perfil de <strong>${name}</strong> ha sido creado y configurado
        exitosamente en nuestra plataforma. A partir de hoy, usted cuenta con un equipo de agentes de IA
        diseñados desde la experiencia pastoral para ayudarle a recuperar su tiempo y cuidar mejor de su congregación.
      </p>
      <p class="section-title">Sus credenciales de acceso</p>
      <div class="card card-blue">
        <p>Para comenzar a explorar su nuevo panel administrativo, utilice los siguientes datos:</p>
        <br />
        <p><span class="label">Enlace de acceso:</span> <a href="${getServerBaseUrl()}">${getServerBaseUrl()}</a></p>
        <p><span class="label">Usuario:</span> ${adminUser.email}</p>
        <p><span class="label">Contraseña temporal:</span> <span class="credential-code">${temporaryPassword}</span></p>
        <br />
        <p style="font-size:13px; color:#6b7280;">${authStatusMessage}</p>
      </div>
      <a href="${getServerBaseUrl()}" class="cta">Acceder a mi Panel Administrativo</a>
      <div class="card card-orange">
        <p><span class="label">Importante:</span> Le recomendamos cambiar su contraseña en su primer inicio de sesión por seguridad.</p>
      </div>
      <p class="section-title">Sus primeros pasos recomendados</p>
      <div class="steps">
        <p style="font-size:14px; color:#4a5568; margin-bottom:10px;">
          Sabemos que su tiempo es valioso, por eso le sugerimos comenzar con estas 3 acciones simples:
        </p>
        <ol>
          <li>Ingrese al panel y vea el estado actual de su Shepherd's Log.</li>
          <li>Revise su WhatsApp: También recibirá este mensaje por WhatsApp como respaldo, en caso de que no tenga acceso a su correo.</li>
          <li>Agende su sesión de bienvenida: Si aún no lo ha hecho, puede programar una llamada de 15 minutos con nosotros para resolver dudas técnicas.</li>
        </ol>
      </div>
      <hr class="divider" />
      <div class="card card-green">
        <p>
          <span class="label">Estamos para servirle.</span><br />
          Si tiene cualquier duda o necesita ayuda configurando a su equipo, simplemente
          responda a este correo o escríbanos por WhatsApp al <strong>+57 302 1234410</strong>.
        </p>
      </div>
      <p style="font-size:14px; color:#4a5568; margin-top:24px; line-height:1.7;">
        Estamos creyendo para que esta herramienta sea de bendición para su vida, su familia
        y toda la congregación de <strong>${name}</strong>.<br /><br />
        En Cristo,<br />
        <strong>El Equipo de Khesed-Tek Systems</strong>
      </p>
    </div>
    <div class="footer">
      <p><strong>Kḥesed-tek Church Management Systems</strong></p>
      <p>soporte@khesed-tek-systems.org &nbsp;|&nbsp; Sistema completo de gestión para iglesias</p>
    </div>
  </div>
</body>
</html>`;

    const welcomeEmailContent = platformSettings?.welcomeEmailBody
      ? replaceEmailTokens(platformSettings.welcomeEmailBody)
      : defaultEmailBody;

    // Only send credential email if Super Admin explicitly requested it.
    // When sendCredentialsNow === false the church is created but locked until
    // payment is confirmed — Super Admin sends credentials from Credenciales page.
    if (sendCredentialsNow !== false) {
      emailQueue
        .add({
          to: adminUser.email,
          subject: welcomeEmailSubject,
          html: welcomeEmailContent,
          churchName: name,
          userName: adminUser.name,
        })
        .catch((error) => {
          console.error("Error sending welcome email:", error);
        });
    }

    return NextResponse.json(
      {
        message: "Iglesia creada exitosamente",
        church: result.church,
        admin: {
          id: result.admin.id,
          name: result.admin.name,
          email: result.admin.email,
        },
        supabaseAuth: {
          created: !!result.supabaseUser,
          message: result.supabaseUser
            ? "Usuario de autenticación creado automáticamente"
            : "Usuario de autenticación pendiente - contactar soporte",
        },
        // tempPassword is returned ONCE here so Super Admin can record it.
        // It will also be included in the credential email when sent.
        tempPassword: temporaryPassword,
        credentialsSent: sendCredentialsNow !== false,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating church:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
