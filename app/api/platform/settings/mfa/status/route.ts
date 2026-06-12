import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    const mfaSettings = await db.user_mfa_settings.findUnique({
      where: { userId: session.user.id },
      select: { isEnabled: true },
    });
    return NextResponse.json({
      isEnabled: mfaSettings?.isEnabled || false,
    });
  } catch (error) {
    console.error('[MFA Status] Error:', error);
    return NextResponse.json(
      { error: 'Error obteniendo estado de 2FA' },
      { status: 500 }
    );
  }
}
