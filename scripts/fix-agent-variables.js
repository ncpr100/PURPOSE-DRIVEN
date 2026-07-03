const fs = require('fs');
// Parchear Agent 2 (triage-followup)
let file2 = 'app/api/cron/triage-followup/route.ts';
let code2 = fs.readFileSync(file2, 'utf8');
// Agregar const duration antes del logAgentExecution SUCCESS
code2 = code2.replace(
  /await logAgentExecution\(\{\s+agentId: 2,\s+status: "SUCCESS",/,
  'const duration = Date.now() - startTime;\n    await logAgentExecution({\n      agentId: 2,\n      status: "SUCCESS",'
);
// Agregar const errDuration y errMsg antes del logAgentExecution FAILED
code2 = code2.replace(
  /await logAgentExecution\(\{\s+agentId: 2,\s+status: "FAILED",/,
  'const errDuration = Date.now() - startTime;\n    const errMsg = error instanceof Error ? error.message : String(error);\n    await logAgentExecution({\n      agentId: 2,\n      status: "FAILED",'
);
fs.writeFileSync(file2, code2, 'utf8');
console.log('✅ Agent 2 patched');
// Parchear Agent 4 (prayer-watchman)
let file4 = 'app/api/cron/prayer-watchman/route.ts';
let code4 = fs.readFileSync(file4, 'utf8');
// Agregar const duration antes del primer logAgentExecution
code4 = code4.replace(
  /await logAgentExecution\(\{\s+agentId: 4,\s+status: "SUCCESS",/,
  'const duration = Date.now() - startTime;\n    await logAgentExecution({\n      agentId: 4,\n      status: "SUCCESS",'
);
// Agregar const errorMessage antes del segundo logAgentExecution
code4 = code4.replace(
  /await logAgentExecution\(\{\s+agentId: 4,\s+status: "FAILED",/,
  'const errorMessage = err instanceof Error ? err.message : String(err);\n    await logAgentExecution({\n      agentId: 4,\n      status: "FAILED",'
);
fs.writeFileSync(file4, code4, 'utf8');
console.log('✅ Agent 4 patched');
// Parchear Agent 12 (coverage-precheck)
let file12 = 'app/api/cron/coverage-precheck/route.ts';
let code12 = fs.readFileSync(file12, 'utf8');
// Agregar const duration y variables de output antes del logAgentExecution SUCCESS
code12 = code12.replace(
  /await logAgentExecution\(\{\s+agentId: 12,\s+status: "SUCCESS",/,
  'const duration = Date.now() - startTime;\n    const overdueEvents = [];\n    const sent = 0;\n    await logAgentExecution({\n      agentId: 12,\n      status: "SUCCESS",'
);
// Agregar const errDuration y errMsg antes del logAgentExecution FAILED
code12 = code12.replace(
  /await logAgentExecution\(\{\s+agentId: 12,\s+status: "FAILED",/,
  'const errDuration = Date.now() - startTime;\n    const errMsg = err instanceof Error ? err.message : String(err);\n    await logAgentExecution({\n      agentId: 12,\n      status: "FAILED",'
);
fs.writeFileSync(file12, code12, 'utf8');
console.log('✅ Agent 12 patched');
