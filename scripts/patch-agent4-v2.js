const fs = require('fs');
const file = 'app/api/cron/prayer-watchman/route.ts';
let code = fs.readFileSync(file, 'utf8');
// Reemplazar bloque de éxito - buscar desde el comentario hasta el console.log
const successStart = '    // CRITICAL: Update agent_settings with execution status';
const successEnd = '    console.log(`[WATCHMAN] Execution completed:';
const successStartIdx = code.indexOf(successStart);
const successEndIdx = code.indexOf(successEnd);
if (successStartIdx !== -1 && successEndIdx !== -1 && successEndIdx > successStartIdx) {
  const successBlock = code.substring(successStartIdx, successEndIdx);
  const successReplacement = `    // CRITICAL: Update agent_settings with execution status
    await logAgentExecution({
      agentId: 4,
      churchId: "PLATFORM",
      status: errors.length > 0 ? "PARTIAL" : "SUCCESS",
      durationMs: duration,
      tokensUsed: 0,
      outputData: { reminders, followups },
      errorMessage: errors.length > 0 ? errors.join('; ').substring(0, 500) : undefined
    });
`;
  code = code.replace(successBlock, successReplacement);
  console.log('✅ [Ag 4] Success tracking replaced');
} else {
  console.error('❌ [Ag 4] Success block not found');
}
// Reemplazar bloque de error - buscar desde el comentario hasta el console.error
const errorStart = '    // CRITICAL: Update agent_settings with error status';
const errorEnd = '    console.error("[WATCHMAN] Cron error:", err);';
const errorStartIdx = code.indexOf(errorStart);
const errorEndIdx = code.indexOf(errorEnd);
if (errorStartIdx !== -1 && errorEndIdx !== -1 && errorEndIdx > errorStartIdx) {
  const errorBlock = code.substring(errorStartIdx, errorEndIdx);
  const errorReplacement = `    // CRITICAL: Update agent_settings with error status
    await logAgentExecution({
      agentId: 4,
      churchId: "PLATFORM",
      status: "FAILED",
      durationMs: duration,
      tokensUsed: 0,
      errorMessage: errorMessage.substring(0, 500)
    });
`;
  code = code.replace(errorBlock, errorReplacement);
  console.log('✅ [Ag 4] Error tracking replaced');
} else {
  console.error('❌ [Ag 4] Error block not found');
}
fs.writeFileSync(file, code, 'utf8');
console.log('🏁 Agente 4 parcheado correctamente');
