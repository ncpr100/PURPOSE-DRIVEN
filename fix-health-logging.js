const fs = require('fs');
const path = require('path');
const enginePath = path.join(process.cwd(), 'lib', 'monitoring', 'health-check-engine.ts');
let engineCode = fs.readFileSync(enginePath, 'utf8');
// --- ACTUALIZAR checkPaddle con logging robusto ---
const paddleFunc = `// ── CHECK: Paddle (Primary Payment Processor - Merchant of Record) ───
async function checkPaddle(): Promise<HealthCheckResult> {
  const start = Date.now();
  // Lectura robusta de variable de entorno con fallback y logging
  const apiKey = process.env.PADDLE_API_KEY;
  console.log('[Paddle Health] API Key present:', !!apiKey);
  console.log('[Paddle Health] API Key prefix:', apiKey ? apiKey.substring(0, 15) + '...' : 'N/A');
  if (!apiKey) {
    return {
      service: "paddle",
      status: "UNKNOWN",
      responseTimeMs: null,
      errorMessage: "PADDLE_API_KEY not configured in server env",
      metadata: { envCheck: !!process.env.PADDLE_API_KEY },
    };
  }
  try {
    // Usar endpoint correcto de Paddle Billing API
    const res = await fetch("https://api.paddle.com/products?per_page=1", {
      method: "GET",
      headers: { 
        "Authorization": \`Bearer \${apiKey}\`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(5000),
    });
    const ms = Date.now() - start;
    console.log(\`[Paddle Health] Response: \${res.status} in \${ms}ms\`);
    // 200 OK = API operativa y key válida
    const isUp = res.ok;
    return {
      service: "paddle",
      status: isUp ? classify("paddle", ms) : "DOWN",
      responseTimeMs: ms,
      errorMessage: isUp ? null : \`HTTP \${res.status}: \${await res.text().catch(() => 'No body')}\`,
      metadata: { 
        statusCode: res.status, 
        environment: apiKey.includes("test_") ? "sandbox" : "production",
        endpoint: "https://api.paddle.com/products"
      },
    };
  } catch (err) {
    console.error('[Paddle Health] Error:', err);
    return {
      service: "paddle",
      status: "DOWN",
      responseTimeMs: Date.now() - start,
      errorMessage: String(err),
      metadata: null,
    };
  }
}`;
// Reemplazar función Paddle
const paddlePattern = /\/\/ ── CHECK: Paddle[\s\S]*?^\}/m;
if (paddlePattern.test(engineCode)) {
  engineCode = engineCode.replace(paddlePattern, paddleFunc);
  console.log('✅ checkPaddle() actualizada con logging de depuración');
}
// --- ACTUALIZAR checkOpenRouter con logging robusto ---
const openRouterFunc = `// ── CHECK: OpenRouter (Primary AI Provider for all 15 agents) ───
async function checkOpenRouter(): Promise<HealthCheckResult> {
  const start = Date.now();
  // Lectura robusta de variable de entorno con fallback y logging
  const apiKey = process.env.OPENROUTER_API_KEY;
  console.log('[OpenRouter Health] API Key present:', !!apiKey);
  console.log('[OpenRouter Health] API Key prefix:', apiKey ? apiKey.substring(0, 15) + '...' : 'N/A');
  if (!apiKey) {
    return {
      service: "openrouter",
      status: "UNKNOWN",
      responseTimeMs: null,
      errorMessage: "OPENROUTER_API_KEY not configured in server env",
      metadata: { envCheck: !!process.env.OPENROUTER_API_KEY },
    };
  }
  try {
    // Ping a la API de OpenRouter para verificar disponibilidad y autenticación
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      method: "GET",
      headers: {
        "Authorization": \`Bearer \${apiKey}\`,
        "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
        "X-Title": "Khesed-Tek CMS SRE Monitor",
      },
      signal: AbortSignal.timeout(5000),
    });
    const ms = Date.now() - start;
    console.log(\`[OpenRouter Health] Response: \${res.status} in \${ms}ms\`);
    // 200 OK significa que la API responde y la key es válida
    const apiAlive = res.ok;
    return {
      service: "openrouter",
      status: apiAlive ? classify("openrouter", ms) : "DOWN",
      responseTimeMs: ms,
      errorMessage: apiAlive ? null : \`HTTP \${res.status}: \${await res.text().catch(() => 'No body')}\`,
      metadata: { 
        statusCode: res.status,
        provider: "OpenRouter",
        endpoint: "/api/v1/models",
        envCheck: !!process.env.OPENROUTER_API_KEY
      },
    };
  } catch (err) {
    console.error('[OpenRouter Health] Error:', err);
    return {
      service: "openrouter",
      status: "DOWN",
      responseTimeMs: Date.now() - start,
      errorMessage: String(err),
      metadata: null,
    };
  }
}`;
// Reemplazar función OpenRouter
const openRouterPattern = /\/\/ ── CHECK: OpenRouter[\s\S]*?^\}/m;
if (openRouterPattern.test(engineCode)) {
  engineCode = engineCode.replace(openRouterPattern, openRouterFunc);
  console.log('✅ checkOpenRouter() actualizada con logging de depuración');
}
fs.writeFileSync(enginePath, engineCode, 'utf8');
console.log('\n🎉 Health checks actualizados con logging de depuración');
