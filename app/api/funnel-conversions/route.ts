
import { db as prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { nanoid } from 'nanoid'
// GET - Obtener conversiones por funnel ID o website ID
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
    const funnelId = searchParams.get('funnelId')
    const websiteId = searchParams.get('websiteId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    let whereClause: any = {}
    if (funnelId) {
      // Verificar que el funnel pertenece a un sitio web de la iglesia
      const funnel = await prisma.funnels.findFirst({
        where: {
          id: funnelId,
          websites: {
            churchId: session.user.churchId
          }
        }
      })
      if (!funnel) {
        return NextResponse.json(
          { error: 'Funnel no encontrado' },
          { status: 404 }
        )
      }
      whereClause.funnelId = funnelId
    } else if (websiteId) {
      // Verificar que el sitio web pertenece a la iglesia
      const website = await prisma.websites.findFirst({
          id: websiteId,
          churchId: session.user.churchId
      if (!website) {
          { error: 'Sitio web no encontrado' },
      whereClause.funnel = {
        websiteId: websiteId
    } else {
      // Obtener todas las conversiones de sitios web de la iglesia
        website: {
    const conversions = await prisma.funnel_conversions.findMany({
      where: whereClause,
      include: {
        funnels: {
          select: {
            name: true,
            slug: true,
            websites: {
              select: {
                name: true,
                slug: true
              }
            }
        },
        funnel_steps: {
            slug: true
      },
      orderBy: {
        createdAt: 'desc'
      take: limit,
      skip: offset
    })
    return NextResponse.json(conversions)
  } catch (error) {
    console.error('Error fetching conversions:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
// POST - Registrar nueva conversión (para uso público)
export async function POST(request: NextRequest) {
    const body = await request.json()
    const { 
      funnelId, 
      stepId, 
      email, 
      firstName, 
      lastName, 
      phone, 
      data,
      source 
    } = body
    // Obtener información del request
    const userAgent = request.headers.get('user-agent') || undefined
    const forwarded = request.headers.get('x-forwarded-for')
    const ipAddress = forwarded ? forwarded.split(',')[0] : 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const conversion = await prisma.funnel_conversions.create({
      data: {
        id: nanoid(),
        funnelId,
        stepId,
        email,
        firstName,
        lastName,
        phone,
        data: data || {},
        source,
        ipAddress,
        userAgent,
    return NextResponse.json(conversion)
    console.error('Error creating conversion:', error)
