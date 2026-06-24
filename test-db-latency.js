const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function testDatabaseLatency() {
  console.log('=== Diagnóstico de Latencia de Database (Supabase) ===\n');
  const tests = [];
  const numTests = 10;
  try {
    // Warmup connection
    await prisma.churches.count();
    console.log('Conexión establecida. Iniciando pruebas...\n');
    for (let i = 0; i < numTests; i++) {
      const start = Date.now();
      // Query simple: contar iglesias
      await prisma.churches.count();
      const duration = Date.now() - start;
      tests.push(duration);
      const status = duration < 100 ? '✅ HEALTHY' : 
                     duration < 500 ? '⚠️  DEGRADED' : '🔴 DOWN';
      console.log(`Test ${i + 1}/${numTests}: ${duration}ms ${status}`);
      // Esperar 500ms entre tests
      if (i < numTests - 1) {
        await new Promise(r => setTimeout(r, 500));
      }
    }
    const avg = tests.reduce((a, b) => a + b, 0) / tests.length;
    const min = Math.min(...tests);
    const max = Math.max(...tests);
    const median = tests.sort((a, b) => a - b)[Math.floor(tests.length / 2)];
    console.log('\n=== Resultados Estadísticos ===');
    console.log(`Promedio: ${avg.toFixed(1)}ms`);
    console.log(`Mediana: ${median}ms`);
    console.log(`Mínimo: ${min}ms`);
    console.log(`Máximo: ${max}ms`);
    console.log('\n=== Análisis ===');
    if (avg < 100) {
      console.log('✅ Latencia EXCELENTE (< 100ms)');
      console.log('   El health check debería reportar HEALTHY');
    } else if (avg < 500) {
      console.log('⚠️  Latencia DEGRADADA (100-500ms)');
      console.log('   Posibles causas:');
      console.log('   - Plan gratuito de Supabase (recursos limitados)');
      console.log('   - Latencia de red Vercel → Supabase');
      console.log('   - Connection pool agotado');
      console.log('   - Cold starts después de inactividad');
    } else {
      console.log('🔴 Latencia CRÍTICA (> 500ms)');
      console.log('   Requiere acción inmediata:');
      console.log('   - Upgrade de plan de Supabase');
      console.log('   - Optimización de queries');
      console.log('   - Implementar connection pooling');
    }
    // Test adicional: query más compleja
    console.log('\n=== Test Adicional: Query Compleja ===');
    const startComplex = Date.now();
    await prisma.agent_settings.findMany({
      where: { isEnabled: true },
      include: {
        church_agent_overrides: true
      }
    });
    const durationComplex = Date.now() - startComplex;
    console.log(`Query con relaciones: ${durationComplex}ms`);
  } catch (error) {
    console.error('❌ Error durante el test:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}
testDatabaseLatency();
