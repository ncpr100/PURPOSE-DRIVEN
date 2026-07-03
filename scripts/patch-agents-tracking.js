const fs = require('fs');
function patchAgent(filePath, agentId) {
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  // 1. Agregar startTime al inicio
  if (!code.includes('const startTime = Date.now();')) {
    code = code.replace(
      /export async function GET\(req: NextRequest\) \{/,
      'export async function GET(req: NextRequest) {\n  const startTime = Date.now();'
    );
    changed = true;
  }
  // 2. Agregar tracking de éxito
  if (!code.includes(`agentId: ${agentId}`)) {
    const successBlock = `
    // --- EXECUTION TRACKING (SUCCESS) ---
    const duration = Date.now() - startTime;
    await db.agent_settings.update({
      where: { agentId: ${agentId} },
      data: {
        lastRunStatus: 'SUCCESS',
        lastRunAt: new Date(),
        lastRunDuration: duration,
        lastError: null,
      },
    }).catch(e => console.error('[TRACKING] Success update failed:', e));
    `;
    // Insertar antes del return final exitoso
    code = code.replace(
      /(\s*)return NextResponse\.json\(\{\s*success: true,/s,
      `$1${successBlock}$1return NextResponse.json({ success: true,`
    );
    changed = true;
  }
  // 3. Agregar tracking de error
  if (!code.includes('// --- EXECUTION TRACKING (ERROR) ---')) {
    const errorBlock = `
    // --- EXECUTION TRACKING (ERROR) ---
    const errDuration = Date.now() - startTime;
    const errMsg = err instanceof Error ? err.message : String(err);
    await db.agent_settings.update({
      where: { agentId: ${agentId} },
      data: {
        lastRunStatus: 'FAILED',
        lastRunAt: new Date(),
        lastRunDuration: errDuration,
        lastError: errMsg.substring(0, 500),
      },
    }).catch(e => console.error('[TRACKING] Error update failed:', e));
    `;
    // Insertar en el bloque catch, después del console.error
    code = code.replace(
      /(console\.error\("[^\"]*"\s*,\s*err\);)/,
      `$1\n${errorBlock}`
    );
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`✅ ${filePath} parcheado para Agente ${agentId}`);
  } else {
    console.log(`⚠️ ${filePath} ya estaba parcheado o no se pudo modificar`);
  }
}
// Ejecutar para Agente 2 y Agente 12
patchAgent('app/api/cron/triage-followup/route.ts', 2);
patchAgent('app/api/cron/coverage-precheck/route.ts', 12);
