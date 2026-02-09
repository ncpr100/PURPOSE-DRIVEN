// 🎨 ADVANCED QR CODE GENERATOR (Vercel-optimized with memory management)
import QRCode from 'qrcode'
import type { QRConfig } from './form-types'

/**
 * Generate advanced QR code with canvas customizations
 * Base64-only approach for Vercel serverless compatibility
 * Includes proper memory cleanup to prevent leaks
 */
export async function generateAdvancedQR(url: string, qrConfig: QRConfig): Promise<string> {
  // Generate base QR code
  let baseQR = await QRCode.toDataURL(url, {
    width: qrConfig.size,
    margin: qrConfig.margin,
    color: {
      dark: qrConfig.useGradient ? '#000000' : qrConfig.foregroundColor,
      light: qrConfig.backgroundColor
    },
    errorCorrectionLevel: 'H' // High correction for logo overlay
  })

  // Apply advanced customizations if needed
  if (qrConfig.logoImage || qrConfig.useBackgroundImage || qrConfig.useGradient) {
    baseQR = await applyCanvasCustomizations(baseQR, qrConfig)
  }

  return baseQR
}

/**
 * Apply canvas-based customizations (gradients, logos, backgrounds)
 * Memory-safe with proper cleanup
 * ONLY runs in browser environment (not during SSR/build)
 */
async function applyCanvasCustomizations(baseQR: string, qrConfig: QRConfig): Promise<string> {
  // CRITICAL: Check for browser environment
  if (typeof window === 'undefined' || !document) {
    console.warn('Canvas operations skipped - not in browser environment')
    return baseQR  // Return base QR if not in browser
  }

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      reject(new Error('Canvas not supported'))
      return
    }

    const img = new Image()
    img.onload = async () => {
      try {
        canvas.width = qrConfig.size
        canvas.height = qrConfig.size

        // 1. Draw background image if enabled
        if (qrConfig.useBackgroundImage && qrConfig.backgroundImage) {
          const bgImg = new Image()
          bgImg.src = qrConfig.backgroundImage
          await new Promise((resolve) => { bgImg.onload = resolve })
          ctx.globalAlpha = qrConfig.backgroundOpacity / 100
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
          ctx.globalAlpha = 1
        }

        // 2. Draw base QR code
        ctx.drawImage(img, 0, 0)

        // 3. Apply gradient overlay if enabled
        if (qrConfig.useGradient) {
          const gradient = qrConfig.gradientType === 'linear'
            ? ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
            : ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width/2)
          
          qrConfig.gradientColors.forEach((color, i) => {
            gradient.addColorStop(i / (qrConfig.gradientColors.length - 1), color)
          })
          
          ctx.globalCompositeOperation = 'source-atop'
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.globalCompositeOperation = 'source-over'
        }

        // 4. Add logo if provided
        if (qrConfig.logoImage) {
          const logoImg = new Image()
          logoImg.src = qrConfig.logoImage
          await new Promise((resolve) => { logoImg.onload = resolve })
          
          const logoSizePixels = (canvas.width * qrConfig.logoSize) / 100
          const logoX = (canvas.width - logoSizePixels) / 2
          const logoY = (canvas.height - logoSizePixels) / 2

          // Draw logo background/shape
          if (qrConfig.logoBackgroundColor && qrConfig.logoBackgroundOpacity > 0) {
            ctx.globalAlpha = qrConfig.logoBackgroundOpacity / 100
            ctx.fillStyle = qrConfig.logoBackgroundColor
            
            if (qrConfig.logoShape === 'circle') {
              ctx.beginPath()
              ctx.arc(canvas.width/2, canvas.height/2, logoSizePixels/2 + qrConfig.logoMargin, 0, Math.PI * 2)
              ctx.fill()
            } else if (qrConfig.logoShape === 'rounded') {
              const radius = 10
              ctx.beginPath()
              ctx.roundRect(logoX - qrConfig.logoMargin, logoY - qrConfig.logoMargin, 
                logoSizePixels + qrConfig.logoMargin*2, logoSizePixels + qrConfig.logoMargin*2, radius)
              ctx.fill()
            } else {
              ctx.fillRect(logoX - qrConfig.logoMargin, logoY - qrConfig.logoMargin,
                logoSizePixels + qrConfig.logoMargin*2, logoSizePixels + qrConfig.logoMargin*2)
            }
            ctx.globalAlpha = 1
          }

          // Draw logo with opacity
          ctx.globalAlpha = qrConfig.logoOpacity / 100
          if (qrConfig.logoShape === 'circle') {
            ctx.save()
            ctx.beginPath()
            ctx.arc(canvas.width/2, canvas.height/2, logoSizePixels/2, 0, Math.PI * 2)
            ctx.clip()
            ctx.drawImage(logoImg, logoX, logoY, logoSizePixels, logoSizePixels)
            ctx.restore()
          } else {
            ctx.drawImage(logoImg, logoX, logoY, logoSizePixels, logoSizePixels)
          }
          ctx.globalAlpha = 1
        }

        // Convert to data URL and cleanup
        const finalQR = canvas.toDataURL('image/png', 1.0)
        
        // 🧹 CRITICAL: Memory cleanup
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        canvas.width = 0
        canvas.height = 0
        
        resolve(finalQR)
      } catch (error) {
        reject(error)
      }
    }
    img.onerror = reject
    img.src = baseQR
  })
}

/**
 * Upload image file to server using FormData (Vercel serverless compatible)
 * Max 2MB file size limitation
 * ENTERPRISE COMPLIANCE: Matches API endpoint expectations exactly
 */
export async function uploadImage(
  file: File, 
  type: 'form-background' | 'qr-logo' | 'qr-background' | 'church-logo'
): Promise<string> {
  // Validate file size (max 2MB for Vercel)
  if (file.size > 2 * 1024 * 1024) {
    throw new Error('La imagen debe ser menor a 2MB')
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Solo se permiten archivos de imagen')
  }

  try {
    // 🔧 FIX: Use FormData instead of JSON to match API expectations
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    console.log(`📤 Uploading ${type}: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`)

    // Upload to API endpoint (expects FormData)
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData  // Send FormData directly (no Content-Type header needed)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Upload failed' }))
      throw new Error(errorData.error || 'Error al subir imagen')
    }

    const data = await response.json()
    console.log(`✅ Upload successful: ${type}`)
    
    return data.url
  } catch (error: any) {
    console.error(`❌ Upload error (${type}):`, error)
    throw new Error(error.message || 'Error al subir la imagen')
  }
}
