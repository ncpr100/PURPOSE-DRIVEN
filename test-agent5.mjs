import { config } from 'dotenv';
config({ path: '.env.local' });
async function testAgent5() {
  try {
    console.log('Testing Agent 5 (Shepherds Log)...\n');
    const response = await fetch('https://khesed-tek-cms-org.vercel.app/api/cron/shepherds-log', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SECRET}`
      }
    });
    console.log('Status:', response.status);
    const result = await response.json();
    console.log('Response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}
testAgent5();
