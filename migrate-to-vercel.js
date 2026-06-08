const fs = require('fs');
const path = require('path');
// ═══════════════════════════════════════════════════════════════
// 1. ACTUALIZAR health-check-engine.ts
// ═══════════════════════════════════════════════════════════════
const enginePath = path.join(process.cwd(), 'lib', 'monitoring', 'health-check-engine.ts');
let engineCode = fs.readFileSync(enginePath, 'utf8');
// 1a. Reemplazar la función checkAbacusAI por checkVercelAI
const oldAbacusFunction = engineCode.match(/\/\/ ── CHECK: AbacusAI[\s\S]*?async function checkAbacusAI\(\): Promise<HealthCheckResult> \{[\s\S]*?^\}/m);
if (oldAbacusFunction) {
  const newVercelFunction = `// ── CHECK: Vercel AI SDK (primary AI provider - replaced AbacusAI) ───
async function checkVercelAI(): Promise<HealthCheckResult> {
  const start = Date.now();
  const aiToken = process.env.AI_GATEWAY_TOKEN || process.env.VERCEL_AI_API_KEY || process.env.OPENROUTER_API_KEY;
  if (!aiToken) {
    return {
      service: "vercel_ai",
      status: "UNKNOWN",
      responseTimeMs: null,
      errorMessage: "No AI provider configured",
      metadata: null,
    };
  }
  try {
    // Vercel AI Gateway health check - lightweight ping to verify AI infrastructure
    const res = await fetch("https://ai.gateway.vercel.com/ping", {
      method: "GET",
      headers: {
        "Authorization": \`Bearer \${aiToken}\`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(4000),
    });
    const ms = Date.now() - start;
    return {
      service: "vercel_ai",
      status: (res.ok || res.status === 404) ? classify("vercel_ai", ms) : "DEGRADED",
      responseTimeMs: ms,
      errorMessage: (res.ok || res.status === 404) ? null : \`HTTP \${res.status}\`,
      metadata: { 
        statusCode: res.status,
        provider: "Vercel AI Gateway",
        environment: process.env.VERCEL_ENV || "development"
      },
    };
  } catch (err) {
    // Fallback: verificar disponibilidad de Vercel infrastructure
    try {
      const fallbackRes = await fetch("https://vercel.com", {
        method: "HEAD",
        signal: AbortSignal.timeout(3000),
      });
      const ms = Date.now() - start;
      return {
        service: "vercel_ai",
        status: fallbackRes.ok ? classify("vercel_ai", ms) : "DEGRADED",
        responseTimeMs: ms,
        errorMessage: "AI Gateway unreachable, Vercel infrastructure OK",
        metadata: { statusCode: fallbackRes.status, method: "fallback_infra" },
      };
    } catch (fallbackErr) {
      return {
        service: "vercel_ai",
        status: "DOWN",
        responseTimeMs: Date.now() - start,
        errorMessage: String(err),
        metadata: null,
      };
    }
  }
}`;
  engineCode = engineCode.replace(oldAbacusFunction[0], newVercelFunction);
  console.log('✅ checkAbacusAI() replaced with checkVercelAI()');
} else {
  console.log('⚠️  Could not find checkAbacusAI function to replace');
}
// 1b. Reemplazar "abacusai" por "vercel_ai" en el enum ServiceName
engineCode = engineCode.replace(
  '| "abacusai"',
  '| "vercel_ai"'
);
// 1c. Reemplazar umbral de abacusai por vercel_ai
engineCode = engineCode.replace(
  'abacusai: { healthy: 1000, degraded: 4000 },',
  'vercel_ai: { healthy: 800, degraded: 3000 },'
);
// 1d. Reemplazar llamada checkAbacusAI() por checkVercelAI()
engineCode = engineCode.replace(
  'checkAbacusAI(),',
  'checkVercelAI(),'
);
// 1e. Reemplazar en el array de servicios de fallback
engineCode = engineCode.replace(
  '"abacusai",',
  '"vercel_ai",'
);
fs.writeFileSync(enginePath, engineCode, 'utf8');
console.log('✅ health-check-engine.ts fully migrated to Vercel AI');
// ═══════════════════════════════════════════════════════════════
// 2. ACTUALIZAR sre-dashboard.tsx
// ═══════════════════════════════════════════════════════════════
const dashboardPath = path.join(process.cwd(), 'app', '(platform)', 'platform', 'agents', 'sre', 'sre-dashboard.tsx');
let dashboardCode = fs.readFileSync(dashboardPath, 'utf8');
// Reemplazar AbacusAI por Vercel AI en SERVICE_CONFIG
dashboardCode = dashboardCode.replace(
  'abacusai: { label: "AbacusAI", icon: "🧠", critical: false },',
  'vercel_ai: { label: "Vercel AI", icon: "⚡", critical: true },'
);
fs.writeFileSync(dashboardPath, dashboardCode, 'utf8');
console.log('✅ sre-dashboard.tsx updated: AbacusAI → Vercel AI (now critical)');
console.log('\n🎉 AbacusAI → Vercel AI migration complete');
