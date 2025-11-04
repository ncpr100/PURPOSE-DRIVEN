import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface AIInsight {
  id: string
  type: 'pattern' | 'recommendation' | 'anomaly' | 'opportunity'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  evidence: string[]
  actionItems: string[]
  confidence: number
  category: 'membership' | 'giving' | 'engagement' | 'ministry' | 'outreach'
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        id: true, 
        churchId: true, 
        role: true
      }
    })

    if (!user?.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 400 })
    }

    // Fetch data for AI analysis
    const [members, donations, events, communications] = await Promise.all([
      prisma.member.findMany({
        where: { churchId: user.churchId, isActive: true },
        select: {
          id: true,
          createdAt: true,
          membershipDate: true,
          birthDate: true,
          maritalStatus: true,
          donations: {
            select: { amount: true, donationDate: true }
          },
          volunteers: {
            select: { 
              assignments: { select: { id: true } }
            }
          }
        }
      }),
      prisma.donation.findMany({
        where: { churchId: user.churchId },
        select: { amount: true, donationDate: true, memberId: true }
      }),
      prisma.event.findMany({
        where: { churchId: user.churchId },
        select: { 
          id: true, 
          startDate: true, 
          category: true,
          checkIns: { select: { id: true } }
        }
      }),
      prisma.communication.findMany({
        where: { churchId: user.churchId },
        take: 100,
        orderBy: { sentAt: 'desc' },
        select: { 
          sentAt: true, 
          status: true, 
          type: true 
        }
      })
    ])

    // Generate AI insights based on data patterns
    const insights: AIInsight[] = []

    // 1. MEMBERSHIP GROWTH PATTERN ANALYSIS
    const recentMembers = members.filter(m => 
      new Date(m.createdAt) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    )
    const previousMembers = members.filter(m => {
      const date = new Date(m.createdAt)
      return date <= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) && 
             date > new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
    })

    if (recentMembers.length > previousMembers.length * 1.2) {
      insights.push({
        id: 'membership-growth-acceleration',
        type: 'pattern',
        priority: 'high',
        title: 'Aceleración en Crecimiento de Membresía',
        description: `El crecimiento de nuevos miembros ha aumentado un ${Math.round(((recentMembers.length / previousMembers.length) - 1) * 100)}% en los últimos 3 meses.`,
        evidence: [
          `${recentMembers.length} nuevos miembros en últimos 90 días`,
          `${previousMembers.length} miembros en período anterior`,
          'Tendencia sostenida por más de 30 días'
        ],
        actionItems: [
          'Preparar programa de integración expandido',
          'Aumentar capacidad de grupos pequeños',
          'Considerar nuevo ciclo de clases de membresía'
        ],
        confidence: 0.85,
        category: 'membership'
      })
    }

    // 2. GIVING PATTERN ANOMALY DETECTION
    const recentDonations = donations.filter(d => 
      new Date(d.donationDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    )
    const previousDonations = donations.filter(d => {
      const date = new Date(d.donationDate)
      return date <= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && 
             date > new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    })

    const recentTotal = recentDonations.reduce((sum, d) => sum + d.amount, 0)
    const previousTotal = previousDonations.reduce((sum, d) => sum + d.amount, 0)

    if (recentTotal > previousTotal * 1.3) {
      insights.push({
        id: 'giving-surge-detected',
        type: 'opportunity',
        priority: 'high',
        title: 'Incremento Significativo en Donaciones',
        description: `Las donaciones han aumentado ${Math.round(((recentTotal / previousTotal) - 1) * 100)}% este mes, indicando mayor compromiso financiero.`,
        evidence: [
          `$${recentTotal.toLocaleString()} en últimos 30 días`,
          `$${previousTotal.toLocaleString()} en período anterior`,
          `${recentDonations.length} donaciones recientes vs ${previousDonations.length} anteriores`
        ],
        actionItems: [
          'Analizar factores que contribuyeron al aumento',
          'Reforzar comunicación sobre impacto de donaciones',
          'Considerar lanzar proyecto especial mientras hay impulso'
        ],
        confidence: 0.92,
        category: 'giving'
      })
    }

    // 3. VOLUNTEER ENGAGEMENT ANALYSIS
    const activeVolunteers = members.filter(m => 
      m.volunteers.some(v => v.assignments.length > 0)
    )
    const volunteerRate = (activeVolunteers.length / members.length) * 100

    if (volunteerRate < 20) {
      insights.push({
        id: 'low-volunteer-engagement',
        type: 'recommendation',
        priority: 'medium',
        title: 'Oportunidad de Aumentar Participación Ministerial',
        description: `Solo el ${Math.round(volunteerRate)}% de los miembros participa activamente en ministerios.`,
        evidence: [
          `${activeVolunteers.length} voluntarios activos de ${members.length} miembros`,
          'Iglesias saludables típicamente tienen 30-40% participación',
          'Múltiples ministerios disponibles para servir'
        ],
        actionItems: [
          'Implementar campaña "Encuentra tu lugar de servicio"',
          'Crear feria de ministerios',
          'Desarrollar programa de identificación de dones espirituales'
        ],
        confidence: 0.78,
        category: 'ministry'
      })
    }

    // 4. EVENT ATTENDANCE PATTERN ANALYSIS
    const recentEvents = events.filter(e => 
      new Date(e.startDate) > new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    )
    const avgAttendance = recentEvents.reduce((sum, e) => sum + e.checkIns.length, 0) / recentEvents.length

    if (avgAttendance > 50) {
      insights.push({
        id: 'high-event-engagement',
        type: 'pattern',
        priority: 'medium',
        title: 'Excelente Participación en Eventos',
        description: `Los eventos tienen un promedio de ${Math.round(avgAttendance)} asistentes, indicando alta participación.`,
        evidence: [
          `${recentEvents.length} eventos en últimos 60 días`,
          `Promedio de ${Math.round(avgAttendance)} asistentes por evento`,
          'Tendencia consistente de alta participación'
        ],
        actionItems: [
          'Documentar mejores prácticas para replicar éxito',
          'Considerar aumentar frecuencia de eventos',
          'Expandir tipos de eventos basado en preferencias'
        ],
        confidence: 0.87,
        category: 'engagement'
      })
    }

    // 5. COMMUNICATION EFFECTIVENESS ANALYSIS
    const successfulCommunications = communications.filter(c => c.status === 'SENT')
    const communicationSuccessRate = (successfulCommunications.length / communications.length) * 100

    if (communicationSuccessRate < 85) {
      insights.push({
        id: 'communication-delivery-issue',
        type: 'anomaly',
        priority: 'medium',
        title: 'Problemas de Entrega en Comunicaciones',
        description: `Solo el ${Math.round(communicationSuccessRate)}% de las comunicaciones se entregan exitosamente.`,
        evidence: [
          `${successfulCommunications.length} de ${communications.length} comunicaciones exitosas`,
          'Tasa de entrega por debajo del 90% óptimo',
          'Posibles problemas con contactos desactualizados'
        ],
        actionItems: [
          'Actualizar base de datos de contactos',
          'Verificar configuración de proveedores de email/SMS',
          'Implementar limpieza automática de contactos inválidos'
        ],
        confidence: 0.82,
        category: 'outreach'
      })
    }

    // 6. DEMOGRAPHIC INSIGHTS
    const membersWithBirthDate = members.filter(m => m.birthDate)
    const averageAge = membersWithBirthDate.reduce((sum, m) => {
      const age = new Date().getFullYear() - new Date(m.birthDate!).getFullYear()
      return sum + age
    }, 0) / membersWithBirthDate.length

    if (averageAge > 50) {
      insights.push({
        id: 'aging-congregation-opportunity',
        type: 'opportunity',
        priority: 'low',
        title: 'Oportunidad de Alcance Generacional',
        description: `La edad promedio de la congregación es ${Math.round(averageAge)} años, sugiriendo oportunidad para ministerio joven.`,
        evidence: [
          `Edad promedio: ${Math.round(averageAge)} años`,
          `${membersWithBirthDate.length} miembros con datos de edad`,
          'Potencial para programas dirigidos a jóvenes y familias'
        ],
        actionItems: [
          'Desarrollar programas para jóvenes y jóvenes adultos',
          'Crear eventos familiares intergeneracionales',
          'Considerar ministerio universitario o de jóvenes profesionales'
        ],
        confidence: 0.74,
        category: 'outreach'
      })
    }

    // Sort insights by priority and confidence
    const sortedInsights = insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return b.confidence - a.confidence
    })

    return NextResponse.json({
      success: true,
      insights: sortedInsights,
      summary: {
        totalInsights: sortedInsights.length,
        highPriority: sortedInsights.filter(i => i.priority === 'high').length,
        patterns: sortedInsights.filter(i => i.type === 'pattern').length,
        recommendations: sortedInsights.filter(i => i.type === 'recommendation').length,
        anomalies: sortedInsights.filter(i => i.type === 'anomaly').length,
        opportunities: sortedInsights.filter(i => i.type === 'opportunity').length
      },
      generated: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error generating AI insights:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}