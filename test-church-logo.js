const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function testChurchLogo() {
  try {
    console.log('🔍 Checking church logo in database...\n');
    
    const church = await db.church.findUnique({
      where: { id: 'demo-church' },
      select: {
        id: true,
        name: true,
        logo: true
      }
    });
    
    if (!church) {
      console.log('❌ Church not found!');
      return;
    }
    
    console.log(`🏠 Church: ${church.name}`);
    console.log(`📋 Church ID: ${church.id}`);
    
    if (church.logo) {
      const logoLength = church.logo.length;
      const isBase64 = church.logo.startsWith('data:image');
      console.log(`✅ Logo exists in database`);
      console.log(`📏 Logo size: ${logoLength} characters`);
      console.log(`🖼️  Is Base64 data URL: ${isBase64 ? 'Yes' : 'No'}`);
      
      if (isBase64) {
        console.log(`🎨 Image type: ${church.logo.split(';')[0].split(':')[1]}`);
        console.log(`📦 Preview (first 100 chars): ${church.logo.substring(0, 100)}...`);
      } else {
        console.log(`⚠️  Logo value: ${church.logo}`);
      }
    } else {
      console.log('⚠️  No logo found in database');
      console.log('💡 Upload a logo through the "Perfil de la Iglesia" page');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await db.$disconnect();
  }
}

testChurchLogo().catch(console.error);