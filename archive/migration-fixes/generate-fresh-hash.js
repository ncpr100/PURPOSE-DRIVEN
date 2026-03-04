const bcrypt = require('bcryptjs');

async function generateAndTest() {
  const password = 'TestPassword123!';
  
  console.log('🔐 Generating bcrypt hash for password: TestPassword123!');
  console.log('');
  
  const hash = await bcrypt.hash(password, 12);
  
  console.log('Generated Hash:');
  console.log(hash);
  console.log('');
  console.log('Hash length:', hash.length);
  console.log('');
  
  // Test the hash
  const isValid = await bcrypt.compare(password, hash);
  console.log('Test Result:', isValid ? '✅ VALID' : '❌ INVALID');
  console.log('');
  
  // Create UPDATE statement
  console.log('SQL UPDATE STATEMENT:');
  console.log('');
  console.log(`UPDATE users SET password = '${hash}', "updatedAt" = NOW() WHERE email = 'testadmin@prueba.com';`);
  console.log('');
  
  // Test with wrong password
  const wrongTest = await bcrypt.compare('wrongpassword', hash);
  console.log('Wrong password test:', wrongTest ? 'OOPS - MATCHED!' : '✅ Correctly rejected');
}

generateAndTest().catch(console.error);
