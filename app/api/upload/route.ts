
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Allow uploads for authenticated users with churchId OR SUPER_ADMIN users
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado - Usuario no autenticado' }, { status: 401 })
    }
    
    // SUPER_ADMIN users can upload regardless of churchId
    if (session.user.role !== 'SUPER_ADMIN' && !session.user.churchId) {
      return NextResponse.json({ error: 'No autorizado - Church ID requerido' }, { status: 401 })
    }

    console.log('📤 Upload request from:', session.user.email, 'Role:', session.user.role, 'ChurchId:', session.user.churchId)

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    if (!file) {
      return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Solo se permiten imágenes' }, { status: 400 })
    }

    // Validate file size (max 2MB for base64 storage)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'El archivo debe ser menor a 2MB' }, { status: 400 })
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
        
        await db.churches.update({
          where: { id: session.user.churchId },
          data: { logo: dataUrl }
        })
        
        console.log('✅ Church logo updated successfully in database')
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

  } catch (error) {
    console.error('❌ Error uploading file:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
