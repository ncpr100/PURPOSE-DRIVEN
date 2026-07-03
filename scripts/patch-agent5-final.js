const fs = require('fs');
const file = 'app/api/cron/shepherds-log/route.ts';
if (!fs.existsSync(file)) {
  console.error('❌ File not found:', file);
  process.exit(1);
}
let code = fs.readFileSync(file, 'utf8');
// Reemplazar bloque de éxito
const successBlock = `    // CRITICAL: Update agent_settings with execution status
    await db.agent_settings.update({
      where: { agentId: 5 },
      data: {
        lastRunStatus: errors.length === 0 ? 'SUCCESS' : 'PARTIAL',
        lastRunAt: new Date(),
        lastRunDuration: duration,
        lastError: errors.length > 0 ? errors.join('; ') : null,
      },
    });`;
const successReplacement = `    // CRITICAL: Update agent_settings with execution status
    await logAgentExecution({
      agentId: 5,
      churchId: "PLATFORM",
      status: errors.length === 0 ? "SUCCESS" : "PARTIAL",
      durationMs: duration,
      tokensUsed: 0,
      outputData: { refreshed, total: churches.length },
      errorMessage: errors.length > 0 ? errors.join('; ') : undefined
    });`;
if (code.includes(successBlock)) {
  code = code.replace(successBlock, successReplacement);
  console.log('✅ [Ag 5] Success tracking replaced');
} else {
  console.error('❌ [Ag 5] Success block not found');
}
// Reemplazar bloque de error
const errorBlock = `    // CRITICAL: Update agent_settings with failure status
    try {
      await db.agent_settings.update({
        where: { agentId: 5 },
        data: {
          lastRunStatus: 'FAILED',
          lastRunAt: new Date(),
          lastRunDuration: duration,
          lastError: errorMessage,
        },
      });
    } catch (updateErr) {
      console.error('[SHEPHERDS_LOG] Failed to update agent_settings:', updateErr);
    }`;
const errorReplacement = `    // CRITICAL: Update agent_settings with failure status
    await logAgentExecution({
      agentId: 5,
      churchId: "PLATFORM",
      status: "FAILED",
      durationMs: duration,
      tokensUsed: 0,
      errorMessage: errorMessage.substring(0, 500)
    });`;
if (code.includes(errorBlock)) {
  code = code.replace(errorBlock, errorReplacement);
  console.log('✅ [Ag 5] Error tracking replaced');
} else {
  console.error('❌ [Ag 5] Error block not found');
}
fs.writeFileSync(file, code, 'utf8');
console.log('🏁 Agente 5 parcheado correctamente');
