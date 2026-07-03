const fs = require('fs');
const file = 'app/api/cron/triage-followup/route.ts';
if (!fs.existsSync(file)) {
  console.error('❌ File not found:', file);
  process.exit(1);
}
let code = fs.readFileSync(file, 'utf8');
// Fix 1: Add startTime if missing at function start
if (!code.includes('const startTime = Date.now();') && code.includes('export async function GET')) {
  code = code.replace(
    'export async function GET(req: NextRequest) {',
    'export async function GET(req: NextRequest) {\n  const startTime = Date.now();'
  );
  console.log('✅ Added startTime declaration');
}
// Fix 2: Add duration calculation in SUCCESS block if missing
const successPattern = /await logAgentExecution\(\{\s+agentId: 2,\s+status: "SUCCESS",\s+durationMs: duration,/;
if (successPattern.test(code) && !code.includes('const duration = Date.now() - startTime;') && code.includes('// --- EXECUTION TRACKING (SUCCESS) ---')) {
  code = code.replace(
    '// --- EXECUTION TRACKING (SUCCESS) ---\n    await logAgentExecution({',
    '// --- EXECUTION TRACKING (SUCCESS) ---\n    const duration = Date.now() - startTime;\n    await logAgentExecution({'
  );
  console.log('✅ Added duration calculation for SUCCESS');
}
// Fix 3: Fix the catch block - replace undefined variables
const catchPattern = /} catch \(error\) \{[\s\S]*?console\.error\("\[TRIAGE_CRON\] Fatal error:", error\);[\s\S]*?await logAgentExecution\(\{[\s\S]*?agentId: 2,[\s\S]*?status: "FAILED",[\s\S]*?durationMs: errDuration,[\s\S]*?errorMessage: errMsg\.substring\(0, 500\)/;
if (catchPattern.test(code)) {
  const newCatchBlock = `} catch (error) {
    console.error("[TRIAGE_CRON] Fatal error:", error);
    // Calcular duración y mensaje de error
    const errorDuration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    // --- EXECUTION TRACKING (ERROR) ---
    await logAgentExecution({
      agentId: 2,
      churchId: "PLATFORM",
      status: "FAILED",
      durationMs: errorDuration,
      tokensUsed: 0,
      errorMessage: errorMessage.substring(0, 500)
    });`;
  // Find and replace the entire catch block
  const catchStart = code.indexOf('} catch (error) {');
  const catchEnd = code.indexOf('return NextResponse.json(', catchStart);
  const returnEnd = code.indexOf(');', catchEnd) + 2;
  if (catchStart !== -1 && returnEnd !== -1) {
    code = code.slice(0, catchStart) + newCatchBlock + '\n    ' + code.slice(returnEnd);
    console.log('✅ Fixed catch block variables');
  }
}
fs.writeFileSync(file, code, 'utf8');
console.log('🏁 triage-followup/route.ts corregido');
