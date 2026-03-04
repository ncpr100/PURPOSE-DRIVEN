// Test Resend Email Sending with Verified Domain
// Run: node test-resend-email.js

require('dotenv').config()
const { Resend } = require('resend')

async function testResendEmail() {
  console.log('\n🧪 Testing Resend Email with Verified Domain')
  console.log('=' .repeat(60))
  
  // Check configuration
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.FROM_EMAIL
  const fromName = process.env.FROM_NAME
  
  console.log('\n📋 Configuration:')
  console.log(`   API Key: ${apiKey ? apiKey.substring(0, 10) + '...' : '❌ MISSING'}`)
  console.log(`   From Email: ${fromEmail || '❌ MISSING'}`)
  console.log(`   From Name: ${fromName || '❌ MISSING'}`)
  
  if (!apiKey) {
    console.error('\n❌ ERROR: RESEND_API_KEY not found in .env file')
    process.exit(1)
  }
  
  if (!fromEmail) {
    console.error('\n❌ ERROR: FROM_EMAIL not found in .env file')
    process.exit(1)
  }
  
  // Initialize Resend
  const resend = new Resend(apiKey)
  
  // Ask for recipient email
  const recipientEmail = process.argv[2] || 'test@example.com'
  
  console.log(`\n📧 Sending test email to: ${recipientEmail}`)
  console.log('\n⏳ Please wait...\n')
  
  try {
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [recipientEmail],
      subject: '✅ Test Email from Khesed-tek (Verified Domain)',
      html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .success { background: #d4edda; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0; }
              .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>✅ Resend Email Test Successful!</h1>
            </div>
            <div class="content">
              <h2>Congratulations! 🎉</h2>
              
              <p>This email was sent successfully using:</p>
              
              <div class="success">
                <p><strong>From:</strong> ${fromEmail}</p>
                <p><strong>Domain:</strong> khesed-tek-systems.org (VERIFIED ✅)</p>
                <p><strong>Service:</strong> Resend API</p>
                <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <h3>What This Means:</h3>
              <ul>
                <li>✅ Resend API is working correctly</li>
                <li>✅ Your verified domain is configured properly</li>
                <li>✅ Emails will be DELIVERED to real inboxes</li>
                <li>✅ Church onboarding emails will work in production</li>
              </ul>
              
              <h3>Next Steps:</h3>
              <ol>
                <li>Add these same environment variables to Railway</li>
                <li>Redeploy your application</li>
                <li>Test church creation in platform</li>
                <li>Admins will receive their credentials via email</li>
              </ol>
              
              <p><strong>Note:</strong> If you received this email, your Resend integration is 100% working! 🚀</p>
            </div>
            <div class="footer">
              <p>Khesed-tek Church Management Systems</p>
              <p>Email Test - ${new Date().toISOString()}</p>
            </div>
          </body>
        </html>
      `
    })
    
    if (error) {
      console.error('❌ Resend API Error:')
      console.error(JSON.stringify(error, null, 2))
      process.exit(1)
    }
    
    console.log('✅ EMAIL SENT SUCCESSFULLY!')
    console.log('=' .repeat(60))
    console.log('\n📊 Response Details:')
    console.log(`   Email ID: ${data.id}`)
    console.log(`   From: ${fromName} <${fromEmail}>`)
    console.log(`   To: ${recipientEmail}`)
    console.log('\n🔍 Next Steps:')
    console.log('   1. Check Resend dashboard: https://resend.com/emails')
    console.log(`   2. Look for email ID: ${data.id}`)
    console.log(`   3. Status should show "Delivered" ✅`)
    console.log(`   4. Check inbox of: ${recipientEmail}`)
    console.log('   5. Email should arrive within 1-2 minutes')
    console.log('\n💡 If email arrives, your Resend integration is WORKING!')
    console.log('   Add same variables to Railway and redeploy.\n')
    
  } catch (error) {
    console.error('\n❌ UNEXPECTED ERROR:')
    console.error(error)
    process.exit(1)
  }
}

// Run the test
if (process.argv.length < 3) {
  console.log('\n⚠️  No recipient email provided')
  console.log('Usage: node test-resend-email.js YOUR_EMAIL@example.com')
  console.log('\nUsing default test email: test@example.com')
  console.log('(This will fail - please provide a real email address)\n')
}

testResendEmail()
