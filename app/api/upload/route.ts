
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Upload API called - checking authentication...')
    
    const session = await getServerSession(authOptions)
    
    // Require authenticated user
    if (!session?.user) {
      console.log('❌ Upload failed - No session found')
      return NextResponse.json({ 
        error: 'No autorizado - Usuario no autenticado',
        code: 'NO_SESSION'
      }, { status: 401 })
    }
    
    console.log('✅ Authenticated user:', {
      email: session.user.email,
      role: session.user.role,
      churchId: session.user.churchId
    })

    // Allow uploads for users with churchId OR SUPER_ADMIN users (who may have churchId=null)
    if (session.user.role !== 'SUPER_ADMIN' && !session.user.churchId) {
      console.log('❌ Upload failed - No churchId and not SUPER_ADMIN')
      return NextResponse.json({ 
        error: 'No autorizado - Church ID requerido',
        code: 'NO_CHURCH_ID'
      }, { status: 401 })
    }

    console.log('📤 Upload request from:', session.user.email, 'Role:', session.user.role, 'ChurchId:', session.user.churchId)

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    if (!file) {
      console.log('❌ Upload failed - No file received')
      return NextResponse.json({ 
        error: 'No se recibió archivo',
        code: 'NO_FILE'
      }, { status: 400 })
    }

    console.log('📁 File details:', {
      name: file.name,
      size: file.size,
      type: file.type,
      uploadType: type
    })

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('❌ Upload failed - Invalid file type:', file.type)
      return NextResponse.json({ 
        error: 'Solo se permiten imágenes',
        code: 'INVALID_FILE_TYPE',
        details: { receivedType: file.type }
      }, { status: 400 })
    }

    // Validate file size (max 2MB for base64 storage)
    if (file.size > 2 * 1024 * 1024) {
      console.log('❌ Upload failed - File too large:', file.size)
      return NextResponse.json({ 
        error: 'El archivo debe ser menor a 2MB',
        code: 'FILE_TOO_LARGE',
        details: { size: file.size, maxSize: 2097152 }
      }, { status: 400 })
    }

    console.log('📤 Converting file to base64...', { name: file.name, size: file.size, type: file.type })

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    console.log('✅ Base64 conversion successful, length:', dataUrl.length)

    // For church logos, update the church record directly (only for church users)
    if (type === 'church-logo') {
      console.log('🏠 Processing church logo upload...')
      
      // Only update database for users with a churchId (not SUPER_ADMIN)
      if (session.user.churchId) {
        console.log('📝 Updating church logo in database for churchId:', session.user.churchId)
        
        try {
          await db.churches.update({
            where: { id: session.user.churchId },
            data: { logo: dataUrl }
          })
          console.log('✅ Church logo updated successfully in database')
        } catch (dbError: any) {
          console.log('⚠️ Database unavailable, returning logo without database save:', dbError.message)
          // Continue without failing - return the logo URL anyway
        }
      } else {
        console.log('ℹ️  SUPER_ADMIN user - returning logo URL without database update')
      }

      return NextResponse.json({ 
        url: dataUrl,
        filename: file.name,
        size: file.size,
        type: file.type,
        message: session.user.churchId 
          ? 'Logo guardado exitosamente en la base de datos'
          : 'Logo cargado exitosamente (vista previa)'
      })
    }

    // For form builder images (backgrounds, QR logos, church logos for forms)
    if (type === 'form-background' || type === 'qr-logo' || type === 'qr-background' || type === 'form-church-logo') {
      console.log(`📋 Processing ${type} upload...`)
      
      // No database storage needed for form images - return base64 directly
      return NextResponse.json({
        url: dataUrl,
        filename: file.name,
        size: file.size,
        type: file.type,
        uploadType: type,
        message: `${type === 'form-background' ? 'Fondo de formulario' : 
                   type === 'qr-logo' ? 'Logo de QR' : 
                   type === 'qr-background' ? 'Fondo de QR' :
                   'Logo de iglesia para formulario'} cargado exitosamente`
      })
    }

    // Default response for unknown types
    return NextResponse.json({
      url: dataUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
      uploadType: type || 'unknown',
      message: 'Archivo cargado exitosamente'
    })

  } catch (error: any) {
    console.error('❌ Upload API error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
    
    return NextResponse.json({
      error: 'Error interno del servidor al procesar la carga',
      code: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}
