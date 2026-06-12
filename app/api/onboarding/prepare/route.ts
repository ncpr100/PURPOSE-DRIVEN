import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Rate limiting simple (in-memory for dev, Redis for prod)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 }); // 15 min window
    return true;
  }
  if (entry.count >= 3) {
    return false; // Max 3 requests per 15 min per IP
  }
  entry.count++;
  return true;
}
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Espera 15 minutos.' },
        { status: 429 }
      );
    }
    const body = await request.json();
    const {
      churchName,
      country,
      denomination,
      language,
      adminName,
      adminEmail,
      planTier,
    } = body;
    // ═════════════════════════════════════════════════════════
    // VALIDACIONES
    // ═════════════════════════════════════════════════════════
    const errors: string[] = [];
    if (!churchName || churchName.trim().length < 3) {
      errors.push('El nombre de la iglesia es requerido (mínimo 3 caracteres)');
    }
    if (!country || country.trim().length < 2) {
      errors.push('El país es requerido');
    }
    if (!adminName || adminName.trim().length < 2) {
      errors.push('El nombre del administrador es requerido');
    }
    if (!adminEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) {
      errors.push('Email inválido');
    }
    if (!planTier || !['semilla', 'cosecha', 'reino', 'gloria', 'red'].includes(planTier)) {
      errors.push('Plan inválido');
    }
    if (!['es', 'en', 'pt'].includes(language || 'es')) {
      errors.push('Idioma inválido');
    }
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
    }
    // Verificar que el email no esté ya registrado
    const existingUser = await db.users.findFirst({
      where: { email: adminEmail.toLowerCase() },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya está registrado. Inicia sesión o usa otro email.' },
        { status: 409 }
      );
    }
    // ═════════════════════════════════════════════════════════
    // CREAR CHURCH + USER EN TRANSACCIÓN
    // ═════════════════════════════════════════════════════════
    const result = await db.$transaction(async (tx) => {
      // 1. Crear iglesia (status PENDING hasta que Paddle confirme pago)
      const church = await tx.churches.create({
        data: {
          name: churchName.trim(),
          country: country.trim(),
          denomination: denomination?.trim() || null,
          language: (language || 'es').toLowerCase(),
          isActive: false, // ← Se activa cuando Paddle confirme payment
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      // 2. Generar contraseña temporal segura
      const tempPassword = crypto.randomBytes(12).toString('base64url');
      const hashedPassword = await bcrypt.hash(tempPassword, 12);
      // 3. Crear usuario admin de la iglesia
      const admin = await tx.users.create({
        data: {
          email: adminEmail.toLowerCase().trim(),
          name: adminName.trim(),
          password: hashedPassword,
          role: 'ADMIN_IGLESIA',
          churchId: church.id,
          isActive: false, // ← Se activa cuando Paddle confirme payment
          isFirstLogin: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return { church, admin, tempPassword };
    });
    // ═════════════════════════════════════════════════════════
    // MAPEAR PLAN TIER A PADDLE PRICE ID
    // ═════════════════════════════════════════════════════════
    // NOTA: Reemplaza estos IDs con los reales de tu Paddle Dashboard
    const paddlePriceMap: Record<string, string> = {
      semilla: process.env.PADDLE_PRICE_SEMILLA || 'pri_01ht6x0y7q5y5y5y5y5y5y5y',
      cosecha: process.env.PADDLE_PRICE_COSECHA || 'pri_01ht6x0y7q6z6z6z6z6z6z6z',
      reino: process.env.PADDLE_PRICE_REINO || 'pri_01ht6x0y7q7a7a7a7a7a7a7a',
      gloria: process.env.PADDLE_PRICE_GLORIA || 'pri_01ht6x0y7q8b8b8b8b8b8b8b',
      red: process.env.PADDLE_PRICE_RED || 'pri_01ht6x0y7q9c9c9c9c9c9c9c',
    };
    const paddlePriceId = paddlePriceMap[planTier];
    console.log(`[Onboarding] Church ${result.church.id} created (PENDING), preparing Paddle checkout for ${planTier}`);
    // ═════════════════════════════════════════════════════════
    // RESPUESTA AL CLIENTE
    // ═════════════════════════════════════════════════════════
    return NextResponse.json({
      success: true,
      churchId: result.church.id,
      userId: result.admin.id,
      paddlePriceId,
      planTier,
      churchLanguage: result.church.language,
      // NO devolvemos tempPassword al cliente por seguridad
      // El webhook lo enviará por email cuando Paddle confirme el pago
    });
  } catch (error) {
    console.error('[Onboarding] Error:', error);
    return NextResponse.json(
      { error: 'Error interno. Intenta de nuevo.' },
      { status: 500 }
    );
  }
}
