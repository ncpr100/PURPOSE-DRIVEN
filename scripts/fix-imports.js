const fs = require('fs');
const agents = [
  { id: 2, file: 'app/api/cron/triage-followup/route.ts' },
  { id: 4, file: 'app/api/cron/prayer-watchman/route.ts' },
  { id: 5, file: 'app/api/cron/shepherds-log/route.ts' },
  { id: 12, file: 'app/api/cron/coverage-precheck/route.ts' }
];
agents.forEach(agent => {
  if (!fs.existsSync(agent.file)) {
    console.log(`❌ File not found: ${agent.file}`);
    return;
  }
  let code = fs.readFileSync(agent.file, 'utf8');
  // 1. Remove BOM if present
  if (code.charCodeAt(0) === 0xFEFF) {
    code = code.substring(1);
    console.log(`🔧 [Ag ${agent.id}] Removed BOM`);
  }
  // 2. Fix import - add quotes if missing
  const badImport = 'import { logAgentExecution } from @/lib/agent-logger;';
  const goodImport = 'import { logAgentExecution } from "@/lib/agent-logger";';
  if (code.includes(badImport)) {
    code = code.replace(badImport, goodImport);
    console.log(`✅ [Ag ${agent.id}] Fixed import quotes`);
  }
  // 3. Check if logAgentExecution is being used
  if (!code.includes('await logAgentExecution(')) {
    console.log(`⚠️  [Ag ${agent.id}] logAgentExecution not called - needs manual patch`);
  } else {
    console.log(`✅ [Ag ${agent.id}] logAgentExecution is being called`);
  }
  fs.writeFileSync(agent.file, code, 'utf8');
});
console.log("\n🏁 Import fixes complete.");
