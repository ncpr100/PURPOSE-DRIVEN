

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('🔍 Session debug:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userEmail: session?.user?.email,
      churchId: session?.user?.churchId,
      role: session?.user?.role
    })
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Get user data from database to ensure we have the latest churchId
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, churchId: true, role: true }
    })

    console.log('🏛️ User data from DB:', user)

    if (!user || !user.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 400 })
    }

    const { eventHistory, currentSeason } = await request.json()
    
    console.log('AI Suggestions request data:', { eventHistory: eventHistory?.length, currentSeason })

    // Mock AI suggestions based on season and church patterns
    const seasonalSuggestions = {
      12: [ // December
        {
          title: 'Celebración Navideña Especial',
          description: 'Culto especial con villancicos, obra de teatro navideña y compartir familiar',
          category: 'CULTO',
          location: 'Auditorio Principal',
          suggestedBudget: 300,
          estimatedAttendees: 120
        },
        {
          title: 'Posadas Comunitarias',
          description: 'Serie de posadas en diferentes hogares de la comunidad',
          category: 'SOCIAL',
          location: 'Hogares de miembros',
          suggestedBudget: 150,
          estimatedAttendees: 80
        }
      ],
      3: [ // March
        {
          title: 'Retiro Espiritual de Primavera',
          description: 'Fin de semana de reflexión, oración y renovación espiritual',
          category: 'CAPACITACION',
          location: 'Centro de Retiros',
          suggestedBudget: 500,
          estimatedAttendees: 50
        }
      ],
      6: [ // June
        {
          title: 'Campamento Juvenil de Verano',
          description: 'Actividades al aire libre, deportes y talleres para jóvenes',
          category: 'SOCIAL',
          location: 'Parque Natural',
          suggestedBudget: 800,
          estimatedAttendees: 40
        }
      ]
    }

    // Get suggestions for current season
    const suggestions = (seasonalSuggestions as any)[currentSeason] || [
      {
        title: 'Culto Especial Mensual',
        description: 'Servicio especial con invitados y actividades familiares',
        category: 'CULTO',
        location: 'Santuario Principal',
        suggestedBudget: 200,
        estimatedAttendees: 100
      }
    ]

    // Add AI-generated insights based on event history
    if (eventHistory && eventHistory.length > 0) {
      const avgAttendance = eventHistory.reduce((acc: number, event: any) => 
        acc + (event.attendees?.length || 0), 0) / eventHistory.length

      suggestions[0].estimatedAttendees = Math.round(avgAttendance * 1.1) // 10% growth suggestion
    }

    return NextResponse.json({
      success: true,
      suggestions,
      insights: [
        'Los eventos de fin de semana tienden a tener mayor asistencia',
        'Considera eventos híbridos (presencial + virtual) para mayor alcance',
        'Los eventos familiares generan más participación comunitaria'
      ],
      aiConfidence: 0.85
    })
  } catch (error) {
    console.error('Error generating AI suggestions:', error)
    return NextResponse.json(
      { error: 'Error al generar sugerencias' }, 
      { status: 500 }
    )
  }
}

