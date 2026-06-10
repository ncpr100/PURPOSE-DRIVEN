import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
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
    const { password } = await request.json();
    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Contraseña requerida para desactivar 2FA' },
        { status: 400 }
      );
    }
    // Verificar contraseña del usuario
    const user = await db.users.findUnique({
      where: { id: userId },
      select: { password: true },
    });
    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Usuario no encontrado o sin contraseña' },
        { status: 404 }
      );
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }
    // Desactivar 2FA (eliminar registros)
    await db.user_mfa_settings.delete({
      where: { userId },
    });
    console.log(`[MFA] 2FA desactivado para usuario: ${userId}`);
    return NextResponse.json({
      success: true,
      message: '2FA desactivado correctamente',
    });
  } catch (error) {
    console.error('[MFA Disable] Error:', error);
    return NextResponse.json(
      { error: 'Error desactivando 2FA' },
      { status: 500 }
    );
  }
}
