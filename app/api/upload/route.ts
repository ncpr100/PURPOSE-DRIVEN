
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

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

    // For church logos, update the church record directly
    if (type === 'church-logo') {
      console.log('🏠 Updating church logo in database...')
      
      await db.churches.update({
        where: { id: session.user.churchId },
        data: { logo: dataUrl }
      })

      console.log('✅ Church logo updated successfully')
      
      // Return the actual base64 data URL so the image displays immediately
      return NextResponse.json({ 
        url: dataUrl,
        filename: file.name,
        size: file.size,
        type: file.type,
        message: 'Logo guardado exitosamente en la base de datos'
      })
    }

  } catch (error) {
    console.error('❌ Error uploading file:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
