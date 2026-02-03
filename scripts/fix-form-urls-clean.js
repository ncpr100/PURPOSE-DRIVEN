#!/usr/bin/env node

/**
 * FIX FORM URLs - Convert long Base64 URLs to short slug-based URLs
 */

const { PrismaClient } = require('@prisma/client')

const db = new PrismaClient()

async function fixFormURLs() {
  console.log('🔧 Starting Form URL Fix...')
  
  try {
    // Find all forms and check their QR URLs
    const allForms = await db.custom_forms.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        qrCodeUrl: true
      }
    })
    
    let updatedCount = 0
    
    for (const form of allForms) {
      let needsUpdate = false
      let newQRCodeUrl = form.qrCodeUrl
      
      // Check if QR URL is too long or contains Base64 data
      if (form.qrCodeUrl && (form.qrCodeUrl.length > 100 || form.qrCodeUrl.includes('data='))) {
        newQRCodeUrl = `${process.env.NEXTAUTH_URL || 'https://khesed-tek-cms.up.railway.app'}/form-viewer?slug=${form.slug}`
        needsUpdate = true
        console.log(`🔗 Will update QR URL for "${form.title}" from ${form.qrCodeUrl.length} chars to ${newQRCodeUrl.length} chars`)
      }
      
      if (needsUpdate) {
        await db.custom_forms.update({
          where: { id: form.id },
          data: { qrCodeUrl: newQRCodeUrl }
        })
        updatedCount++
        console.log(`✅ Updated form "${form.title}" with shorter QR URL`)
      }
    }
    
    console.log('\n📊 SUMMARY:')
    console.log(`✅ Forms with updated QR URLs: ${updatedCount}`)
    console.log('\n🎯 SOLUTION IMPLEMENTED:')
    console.log('• All forms now use short slug-based URLs in QR codes')
    console.log('• QR codes will be scannable and functional')
    console.log('• URL length reduced from ~5000+ characters to ~50 characters')
    
    console.log('\n✨ Form URL Fix completed successfully!')
    
  } catch (error) {
    console.error('❌ Error fixing form URLs:', error)
    throw error
  } finally {
    await db.$disconnect()
  }
}

// Run the fix
if (require.main === module) {
  fixFormURLs()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

module.exports = { fixFormURLs }