const fs = require('fs');
// Fix triage-followup
let t = fs.readFileSync('app/api/cron/triage-followup/route.ts', 'utf8');
t = t.replace('await logAgentExecution({\n      agentId: 2,\n      status: "SUCCESS",', 
              'const duration = Date.now() - startTime;\n    await logAgentExecution({\n      agentId: 2,\n      status: "SUCCESS",');
t = t.replace('await logAgentExecution({\n      agentId: 2,\n      status: "FAILED",', 
              'const errDuration = Date.now() - startTime;\n    const errMsg = error instanceof Error ? error.message : String(error);\n    await logAgentExecution({\n      agentId: 2,\n      status: "FAILED",');
fs.writeFileSync('app/api/cron/triage-followup/route.ts', t);
// Fix prayer-watchman
let p = fs.readFileSync('app/api/cron/prayer-watchman/route.ts', 'utf8');
p = p.replace('await logAgentExecution({\n      agentId: 4,\n      status: "SUCCESS",', 
              'const duration = Date.now() - startTime;\n    await logAgentExecution({\n      agentId: 4,\n      status: "SUCCESS",');
p = p.replace('await logAgentExecution({\n      agentId: 4,\n      status: "FAILED",', 
              'const errDuration = Date.now() - startTime;\n    const errMsg = error instanceof Error ? error.message : String(error);\n    await logAgentExecution({\n      agentId: 4,\n      status: "FAILED",');
fs.writeFileSync('app/api/cron/prayer-watchman/route.ts', p);
// Fix coverage-precheck
let c = fs.readFileSync('app/api/cron/coverage-precheck/route.ts', 'utf8');
c = c.replace('await logAgentExecution({\n      agentId: 12,\n      status: "SUCCESS",', 
              'const duration = Date.now() - startTime;\n    await logAgentExecution({\n      agentId: 12,\n      status: "SUCCESS",');
c = c.replace('await logAgentExecution({\n      agentId: 12,\n      status: "FAILED",', 
              'const errDuration = Date.now() - startTime;\n    const errMsg = error instanceof Error ? error.message : String(error);\n    await logAgentExecution({\n      agentId: 12,\n      status: "FAILED",');
fs.writeFileSync('app/api/cron/coverage-precheck/route.ts', c);
console.log('✅ Parche aplicado a Agentes 2, 4 y 12');
