'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function TermsPage() {
  return <TermsClient />
}

function TermsClient() {
  const [lang, setLang] = useState<'es'|'en'|'pt'>('es')

  const tabs = [
    { id: 'es', label: '🇪🇸 Español' },
    { id: 'en', label: '🇺🇸 English' },
    { id: 'pt', label: '🇧🇷 Português' },
  ] as const

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-background text-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold tracking-tight">
            {lang === 'es' && 'Términos y Condiciones de Servicio'}
            {lang === 'en' && 'Terms and Conditions of Service'}
            {lang === 'pt' && 'Termos e Condições de Serviço'}
          </h1>
          <p className="mt-2 text-muted-foreground/70">Khesed-Tek Systems, LLC</p>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === 'es' && 'Última actualización: 9 de marzo de 2026'}
            {lang === 'en' && 'Last Updated: March 9, 2026'}
            {lang === 'pt' && 'Última atualização: 9 de março de 2026'}
          </p>
        </div>
      </div>

      {/* Language tabs + Download */}
      <div className="max-w-4xl mx-auto px-6 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-2">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setLang(t.id)}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                lang === t.id
                  ? 'bg-[#0D1B2E] text-[#C9922A]'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <a
          href="/downloads/terms-of-service.html"
          download="Khesed-Tek-Terms-of-Service.html"
          className="inline-flex items-center gap-2 bg-[#0D1B2E] text-[#C9922A] text-sm font-semibold px-5 py-2.5 rounded-md hover:opacity-90 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          {lang === 'es' && 'Descargar PDF'}
          {lang === 'en' && 'Download PDF'}
          {lang === 'pt' && 'Baixar PDF'}
        </a>
      </div>

      {/* ── SPANISH ── */}
      {lang === 'es' && (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-10 text-muted-foreground text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">1. Definiciones y Partes</h2>
            <p className="mb-3"><strong>1.1. Las Partes.</strong> Este acuerdo se celebra entre Khesed-Tek Systems, LLC, una sociedad de responsabilidad limitada constituida bajo las leyes del Estado de Delaware (en adelante &quot;Khesed-Tek&quot;, &quot;nosotros&quot; o &quot;nuestro&quot;), y la iglesia, ministerio u organización sin fines de lucro (en adelante &quot;la Iglesia&quot;, &quot;usted&quot; o &quot;su&quot;) que contrata nuestros Servicios.</p>
            <p className="mb-3"><strong>1.2. Definiciones Clave.</strong></p>
            <div className="overflow-x-auto"><table className="w-full border border-border text-sm"><thead className="bg-muted/30"><tr><th className="border border-border px-4 py-2 text-left font-semibold text-foreground w-40">Término</th><th className="border border-border px-4 py-2 text-left font-semibold text-foreground">Definición</th></tr></thead><tbody>{[['Servicios','La plataforma Khesed-Tek CMS, aplicaciones móviles, soporte técnico y cualquier otro producto ofrecido por Khesed-Tek Systems.'],['Plataforma','El software de gestión ministerial Khesed-Tek CMS, accesible vía web y dispositivos móviles.'],['Datos de la Iglesia','Toda información, registros y contenido que la Iglesia ingresa, importa o almacena en la Plataforma.'],['Administrador','La persona designada por la Iglesia para gestionar la cuenta y otorgar permisos a otros usuarios.'],['Usuarios Autorizados','Pastores, líderes, voluntarios y miembros que la Iglesia autoriza a acceder a la Plataforma.']].map(([t,d])=>(<tr key={t} className="even:bg-muted/30"><td className="border border-border px-4 py-2 font-medium text-foreground align-top">{t}</td><td className="border border-border px-4 py-2">{d}</td></tr>))}</tbody></table></div>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">2. Aceptación de Términos</h2>
            <p className="mb-3"><strong>2.1.</strong> Al crear una cuenta o usar los Servicios, usted acepta estos Términos y nuestra Política de Privacidad. Si actúa en nombre de una iglesia, declara tener autoridad legal plena para vincularla.</p>
            <p className="mb-3"><strong>2.2. Modificaciones.</strong> Podemos modificar estos Términos en cualquier momento. Los cambios materiales serán notificados con al menos 30 días de anticipación. El uso continuado constituye aceptación.</p>
            <p className="mb-3"><strong>2.3. Ley Aplicable.</strong> Estos Términos se rigen por las leyes del Estado de Delaware, EE.UU.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">3. Creación y Administración de Cuentas</h2>
            <p className="mb-3"><strong>3.1.</strong> Debe proporcionar información completa y precisa al registrarse, incluyendo nombre legal de la iglesia, correo electrónico válido e información de facturación.</p>
            <p className="mb-3"><strong>3.2.</strong> Cada usuario debe tener credenciales únicas. El inicio de sesión compartido no está permitido. Los Administradores son responsables de las acciones de todos los Usuarios Autorizados.</p>
            <p className="mb-3"><strong>3.3.</strong> Usted es responsable de mantener la confidencialidad de sus credenciales y notificarnos de inmediato ante cualquier acceso no autorizado.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">4. Propiedad Intelectual</h2>
            <p className="mb-3"><strong>4.1.</strong> Khesed-Tek Systems, LLC retiene todos los derechos sobre el código fuente, diseño, interfaz, marcas y contenido de la Plataforma.</p>
            <p className="mb-3"><strong>4.2.</strong> Le otorgamos una licencia limitada, no exclusiva e intransferible para usar los Servicios únicamente para sus fines ministeriales internos.</p>
            <p className="mb-3"><strong>4.3.</strong> Usted retiene la propiedad de los Datos de la Iglesia. Nos otorga una licencia limitada para almacenar y procesar dichos datos a fin de prestar los Servicios.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">5. Uso Aceptable</h2>
            <p className="mb-3"><strong>5.1.</strong> Khesed-Tek CMS está diseñado exclusivamente para apoyar el trabajo de iglesias y ministerios alineados con valores cristianos tradicionales.</p>
            <p className="mb-3"><strong>5.2. Conductas Prohibidas:</strong> almacenar o transmitir contenido ilegal, obsceno o difamatorio; enviar spam; introducir malware; suplantar identidades; acceder sin autorización a otros sistemas.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">6. Términos Comerciales y Pagos</h2>
            <p className="mb-3"><strong>6.1.</strong> Los Servicios se ofrecen mediante suscripción mensual o anual. Los precios pueden modificarse con 30 días de aviso previo.</p>
            <p className="mb-3"><strong>6.2.</strong> Las cuentas con más de 30 días de mora podrán ser suspendidas. Se podrá aplicar un cargo administrativo de $30 USD por transacción fallida.</p>
            <p className="mb-3"><strong>6.3. Compromiso Misional.</strong> Una parte de los ingresos de Khesed-Tek se destina a financiar los programas de rehabilitación de Misión Khesed en Colombia y América Latina.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">7. Datos y Seguridad</h2>
            <p className="mb-3">Los Datos de la Iglesia le pertenecen exclusivamente. Implementamos cifrado en tránsito (HTTPS) y en reposo, copias de seguridad diarias automatizadas y controles de acceso basados en roles. No vendemos ni compartimos sus datos con terceros para fines de marketing.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">8. Disponibilidad del Servicio</h2>
            <p>Los Servicios se ofrecen &quot;TAL COMO ESTÁN&quot; y &quot;SEGÚN DISPONIBILIDAD&quot;. No garantizamos disponibilidad ininterrumpida. No somos responsables de fallos causados por eventos fuera de nuestro control razonable.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">9. Limitación de Responsabilidad</h2>
            <p className="mb-3">En la medida máxima permitida por la ley de Delaware, nuestra responsabilidad total no excederá el monto total pagado por usted durante los doce (12) meses anteriores al evento que dio origen al reclamo.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">10. Cancelación y Terminación</h2>
            <p className="mb-3"><strong>10.1.</strong> Puede cancelar su suscripción en cualquier momento desde el panel de administración. La cancelación será efectiva al final del período de facturación en curso.</p>
            <p className="mb-3"><strong>10.2.</strong> Podemos suspender o terminar su acceso de forma inmediata si viola estos Términos o no realiza pagos a tiempo.</p>
            <p className="mb-3"><strong>10.3.</strong> Sus datos permanecerán disponibles hasta 90 días después de la cancelación para permitir la exportación y recuperación.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">11. Indemnización</h2>
            <p>Usted acepta indemnizar y eximir de responsabilidad a Khesed-Tek Systems, LLC, sus miembros, directivos, empleados y agentes frente a cualquier reclamo que surja de su uso de los Servicios o de la violación de estos Términos.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">12. Disposiciones Generales</h2>
            <p className="mb-3"><strong>12.1.</strong> Estos Términos, junto con la Política de Privacidad, constituyen el acuerdo completo entre las partes.</p>
            <p className="mb-3"><strong>12.2.</strong> No puede ceder estos Términos sin nuestro consentimiento previo por escrito.</p>
            <p className="mb-3"><strong>12.3.</strong> Los tribunales estatales y federales de Delaware tienen jurisdicción exclusiva para cualquier disputa.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">13. Información de Contacto</h2>
            <div className="bg-muted/30 border border-border rounded-lg p-6 space-y-2">
              <p className="font-semibold text-foreground">Khesed-Tek Systems, LLC</p>
              <p className="text-muted-foreground text-xs">(Delaware Limited Liability Company)</p>
              <p>Email: <a href="mailto:legal@khesed-tek-systems.org" className="text-[hsl(var(--info))] underline">legal@khesed-tek-systems.org</a></p>
              <p>Teléfono: <a href="tel:+573011234410" className="text-[hsl(var(--info))] underline">+57 301 123 4410</a></p>
              <p>Web: <a href="https://www.khesed-tek-systems.org" className="text-[hsl(var(--info))] underline" target="_blank" rel="noopener noreferrer">www.khesed-tek-systems.org</a></p>
            </div>
          </section>
          <div className="border-t border-border pt-8"><p className="text-center text-muted-foreground font-medium">AL USAR NUESTROS SERVICIOS, USTED RECONOCE QUE HA LEÍDO, COMPRENDIDO Y ACEPTA QUEDAR VINCULADO POR ESTOS TÉRMINOS Y CONDICIONES.</p></div>
        </div>
      )}

      {/* ── ENGLISH ── */}
      {lang === 'en' && (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-10 text-muted-foreground text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">1. Definitions and Parties</h2>
            <p className="mb-3"><strong>1.1. The Parties.</strong> This agreement is entered into between Khesed-Tek Systems, LLC, a Delaware limited liability company (&quot;Khesed-Tek&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), and the church, ministry, or non-profit organization (&quot;the Church&quot;, &quot;you&quot;, or &quot;your&quot;) that contracts our Services.</p>
            <p className="mb-3"><strong>1.2. Key Definitions.</strong></p>
            <div className="overflow-x-auto"><table className="w-full border border-border text-sm"><thead className="bg-muted/30"><tr><th className="border border-border px-4 py-2 text-left font-semibold text-foreground w-40">Term</th><th className="border border-border px-4 py-2 text-left font-semibold text-foreground">Definition</th></tr></thead><tbody>{[['Services','The Khesed-Tek CMS platform, mobile applications, technical support, and any other products offered by Khesed-Tek Systems.'],['Platform','The Khesed-Tek CMS church management software, accessible via web and mobile devices.'],['Church Data','All information, records, and content that the Church enters, imports, or stores on the Platform.'],['Administrator','The person(s) designated by the Church to manage the account and grant permissions to other users.'],['Authorized Users','Pastors, leaders, volunteers, and members whom the Church authorizes to access the Platform.']].map(([t,d])=>(<tr key={t} className="even:bg-muted/30"><td className="border border-border px-4 py-2 font-medium text-foreground align-top">{t}</td><td className="border border-border px-4 py-2">{d}</td></tr>))}</tbody></table></div>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">2. Acceptance of Terms</h2>
            <p className="mb-3"><strong>2.1.</strong> By creating an account or using the Services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If acting on behalf of a church, you represent that you have full legal authority to bind it.</p>
            <p className="mb-3"><strong>2.2. Modifications.</strong> We may modify these Terms at any time. Material changes will be notified at least 30 days in advance. Continued use constitutes acceptance.</p>
            <p className="mb-3"><strong>2.3. Governing Law.</strong> These Terms are governed by the laws of the State of Delaware, USA.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">3. Account Creation and Administration</h2>
            <p className="mb-3"><strong>3.1.</strong> You must provide complete and accurate information when registering, including the church&apos;s full legal name, a valid email address, and billing information.</p>
            <p className="mb-3"><strong>3.2.</strong> Each user must have unique credentials. Shared logins are not permitted. Administrators are responsible for the actions of all Authorized Users.</p>
            <p className="mb-3"><strong>3.3.</strong> You are responsible for maintaining the confidentiality of your credentials and notifying us immediately of any unauthorized access.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">4. Intellectual Property</h2>
            <p className="mb-3"><strong>4.1.</strong> Khesed-Tek Systems, LLC retains all rights to the source code, design, interface, trademarks, and content of the Platform.</p>
            <p className="mb-3"><strong>4.2.</strong> We grant you a limited, non-exclusive, non-transferable license to use the Services solely for your internal ministry purposes.</p>
            <p className="mb-3"><strong>4.3.</strong> You retain ownership of Church Data. You grant us a limited license to store and process it to provide the Services.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">5. Acceptable Use</h2>
            <p className="mb-3"><strong>5.1.</strong> Khesed-Tek CMS is designed exclusively to support churches and ministries aligned with traditional Christian values.</p>
            <p className="mb-3"><strong>5.2. Prohibited Conduct:</strong> storing or transmitting illegal, obscene, or defamatory content; sending spam; introducing malware; impersonating others; unauthorized access to other systems.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">6. Commercial Terms and Payments</h2>
            <p className="mb-3"><strong>6.1.</strong> Services are offered on a monthly or annual subscription basis. Prices may be modified with 30 days&apos; prior notice.</p>
            <p className="mb-3"><strong>6.2.</strong> Accounts more than 30 days past due may be suspended. An administrative fee of $30 USD may be applied per failed transaction.</p>
            <p className="mb-3"><strong>6.3. Mission Commitment.</strong> A portion of Khesed-Tek&apos;s earnings is allocated to fund Misión Khesed rehabilitation programs in Colombia and Latin America.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">7. Data and Security</h2>
            <p>Church Data belongs exclusively to you. We implement encryption in transit (HTTPS) and at rest, automated daily backups, and role-based access controls. We do not sell or share your data with third parties for marketing purposes.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">8. Service Availability</h2>
            <p>Services are provided &quot;AS IS&quot; and &quot;AS AVAILABLE.&quot; We do not guarantee uninterrupted availability. We are not liable for failures caused by events beyond our reasonable control.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">9. Limitation of Liability</h2>
            <p>To the maximum extent permitted by Delaware law, our total liability shall not exceed the total amount paid by you during the twelve (12) months preceding the event giving rise to the claim.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">10. Cancellation and Termination</h2>
            <p className="mb-3"><strong>10.1.</strong> You may cancel your subscription at any time from the administration panel. Cancellation takes effect at the end of the current billing period.</p>
            <p className="mb-3"><strong>10.2.</strong> We may suspend or terminate your access immediately if you violate these Terms or fail to make timely payments.</p>
            <p className="mb-3"><strong>10.3.</strong> Your data remains available for up to 90 days after cancellation to allow for export and recovery.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">11. Indemnification</h2>
            <p>You agree to indemnify and hold harmless Khesed-Tek Systems, LLC, its members, managers, employees, and agents from any claims arising from your use of the Services or violation of these Terms.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">12. General Provisions</h2>
            <p className="mb-3"><strong>12.1.</strong> These Terms, together with the Privacy Policy, constitute the entire agreement between the parties.</p>
            <p className="mb-3"><strong>12.2.</strong> You may not assign these Terms without our prior written consent.</p>
            <p className="mb-3"><strong>12.3.</strong> The state and federal courts of Delaware have exclusive jurisdiction for any disputes.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">13. Contact Information</h2>
            <div className="bg-muted/30 border border-border rounded-lg p-6 space-y-2">
              <p className="font-semibold text-foreground">Khesed-Tek Systems, LLC</p>
              <p className="text-muted-foreground text-xs">(Delaware Limited Liability Company)</p>
              <p>Email: <a href="mailto:legal@khesed-tek-systems.org" className="text-[hsl(var(--info))] underline">legal@khesed-tek-systems.org</a></p>
              <p>Phone: <a href="tel:+573011234410" className="text-[hsl(var(--info))] underline">+57 301 123 4410</a></p>
              <p>Website: <a href="https://www.khesed-tek-systems.org" className="text-[hsl(var(--info))] underline" target="_blank" rel="noopener noreferrer">www.khesed-tek-systems.org</a></p>
            </div>
          </section>
          <div className="border-t border-border pt-8"><p className="text-center text-muted-foreground font-medium">BY USING OUR SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS.</p></div>
        </div>
      )}

      {/* ── PORTUGUESE ── */}
      {lang === 'pt' && (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-10 text-muted-foreground text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">1. Definições e Partes</h2>
            <p className="mb-3"><strong>1.1. As Partes.</strong> Este acordo é celebrado entre a Khesed-Tek Systems, LLC, uma sociedade de responsabilidade limitada constituída sob as leis do Estado de Delaware (&quot;Khesed-Tek&quot;, &quot;nós&quot; ou &quot;nosso&quot;), e a igreja, ministério ou organização sem fins lucrativos (&quot;a Igreja&quot;, &quot;você&quot; ou &quot;seu&quot;) que contrata nossos Serviços.</p>
            <p className="mb-3"><strong>1.2. Definições Principais.</strong></p>
            <div className="overflow-x-auto"><table className="w-full border border-border text-sm"><thead className="bg-muted/30"><tr><th className="border border-border px-4 py-2 text-left font-semibold text-foreground w-40">Termo</th><th className="border border-border px-4 py-2 text-left font-semibold text-foreground">Definição</th></tr></thead><tbody>{[['Serviços','A plataforma Khesed-Tek CMS, aplicativos móveis, suporte técnico e quaisquer outros produtos oferecidos pela Khesed-Tek Systems.'],['Plataforma','O software de gestão ministerial Khesed-Tek CMS, acessível via web e dispositivos móveis.'],['Dados da Igreja','Todas as informações, registros e conteúdos que a Igreja insere, importa ou armazena na Plataforma.'],['Administrador','A pessoa designada pela Igreja para gerenciar a conta e conceder permissões a outros usuários.'],['Usuários Autorizados','Pastores, líderes, voluntários e membros que a Igreja autoriza a acessar a Plataforma.']].map(([t,d])=>(<tr key={t} className="even:bg-muted/30"><td className="border border-border px-4 py-2 font-medium text-foreground align-top">{t}</td><td className="border border-border px-4 py-2">{d}</td></tr>))}</tbody></table></div>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">2. Aceitação dos Termos</h2>
            <p className="mb-3"><strong>2.1.</strong> Ao criar uma conta ou usar os Serviços, você reconhece que leu, compreendeu e concorda em estar vinculado a estes Termos e à nossa Política de Privacidade. Se agir em nome de uma igreja, declara ter autoridade legal plena para vinculá-la.</p>
            <p className="mb-3"><strong>2.2. Modificações.</strong> Podemos modificar estes Termos a qualquer momento. Alterações materiais serão notificadas com pelo menos 30 dias de antecedência. O uso continuado constitui aceitação.</p>
            <p className="mb-3"><strong>2.3. Lei Aplicável.</strong> Estes Termos são regidos pelas leis do Estado de Delaware, EUA.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">3. Criação e Administração de Contas</h2>
            <p className="mb-3"><strong>3.1.</strong> Você deve fornecer informações completas e precisas ao se registrar, incluindo o nome legal completo da igreja, endereço de e-mail válido e informações de faturamento.</p>
            <p className="mb-3"><strong>3.2.</strong> Cada usuário deve ter credenciais únicas. Logins compartilhados não são permitidos. Os Administradores são responsáveis pelas ações de todos os Usuários Autorizados.</p>
            <p className="mb-3"><strong>3.3.</strong> Você é responsável por manter a confidencialidade de suas credenciais e nos notificar imediatamente sobre qualquer acesso não autorizado.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">4. Propriedade Intelectual</h2>
            <p className="mb-3"><strong>4.1.</strong> A Khesed-Tek Systems, LLC retém todos os direitos sobre o código-fonte, design, interface, marcas registradas e conteúdo da Plataforma.</p>
            <p className="mb-3"><strong>4.2.</strong> Concedemos a você uma licença limitada, não exclusiva e intransferível para usar os Serviços exclusivamente para seus fins ministeriais internos.</p>
            <p className="mb-3"><strong>4.3.</strong> Você retém a propriedade dos Dados da Igreja. Você nos concede uma licença limitada para armazená-los e processá-los a fim de prestação dos Serviços.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">5. Uso Aceitável</h2>
            <p className="mb-3"><strong>5.1.</strong> O Khesed-Tek CMS é projetado exclusivamente para apoiar igrejas e ministérios alinhados com valores cristãos tradicionais.</p>
            <p className="mb-3"><strong>5.2. Condutas Proibidas:</strong> armazenar ou transmitir conteúdo ilegal, obsceno ou difamatório; enviar spam; introduzir malware; se fazer passar por outros; acessar sem autorização outros sistemas.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">6. Termos Comerciais e Pagamentos</h2>
            <p className="mb-3"><strong>6.1.</strong> Os Serviços são oferecidos por assinatura mensal ou anual. Os preços podem ser modificados com 30 dias de aviso prévio.</p>
            <p className="mb-3"><strong>6.2.</strong> Contas com mais de 30 dias de atraso poderão ser suspensas. Uma taxa administrativa de $30 USD poderá ser aplicada por transação falhada.</p>
            <p className="mb-3"><strong>6.3. Compromisso Missionário.</strong> Uma parte dos ganhos da Khesed-Tek é destinada ao financiamento dos programas de reabilitação da Misión Khesed na Colômbia e na América Latina.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">7. Dados e Segurança</h2>
            <p>Os Dados da Igreja pertencem exclusivamente a você. Implementamos criptografia em trânsito (HTTPS) e em repouso, backups diários automatizados e controles de acesso baseados em funções. Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">8. Disponibilidade do Serviço</h2>
            <p>Os Serviços são fornecidos &quot;NO ESTADO EM QUE SE ENCONTRAM&quot; e &quot;CONFORME DISPONÍVEIS.&quot; Não garantimos disponibilidade ininterrupta. Não somos responsáveis por falhas causadas por eventos fora do nosso controle razoável.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">9. Limitação de Responsabilidade</h2>
            <p>Na extensão máxima permitida pela lei de Delaware, nossa responsabilidade total não excederá o valor total pago por você durante os doze (12) meses anteriores ao evento que originou a reclamação.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">10. Cancelamento e Rescisão</h2>
            <p className="mb-3"><strong>10.1.</strong> Você pode cancelar sua assinatura a qualquer momento pelo painel de administração. O cancelamento entra em vigor no final do período de faturamento atual.</p>
            <p className="mb-3"><strong>10.2.</strong> Podemos suspender ou encerrar seu acesso imediatamente se você violar estes Termos ou não realizar pagamentos em dia.</p>
            <p className="mb-3"><strong>10.3.</strong> Seus dados ficarão disponíveis por até 90 dias após o cancelamento para permitir exportação e recuperação.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">11. Indenização</h2>
            <p>Você concorda em indenizar e isentar de responsabilidade a Khesed-Tek Systems, LLC, seus membros, gestores, funcionários e agentes de quaisquer reclamações decorrentes do seu uso dos Serviços ou da violação destes Termos.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">12. Disposições Gerais</h2>
            <p className="mb-3"><strong>12.1.</strong> Estes Termos, juntamente com a Política de Privacidade, constituem o acordo completo entre as partes.</p>
            <p className="mb-3"><strong>12.2.</strong> Você não pode ceder estes Termos sem nosso consentimento prévio por escrito.</p>
            <p className="mb-3"><strong>12.3.</strong> Os tribunais estaduais e federais de Delaware têm jurisdição exclusiva para quaisquer disputas.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">13. Informações de Contato</h2>
            <div className="bg-muted/30 border border-border rounded-lg p-6 space-y-2">
              <p className="font-semibold text-foreground">Khesed-Tek Systems, LLC</p>
              <p className="text-muted-foreground text-xs">(Delaware Limited Liability Company)</p>
              <p>E-mail: <a href="mailto:legal@khesed-tek-systems.org" className="text-[hsl(var(--info))] underline">legal@khesed-tek-systems.org</a></p>
              <p>Telefone: <a href="tel:+573011234410" className="text-[hsl(var(--info))] underline">+57 301 123 4410</a></p>
              <p>Site: <a href="https://www.khesed-tek-systems.org" className="text-[hsl(var(--info))] underline" target="_blank" rel="noopener noreferrer">www.khesed-tek-systems.org</a></p>
            </div>
          </section>
          <div className="border-t border-border pt-8"><p className="text-center text-muted-foreground font-medium">AO USAR NOSSOS SERVIÇOS, VOCÊ RECONHECE QUE LEU, COMPREENDEU E CONCORDA EM ESTAR VINCULADO A ESTES TERMOS E CONDIÇÕES.</p></div>
        </div>
      )}

      {/* Page Footer */}
      <div className="bg-background text-muted-foreground/70 py-6 text-center text-xs">
        <p>© {new Date().getFullYear()} Khesed-Tek Systems, LLC. All rights reserved.</p>
        <p className="mt-1">A Delaware Limited Liability Company</p>
      </div>
    </div>
  )
}
