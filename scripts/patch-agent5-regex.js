const fs = require('fs');
const file = 'app/api/cron/shepherds-log/route.ts';
if (!fs.existsSync(file)) {
  console.error('❌ File not found:', file);
  process.exit(1);
}
let code = fs.readFileSync(file, 'utf8');
// Buscar y reemplazar bloque de éxito usando regex flexible
const successPattern = /\/\/ CRITICAL: Update agent_settings with execution status[\s\S]*?lastError: errors\.length > 0 \? errors\.join\('; '\) : null,[\s\S]*?\}\),[\s\S]*?\}\);/;
const successReplacement = `// CRITICAL: Update agent_settings with execution status
    await logAgentExecution({
      agentId: 5,
      churchId: "PLATFORM",
      status: errors.length === 0 ? "SUCCESS" : "PARTIAL",
      durationMs: duration,
      tokensUsed: 0,
      outputData: { refreshed, total: churches.length },
      errorMessage: errors.length > 0 ? errors.join('; ') : undefined
    });`;
if (successPattern.test(code)) {
  code = code.replace(successPattern, successReplacement);
  console.log('✅ [Ag 5] Success tracking replaced');
} else {
  console.error('❌ [Ag 5] Success block not found');
}
// Buscar y reemplazar bloque de error usando regex flexible
const errorPattern = /\/\/ CRITICAL: Update agent_settings with failure status[\s\S]*?try \{[\s\S]*?await db\.agent_settings\.update\(\{[\s\S]*?where: \{ agentId: 5 \},[\s\S]*?data: \{[\s\S]*?lastRunStatus: 'FAILED',[\s\S]*?lastRunAt: new Date\(\),[\s\S]*?lastRunDuration: duration,[\s\S]*?lastError: errorMessage,[\s\S]*?\},[\s\S]*?\}\);[\s\S]*?\} catch \(updateErr\) \{[\s\S]*?console\.error\('\[SHEPHERDS_LOG\] Failed to update agent_settings:', updateErr\);[\s\S]*?\}/;
const errorReplacement = `// CRITICAL: Update agent_settings with failure status
    await logAgentExecution({
      agentId: 5,
      churchId: "PLATFORM",
      status: "FAILED",
      durationMs: duration,
      tokensUsed: 0,
      errorMessage: errorMessage.substring(0, 500)
    });`;
if (errorPattern.test(code)) {
  code = code.replace(errorPattern, errorReplacement);
  console.log('✅ [Ag 5] Error tracking replaced');
} else {
  console.error('❌ [Ag 5] Error block not found');
}
fs.writeFileSync(file, code, 'utf8');
console.log('🏁 Agente 5 parcheado');
