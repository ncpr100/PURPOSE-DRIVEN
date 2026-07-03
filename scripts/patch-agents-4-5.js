const fs = require('fs');
// Parchear Agente 4 - Prayer Watchman
const agent4File = 'app/api/cron/prayer-watchman/route.ts';
let agent4Code = fs.readFileSync(agent4File, 'utf8');
// Buscar el bloque de tracking de éxito
const successPattern4 = /\/\/ --- EXECUTION TRACKING \(SUCCESS\) ---[\s\S]*?}\)\.catch\(e => console\.error\('\[TRACKING\] Success update failed:', e\)\);/;
const successReplacement4 = `// --- EXECUTION TRACKING (SUCCESS) ---
    await logAgentExecution({
      agentId: 4,
      churchId: "PLATFORM",
      status: "SUCCESS",
      durationMs: duration,
      tokensUsed: 0,
      outputData: { processed: results?.length || 0, sent: sentCount || 0 }
    });`;
if (successPattern4.test(agent4Code)) {
  agent4Code = agent4Code.replace(successPattern4, successReplacement4);
  console.log('✅ [Ag 4] Success tracking replaced');
} else {
  console.log('⚠️  [Ag 4] Success tracking pattern not found');
}
// Buscar el bloque de tracking de error
const errorPattern4 = /\/\/ --- EXECUTION TRACKING \(ERROR\) ---[\s\S]*?}\)\.catch\(e => console\.error\('\[TRACKING\] Error update failed:', e\)\);/;
const errorReplacement4 = `// --- EXECUTION TRACKING (ERROR) ---
    await logAgentExecution({
      agentId: 4,
      churchId: "PLATFORM",
      status: "FAILED",
      durationMs: errDuration,
      tokensUsed: 0,
      errorMessage: errMsg.substring(0, 500)
    });`;
if (errorPattern4.test(agent4Code)) {
  agent4Code = agent4Code.replace(errorPattern4, errorReplacement4);
  console.log('✅ [Ag 4] Error tracking replaced');
} else {
  console.log('⚠️  [Ag 4] Error tracking pattern not found');
}
fs.writeFileSync(agent4File, agent4Code, 'utf8');
// Parchear Agente 5 - Shepherd's Log
const agent5File = 'app/api/cron/shepherds-log/route.ts';
let agent5Code = fs.readFileSync(agent5File, 'utf8');
// Buscar el bloque de tracking de éxito
const successPattern5 = /\/\/ --- EXECUTION TRACKING \(SUCCESS\) ---[\s\S]*?}\)\.catch\(e => console\.error\('\[TRACKING\] Success update failed:', e\)\);/;
const successReplacement5 = `// --- EXECUTION TRACKING (SUCCESS) ---
    await logAgentExecution({
      agentId: 5,
      churchId: "PLATFORM",
      status: "SUCCESS",
      durationMs: duration,
      tokensUsed: 0,
      outputData: { processed: results?.length || 0 }
    });`;
if (successPattern5.test(agent5Code)) {
  agent5Code = agent5Code.replace(successPattern5, successReplacement5);
  console.log('✅ [Ag 5] Success tracking replaced');
} else {
  console.log('⚠️  [Ag 5] Success tracking pattern not found');
}
// Buscar el bloque de tracking de error
const errorPattern5 = /\/\/ --- EXECUTION TRACKING \(ERROR\) ---[\s\S]*?}\)\.catch\(e => console\.error\('\[TRACKING\] Error update failed:', e\)\);/;
const errorReplacement5 = `// --- EXECUTION TRACKING (ERROR) ---
    await logAgentExecution({
      agentId: 5,
      churchId: "PLATFORM",
      status: "FAILED",
      durationMs: errDuration,
      tokensUsed: 0,
      errorMessage: errMsg.substring(0, 500)
    });`;
if (errorPattern5.test(agent5Code)) {
  agent5Code = agent5Code.replace(errorPattern5, errorReplacement5);
  console.log('✅ [Ag 5] Error tracking replaced');
} else {
  console.log('⚠️  [Ag 5] Error tracking pattern not found');
}
fs.writeFileSync(agent5File, agent5Code, 'utf8');
console.log('\n🏁 Manual patching complete for Agents 4 and 5');
