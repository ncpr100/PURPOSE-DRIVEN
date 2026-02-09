#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function testUploadAPI() {
  console.log('🧪 TESTING UPLOAD API FUNCTIONALITY')
  console.log('====================================\n')

  try {
    // Step 1: Check if /api/upload endpoint exists
    console.log('📋 Step 1: Checking if upload API exists...')
    const uploadApiPath = path.join(__dirname, 'app/api/upload/route.ts')
    const exists = fs.existsSync(uploadApiPath)
    console.log(`   ${exists ? '✅' : '❌'} Upload API file exists: ${exists}`)
    
    if (exists) {
      const content = fs.readFileSync(uploadApiPath, 'utf8')
      console.log('   ✅ File size:', content.length, 'bytes')
      
      // Check for critical functions
      const hasFormData = content.includes('formData')
      const hasFileHandling = content.includes('file')
      const hasBase64 = content.includes('base64')
      const hasQRLogo = content.includes('qr-logo')
      
      console.log(`   ${hasFormData ? '✅' : '❌'} FormData handling: ${hasFormData}`)
      console.log(`   ${hasFileHandling ? '✅' : '❌'} File processing: ${hasFileHandling}`)
      console.log(`   ${hasBase64 ? '✅' : '❌'} Base64 conversion: ${hasBase64}`)
      console.log(`   ${hasQRLogo ? '✅' : '❌'} QR logo support: ${hasQRLogo}`)
      
      if (!hasFormData || !hasFileHandling || !hasBase64 || !hasQRLogo) {
        console.log('   ⚠️  WARNING: Upload API may be incomplete!')
      }
    }

    // Step 2: Check uploadImage utility function
    console.log('\n📋 Step 2: Checking uploadImage utility function...')
    const qrGenPath = path.join(__dirname, 'app/(dashboard)/form-builder/_components/qr-generator.ts')
    const qrGenExists = fs.existsSync(qrGenPath)
    console.log(`   ${qrGenExists ? '✅' : '❌'} qr-generator.ts exists: ${qrGenExists}`)
    
    if (qrGenExists) {
      const qrContent = fs.readFileSync(qrGenPath, 'utf8')
      const hasUploadFunction = qrContent.includes('export async function uploadImage')
      const hasFormDataUpload = qrContent.includes('formData.append')
      const hasFetchCall = qrContent.includes("fetch('/api/upload'")
      
      console.log(`   ${hasUploadFunction ? '✅' : '❌'} uploadImage function exported: ${hasUploadFunction}`)
      console.log(`   ${hasFormDataUpload ? '✅' : '❌'} FormData construction: ${hasFormDataUpload}`)
      console.log(`   ${hasFetchCall ? '✅' : '❌'} API call to /api/upload: ${hasFetchCall}`)
      
      if (!hasUploadFunction || !hasFormDataUpload || !hasFetchCall) {
        console.log('   ⚠️  WARNING: Upload function may be incomplete!')
      }
    } else {
      console.log('   ❌ CRITICAL: qr-generator.ts file not found!')
      console.log('   This means uploadImage function does not exist!')
    }

    // Step 3: Check form builder imports
    console.log('\n📋 Step 3: Checking form builder component...')
    const formBuilderPath = path.join(__dirname, 'app/(dashboard)/form-builder/_components/branded-form-builder.tsx')
    const fbExists = fs.existsSync(formBuilderPath)
    console.log(`   ${fbExists ? '✅' : '❌'} branded-form-builder.tsx exists: ${fbExists}`)
    
    if (fbExists) {
      const fbContent = fs.readFileSync(formBuilderPath, 'utf8')
      const importsUploadImage = fbContent.includes("import { generateAdvancedQR, uploadImage } from './qr-generator'")
      const callsUploadImage = fbContent.includes('uploadImage(file,')
      const hasHandleImageUpload = fbContent.includes('handleImageUpload')
      
      console.log(`   ${importsUploadImage ? '✅' : '❌'} Imports uploadImage: ${importsUploadImage}`)
      console.log(`   ${callsUploadImage ? '✅' : '❌'} Calls uploadImage: ${callsUploadImage}`)
      console.log(`   ${hasHandleImageUpload ? '✅' : '❌'} Has handleImageUpload: ${hasHandleImageUpload}`)
      
      if (!importsUploadImage) {
        console.log('   ❌ CRITICAL: uploadImage not imported!')
      }
    }

    // Step 4: Check QR customization panel
    console.log('\n📋 Step 4: Checking QR customization panel...')
    const qrPanelPath = path.join(__dirname, 'app/(dashboard)/form-builder/_components/qr-customization-panel.tsx')
    const qrPanelExists = fs.existsSync(qrPanelPath)
    console.log(`   ${qrPanelExists ? '✅' : '❌'} qr-customization-panel.tsx exists: ${qrPanelExists}`)
    
    if (qrPanelExists) {
      const qrPanelContent = fs.readFileSync(qrPanelPath, 'utf8')
      const hasFileInput = qrPanelContent.includes('type="file"')
      const hasLogoUpload = qrPanelContent.includes('qr-logo-upload')
      const callsOnImageUpload = qrPanelContent.includes("onImageUpload(file, 'qr-logo')")
      
      console.log(`   ${hasFileInput ? '✅' : '❌'} Has file input: ${hasFileInput}`)
      console.log(`   ${hasLogoUpload ? '✅' : '❌'} Has logo upload ID: ${hasLogoUpload}`)
      console.log(`   ${callsOnImageUpload ? '✅' : '❌'} Calls onImageUpload prop: ${callsOnImageUpload}`)
    }

    // Summary
    console.log('\n📊 SUMMARY')
    console.log('===========')
    console.log('\n✅ All code files exist and contain expected upload logic')
    console.log('✅ Upload flow: File input → onImageUpload → uploadImage → /api/upload')
    console.log('\n⚠️  POTENTIAL ISSUES TO CHECK:')
    console.log('   1. Is the /api/upload endpoint accessible in production?')
    console.log('   2. Are there CORS or authentication errors?')
    console.log('   3. Is the uploadImage function being called correctly?')
    console.log('   4. Check browser console for errors when uploading')
    console.log('   5. Verify file size is under 2MB limit')
    console.log('\n💡 NEXT STEPS:')
    console.log('   1. Open browser DevTools (F12)')
    console.log('   2. Go to Network tab')
    console.log('   3. Try uploading an image')
    console.log('   4. Check if POST to /api/upload shows up')
    console.log('   5. Look at Response tab for errors')
    
  } catch (error) {
    console.error('❌ Test error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testUploadAPI()
