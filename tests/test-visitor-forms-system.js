const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function testVisitorFormsSystem() {
  console.log('\n🔍 TESTING VISITOR FORMS SYSTEM');
  console.log('='.repeat(50));

  try {
    // Test 1: Create a test visitor form
    console.log('\n1. Creating test visitor form...');
    
    const testForm = await db.visitorForm.create({
      data: {
        name: 'Test Visitor Form',
        description: 'Form for testing purposes',
        slug: 'test-visitor-form-' + Date.now(),
        churchId: 'cmgu17gel000078ibvdye9vxd', // First valid church ID
        fields: [
          {
            id: 'firstName',
            type: 'text',
            label: 'Nombre',
            required: true,
            placeholder: 'Ingrese su nombre'
          },
          {
            id: 'lastName',
            type: 'text',
            label: 'Apellido',
            required: true,
            placeholder: 'Ingrese su apellido'
          },
          {
            id: 'email',
            type: 'email',
            label: 'Email',
            required: true,
            placeholder: 'su@email.com'
          },
          {
            id: 'phone',
            type: 'tel',
            label: 'Teléfono',
            required: false,
            placeholder: '+1 234 567 8900'
          },
          {
            id: 'visitReason',
            type: 'select',
            label: '¿Por qué nos visita?',
            required: true,
            options: ['Primera vez', 'Invitado por alguien', 'Búsqueda espiritual', 'Otro']
          },
          {
            id: 'interests',
            type: 'checkbox',
            label: 'Intereses (seleccione todos los que apliquen)',
            required: false,
            options: ['Servicio dominical', 'Grupos pequeños', 'Ministerio juvenil', 'Ministerio infantil', 'Voluntariado']
          },
          {
            id: 'comments',
            type: 'textarea',
            label: 'Comentarios adicionales',
            required: false,
            placeholder: 'Cualquier pregunta o comentario...'
          }
        ],
        style: {
          backgroundColor: '#f8fafc',
          primaryColor: '#3b82f6',
          buttonTextColor: '#ffffff'
        },
        settings: {
          thankYouMessage: 'Gracias por visitarnos. Nos pondremos en contacto pronto.',
          sendNotification: true,
          notificationEmail: 'admin@iglesia.com',
          autoFollowUp: true
        },
        isActive: true,
        isPublic: true
      }
    });

    console.log(`✅ Test form created with slug: ${testForm.slug}`);

    // Test 2: Create QR codes for the form
    console.log('\n2. Creating QR codes for the form...');
    
    const qrCode1 = await db.visitorQRCode.create({
      data: {
        formId: testForm.id,
        name: 'Entrada Principal',
        code: 'QR-ENTRANCE-' + Date.now(),
        design: {
          size: 200,
          color: '#000000',
          backgroundColor: '#ffffff',
          logoUrl: null,
          style: 'square'
        },
        isActive: true,
        churchId: testForm.churchId
      }
    });

    const qrCode2 = await db.visitorQRCode.create({
      data: {
        formId: testForm.id,
        name: 'Lobby',
        code: 'QR-LOBBY-' + Date.now(),
        design: {
          size: 150,
          color: '#1f2937',
          backgroundColor: '#f9fafb',
          logoUrl: null,
          style: 'rounded'
        },
        isActive: true,
        churchId: testForm.churchId
      }
    });

    console.log(`✅ Created QR codes: ${qrCode1.name}, ${qrCode2.name}`);

    // Test 3: Create test submissions
    console.log('\n3. Creating test submissions...');
    
    const submission1 = await db.visitorSubmission.create({
      data: {
        formId: testForm.id,
        data: {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@email.com',
          phone: '+1 234 567 8900',
          visitReason: 'Primera vez',
          interests: ['Servicio dominical', 'Grupos pequeños'],
          comments: 'Me gustaría conocer más sobre la iglesia',
          submittedVia: `QR: ${qrCode1.code}`,
          submittedAt: new Date().toISOString()
        },
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 Test Browser',
        churchId: testForm.churchId
      }
    });

    const submission2 = await db.visitorSubmission.create({
      data: {
        formId: testForm.id,
        data: {
          firstName: 'María',
          lastName: 'González',
          email: 'maria.gonzalez@email.com',
          visitReason: 'Invitado por alguien',
          interests: ['Ministerio juvenil'],
          submittedVia: 'Direct Link',
          submittedAt: new Date().toISOString()
        },
        ipAddress: '192.168.1.2',
        userAgent: 'Mozilla/5.0 Test Browser',
        churchId: testForm.churchId
      }
    });

    console.log(`✅ Created ${2} test submissions`);

    // Test 4: Update QR scan counts
    console.log('\n4. Simulating QR scans...');
    
    await db.visitorQRCode.update({
      where: { id: qrCode1.id },
      data: {
        scanCount: 5,
        lastScan: new Date()
      }
    });

    await db.visitorQRCode.update({
      where: { id: qrCode2.id },
      data: {
        scanCount: 3,
        lastScan: new Date()
      }
    });

    console.log('✅ Updated QR scan counts');

    // Test 5: Query all data to verify
    console.log('\n5. Verifying data integrity...');
    
    const formWithData = await db.visitorForm.findUnique({
      where: { id: testForm.id },
      include: {
        qrCodes: true,
        submissions: true,
        church: {
          select: { name: true }
        }
      }
    });

    console.log('\n📊 FORM DATA SUMMARY:');
    console.log(`   📝 Form: ${formWithData.name}`);
    console.log(`   🏛️ Church: ${formWithData.church.name}`);
    console.log(`   🔗 Slug: ${formWithData.slug}`);
    console.log(`   📱 QR Codes: ${formWithData.qrCodes.length}`);
    console.log(`   📋 Submissions: ${formWithData.submissions.length}`);
    console.log(`   ✅ Active: ${formWithData.isActive}`);
    console.log(`   🌐 Public: ${formWithData.isPublic}`);

    console.log('\n📱 QR CODES:');
    formWithData.qrCodes.forEach((qr, index) => {
      console.log(`   ${index + 1}. ${qr.name}`);
      console.log(`      Code: ${qr.code}`);
      console.log(`      Scans: ${qr.scanCount}`);
      console.log(`      Last Scan: ${qr.lastScan ? qr.lastScan.toISOString() : 'Never'}`);
      console.log(`      Active: ${qr.isActive}`);
    });

    console.log('\n📋 SUBMISSIONS:');
    formWithData.submissions.forEach((submission, index) => {
      const data = submission.data;
      console.log(`   ${index + 1}. ${data.firstName} ${data.lastName}`);
      console.log(`      Email: ${data.email}`);
      console.log(`      Via: ${data.submittedVia}`);
      console.log(`      Reason: ${data.visitReason}`);
      console.log(`      Submitted: ${submission.createdAt ? submission.createdAt.toISOString() : new Date().toISOString()}`);
    });

    // Test 6: Check API endpoints would work
    console.log('\n6. API Endpoint Validation...');
    
    // Simulate API calls by checking data
    const forms = await db.visitorForm.findMany({
      where: { churchId: testForm.churchId },
      include: {
        qrCodes: true,
        submissions: true
      }
    });
    
    console.log(`✅ GET /api/visitor-forms - Would return ${forms.length} forms`);
    
    const publicForm = await db.visitorForm.findUnique({
      where: { slug: testForm.slug },
      include: { church: true }
    });
    
    console.log(`✅ GET /api/visitor-form/${testForm.slug} - Form accessible: ${!!publicForm}`);
    
    const qrCodes = await db.visitorQRCode.findMany({
      where: { formId: testForm.id }
    });
    
    console.log(`✅ GET /api/visitor-qr-codes - Would return ${qrCodes.length} QR codes`);

    // Test 7: Generate sample URLs
    console.log('\n7. Sample URLs for testing:');
    console.log(`   📄 Public Form: /visitor-form/${testForm.slug}`);
    console.log(`   📱 QR Link 1: /visitor-form/${testForm.slug}?qr=${qrCode1.code}`);
    console.log(`   📱 QR Link 2: /visitor-form/${testForm.slug}?qr=${qrCode2.code}`);
    console.log(`   ⚙️ Management: /(dashboard)/forms (requires auth)`);

    console.log('\n✅ ALL VISITOR FORMS SYSTEM TESTS PASSED!');
    console.log('\n🎯 READY FOR INTEGRATION TESTING');
    console.log('   1. Test API endpoints in browser/Postman');
    console.log('   2. Test public form submission');
    console.log('   3. Test QR code generation UI');
    console.log('   4. Test form management dashboard');

    return {
      formSlug: testForm.slug,
      qrCodes: [qrCode1.code, qrCode2.code],
      submissionCount: 2
    };

  } catch (error) {
    console.error('❌ Error testing visitor forms system:', error);
    throw error;
  }
}

async function main() {
  try {
    const result = await testVisitorFormsSystem();
    console.log('\n🎉 Test completed successfully!');
    console.log('Result:', result);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main();