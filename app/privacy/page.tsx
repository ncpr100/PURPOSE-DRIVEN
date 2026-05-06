import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidad | Privacy Policy | Khesed-Tek Systems',
  description: 'Política de Privacidad / Privacy Policy / Política de Privacidade — Khesed-Tek Systems, LLC',
}

type Lang = 'es' | 'en' | 'pt'

export default function PrivacyPage({ searchParams }: { searchParams: { lang?: string } }) {
  const lang: Lang = searchParams?.lang === 'en' ? 'en' : searchParams?.lang === 'pt' ? 'pt' : 'es'

  const tabCls = (active: boolean) =>
    `px-4 py-2 rounded text-sm font-semibold border transition-colors ${
      active ? 'bg-[#0D1B2E] text-[#C9922A] border-[#0D1B2E]' : 'border-border text-muted-foreground hover:bg-muted'
    }`

  return (
    <div className="min-h-screen bg-white">

      {/* ── HEADER ── */}
      <div className="bg-background text-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold tracking-tight">
            {lang === 'es' && 'Política de Privacidad'}
            {lang === 'en' && 'Privacy Policy'}
            {lang === 'pt' && 'Política de Privacidade'}
          </h1>
          <p className="mt-2 text-muted-foreground/70">Khesed-Tek Systems, LLC</p>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === 'es' && 'Última Actualización: 9 de marzo de 2026'}
            {lang === 'en' && 'Last Updated: March 9, 2026'}
            {lang === 'pt' && 'Última Atualização: 9 de março de 2026'}
          </p>
        </div>
      </div>

      {/* ── LANGUAGE TABS + DOWNLOAD ── */}
      <div className="max-w-4xl mx-auto px-6 pt-8 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          <Link href="/privacy" className={tabCls(lang === 'es')}>🇪🇸 Español</Link>
          <Link href="/privacy?lang=en" className={tabCls(lang === 'en')}>🇺🇸 English</Link>
          <Link href="/privacy?lang=pt" className={tabCls(lang === 'pt')}>🇧🇷 Português</Link>
        </div>
        <a
          href="/downloads/privacy-policy.html"
          download="Khesed-Tek-Privacy-Policy.html"
          className="inline-flex items-center gap-2 bg-[#0D1B2E] text-[#C9922A] text-sm font-semibold px-5 py-2.5 rounded-md hover:opacity-90 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          {lang === 'es' && 'Descargar PDF'}
          {lang === 'en' && 'Download PDF'}
          {lang === 'pt' && 'Baixar PDF'}
        </a>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10 text-muted-foreground text-sm leading-relaxed">

        {/* 1 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            {lang === 'es' && '1. Introducción'}
            {lang === 'en' && '1. Introduction'}
            {lang === 'pt' && '1. Introdução'}
          </h2>
          <p>
            {lang === 'es' && 'Khesed-Tek Systems, LLC ("Khesed-Tek", "nosotros", "nos" o "nuestro"), una compañía de responsabilidad limitada de Delaware, está comprometida con la protección de la privacidad de las iglesias, ministerios y organizaciones ("usted" o "su") que utilizan nuestra plataforma de gestión ministerial. Esta Política de Privacidad explica cómo recopilamos, utilizamos, divulgamos y protegemos su información cuando utiliza nuestros Servicios.'}
            {lang === 'en' && 'Khesed-Tek Systems, LLC ("Khesed-Tek", "we", "us", or "our"), a Delaware limited liability company, is committed to protecting the privacy of the churches, ministries, and organizations ("you" or "your") that use our church management platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Services.'}
            {lang === 'pt' && 'Khesed-Tek Systems, LLC ("Khesed-Tek", "nós", "nos" ou "nosso"), uma sociedade de responsabilidade limitada de Delaware, está comprometida com a proteção da privacidade das igrejas, ministérios e organizações ("você" ou "seu") que utilizam nossa plataforma de gestão ministerial. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você usa nossos Serviços.'}
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            {lang === 'es' && '2. Información que Recopilamos'}
            {lang === 'en' && '2. Information We Collect'}
            {lang === 'pt' && '2. Informações que Coletamos'}
          </h2>
          <p className="mb-3">
            {lang === 'es' && <><strong>2.1. Información de Cuenta.</strong> Al registrarse, recopilamos: nombre de la iglesia u organización, nombre del administrador, dirección de correo electrónico, número de teléfono e información de facturación.</>}
            {lang === 'en' && <><strong>2.1. Account Information.</strong> When you register, we collect: the church or organization name, administrator name, email address, phone number, and billing information.</>}
            {lang === 'pt' && <><strong>2.1. Informações de Conta.</strong> Ao se registrar, coletamos: nome da igreja ou organização, nome do administrador, endereço de e-mail, número de telefone e informações de faturamento.</>}
          </p>
          <p className="mb-3">
            {lang === 'es' && <><strong>2.2. Datos de la Iglesia.</strong> Datos que ingresa en la plataforma, incluyendo registros de miembros, asistencia, donaciones, peticiones de oración, información de eventos y comunicaciones. Usted conserva la plena titularidad de estos datos.</>}
            {lang === 'en' && <><strong>2.2. Church Data.</strong> Data you enter into the platform including member records, attendance, donations, prayer requests, event information, and communications. You retain full ownership of this data.</>}
            {lang === 'pt' && <><strong>2.2. Dados da Igreja.</strong> Dados que você insere na plataforma, incluindo registros de membros, frequência, doações, pedidos de oração, informações de eventos e comunicações. Você retém a propriedade total desses dados.</>}
          </p>
          <p className="mb-3">
            {lang === 'es' && <><strong>2.3. Datos de Uso.</strong> Recopilamos automáticamente información sobre cómo interactúa con la plataforma, incluyendo datos de registro, direcciones IP, tipo de navegador, páginas visitadas y acciones realizadas.</>}
            {lang === 'en' && <><strong>2.3. Usage Data.</strong> We automatically collect information about how you interact with the platform, including log data, IP addresses, browser type, pages visited, and actions taken.</>}
            {lang === 'pt' && <><strong>2.3. Dados de Uso.</strong> Coletamos automaticamente informações sobre como você interage com a plataforma, incluindo dados de log, endereços IP, tipo de navegador, páginas visitadas e ações realizadas.</>}
          </p>
          <p className="mb-3">
            {lang === 'es' && <><strong>2.4. Información de Pago.</strong> Los detalles de pago son procesados por nuestro procesador de pagos (Paddle). No almacenamos números completos de tarjetas de crédito en nuestros servidores.</>}
            {lang === 'en' && <><strong>2.4. Payment Information.</strong> Payment details are processed by our payment processor (Paddle). We do not store full credit card numbers on our servers.</>}
            {lang === 'pt' && <><strong>2.4. Informações de Pagamento.</strong> Os detalhes de pagamento são processados pelo nosso processador de pagamentos (Paddle). Não armazenamos números completos de cartão de crédito em nossos servidores.</>}
          </p>
          <p className="mb-3">
            {lang === 'es' && <><strong>2.5. Comunicaciones.</strong> Si contacta a nuestro equipo de soporte, conservamos registros de esas comunicaciones.</>}
            {lang === 'en' && <><strong>2.5. Communications.</strong> If you contact our support team, we retain records of those communications.</>}
            {lang === 'pt' && <><strong>2.5. Comunicações.</strong> Se você entrar em contato com nossa equipe de suporte, mantemos registros dessas comunicações.</>}
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            {lang === 'es' && '3. Cómo Utilizamos su Información'}
            {lang === 'en' && '3. How We Use Your Information'}
            {lang === 'pt' && '3. Como Usamos Suas Informações'}
          </h2>
          <p className="mb-3">
            {lang === 'es' && 'Utilizamos la información recopilada para:'}
            {lang === 'en' && 'We use the information we collect to:'}
            {lang === 'pt' && 'Usamos as informações coletadas para:'}
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            {lang === 'es' && <>
              <li>Proveer, operar y mantener la plataforma Khesed-Tek CMS</li>
              <li>Procesar pagos y gestionar suscripciones</li>
              <li>Enviar correos transaccionales (recibos, facturas, notificaciones de servicio)</li>
              <li>Brindar soporte al cliente y responder consultas</li>
              <li>Mejorar y desarrollar nuevas funciones para la plataforma</li>
              <li>Monitorear y analizar patrones de uso para mejorar la experiencia del usuario</li>
              <li>Detectar, prevenir y resolver problemas técnicos o brechas de seguridad</li>
              <li>Cumplir con obligaciones legales</li>
            </>}
            {lang === 'en' && <>
              <li>Provide, operate, and maintain the Khesed-Tek CMS platform</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send transactional emails (receipts, invoices, service notifications)</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Improve and develop new features for the platform</li>
              <li>Monitor and analyze usage patterns to enhance user experience</li>
              <li>Detect, prevent, and address technical issues or security breaches</li>
              <li>Comply with legal obligations</li>
            </>}
            {lang === 'pt' && <>
              <li>Fornecer, operar e manter a plataforma Khesed-Tek CMS</li>
              <li>Processar pagamentos e gerenciar assinaturas</li>
              <li>Enviar e-mails transacionais (recibos, faturas, notificações de serviço)</li>
              <li>Fornecer suporte ao cliente e responder a consultas</li>
              <li>Melhorar e desenvolver novos recursos para a plataforma</li>
              <li>Monitorar e analisar padrões de uso para melhorar a experiência do usuário</li>
              <li>Detectar, prevenir e resolver problemas técnicos ou violações de segurança</li>
              <li>Cumprir obrigações legais</li>
            </>}
          </ul>
          <p>
            {lang === 'es' && <strong>No vendemos sus datos ni los utilizamos para fines publicitarios.</strong>}
            {lang === 'en' && <strong>We do not sell your data or use it for advertising purposes.</strong>}
            {lang === 'pt' && <strong>Não vendemos seus dados nem os usamos para fins publicitários.</strong>}
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            {lang === 'es' && '4. Compartición y Divulgación de Datos'}
            {lang === 'en' && '4. Data Sharing and Disclosure'}
            {lang === 'pt' && '4. Compartilhamento e Divulgação de Dados'}
          </h2>
          <p className="mb-3">
            {lang === 'es' && 'Solo compartimos su información en las siguientes circunstancias:'}
            {lang === 'en' && 'We may share your information only in the following circumstances:'}
            {lang === 'pt' && 'Podemos compartilhar suas informações apenas nas seguintes circunstâncias:'}
          </p>
          <p className="mb-3">
            {lang === 'es' && <><strong>4.1. Proveedores de Servicios.</strong> Compartimos datos con proveedores terceros de confianza que nos asisten en la operación de la plataforma (alojamiento en la nube, procesamiento de pagos, entrega de correos). Estos proveedores están sujetos a estrictos acuerdos de confidencialidad.</>}
            {lang === 'en' && <><strong>4.1. Service Providers.</strong> We share data with trusted third-party providers who assist us in operating the platform (cloud hosting, payment processing, email delivery). These providers are bound by strict confidentiality agreements.</>}
            {lang === 'pt' && <><strong>4.1. Provedores de Serviços.</strong> Compartilhamos dados com provedores terceiros de confiança que nos auxiliam na operação da plataforma (hospedagem em nuvem, processamento de pagamentos, entrega de e-mails). Esses provedores estão sujeitos a rígidos acordos de confidencialidade.</>}
          </p>
          <p className="mb-3">
            {lang === 'es' && <><strong>4.2. Requisitos Legales.</strong> Podemos divulgar datos si lo exige la ley, una orden judicial o una autoridad gubernamental.</>}
            {lang === 'en' && <><strong>4.2. Legal Requirements.</strong> We may disclose data if required by law, court order, or governmental authority.</>}
            {lang === 'pt' && <><strong>4.2. Exigências Legais.</strong> Podemos divulgar dados conforme exigido por lei, ordem judicial ou autoridade governamental.</>}
          </p>
          <p className="mb-3">
            {lang === 'es' && <><strong>4.3. Transferencias Comerciales.</strong> En caso de fusión, adquisición o venta de activos, sus datos pueden ser transferidos. Le notificaremos antes de que esto ocurra.</>}
            {lang === 'en' && <><strong>4.3. Business Transfers.</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred. We will notify you before this occurs.</>}
            {lang === 'pt' && <><strong>4.3. Transferências Comerciais.</strong> Em caso de fusão, aquisição ou venda de ativos, seus dados podem ser transferidos. Notificaremos você antes que isso ocorra.</>}
          </p>
          <p className="mb-3">
            {lang === 'es' && <><strong>4.4. Datos Agregados.</strong> Podemos compartir estadísticas anónimas y agregadas que no identifiquen a ninguna iglesia o persona en particular.</>}
            {lang === 'en' && <><strong>4.4. Aggregated Data.</strong> We may share anonymized, aggregated statistics that cannot identify any individual church or person.</>}
            {lang === 'pt' && <><strong>4.4. Dados Agregados.</strong> Podemos compartilhar estatísticas anônimas e agregadas que não identifiquem nenhuma igreja ou pessoa.</>}
          </p>
          <p>
            {lang === 'es' && <strong>Nunca vendemos, alquilamos ni comerciamos sus datos personales a terceros con fines de marketing.</strong>}
            {lang === 'en' && <strong>We never sell, rent, or trade your personal data to third parties for marketing purposes.</strong>}
            {lang === 'pt' && <strong>Nunca vendemos, alugamos ou negociamos seus dados pessoais a terceiros para fins de marketing.</strong>}
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            {lang === 'es' && '5. Seguridad de los Datos'}
            {lang === 'en' && '5. Data Security'}
            {lang === 'pt' && '5. Segurança dos Dados'}
          </h2>
          <p className="mb-3">
            {lang === 'es' && 'Implementamos medidas de seguridad estándar del sector para proteger sus datos:'}
            {lang === 'en' && 'We implement industry-standard security measures to protect your data:'}
            {lang === 'pt' && 'Implementamos medidas de segurança padrão do setor para proteger seus dados:'}
          </p>
          <ul className="list-disc pl-6 space-y-1">
            {lang === 'es' && <>
              <li>Cifrado en tránsito (HTTPS/TLS) y en reposo (AES-256)</li>
              <li>Copias de seguridad diarias automáticas con almacenamiento externo</li>
              <li>Controles de acceso basados en roles que limitan el acceso a los datos al personal autorizado</li>
              <li>Auditorías de seguridad periódicas y evaluaciones de vulnerabilidades</li>
              <li>Sistemas de monitoreo de actividades sospechosas y accesos no autorizados</li>
            </>}
            {lang === 'en' && <>
              <li>Encryption in transit (HTTPS/TLS) and at rest (AES-256)</li>
              <li>Automated daily backups with offsite storage</li>
              <li>Role-based access controls limiting data access to authorized personnel only</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Monitoring systems for suspicious activity and unauthorized access</li>
            </>}
            {lang === 'pt' && <>
              <li>Criptografia em trânsito (HTTPS/TLS) e em repouso (AES-256)</li>
              <li>Backups diários automatizados com armazenamento externo</li>
              <li>Controles de acesso baseados em funções, limitando o acesso aos dados apenas ao pessoal autorizado</li>
              <li>Auditorias de segurança regulares e avaliações de vulnerabilidades</li>
              <li>Sistemas de monitoramento de atividades suspeitas e acessos não autorizados</li>
            </>}
          </ul>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            {lang === 'es' && '6. Retención de Datos'}
            {lang === 'en' && '6. Data Retention'}
            {lang === 'pt' && '6. Retenção de Dados'}
          </h2>
          <p className="mb-3">
            {lang === 'es' && 'Conservamos sus datos mientras su cuenta esté activa o según sea necesario para prestar los servicios. Tras la cancelación:'}
            {lang === 'en' && 'We retain your data for as long as your account is active or as needed to provide services. Upon cancellation:'}
            {lang === 'pt' && 'Mantemos seus dados enquanto sua conta estiver ativa ou conforme necessário para fornecer os serviços. Após o cancelamento:'}
          </p>
          <ul className="list-disc pl-6 space-y-1">
            {lang === 'es' && <>
              <li>Sus datos permanecen accesibles hasta 90 días para permitir su exportación y recuperación</li>
              <li>Después de 90 días, sus datos se eliminan permanentemente de nuestros sistemas</li>
              <li>Los registros de facturación y transacciones pueden conservarse hasta 7 años según lo exija la ley</li>
            </>}
            {lang === 'en' && <>
              <li>Your data remains accessible for up to 90 days to allow for export and recovery</li>
              <li>After 90 days, your data is permanently deleted from our systems</li>
              <li>Billing and transaction records may be retained for up to 7 years as required by law</li>
            </>}
            {lang === 'pt' && <>
              <li>Seus dados permanecem acessíveis por até 90 dias para permitir exportação e recuperação</li>
              <li>Após 90 dias, seus dados são excluídos permanentemente dos nossos sistemas</li>
              <li>Registros de faturamento e transações podem ser retidos por até 7 anos conforme exigido por lei</li>
            </>}
          </ul>
        </section>

        {/* 7 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            {lang === 'es' && '7. Sus Derechos'}
            {lang === 'en' && '7. Your Rights'}
            {lang === 'pt' && '7. Seus Direitos'}
          </h2>
          <p className="mb-3">
            {lang === 'es' && 'Como usuario de nuestra plataforma, tiene derecho a:'}
            {lang === 'en' && 'As a user of our platform, you have the right to:'}
            {lang === 'pt' && 'Como usuário de nossa plataforma, você tem o direito de:'}
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            {lang === 'es' && <>
              <li><strong>Acceso:</strong> Solicitar una copia de los datos que conservamos sobre su organización</li>
              <li><strong>Corrección:</strong> Actualizar o corregir información inexacta</li>
              <li><strong>Eliminación:</strong> Solicitar la eliminación de sus datos (sujeto a requisitos de retención legal)</li>
              <li><strong>Portabilidad:</strong> Exportar sus Datos de la Iglesia en formatos estándar (CSV, Excel)</li>
              <li><strong>Objeción:</strong> Oponerse al tratamiento de sus datos en ciertas circunstancias</li>
            </>}
            {lang === 'en' && <>
              <li><strong>Access:</strong> Request a copy of the data we hold about your organization</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your data (subject to legal retention requirements)</li>
              <li><strong>Portability:</strong> Export your Church Data in standard formats (CSV, Excel)</li>
              <li><strong>Objection:</strong> Object to processing of your data in certain circumstances</li>
            </>}
            {lang === 'pt' && <>
              <li><strong>Acesso:</strong> Solicitar uma cópia dos dados que mantemos sobre sua organização</li>
              <li><strong>Correção:</strong> Atualizar ou corrigir informações imprecisas</li>
              <li><strong>Exclusão:</strong> Solicitar a exclusão dos seus dados (sujeito a requisitos legais de retenção)</li>
              <li><strong>Portabilidade:</strong> Exportar seus Dados da Igreja em formatos padrão (CSV, Excel)</li>
              <li><strong>Oposição:</strong> Opor-se ao processamento dos seus dados em determinadas circunstâncias</li>
            </>}
          </ul>
          <p>
            {lang === 'es' && <>Para ejercer cualquiera de estos derechos, contáctenos en <a href="mailto:legal@khesed-tek-systems.org" className="text-[hsl(var(--info))] underline">legal@khesed-tek-systems.org</a>.</>}
            {lang === 'en' && <>To exercise any of these rights, contact us at <a href="mailto:legal@khesed-tek-systems.org" className="text-[hsl(var(--info))] underline">legal@khesed-tek-systems.org</a>.</>}
            {lang === 'pt' && <>Para exercer qualquer um desses direitos, entre em contato conosco em <a href="mailto:legal@khesed-tek-systems.org" className="text-[hsl(var(--info))] underline">legal@khesed-tek-systems.org</a>.</>}
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            {lang === 'es' && '8. Privacidad de los Menores'}
            {lang === 'en' && "8. Children's Privacy"}
            {lang === 'pt' && '8. Privacidade de Menores'}
          </h2>
          <p>
            {lang === 'es' && 'Nuestra plataforma no está dirigida a personas menores de 13 años. Si su iglesia almacena información sobre menores, usted es responsable de garantizar que ha obtenido el consentimiento parental o del tutor necesario según la ley aplicable, incluida la Ley COPPA si aplica.'}
            {lang === 'en' && "Our platform is not directed at individuals under 13 years of age. If your church stores information about minors, you are responsible for ensuring you have obtained the necessary parental or guardian consent as required by applicable law, including COPPA (Children's Online Privacy Protection Act) if applicable."}
            {lang === 'pt' && 'Nossa plataforma não é direcionada a indivíduos menores de 13 anos. Se sua igreja armazena informações sobre menores, você é responsável por garantir que obteve o consentimento parental ou do responsável necessário conforme a lei aplicável, incluindo a COPPA se aplicável.'}
          </p>
        </section>

        {/* 9 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            {lang === 'es' && '9. Transferencias Internacionales de Datos'}
            {lang === 'en' && '9. International Data Transfers'}
            {lang === 'pt' && '9. Transferências Internacionais de Dados'}
          </h2>
          <p>
            {lang === 'es' && 'Khesed-Tek Systems, LLC tiene su sede en los Estados Unidos. Sus datos pueden almacenarse y procesarse en los Estados Unidos u otros países donde operan nuestros proveedores de servicios. Al utilizar nuestros Servicios, usted consiente la transferencia de sus datos a países que pueden tener leyes de protección de datos diferentes. Garantizamos que existen salvaguardas adecuadas para todas las transferencias internacionales.'}
            {lang === 'en' && 'Khesed-Tek Systems, LLC is based in the United States. Your data may be stored and processed in the United States or other countries where our service providers operate. By using our Services, you consent to the transfer of your data to countries that may have different data protection laws than your country of residence. We ensure appropriate safeguards are in place for all international transfers.'}
            {lang === 'pt' && 'Khesed-Tek Systems, LLC está sediada nos Estados Unidos. Seus dados podem ser armazenados e processados nos Estados Unidos ou em outros países onde nossos provedores de serviços operam. Ao usar nossos Serviços, você consente com a transferência dos seus dados para países que podem ter leis de proteção de dados diferentes. Garantimos que salvaguardas adequadas estão em vigor para todas as transferências internacionais.'}
          </p>
        </section>

        {/* 10 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            {lang === 'es' && '10. Cookies y Seguimiento'}
            {lang === 'en' && '10. Cookies and Tracking'}
            {lang === 'pt' && '10. Cookies e Rastreamento'}
          </h2>
          <p className="mb-3">
            {lang === 'es' && 'Utilizamos cookies y tecnologías similares para:'}
            {lang === 'en' && 'We use cookies and similar technologies to:'}
            {lang === 'pt' && 'Usamos cookies e tecnologias similares para:'}
          </p>
          <ul className="list-disc pl-6 space-y-1">
            {lang === 'es' && <>
              <li>Mantener su sesión de inicio de sesión</li>
              <li>Recordar sus preferencias</li>
              <li>Analizar patrones de uso de la plataforma</li>
              <li>Mejorar la funcionalidad de la plataforma</li>
            </>}
            {lang === 'en' && <>
              <li>Maintain your login session</li>
              <li>Remember your preferences</li>
              <li>Analyze platform usage patterns</li>
              <li>Improve platform functionality</li>
            </>}
            {lang === 'pt' && <>
              <li>Manter sua sessão de login</li>
              <li>Lembrar suas preferências</li>
              <li>Analisar padrões de uso da plataforma</li>
              <li>Melhorar a funcionalidade da plataforma</li>
            </>}
          </ul>
          <p className="mt-3">
            {lang === 'es' && 'Puede controlar la configuración de cookies a través de su navegador. La desactivación de cookies puede afectar ciertas funciones de la plataforma.'}
            {lang === 'en' && 'You can control cookie settings through your browser. Disabling cookies may affect certain platform features.'}
            {lang === 'pt' && 'Você pode controlar as configurações de cookies pelo seu navegador. Desativar cookies pode afetar determinados recursos da plataforma.'}
          </p>
        </section>

        {/* 11 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            {lang === 'es' && '11. Cambios a esta Política'}
            {lang === 'en' && '11. Changes to This Policy'}
            {lang === 'pt' && '11. Alterações a Esta Política'}
          </h2>
          <p>
            {lang === 'es' && 'Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos sobre cambios importantes por correo electrónico o a través de la plataforma con al menos 30 días de anticipación. Su uso continuado de los Servicios después de la fecha efectiva constituye la aceptación de la política actualizada.'}
            {lang === 'en' && 'We may update this Privacy Policy from time to time. We will notify you of material changes via email or through the platform at least 30 days before the changes take effect. Your continued use of the Services after the effective date constitutes acceptance of the updated policy.'}
            {lang === 'pt' && 'Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças materiais por e-mail ou através da plataforma com pelo menos 30 dias de antecedência. O uso contínuo dos Serviços após a data de vigência constitui aceitação da política atualizada.'}
          </p>
        </section>

        {/* 12 */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            {lang === 'es' && '12. Contáctenos'}
            {lang === 'en' && '12. Contact Us'}
            {lang === 'pt' && '12. Entre em Contato'}
          </h2>
          <div className="bg-muted/30 border border-border rounded-lg p-6 space-y-2">
            <p className="font-semibold text-foreground">Khesed-Tek Systems, LLC</p>
            <p className="text-muted-foreground text-xs">(Delaware Limited Liability Company)</p>
            <p>
              {lang === 'es' && 'Correo: '}
              {lang === 'en' && 'Email: '}
              {lang === 'pt' && 'E-mail: '}
              <a href="mailto:legal@khesed-tek-systems.org" className="text-[hsl(var(--info))] underline">legal@khesed-tek-systems.org</a>
            </p>
            <p>
              {lang === 'es' && 'Teléfono: '}
              {lang === 'en' && 'Phone: '}
              {lang === 'pt' && 'Telefone: '}
              <a href="tel:+573011234410" className="text-[hsl(var(--info))] underline">+57 301 123 4410</a>
            </p>
            <p>
              {lang === 'es' && 'Sitio web: '}
              {lang === 'en' && 'Website: '}
              {lang === 'pt' && 'Website: '}
              <a href="https://www.khesed-tek-systems.org" className="text-[hsl(var(--info))] underline" target="_blank" rel="noopener noreferrer">www.khesed-tek-systems.org</a>
            </p>
          </div>
        </section>

        {/* Acknowledgment */}
        <div className="border-t border-border pt-8 mt-8">
          <p className="text-center text-muted-foreground font-medium">
            {lang === 'es' && 'AL USAR NUESTROS SERVICIOS, USTED RECONOCE QUE HA LEÍDO Y COMPRENDIDO ESTA POLÍTICA DE PRIVACIDAD.'}
            {lang === 'en' && 'BY USING OUR SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTOOD THIS PRIVACY POLICY.'}
            {lang === 'pt' && 'AO USAR NOSSOS SERVIÇOS, VOCÊ RECONHECE QUE LEU E COMPREENDEU ESTA POLÍTICA DE PRIVACIDADE.'}
          </p>
        </div>
      </div>

      {/* ── PAGE FOOTER ── */}
      <div className="bg-background text-muted-foreground/70 py-6 text-center text-xs">
        <p>
          {'© '}
          {new Date().getFullYear()}
          {lang === 'es' && ' Khesed-Tek Systems, LLC. Todos los derechos reservados.'}
          {lang === 'en' && ' Khesed-Tek Systems, LLC. All rights reserved.'}
          {lang === 'pt' && ' Khesed-Tek Systems, LLC. Todos os direitos reservados.'}
        </p>
        <p className="mt-1">A Delaware Limited Liability Company</p>
      </div>
    </div>
  )
}
