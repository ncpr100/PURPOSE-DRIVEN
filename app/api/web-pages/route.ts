
import { db as prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { nanoid } from 'nanoid'
// GET - Obtener páginas web por website ID
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    const { searchParams } = new URL(request.url)
    const websiteId = searchParams.get('websiteId')
    if (!websiteId) {
        { error: 'ID del sitio web es requerido' },
        { status: 400 }
    // Verificar que el sitio web pertenece a la iglesia
    const website = await prisma.websites.findFirst({
      where: {
        id: websiteId,
        churchId: session.user.churchId
      }
    })
    if (!website) {
        { error: 'Sitio web no encontrado' },
        { status: 404 }
    const pages = await prisma.web_pages.findMany({
        websiteId: websiteId
      },
      include: {
        web_page_sections: {
          orderBy: {
            order: 'asc'
          }
        }
      orderBy: [
        { isHomePage: 'desc' },
        { order: 'asc' }
      ]
    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching web pages:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
// POST - Crear nueva página web
export async function POST(request: NextRequest) {
    const body = await request.json()
    const { websiteId, title, slug, content, isHomePage, metaTitle, metaDescription } = body
    // Verificar que el slug no existe en este sitio web
    const existingPage = await prisma.web_pages.findFirst({
        websiteId,
        slug
    if (existingPage) {
        { error: 'Ya existe una página con esta URL en este sitio web' },
    // Si es página de inicio, desmarcar otras como homepage
    if (isHomePage) {
      await prisma.web_pages.updateMany({
        where: {
          websiteId,
          isHomePage: true
        },
        data: {
          isHomePage: false
      })
    const page = await prisma.web_pages.create({
      data: {
        id: nanoid(),
        title,
        slug,
        content: content || {},
        isHomePage: isHomePage || false,
        metaTitle,
        metaDescription,
        updatedAt: new Date()
        web_page_sections: true
    return NextResponse.json(page)
    console.error('Error creating web page:', error)
