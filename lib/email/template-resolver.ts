import { prisma } from '@/lib/prisma';
export interface EmailTemplate {
  id: string;
  type: string;
  language: string;
  subject: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}
/**
 * Resuelve el template de email según el tipo y idioma de la iglesia
 * @param type - Tipo de template (ej: 'welcome_church', 'password_reset')
 * @param churchLanguage - Idioma de la iglesia (ej: 'es', 'en', 'pt')
 * @returns Template resuelto o null si no existe
 */
export async function resolveTemplate(
  type: string,
  churchLanguage: string = 'es'
): Promise<EmailTemplate | null> {
  try {
    // 1. Intentar obtener el template en el idioma solicitado
    let template = await prisma.email_templates.findFirst({
      where: {
        type,
        language: churchLanguage
      }
    });
    // 2. Si no existe, hacer fallback a español
    if (!template && churchLanguage !== 'es') {
      template = await prisma.email_templates.findFirst({
        where: {
          type,
          language: 'es'
        }
      });
    }
    // 3. Si aún no existe, retornar null
    if (!template) {
      console.warn('[TemplateResolver] No template found for type: ' + type + ', language: ' + churchLanguage);
      return null;
    }
    return template;
  } catch (error) {
    console.error('[TemplateResolver] Error resolving template:', error);
    return null;
  }
}
/**
 * Obtiene todos los templates de un tipo en todos los idiomas
 * @param type - Tipo de template
 * @returns Array de templates en diferentes idiomas
 */
export async function getAllTemplatesByType(type: string): Promise<EmailTemplate[]> {
  try {
    return await prisma.email_templates.findMany({
      where: { type },
      orderBy: { language: 'asc' }
    });
  } catch (error) {
    console.error('[TemplateResolver] Error getting templates by type:', error);
    return [];
  }
}
/**
 * Actualiza o crea un template para un tipo e idioma específico
 * @param type - Tipo de template
 * @param language - Idioma del template
 * @param subject - Asunto del email
 * @param body - Cuerpo del email (HTML)
 * @returns Template actualizado o creado
 */
export async function upsertTemplate(
  type: string,
  language: string,
  subject: string,
  body: string
): Promise<EmailTemplate> {
  try {
    return await prisma.email_templates.upsert({
      where: {
        type_language: {
          type,
          language
        }
      },
      update: {
        subject,
        body,
        updatedAt: new Date()
      },
      create: {
        type,
        language,
        subject,
        body
      }
    });
  } catch (error) {
    console.error('[TemplateResolver] Error upserting template:', error);
    throw error;
  }
}
/**
 * Lista todos los tipos de templates disponibles
 * @returns Array de tipos únicos
 */
export async function listTemplateTypes(): Promise<string[]> {
  try {
    const templates = await prisma.email_templates.findMany({
      select: { type: true },
      distinct: ['type']
    });
    return templates.map(t => t.type);
  } catch (error) {
    console.error('[TemplateResolver] Error listing template types:', error);
    return [];
  }
}
