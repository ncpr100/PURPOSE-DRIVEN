import { db } from '@/lib/db';
import { cookies } from 'next/headers';
/**
 * Verifica si el usuario requiere MFA y establece el estado de sesión correspondiente.
 * Usar en la ruta de login después de validar email/password.
 */
export async function handleMFAFlow(userId: string): Promise<{ requiresMfa: boolean }> {
  const mfaSettings = await db.user_mfa_settings.findUnique({
    where: { userId },
    select: { isEnabled: true },
  });
  const requiresMfa = mfaSettings?.isEnabled || false;
  const cookieStore = await cookies();
  if (requiresMfa) {
    // Establecer estado pendiente
    cookieStore.set('mfa_pending', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15, // 15 minutos para completar MFA
    });
    // Limpiar cookie de verificado si existe
    cookieStore.delete('mfa_verified');
  } else {
    // Login directo, marcar como verificado
    cookieStore.set('mfa_verified', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    cookieStore.delete('mfa_pending');
  }
  return { requiresMfa };
}
