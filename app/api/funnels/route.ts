
import { db as prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { nanoid } from 'nanoid'
// GET - Obtener funnels por website ID
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId');
    
    if (!websiteId) {
      return NextResponse.json(
        { error: 'ID del sitio web es requerido' },
        { status: 400 }
      );
    }
    
    // Verificar que el sitio web pertenece a la iglesia
    const website = await prisma.websites.findFirst({
      where: {
        id: websiteId,
        churchId: session.user.churchId
      }
    });
    
    if (!website) {
      return NextResponse.json(
        { error: 'Sitio web no encontrado' },
        { status: 404 }
      );
    }
    
    const funnels = await prisma.funnels.findMany({
      where: {
        websiteId: websiteId
      },
      include: {
        funnel_steps: {
          orderBy: {
            order: 'asc'
          }
        },
        _count: {
          select: {
            funnel_conversions: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    return NextResponse.json(funnels);
  } catch (error) {
    console.error('Error fetching funnels:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
// POST - Crear nuevo funnel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { websiteId, name, slug, description, type, config } = body;
    
    // Verificar que el slug no existe en este sitio web
    const existingFunnel = await prisma.funnels.findFirst({
      where: {
        websiteId,
        slug
      }
    });
    
    if (existingFunnel) {
      return NextResponse.json(
        { error: 'Ya existe un funnel con esta URL en este sitio web' },
        { status: 409 }
      );
    }
    
    const funnel = await prisma.funnels.create({
      data: {
        websiteId,
        name,
        slug,
        description,
        type,
        config: config || {}
      }
    });
    
    return NextResponse.json(funnel);
  } catch (error) {
    console.error('Error creating funnel:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
