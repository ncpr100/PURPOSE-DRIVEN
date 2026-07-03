const fs = require('fs');
const agents = [
  { id: 2, file: 'app/api/cron/triage-followup/route.ts' },
  { id: 4, file: 'app/api/cron/prayer-watchman/route.ts' },
  { id: 12, file: 'app/api/cron/coverage-precheck/route.ts' },
  { id: 5, file: 'app/api/cron/shepherds-log/route.ts' }
];
const importStatement = 'import { logAgentExecution } from "@/lib/agent-logger";\n';
agents.forEach(agent => {
  if (!fs.existsSync(agent.file)) {
    console.log(`️ File not found: ${agent.file}`);
    return;
  }
  let code = fs.readFileSync(agent.file, 'utf8');
  // 1. Add import if missing
  if (!code.includes('logAgentExecution')) {
    const firstImportIndex = code.indexOf('import ');
    if (firstImportIndex !== -1) {
      const endOfLine = code.indexOf('\n', firstImportIndex);
      code = code.slice(0, endOfLine + 1) + importStatement + code.slice(endOfLine + 1);
    }
  }
  // 2. Replace Success tracking block
  const successStart = '// --- EXECUTION TRACKING (SUCCESS) ---';
  const successEnd = "}).catch(e => console.error('[TRACKING] Success update failed:', e));";
  if (code.includes(successStart) && code.includes(successEnd)) {
    const startIdx = code.indexOf(successStart);
    const endIdx = code.indexOf(successEnd) + successEnd.length;
    const replacement = `// --- EXECUTION TRACKING (SUCCESS) ---
    await logAgentExecution({
      agentId: ${agent.id},
      churchId: "PLATFORM",
      status: "SUCCESS",
      durationMs: duration,
      tokensUsed: 0,
      outputData: { processed: overdueEvents?.length || 0, sent: sent || 0 }
    });`;
    code = code.slice(0, startIdx) + replacement + code.slice(endIdx);
    console.log(`✅ [Ag ${agent.id}] Success tracking replaced.`);
  }
  // 3. Replace Error tracking block
  const errorStart = '// --- EXECUTION TRACKING (ERROR) ---';
  const errorEnd = "}).catch(e => console.error('[TRACKING] Error update failed:', e));";
  if (code.includes(errorStart) && code.includes(errorEnd)) {
    const startIdx = code.indexOf(errorStart);
    const endIdx = code.indexOf(errorEnd) + errorEnd.length;
    const replacement = `// --- EXECUTION TRACKING (ERROR) ---
    await logAgentExecution({
      agentId: ${agent.id},
      churchId: "PLATFORM",
      status: "FAILED",
      durationMs: errDuration,
      tokensUsed: 0,
      errorMessage: errMsg.substring(0, 500)
    });`;
    code = code.slice(0, startIdx) + replacement + code.slice(endIdx);
    console.log(`✅ [Ag ${agent.id}] Error tracking replaced.`);
  }
  fs.writeFileSync(agent.file, code, 'utf8');
});
console.log("🏁 Patching complete. Check 'git diff' to verify.");
