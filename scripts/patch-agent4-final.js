const fs = require('fs');
const file = 'app/api/cron/prayer-watchman/route.ts';
let code = fs.readFileSync(file, 'utf8');
// Reemplazar bloque de éxito
const successBlock = `    // CRITICAL: Update agent_settings with execution status
    const duration = Date.now() - startTime;
    await db.agent_settings.update({
      where: { agentId: 4 },
      data: {
        lastRunStatus: errors.length > 0 ? 'PARTIAL' : 'SUCCESS',
        lastRunAt: now,
        lastRunDuration: duration,
        lastError: errors.length > 0 ? errors.join('; ').substring(0, 500) : null,
      },
    });`;
const successReplacement = `    // CRITICAL: Update agent_settings with execution status
    const duration = Date.now() - startTime;
    await logAgentExecution({
      agentId: 4,
      churchId: "PLATFORM",
      status: errors.length > 0 ? "PARTIAL" : "SUCCESS",
      durationMs: duration,
      tokensUsed: 0,
      outputData: { reminders, followups },
      errorMessage: errors.length > 0 ? errors.join('; ').substring(0, 500) : undefined
    });`;
if (code.includes(successBlock)) {
  code = code.replace(successBlock, successReplacement);
  console.log('✅ [Ag 4] Success tracking replaced');
} else {
  console.error('❌ [Ag 4] Success block not found');
}
// Reemplazar bloque de error
const errorBlock = `    // CRITICAL: Update agent_settings with error status
    const duration = Date.now() - startTime;
    const errorMessage = err instanceof Error ? err.message : String(err);
    await db.agent_settings.update({
      where: { agentId: 4 },
      data: {
        lastRunStatus: 'FAILED',
        lastRunAt: new Date(),
        lastRunDuration: duration,
        lastError: errorMessage.substring(0, 500),
      },
    }).catch(updateErr => {
      console.error('[WATCHMAN] Failed to update agent_settings:', updateErr);
    });`;
const errorReplacement = `    // CRITICAL: Update agent_settings with error status
    const duration = Date.now() - startTime;
    const errorMessage = err instanceof Error ? err.message : String(err);
    await logAgentExecution({
      agentId: 4,
      churchId: "PLATFORM",
      status: "FAILED",
      durationMs: duration,
      tokensUsed: 0,
      errorMessage: errorMessage.substring(0, 500)
    });`;
if (code.includes(errorBlock)) {
  code = code.replace(errorBlock, errorReplacement);
  console.log('✅ [Ag 4] Error tracking replaced');
} else {
  console.error('❌ [Ag 4] Error block not found');
}
fs.writeFileSync(file, code, 'utf8');
console.log('🏁 Agente 4 parcheado correctamente');
