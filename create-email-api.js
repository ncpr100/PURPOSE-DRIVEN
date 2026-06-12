const fs = require('fs');
const path = require('path');
const routeCode = `import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
export const dynamic = 'force-dynamic';
// GET /api/platform/email-templates?type=welcome_church&language=es
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 });
    }
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'welcome_church';
    const language = searchParams.get('language') || 'es';
    const template = await db.email_templates.findFirst({
      where: { type, language }
    });
    return NextResponse.json({ template });
  } catch (error) {
    console.error('Error fetching email template:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
// PUT /api/platform/email-templates
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 });
    }
    const body = await request.json();
    const { type, language, subject, body: templateBody } = body;
    if (!type || !language || !subject || !templateBody) {
      return NextResponse.json(
        { message: 'Campos requeridos: type, language, subject, body' },
        { status: 400 }
      );
    }
    const template = await db.email_templates.upsert({
      where: {
        type_language: { type, language }
      },
      update: { subject, body: templateBody, updatedAt: new Date() },
      create: { type, language, subject, body: templateBody }
    });
    return NextResponse.json({ 
      message: 'Template actualizado exitosamente',
      template 
    });
  } catch (error) {
    console.error('Error updating email template:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}`;
const routeDir = path.join(process.cwd(), 'app', 'api', 'platform', 'email-templates');
if (!fs.existsSync(routeDir)) fs.mkdirSync(routeDir, { recursive: true });
fs.writeFileSync(path.join(routeDir, 'route.ts'), routeCode, 'utf8');
console.log('✅ Endpoint API de email-templates creado exitosamente');
