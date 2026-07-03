const fs = require('fs');
const filePath = 'app/api/cron/triage-followup/route.ts';
let code = fs.readFileSync(filePath, 'utf8');
// Agregar tracking de error en el catch
if (!code.includes('// --- EXECUTION TRACKING (ERROR) ---')) {
  code = code.replace(
    /(console\.error\("\[TRIAGE_CRON\] Fatal error:", error\);)/,
    `$1
    // --- EXECUTION TRACKING (ERROR) ---
    const errDuration = Date.now() - startTime;
    const errMsg = error instanceof Error ? error.message : String(error);
    await db.agent_settings.update({
      where: { agentId: 2 },
      data: {
        lastRunStatus: 'FAILED',
        lastRunAt: new Date(),
        lastRunDuration: errDuration,
        lastError: errMsg.substring(0, 500),
      },
    }).catch(e => console.error('[TRACKING] Error update failed:', e));`
  );
  fs.writeFileSync(filePath, code, 'utf8');
  console.log('✅ Tracking de error agregado al Agente 2');
} else {
  console.log('⚠️ Tracking ya existe');
}
