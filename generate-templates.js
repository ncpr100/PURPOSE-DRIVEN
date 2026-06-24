const fs = require('fs');
const path = require('path');
if (!fs.existsSync('templates')) {
  fs.mkdirSync('templates');
}
// ═══════════════════════════════════════════════════════════════
// PLANTILLA 2: Agent 12 Cascade (Corregida)
// ═══════════════════════════════════════════════════════════════
const agent12 = <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WhatsApp Next Steps - Agent 12 Cascade Template (ES / EN / PT) | Khesed-Tek Systems</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: Arial, sans-serif; max-width: 860px; margin: 40px auto; padding: 0 24px; color: #1a1a2e; }
    h1 { color: #0D1B2E; border-bottom: 3px solid #C9922A; padding-bottom: 10px; }
    h2 { color: #C9922A; margin-top: 32px; }
    .badge { display: inline-block; background: #0D1B2E; color: #C9922A; font-size: 11px; font-weight: bold; padding: 3px 10px; border-radius: 12px; margin-right: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
    .lang-badge { display: inline-block; font-size: 12px; font-weight: bold; padding: 4px 12px; border-radius: 12px; margin-right: 6px; text-transform: uppercase; }
    .lang-es { background: #c0392b; color: white; }
    .lang-en { background: #1a5276; color: white; }
    .lang-pt { background: #1e8449; color: white; }
    .field-block { background: #f8f8f0; border: 1px solid #ddd; border-left: 4px solid #C9922A; border-radius: 4px; padding: 14px 18px; margin: 10px 0; }
    .field-label { font-size: 11px; font-weight: bold; color: #666; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; }
    .field-value { font-size: 14px; color: #1a1a2e; white-space: pre-wrap; line-height: 1.6; }
    .variable-table, .use-case-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    .variable-table th, .use-case-table th { background: #0D1B2E; color: #C9922A; padding: 10px 14px; text-align: left; font-size: 12px; }
    .variable-table td, .use-case-table td { padding: 9px 14px; border-bottom: 1px solid #eee; font-size: 13px; vertical-align: top; }
    .variable-table tr:nth-child(even), .use-case-table tr:nth-child(even) { background: #f5f5f5; }
    .step { background: #fff; border: 1px solid #e0e0e0; border-radius: 6px; padding: 16px 20px; margin: 12px 0; }
    .step-num { display: inline-block; width: 26px; height: 26px; background: #C9922A; color: white; border-radius: 50%; text-align: center; line-height: 26px; font-weight: bold; font-size: 13px; margin-right: 10px; }
    .warning { background: #fff8e1; border: 1px solid #f0c040; border-radius: 4px; padding: 12px 16px; margin: 16px 0; font-size: 13px; }
    .tip { background: #e8f5e9; border: 1px solid #a5d6a7; border-radius: 4px; padding: 12px 16px; margin: 16px 0; font-size: 13px; }
    .wa-preview { background: #e5ddd5; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .wa-bubble { background: white; border-radius: 8px 8px 8px 0; padding: 12px 16px; max-width: 420px; box-shadow: 0 1px 2px rgba(0,0,0,0.15); font-size: 13px; line-height: 1.6; }
    .wa-header { font-weight: bold; font-size: 14px; margin-bottom: 8px; color: #075e54; }
    .wa-footer { font-size: 11px; color: #999; margin-top: 8px; }
    footer { margin-top: 48px; border-top: 1px solid #ddd; padding-top: 16px; font-size: 11px; color: #888; text-align: center; }
    .tabs { display: flex; gap: 4px; margin: 24px 0 0; border-bottom: 2px solid #C9922A; }
    .tab-btn { padding: 10px 22px; border: none; background: #f0ede6; color: #555; font-weight: bold; font-size: 13px; cursor: pointer; border-radius: 6px 6px 0 0; }
    .tab-btn.active { background: #C9922A; color: white; }
    .tab-btn:hover:not(.active) { background: #e8d9b8; }
    .tab-panel { display: none; padding: 24px 0; }
    .tab-panel.active { display: block; }
    .lang-section-header { display: flex; align-items: center; gap: 12px; background: #0D1B2E; color: #C9922A; padding: 14px 20px; border-radius: 6px; margin-bottom: 20px; }
    .lang-section-header h2 { color: #C9922A; margin: 0; font-size: 18px; }
    .header-bar { background: #0D1B2E; color: #C9922A; padding: 12px 20px; border-radius: 6px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    .print-btn { background: #C9922A; color: #0D1B2E; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; }
    .subtitle { color: #555; font-size: 13px; }
    .step-link { color: #0D1B2E; text-decoration: underline; }
    .tip-margin { margin-top: 32px; }
    @media print {
      .no-print { display: none !important; }
      .tabs { display: none; }
      .tab-panel { display: block !important; }
      .tab-panel + .tab-panel { page-break-before: always; margin-top: 40px; }
    }
  </style>
</head>
<body>
  <div class="header-bar no-print">
    <strong>Khesed-Tek Systems, LLC — WhatsApp Next Steps Submission Guide</strong>
    <button class="print-btn" onclick="window.print()">&#x2B73; Download / Print PDF (All Languages)</button>
  </div>
  <h1>WhatsApp Next Steps<br/>Template Submission - Agent 12 Cascade Alert</h1>
  <p class="subtitle">
    <span class="badge">Template 2 of 4</span>
    <span class="badge">Category: Utility</span>
    <span class="badge">Name: agent12_cascade_khesed_tek</span>
    <span class="lang-badge lang-es">ES</span>
    <span class="lang-badge lang-en">EN</span>
    <span class="lang-badge lang-pt">PT</span>
  </p>
  <p>Use this document when filling in the Meta Business Manager template form at <strong>business.facebook.com</strong>. Submit once per language — each language is a separate submission using the <strong>same template name</strong>.</p>
  <div class="warning">
    <strong>Important:</strong> Meta does not accept file uploads. You must manually enter each field in Meta Business Manager. Use this document as your copy-paste reference.<br/><br/>
    <strong>Recommended submission order:</strong> Spanish (es) first, then English (en), then Portuguese pt_BR.
  </div>
  <div class="tabs no-print">
    <button class="tab-btn active" onclick="showTab('es',this)">Spanish (es)</button>
    <button class="tab-btn" onclick="showTab('en',this)">English (en)</button>
    <button class="tab-btn" onclick="showTab('pt',this)">Portuguese (pt_BR)</button>
  </div>
  <!-- SPANISH -->
  <div id="tab-es" class="tab-panel active">
    <div class="lang-section-header"><span class="lang-badge lang-es">ES</span><h2>Spanish (es) — Espanol</h2></div>
    <h2>Template Fields</h2>
    <div class="field-block"><div class="field-label">Template Name</div><div class="field-value">agent12_cascade_khesed_tek</div></div>
    <div class="field-block"><div class="field-label">Category</div><div class="field-value">UTILITY</div></div>
    <div class="field-block"><div class="field-label">Language</div><div class="field-value">Spanish (es)</div></div>
    <div class="field-block"><div class="field-label">Header Type</div><div class="field-value">TEXT</div></div>
    <div class="field-block"><div class="field-label">Header Text (max 60 chars)</div><div class="field-value">Notificacion Pastoral — Kh. CMS</div></div>
    <div class="field-block"><div class="field-label">Body Text</div><div class="field-value">Hola, {{1}} de *{{2}}*,
Ha ocurrido un evento que requiere su atencion pastoral:
*{{3}}*
{{4}}
Por favor, revise su panel de administracion para ver los detalles completos y tomar accion.
Khesed-tek — Sistema de Cascada Pastoral</div></div>
    <div class="field-block"><div class="field-label">Footer Text (max 60 chars)</div><div class="field-value">soporte@khesed-tek-systems.org</div></div>
    <div class="field-block"><div class="field-label">Button Type</div><div class="field-value">None (text-only notification)</div></div>
    <h2>Variable Reference</h2>
    <table class="variable-table">
      <thead><tr><th>Meta Variable</th><th>System Variable</th><th>Example Value</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td>{{1}}</td><td>adminName</td><td>Pastor Carlos</td><td>Pastor / admin name</td></tr>
        <tr><td>{{2}}</td><td>churchName</td><td>Iglesia Central</td><td>Church name</td></tr>
        <tr><td>{{3}}</td><td>alertTitle</td><td>Nuevo Visitante Registrado</td><td>Short title of the alert event</td></tr>
        <tr><td>{{4}}</td><td>alertDetail</td><td>Maria Lopez se registro como nueva visitante el 06/05/2026.</td><td>Full detail of the event</td></tr>
      </tbody>
    </table>
    <h2>Use Cases for {{3}} and {{4}}</h2>
    <table class="use-case-table">
      <thead><tr><th>Use Case</th><th>{{3}} — Alert Title</th><th>{{4}} — Alert Detail</th></tr></thead>
      <tbody>
        <tr><td>New Visitor</td><td>Nuevo Visitante Registrado</td><td>Maria Lopez se registro el 06/05/2026 y solicita seguimiento.</td></tr>
        <tr><td>Prayer Request</td><td>Nueva Solicitud de Oracion</td><td>Juan Perez solicita oracion por sanidad familiar.</td></tr>
        <tr><td>Donation</td><td>Donacion Recibida</td><td>Se recibio una donacion de  a la cuenta General.</td></tr>
        <tr><td>Volunteer Application</td><td>Nueva Solicitud de Voluntario</td><td>Ana Garza desea servir en el ministerio de ninos.</td></tr>
        <tr><td>Spiritual Assessment</td><td>Evaluacion Espiritual Completada</td><td>Carlos Ruiz completo su evaluacion espiritual.</td></tr>
        <tr><td>System Alert</td><td>Alerta del Sistema</td><td>Se detecto un acceso inusual a la plataforma.</td></tr>
      </tbody>
    </table>
    <h2>WhatsApp Preview</h2>
    <div class="wa-preview"><div class="wa-bubble">
      <div class="wa-header">Notificacion Pastoral — Kh. CMS</div>
      Hola, Pastor Carlos de <strong>Iglesia Central</strong>,<br/><br/>
      Ha ocurrido un evento que requiere su atencion pastoral:<br/><br/>
      <strong>Nuevo Visitante Registrado</strong><br/>
      Maria Lopez se registro como nueva visitante el 06/05/2026.<br/><br/>
      Por favor, revise su panel para ver los detalles completos.<br/><br/>
      Khesed-tek — Sistema de Cascada Pastoral
      <div class="wa-footer">soporte@khesed-tek-systems.org</div>
    </div></div>
    <h2>Step-by-Step Submission</h2>
    <div class="step"><span class="step-num">1</span>Go to <a href="https://business.facebook.com" target="_blank" rel="noopener noreferrer" class="step-link">business.facebook.com</a> → WhatsApp Manager</div>
    <div class="step"><span class="step-num">2</span>Account Tools → Message Templates → Create Template</div>
    <div class="step"><span class="step-num">3</span><strong>Category:</strong> Utility</div>
    <div class="step"><span class="step-num">4</span><strong>Template Name:</strong> <code>agent12_cascade_khesed_tek</code></div>
    <div class="step"><span class="step-num">5</span><strong>Language:</strong> Spanish (es)</div>
    <div class="step"><span class="step-num">6</span>Header → Text → paste header above</div>
    <div class="step"><span class="step-num">7</span>Body → paste body above. Enter sample values from table when prompted for each variable</div>
    <div class="step"><span class="step-num">8</span>Footer → paste footer above</div>
    <div class="step"><span class="step-num">9</span>No button needed for this template</div>
    <div class="step"><span class="step-num">10</span><strong>Submit for Review.</strong> Approval: 24–48 hours. Repeat for English and Portuguese.</div>
  </div>
  <!-- ENGLISH -->
  <div id="tab-en" class="tab-panel">
    <div class="lang-section-header"><span class="lang-badge lang-en">EN</span><h2>English (en)</h2></div>
    <h2>Template Fields</h2>
    <div class="field-block"><div class="field-label">Template Name</div><div class="field-value">agent12_cascade_khesed_tek</div></div>
    <div class="field-block"><div class="field-label">Category</div><div class="field-value">UTILITY</div></div>
    <div class="field-block"><div class="field-label">Language</div><div class="field-value">English (en)</div></div>
    <div class="field-block"><div class="field-label">Header Type</div><div class="field-value">TEXT</div></div>
    <div class="field-block"><div class="field-label">Header Text (max 60 chars)</div><div class="field-value">Pastoral Alert — Kh. CMS</div></div>
    <div class="field-block"><div class="field-label">Body Text</div><div class="field-value">Hello, {{1}} from *{{2}}*,
An event has occurred that requires your pastoral attention:
*{{3}}*
{{4}}
Please review your administration panel for full details and to take action.
Khesed-tek — Pastoral Cascade System</div></div>
    <div class="field-block"><div class="field-label">Footer Text (max 60 chars)</div><div class="field-value">support@khesed-tek-systems.org</div></div>
    <div class="field-block"><div class="field-label">Button Type</div><div class="field-value">None (text-only notification)</div></div>
    <h2>Variable Reference</h2>
    <table class="variable-table">
      <thead><tr><th>Meta Variable</th><th>System Variable</th><th>Example Value</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td>{{1}}</td><td>adminName</td><td>Pastor John</td><td>Pastor / admin name</td></tr>
        <tr><td>{{2}}</td><td>churchName</td><td>Grace Community Church</td><td>Church name</td></tr>
        <tr><td>{{3}}</td><td>alertTitle</td><td>New Visitor Registered</td><td>Short title of the alert event</td></tr>
        <tr><td>{{4}}</td><td>alertDetail</td><td>Mary Johnson registered as a new visitor on 05/06/2026.</td><td>Full detail of the event</td></tr>
      </tbody>
    </table>
    <h2>WhatsApp Preview</h2>
    <div class="wa-preview"><div class="wa-bubble">
      <div class="wa-header">Pastoral Alert — Kh. CMS</div>
      Hello, Pastor John from <strong>Grace Community Church</strong>,<br/><br/>
      An event has occurred that requires your pastoral attention:<br/><br/>
      <strong>New Visitor Registered</strong><br/>
      Mary Johnson registered as a new visitor on 05/06/2026.<br/><br/>
      Please review your administration panel for full details.<br/><br/>
      Khesed-tek — Pastoral Cascade System
      <div class="wa-footer">support@khesed-tek-systems.org</div>
    </div></div>
    <h2>Step-by-Step Submission</h2>
    <div class="step"><span class="step-num">1</span>Go to <a href="https://business.facebook.com" target="_blank" rel="noopener noreferrer" class="step-link">business.facebook.com</a> → WhatsApp Manager</div>
    <div class="step"><span class="step-num">2</span>Account Tools → Message Templates → Create Template</div>
    <div class="step"><span class="step-num">3</span><strong>Category:</strong> Utility</div>
    <div class="step"><span class="step-num">4</span><strong>Template Name:</strong> <code>agent12_cascade_khesed_tek</code></div>
    <div class="step"><span class="step-num">5</span><strong>Language:</strong> English (en)</div>
    <div class="step"><span class="step-num">6</span>Header → Text → paste header above</div>
    <div class="step"><span class="step-num">7</span>Body → paste body above</div>
    <div class="step"><span class="step-num">8</span>Footer → paste footer above</div>
    <div class="step"><span class="step-num">9</span>No button needed</div>
    <div class="step"><span class="step-num">10</span><strong>Submit for Review.</strong> Approval: 24–48 hours.</div>
  </div>
  <!-- PORTUGUESE -->
  <div id="tab-pt" class="tab-panel">
    <div class="lang-section-header"><span class="lang-badge lang-pt">PT</span><h2>Portuguese (pt_BR) — Portugues (Brasil)</h2></div>
    <h2>Template Fields</h2>
    <div class="field-block"><div class="field-label">Template Name</div><div class="field-value">agent12_cascade_khesed_tek</div></div>
    <div class="field-block"><div class="field-label">Category</div><div class="field-value">UTILITY</div></div>
    <div class="field-block"><div class="field-label">Language</div><div class="field-value">Portuguese (Brazil) — pt_BR</div></div>
    <div class="field-block"><div class="field-label">Header Type</div><div class="field-value">TEXT</div></div>
    <div class="field-block"><div class="field-label">Header Text (max 60 chars)</div><div class="field-value">Alerta Pastoral — Kh. CMS</div></div>
    <div class="field-block"><div class="field-label">Body Text</div><div class="field-value">Ola, {{1}} de *{{2}}*,
Ocorreu um evento que requer sua atencao pastoral:
*{{3}}*
{{4}}
Por favor, acesse seu painel de administracao para ver os detalhes completos e tomar uma acao.
Khesed-tek — Sistema de Cascata Pastoral</div></div>
    <div class="field-block"><div class="field-label">Footer Text (max 60 chars)</div><div class="field-value">suporte@khesed-tek-systems.org</div></div>
    <div class="field-block"><div class="field-label">Button Type</div><div class="field-value">None (text-only notification)</div></div>
    <h2>WhatsApp Preview</h2>
    <div class="wa-preview"><div class="wa-bubble">
      <div class="wa-header">Alerta Pastoral — Kh. CMS</div>
      Ola, Pastor Joao de <strong>Igreja da Graca</strong>,<br/><br/>
      Ocorreu um evento que requer sua atencao pastoral:<br/><br/>
      <strong>Novo Visitante Registrado</strong><br/>
      Maria Silva se registrou como nova visitante em 06/05/2026.<br/><br/>
      Por favor, acesse seu painel para ver os detalhes completos.<br/><br/>
      Khesed-tek — Sistema de Cascata Pastoral
      <div class="wa-footer">suporte@khesed-tek-systems.org</div>
    </div></div>
    <h2>Guia de Envio</h2>
    <div class="step"><span class="step-num">1</span>Acesse <a href="https://business.facebook.com" target="_blank" rel="noopener noreferrer" class="step-link">business.facebook.com</a> → WhatsApp Manager</div>
    <div class="step"><span class="step-num">2</span>Ferramentas de conta → Modelos de mensagem → Criar modelo</div>
    <div class="step"><span class="step-num">3</span><strong>Categoria:</strong> Utilitario (Utility)</div>
    <div class="step"><span class="step-num">4</span><strong>Nome:</strong> <code>agent12_cascade_khesed_tek</code></div>
    <div class="step"><span class="step-num">5</span><strong>Idioma:</strong> Portugues (Brasil) — pt_BR</div>
    <div class="step"><span class="step-num">6</span>Cabecalho → Texto → cole o texto acima</div>
    <div class="step"><span class="step-num">7</span>Corpo → cole o texto acima</div>
    <div class="step"><span class="step-num">8</span>Rodape → cole o rodape acima</div>
    <div class="step"><span class="step-num">9</span>Nenhum botao necessario</div>
    <div class="step"><span class="step-num">10</span><strong>Enviar para revisao.</strong> Aprovacao: 24–48 horas.</div>
  </div>
  <div class="tip tip-margin">
    After all 3 language approvals: Update environment variables <code>TWILIO_WHATSAPP_TEMPLATE_SID_AGENT12_ES</code>, <code>_EN</code>, and <code>_PT</code> in Vercel with the SIDs provided by Meta/Twilio.
  </div>
  <div class="warning">
    After approval, test each language version in the Twilio WhatsApp Sandbox before enabling in production.
  </div>
  <footer>
    Khesed-Tek Systems, LLC — Delaware Limited Liability Company<br/>
    soporte@khesed-tek-systems.org | +57 302 123 4410 | khesed-tek-systems.org<br/>
    Prepared May 2026 · Template v2.0 (ES / EN / PT)
  </footer>
  <script>
    function showTab(lang, btn) {
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('tab-' + lang).classList.add('active');
      btn.classList.add('active');
    }
  </script>
</body>
</html>;
fs.writeFileSync('templates/agent12-cascade.html', agent12, 'utf8');
console.log('✅ Plantilla 2 generada: templates/agent12-cascade.html');
