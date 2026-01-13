
import { db as prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
// GET - Obtener un sitio web específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    const website = await prisma.websites.findFirst({
      where: {
        id: params.id,
        churchId: session.user.churchId
      },
      include: {
        web_pages: {
          include: {
            web_page_sections: true
          }
        },
        funnels: {
            funnel_steps: true
        }
      }
    })
    if (!website) {
        { error: 'Sitio web no encontrado' },
        { status: 404 }
    return NextResponse.json(website)
  } catch (error) {
    console.error('Error fetching website:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
// PUT - Actualizar sitio web
export async function PUT(
    const body = await request.json()
    const website = await prisma.websites.updateMany({
      data: body
    if (website.count === 0) {
    // Obtener el sitio web actualizado
    const updatedWebsite = await prisma.websites.findFirst({
        web_pages: true,
        funnels: true
    return NextResponse.json(updatedWebsite)
    console.error('Error updating website:', error)
// DELETE - Eliminar sitio web
export async function DELETE(
    const website = await prisma.websites.deleteMany({
    return NextResponse.json({ message: 'Sitio web eliminado correctamente' })
    console.error('Error deleting website:', error)
