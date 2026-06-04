const fs = require('fs');
const path = require('path');
console.log('🔧 Applying final import patches...');
const constPath = path.join(process.cwd(), 'lib', 'ai', 'constitution.ts');
if (!fs.existsSync(constPath) || !fs.readFileSync(constPath, 'utf8').includes('AI_CONSTITUTION')) {
  fs.writeFileSync(constPath, \export const AI_CONSTITUTION = { imageOfGod: "You are assisting a human made in God's image...", grief: "If the topic involves grief...", justice: "When discussing sin or justice...", hope: "End every piece of long-form content...", noPastoralReplacement: "You are not a pastor...", language: "All output must be in Spanish...", stewardship: "When analyzing giving...", leadershipDiscernment: "When identifying leadership...", dataHumility: "Data can show patterns...", disclaimer: "Generado por IA como apoyo ministerial..." } as const; export function buildSystemPrompt(clauses: (keyof typeof AI_CONSTITUTION)[]): string { return clauses.map(c => AI_CONSTITUTION[c]).join("\\n\\n"); }\, 'utf8');
  console.log('✅ Restored lib/ai/constitution.ts');
}
const patches = [['@/lib/system/sre-engineer', '@/lib/system/sre-engineer'], ['@/lib/ai/constitution', '@/lib/ai/constitution'], ['@/lib/agents/generosity-coach', '@/lib/agents/generosity-coach'], ['@/lib/agents/leadership-pipeline', '@/lib/agents/leadership-pipeline'], ['@/lib/system/cache-optimization', '@/lib/system/cache-optimization']];
let count = 0;
const files = ['app/api/cron/leadership-pipeline/route.ts', 'app/api/cron/generosity-coach/route.ts', 'app/api/platform/agents/sre/run-check/route.ts', 'app/api/platform/agents/sre/incidents/[id]/resolve/route.ts', 'app/api/shepherds-log/route.ts', 'app/api/cron/sla-calculation/route.ts', 'app/api/cron/data-retention/route.ts', 'lib/analytics-cache-initializer.ts', 'lib/system/cache-optimization.ts', 'lib/services/cached-analytics.ts'].filter(f => fs.existsSync(path.join(process.cwd(), f)));
for (const file of files) {
  let content = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
  const original = content;
  for (const [old, np] of patches) { content = content.split(old).join(np); }
  if (content !== original) { fs.writeFileSync(path.join(process.cwd(), file), content, 'utf8'); console.log('🔄 Patched: ' + file); count++; }
}
console.log('\\n✅ Patches complete! (' + count + ' files updated)');
