import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export type EmailTemplateType = 
  | 'welcome_church'
  | 'password_reset'
  | 'payment_confirmed'
  | 'trial_expiring'
  | 'subscription_activated';
export type Language = 'es' | 'en' | 'pt';
interface ResolvedTemplate {
  subject: string;
  body: string;
  language: Language;
  fallbackUsed: boolean;
}
export async function resolveEmailTemplate(
  type: EmailTemplateType,
  requestedLanguage: Language = 'es'
): Promise<ResolvedTemplate> {
  let template = await prisma.email_templates.findFirst({
    where: { type, language: requestedLanguage }
  });
  if (template) {
    return {
      subject: template.subject,
      body: template.body,
      language: requestedLanguage,
      fallbackUsed: false
    };
  }
  template = await prisma.email_templates.findFirst({
    where: { type, language: 'es' }
  });
  if (template) {
    return {
      subject: template.subject,
      body: template.body,
      language: 'es',
      fallbackUsed: true
    };
  }
  return {
    subject: 'Bienvenido a Khesed-Tek CMS',
    body: '<h1>Bienvenido</h1><p>Hola {{adminName}}, tu iglesia {{churchName}} ha sido activada.</p>',
    language: 'es',
    fallbackUsed: true
  };
}
export function replaceTokens(
  template: string,
  tokens: Record<string, string>
): string {
  let result = template;
  Object.entries(tokens).forEach(([key, value]) => {
    const regex = new RegExp('\\{\\{' + key + '\\}\\}', 'g');
    result = result.replace(regex, value);
  });
  return result;
}