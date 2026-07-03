const fs = require('fs');
const file = 'app/api/cron/prayer-watchman/route.ts';
if (!fs.existsSync(file)) {
  console.error('❌ File not found:', file);
  process.exit(1);
}
let code = fs.readFileSync(file, 'utf8');
// Fix 1: Ensure startTime is declared at function start
if (!code.includes('const startTime = Date.now();') && code.includes('export async function GET')) {
  code = code.replace(
    'export async function GET(req: NextRequest) {',
    'export async function GET(req: NextRequest) {\n  const startTime = Date.now();'
  );
  console.log('✅ Added startTime declaration');
}
// Fix 2: Add duration calculation BEFORE first logAgentExecution (SUCCESS case)
const successPattern = /await logAgentExecution\(\{\s+agentId: 4,\s+churchId: "PLATFORM",\s+status: "SUCCESS",\s+durationMs: duration,/;
if (successPattern.test(code)) {
  code = code.replace(
    'await logAgentExecution({\n      agentId: 4,\n      churchId: "PLATFORM",\n      status: "SUCCESS",\n      durationMs: duration,',
    'const duration = Date.now() - startTime;\n    await logAgentExecution({\n      agentId: 4,\n      churchId: "PLATFORM",\n      status: "SUCCESS",\n      durationMs: duration,'
  );
  console.log('✅ Added duration calculation for SUCCESS');
}
// Fix 3: Fix catch block - replace undefined errorMessage
const catchPattern = /await logAgentExecution\(\{\s+agentId: 4,\s+churchId: "PLATFORM",\s+status: "FAILED",\s+durationMs: duration,\s+tokensUsed: 0,\s+errorMessage: errorMessage\.substring\(0, 500\)/;
if (catchPattern.test(code)) {
  code = code.replace(
    'await logAgentExecution({\n      agentId: 4,\n      churchId: "PLATFORM",\n      status: "FAILED",\n      durationMs: duration,\n      tokensUsed: 0,\n      errorMessage: errorMessage.substring(0, 500)',
    'const errorMessage = err instanceof Error ? err.message : String(err);\n    await logAgentExecution({\n      agentId: 4,\n      churchId: "PLATFORM",\n      status: "FAILED",\n      durationMs: duration,\n      tokensUsed: 0,\n      errorMessage: errorMessage.substring(0, 500)'
  );
  console.log('✅ Fixed errorMessage in catch block');
}
// Fix 4: Ensure console.log uses defined duration
code = code.replace(
  /console\.log\(`\[WATCHMAN\] Execution completed: \$\{reminders\} reminders, \$\{followups\} follow-ups in \$\{duration\}ms`\);/,
  'const logDuration = Date.now() - startTime;\n    console.log(`[WATCHMAN] Execution completed: ${reminders} reminders, ${followups} follow-ups in ${logDuration}ms`);'
);
// Fix 5: Ensure return NextResponse uses defined duration
if (code.includes('return NextResponse.json({\n      success: true,\n      reminders,\n      followups,\n      duration,')) {
  code = code.replace(
    'return NextResponse.json({\n      success: true,\n      reminders,\n      followups,\n      duration,',
    'const responseDuration = Date.now() - startTime;\n    return NextResponse.json({\n      success: true,\n      reminders,\n      followups,\n      duration: responseDuration,'
  );
  console.log('✅ Fixed duration in success response');
}
fs.writeFileSync(file, code, 'utf8');
console.log('🏁 prayer-watchman/route.ts corregido');
