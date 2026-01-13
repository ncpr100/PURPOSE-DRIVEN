
import { db as prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { nanoid } from 'nanoid'
// GET - Obtener todos los sitios web de una iglesia
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    const websites = await prisma.websites.findMany({
      where: {
        churchId: session.user.churchId
      },
      include: {
        web_pages: {
          select: {
            id: true,
            title: true,
            slug: true,
            isHomePage: true,
            isPublished: true
          }
        },
        funnels: {
            name: true,
            type: true,
            isActive: true
        _count: {
            web_pages: true,
            funnels: true
        }
      orderBy: {
        updatedAt: 'desc'
      }
    })
    return NextResponse.json(websites)
  } catch (error) {
    console.error('Error fetching websites:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
// POST - Crear nuevo sitio web
export async function POST(request: NextRequest) {
    const body = await request.json()
    const { name, description, slug, theme, primaryColor, secondaryColor } = body
    // Verificar que el slug no existe
    const existingWebsite = await prisma.websites.findUnique({
      where: { slug }
    if (existingWebsite) {
        { error: 'La URL del sitio web ya está en uso' },
        { status: 400 }
    const website = await prisma.websites.create({
      data: {
        id: nanoid(),
        name,
        description,
        slug,
        theme: theme || 'default',
        primaryColor: primaryColor || '#3B82F6',
        secondaryColor: secondaryColor || '#64748B',
        churchId: session.user.churchId,
        updatedAt: new Date(),
        web_pages: true,
        funnels: true,
    return NextResponse.json(website)
    console.error('Error creating website:', error)
