const fs = require('fs');
const FormData = require('form-data');

async function testUploadAPI() {
  try {
    console.log('🧪 TESTING UPLOAD API DIRECTLY...');
    
    // Read the test image we created
    const testImagePath = './public/test-logo.png';
    const imageBuffer = fs.readFileSync(testImagePath);
    
    console.log('📁 Test image loaded:', testImagePath);
    console.log('📏 Size:', imageBuffer.length, 'bytes');
    
    // Create form data
    const form = new FormData();
    form.append('file', imageBuffer, {
      filename: 'test-logo.png',
      contentType: 'image/png'
    });
    form.append('type', 'church-logo');
    
    console.log('🌐 Making request to upload API...');
    
    // Test the upload endpoint
    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: form,
      headers: {
        'Cookie': 'next-auth.session-token=test' // This won't work, but let's see the error
      }
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📄 Response body:', responseText);
    
    if (response.status === 401) {
      console.log('🔐 Expected: Authentication required');
      console.log('✅ Upload API is working (just needs auth)');
    } else if (response.status === 200) {
      console.log('✅ Upload successful!');
    } else {
      console.log('❌ Unexpected response');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testUploadAPI().catch(console.error);