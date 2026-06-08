import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function migrateEmailTemplates() {
  console.log('Starting email templates migration...');
  // 1. Obtener platform_settings actual
  const settings = await prisma.platform_settings.findFirst();
  if (!settings) {
    console.log('No platform_settings found, creating default templates...');
  }
  // 2. Crear templates por defecto en español
  const defaultTemplates = [
    {
      type: 'welcome_church',
      language: 'es',
      subject: settings?.welcomeEmailSubject || 'Bienvenido a Khesed-Tek CMS - {{churchName}}',
      body: settings?.welcomeEmailBody || `<h1>Bienvenido a Khesed-Tek CMS</h1>
<p>Hola {{adminName}},</p>
<p>Tu iglesia <strong>{{churchName}}</strong> ha sido activada exitosamente en Khesed-Tek CMS.</p>
<h2>Tus credenciales de acceso:</h2>
<ul>
<li><strong>Email:</strong> {{adminEmail}}</li>
<li><strong>Contraseña temporal:</strong> {{tempPassword}}</li>
</ul>
<p><strong>Estado de autenticación:</strong> {{authStatus}}</p>
<p>Por favor ingresa a <a href="{{loginUrl}}">{{loginUrl}}</a> y cambia tu contraseña inmediatamente.</p>
<p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
<p>Bendiciones,<br>Equipo Khesed-Tek</p>`
    },
    {
      type: 'welcome_church',
      language: 'en',
      subject: 'Welcome to Khesed-Tek CMS - {{churchName}}',
      body: `<h1>Welcome to Khesed-Tek CMS</h1>
<p>Hello {{adminName}},</p>
<p>Your church <strong>{{churchName}}</strong> has been successfully activated on Khesed-Tek CMS.</p>
<h2>Your access credentials:</h2>
<ul>
<li><strong>Email:</strong> {{adminEmail}}</li>
<li><strong>Temporary password:</strong> {{tempPassword}}</li>
</ul>
<p><strong>Authentication status:</strong> {{authStatus}}</p>
<p>Please log in at <a href="{{loginUrl}}">{{loginUrl}}</a> and change your password immediately.</p>
<p>If you have any questions, don't hesitate to contact us.</p>
<p>Blessings,<br>Khesed-Tek Team</p>`
    },
    {
      type: 'welcome_church',
      language: 'pt',
      subject: 'Bem-vindo ao Khesed-Tek CMS - {{churchName}}',
      body: `<h1>Bem-vindo ao Khesed-Tek CMS</h1>
<p>Olá {{adminName}},</p>
<p>Sua igreja <strong>{{churchName}}</strong> foi ativada com sucesso no Khesed-Tek CMS.</p>
<h2>Suas credenciais de acesso:</h2>
<ul>
<li><strong>Email:</strong> {{adminEmail}}</li>
<li><strong>Senha temporária:</strong> {{tempPassword}}</li>
</ul>
<p><strong>Status de autenticação:</strong> {{authStatus}}</p>
<p>Por favor, acesse <a href="{{loginUrl}}">{{loginUrl}}</a> e altere sua senha imediatamente.</p>
<p>Se você tiver alguma dúvida, não hesite em nos contatar.</p>
<p>Bênçãos,<br>Equipe Khesed-Tek</p>`
    },
    {
      type: 'password_reset',
      language: 'es',
      subject: 'Restablecer contraseña - Khesed-Tek CMS',
      body: `<h1>Restablecer contraseña</h1>
<p>Hola {{adminName}},</p>
<p>Has solicitado restablecer tu contraseña en Khesed-Tek CMS.</p>
<p>Tu nueva contraseña temporal es: <strong>{{tempPassword}}</strong></p>
<p>Por favor ingresa a <a href="{{loginUrl}}">{{loginUrl}}</a> y cámbiala inmediatamente.</p>
<p>Si no solicitaste esto, ignora este email.</p>
<p>Bendiciones,<br>Equipo Khesed-Tek</p>`
    },
    {
      type: 'password_reset',
      language: 'en',
      subject: 'Password Reset - Khesed-Tek CMS',
      body: `<h1>Password Reset</h1>
<p>Hello {{adminName}},</p>
<p>You have requested to reset your password on Khesed-Tek CMS.</p>
<p>Your new temporary password is: <strong>{{tempPassword}}</strong></p>
<p>Please log in at <a href="{{loginUrl}}">{{loginUrl}}</a> and change it immediately.</p>
<p>If you did not request this, please ignore this email.</p>
<p>Blessings,<br>Khesed-Tek Team</p>`
    },
    {
      type: 'password_reset',
      language: 'pt',
      subject: 'Redefinição de Senha - Khesed-Tek CMS',
      body: `<h1>Redefinição de Senha</h1>
<p>Olá {{adminName}},</p>
<p>Você solicitou a redefinição da sua senha no Khesed-Tek CMS.</p>
<p>Sua nova senha temporária é: <strong>{{tempPassword}}</strong></p>
<p>Por favor, acesse <a href="{{loginUrl}}">{{loginUrl}}</a> e altere-a imediatamente.</p>
<p>Se você não solicitou isso, ignore este email.</p>
<p>Bênçãos,<br>Equipe Khesed-Tek</p>`
    },
    {
      type: 'payment_confirmed',
      language: 'es',
      subject: 'Pago confirmado - {{churchName}}',
      body: `<h1>Pago confirmado</h1>
<p>Hola {{adminName}},</p>
<p>Tu pago para <strong>{{churchName}}</strong> ha sido procesado exitosamente.</p>
<p>Gracias por confiar en Khesed-Tek CMS.</p>
<p>Bendiciones,<br>Equipo Khesed-Tek</p>`
    },
    {
      type: 'payment_confirmed',
      language: 'en',
      subject: 'Payment Confirmed - {{churchName}}',
      body: `<h1>Payment Confirmed</h1>
<p>Hello {{adminName}},</p>
<p>Your payment for <strong>{{churchName}}</strong> has been successfully processed.</p>
<p>Thank you for trusting Khesed-Tek CMS.</p>
<p>Blessings,<br>Khesed-Tek Team</p>`
    },
    {
      type: 'payment_confirmed',
      language: 'pt',
      subject: 'Pagamento Confirmado - {{churchName}}',
      body: `<h1>Pagamento Confirmado</h1>
<p>Olá {{adminName}},</p>
<p>Seu pagamento para <strong>{{churchName}}</strong> foi processado com sucesso.</p>
<p>Obrigado por confiar no Khesed-Tek CMS.</p>
<p>Bênçãos,<br>Equipe Khesed-Tek</p>`
    },
    {
      type: 'trial_expiring',
      language: 'es',
      subject: 'Tu período de prueba expira pronto - {{churchName}}',
      body: `<h1>Período de prueba por expirar</h1>
<p>Hola {{adminName}},</p>
<p>Tu período de prueba para <strong>{{churchName}}</strong> expirará en 3 días.</p>
<p>Por favor actualiza tu método de pago para continuar usando Khesed-Tek CMS.</p>
<p>Bendiciones,<br>Equipo Khesed-Tek</p>`
    },
    {
      type: 'trial_expiring',
      language: 'en',
      subject: 'Your trial is expiring soon - {{churchName}}',
      body: `<h1>Trial Expiring Soon</h1>
<p>Hello {{adminName}},</p>
<p>Your trial period for <strong>{{churchName}}</strong> will expire in 3 days.</p>
<p>Please update your payment method to continue using Khesed-Tek CMS.</p>
<p>Blessings,<br>Khesed-Tek Team</p>`
    },
    {
      type: 'trial_expiring',
      language: 'pt',
      subject: 'Seu período de teste está expirando - {{churchName}}',
      body: `<h1>Período de Teste Expirando</h1>
<p>Olá {{adminName}},</p>
<p>Seu período de teste para <strong>{{churchName}}</strong> expirará em 3 dias.</p>
<p>Por favor, atualize seu método de pagamento para continuar usando o Khesed-Tek CMS.</p>
<p>Bênçãos,<br>Equipe Khesed-Tek</p>`
    },
    {
      type: 'subscription_activated',
      language: 'es',
      subject: 'Suscripción activada - {{churchName}}',
      body: `<h1>Suscripción activada</h1>
<p>Hola {{adminName}},</p>
<p>Tu suscripción para <strong>{{churchName}}</strong> ha sido activada exitosamente.</p>
<p>Ahora tienes acceso completo a todas las funcionalidades de Khesed-Tek CMS.</p>
<p>Bendiciones,<br>Equipo Khesed-Tek</p>`
    },
    {
      type: 'subscription_activated',
      language: 'en',
      subject: 'Subscription Activated - {{churchName}}',
      body: `<h1>Subscription Activated</h1>
<p>Hello {{adminName}},</p>
<p>Your subscription for <strong>{{churchName}}</strong> has been successfully activated.</p>
<p>You now have full access to all Khesed-Tek CMS features.</p>
<p>Blessings,<br>Khesed-Tek Team</p>`
    },
    {
      type: 'subscription_activated',
      language: 'pt',
      subject: 'Assinatura Ativada - {{churchName}}',
      body: `<h1>Assinatura Ativada</h1>
<p>Olá {{adminName}},</p>
<p>Sua assinatura para <strong>{{churchName}}</strong> foi ativada com sucesso.</p>
<p>Agora você tem acesso completo a todos os recursos do Khesed-Tek CMS.</p>
<p>Bênçãos,<br>Equipe Khesed-Tek</p>`
    }
  ];
  // 3. Insertar templates (usar upsert para evitar duplicados)
  for (const template of defaultTemplates) {
    await prisma.email_templates.upsert({
      where: {
        type_language: {
          type: template.type,
          language: template.language
        }
      },
      update: {},
      create: template
    });
    console.log(`Created template: ${template.type} (${template.language})`);
  }
  console.log('Migration completed successfully!');
}
migrateEmailTemplates()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
