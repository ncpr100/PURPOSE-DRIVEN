const fs = require('fs');
const file = 'app/api/cron/triage-followup/route.ts';
let code = fs.readFileSync(file, 'utf8');
// Agregar const duration antes del logAgentExecution SUCCESS
code = code.replace(
  'await logAgentExecution({\n      agentId: 2,\n      churchId: "PLATFORM",\n      status: "SUCCESS",',
  'const duration = Date.now() - startTime;\n    await logAgentExecution({\n      agentId: 2,\n      churchId: "PLATFORM",\n      status: "SUCCESS",'
);
// Agregar const errDuration y errMsg antes del logAgentExecution FAILED
code = code.replace(
  'await logAgentExecution({\n      agentId: 2,\n      churchId: "PLATFORM",\n      status: "FAILED",',
  'const errDuration = Date.now() - startTime;\n    const errMsg = error instanceof Error ? error.message : String(error);\n    await logAgentExecution({\n      agentId: 2,\n      churchId: "PLATFORM",\n      status: "FAILED",'
);
fs.writeFileSync(file, code, 'utf8');
console.log('✅ Variables agregadas al Agente 2');
