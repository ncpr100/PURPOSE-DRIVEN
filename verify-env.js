require('dotenv').config({ path: '.env.local' });
console.log('=== VERIFICACIÓN DESPUÉS DE REINICIO ===\n');
// Simular lo que hace el servidor Next.js
const testEnv = {
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  PADDLE_API_KEY: process.env.PADDLE_API_KEY,
  CRON_SECRET: process.env.CRON_SECRET,
};
console.log('Variables disponibles:');
Object.entries(testEnv).forEach(([key, value]) => {
  if (value) {
    console.log(`  ✅ ${key}: ${value.substring(0, 15)}...`);
  } else {
    console.log(`  ❌ ${key}: NO CONFIGURADA`);
  }
});
