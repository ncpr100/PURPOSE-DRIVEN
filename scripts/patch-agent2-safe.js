const fs = require('fs');
const file = 'app/api/cron/triage-followup/route.ts';
let code = fs.readFileSync(file, 'utf8');
// SUCCESS Block
const oldSuccess = `    // --- EXECUTION TRACKING (SUCCESS) ---
    const duration = Date.now() - startTime;
    await db.agent_settings.update({
      where: { agentId: 2 },
      data: {
        lastRunStatus: 'SUCCESS',
        lastRunAt: new Date(),
        lastRunDuration: duration,
        lastError: null,
      },
    }).catch(e => console.error('[TRACKING] Success update failed:', e));`;
const newSuccess = `    // --- EXECUTION TRACKING (SUCCESS) ---
    const duration = Date.now() - startTime;
    await logAgentExecution({
      agentId: 2,
      churchId: "PLATFORM",
      status: "SUCCESS",
      durationMs: duration,
      tokensUsed: 0,
      outputData: { processed: overdueEvents?.length || 0, sent: sent || 0 }
    });`;
code = code.includes(oldSuccess) ? code.replace(oldSuccess, newSuccess) : code;
// ERROR Block
const oldError = `    // --- EXECUTION TRACKING (ERROR) ---
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
    }).catch(e => console.error('[TRACKING] Error update failed:', e));`;
const newError = `    // --- EXECUTION TRACKING (ERROR) ---
    const errDuration = Date.now() - startTime;
    const errMsg = error instanceof Error ? error.message : String(error);
    await logAgentExecution({
      agentId: 2,
      churchId: "PLATFORM",
      status: "FAILED",
      durationMs: errDuration,
      tokensUsed: 0,
      errorMessage: errMsg.substring(0, 500)
    });`;
code = code.includes(oldError) ? code.replace(oldError, newError) : code;
// Add import if missing
if (!code.includes('logAgentExecution')) {
  code = 'import { logAgentExecution } from "@/lib/agent-logger";\n' + code;
}
fs.writeFileSync(file, code, 'utf8');
console.log('✅ Agente 2 parcheado correctamente');
