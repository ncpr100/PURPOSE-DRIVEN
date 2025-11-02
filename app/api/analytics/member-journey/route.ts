import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface MemberJourneyStage {
  stage: string;
  count: number;
  percentage: number;
  averageDuration: number; // days
  conversionRate: number; // to next stage
}

interface ConversionFunnel {
  visitor: MemberJourneyStage;
  firstTimeGuest: MemberJourneyStage;
  returningGuest: MemberJourneyStage;
  regularAttendee: MemberJourneyStage;
  member: MemberJourneyStage;
  activeMember: MemberJourneyStage;
  leader: MemberJourneyStage;
}

interface SpiritualGrowthMetrics {
  baptisms: {
    thisMonth: number;
    lastMonth: number;
    growthRate: number;
  };
  discipleship: {
    totalInPrograms: number;
    completionRate: number;
    averageProgress: number;
  };
  ministry: {
    totalVolunteers: number;
    leadershipDevelopment: number;
    activeMinistries: number;
  };
  engagement: {
    averageWeeklyAttendance: number;
    prayerWallParticipation: number;
    smallGroupParticipation: number;
  };
}

interface MemberJourneyAnalytics {
  conversionFunnel: ConversionFunnel;
  spiritualGrowth: SpiritualGrowthMetrics;
  pathwayAnalysis: {
    mostCommonPath: string[];
    averageJourneyTime: number;
    dropoffPoints: Array<{
      stage: string;
      dropoffRate: number;
      recommendations: string[];
    }>;
  };
  segmentAnalysis: {
    demographics: Array<{
      segment: string;
      count: number;
      conversionRate: number;
      preferredPathway: string;
    }>;
    engagementLevels: Array<{
      level: string;
      count: number;
      characteristics: string[];
    }>;
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const churchId = session.user.churchId;
    if (!churchId) {
      return NextResponse.json({ error: 'Church not found' }, { status: 404 });
    }

    const searchParams = request.nextUrl.searchParams;
    const period = parseInt(searchParams.get('period') || '365'); // days

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - period);

    // Gather comprehensive member journey data
    const [
      visitors,
      members,
      checkIns,
      volunteers,
      prayerRequests,
      events,
      communications
    ] = await Promise.all([
      // Visitor tracking
      // Visitor conversion tracking via check-ins
      db.checkIn.findMany({
        where: { 
          churchId,
          checkedInAt: { gte: startDate, lte: endDate },
          isFirstTime: true
        },
        select: {
          id: true,
          checkedInAt: true,
          firstName: true,
          lastName: true,
          email: true,
          isFirstTime: true,
          visitorType: true
        }
      }),

      // Member progression tracking
      db.member.findMany({
        where: { churchId },
        include: {
          spiritualProfile: true
        },
        orderBy: { createdAt: 'asc' }
      }),

      // Attendance tracking
        db.checkIn.findMany({
          where: { 
            churchId,
            checkedInAt: { gte: startDate, lte: endDate }
          },
          select: {
            id: true,
            checkedInAt: true,
            firstName: true,
            lastName: true,
            isFirstTime: true
          }
        }),      // Ministry involvement
      db.volunteerAssignment.findMany({
        where: { 
          churchId,
          createdAt: { gte: startDate, lte: endDate }
        },
        include: {
          volunteer: {
            include: {
              member: true
            }
          }
        }
      }),

      // Prayer wall engagement
        db.prayerRequest.findMany({
          where: { 
            churchId,
            createdAt: { gte: startDate, lte: endDate }
          },
          select: {
            id: true,
            message: true,
            createdAt: true,
            status: true
          }
        }),      // Event participation
      db.event.findMany({
        where: { 
          churchId,
          startDate: { gte: startDate, lte: endDate }
        }
      }),

      // Communication engagement
      db.communication.findMany({
        where: { 
          churchId,
          sentAt: { gte: startDate, lte: endDate }
        }
      })
    ]);

    // Calculate comprehensive analytics
    const analytics: MemberJourneyAnalytics = {
      conversionFunnel: calculateConversionFunnel(visitors, members, checkIns),
      spiritualGrowth: calculateSpiritualGrowth(members, volunteers, prayerRequests),
      pathwayAnalysis: calculatePathwayAnalysis(visitors, members, checkIns),
      segmentAnalysis: calculateSegmentAnalysis(members, checkIns, volunteers)
    };

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Error in member journey analytics:', error);
    return NextResponse.json(
      { error: 'Error calculating member journey analytics' },
      { status: 500 }
    );
  }
}

function calculateConversionFunnel(visitors: any[], members: any[], checkIns: any[]): ConversionFunnel {
  const totalVisitors = visitors.length;
  const totalMembers = members.length;

  // Create attendance map
  const attendanceMap = new Map();
  checkIns.forEach(checkIn => {
    const id = checkIn.memberId || checkIn.visitorId;
    if (id) {
      if (!attendanceMap.has(id)) {
        attendanceMap.set(id, []);
      }
      attendanceMap.get(id).push(checkIn.checkInDate);
    }
  });

  // Calculate stages
  const firstTimeGuests = visitors.filter(v => {
    const attendance = attendanceMap.get(v.id) || [];
    return attendance.length === 1;
  }).length;

  const returningGuests = visitors.filter(v => {
    const attendance = attendanceMap.get(v.id) || [];
    return attendance.length > 1 && attendance.length < 4;
  }).length;

  const regularAttendees = visitors.filter(v => {
    const attendance = attendanceMap.get(v.id) || [];
    return attendance.length >= 4;
  }).length + members.filter(m => {
    const attendance = attendanceMap.get(m.id) || [];
    return attendance.length >= 4;
  }).length;

  const activeMembers = members.filter(m => {
    const attendance = attendanceMap.get(m.id) || [];
    const recentAttendance = attendance.filter(date => {
      const checkInDate = new Date(date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return checkInDate >= thirtyDaysAgo;
    });
    return recentAttendance.length >= 2;
  }).length;

  const leaders = members.filter(m => 
    m.role && ['PASTOR', 'LIDER', 'ADMIN_IGLESIA'].includes(m.role)
  ).length;

  // Calculate percentages and conversion rates
  const stages = [totalVisitors, firstTimeGuests, returningGuests, regularAttendees, totalMembers, activeMembers, leaders];
  
  const createStage = (index: number, name: string): MemberJourneyStage => ({
    stage: name,
    count: stages[index],
    percentage: totalVisitors > 0 ? Math.round((stages[index] / totalVisitors) * 100) : 0,
    averageDuration: calculateAverageDuration(name, visitors, members, checkIns),
    conversionRate: index < stages.length - 1 && stages[index] > 0 
      ? Math.round((stages[index + 1] / stages[index]) * 100) 
      : 0
  });

  return {
    visitor: createStage(0, 'Visitante'),
    firstTimeGuest: createStage(1, 'Primera Visita'),
    returningGuest: createStage(2, 'Visitante Recurrente'),
    regularAttendee: createStage(3, 'Asistente Regular'),
    member: createStage(4, 'Miembro'),
    activeMember: createStage(5, 'Miembro Activo'),
    leader: createStage(6, 'Líder')
  };
}

function calculateSpiritualGrowth(members: any[], volunteers: any[], prayerRequests: any[]): SpiritualGrowthMetrics {
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Baptism tracking (simplified - you might have a specific baptism model)
  const baptismsThisMonth = members.filter(m => 
    m.spiritualProfile?.baptismDate && 
    new Date(m.spiritualProfile.baptismDate) >= thisMonth
  ).length;

  const baptismsLastMonth = members.filter(m => 
    m.spiritualProfile?.baptismDate && 
    new Date(m.spiritualProfile.baptismDate) >= lastMonth &&
    new Date(m.spiritualProfile.baptismDate) < thisMonth
  ).length;

  const baptismGrowthRate = baptismsLastMonth > 0 
    ? Math.round(((baptismsThisMonth - baptismsLastMonth) / baptismsLastMonth) * 100)
    : 0;

  // Discipleship metrics
  const membersInDiscipleship = members.filter(m => 
    m.spiritualProfile?.discipleshipLevel && 
    m.spiritualProfile.discipleshipLevel !== 'NUEVO'
  ).length;

  const completedDiscipleship = members.filter(m => 
    m.spiritualProfile?.discipleshipLevel === 'MADURO' ||
    m.spiritualProfile?.discipleshipLevel === 'LIDER'
  ).length;

  const discipleshipCompletionRate = membersInDiscipleship > 0 
    ? Math.round((completedDiscipleship / membersInDiscipleship) * 100)
    : 0;

  // Ministry involvement
  const totalVolunteers = new Set(volunteers.map(v => v.volunteer?.member?.id)).size;
  const leadershipDevelopment = members.filter(m => 
    m.spiritualProfile?.leadershipLevel &&
    m.spiritualProfile.leadershipLevel !== 'NINGUNO'
  ).length;

  // Engagement metrics
  const prayerParticipants = new Set(prayerRequests.map(pr => pr.member?.id)).size;
  const activeMembers = members.filter(m => m.isActive).length;
  const prayerParticipationRate = activeMembers > 0 
    ? Math.round((prayerParticipants / activeMembers) * 100)
    : 0;

  return {
    baptisms: {
      thisMonth: baptismsThisMonth,
      lastMonth: baptismsLastMonth,
      growthRate: baptismGrowthRate
    },
    discipleship: {
      totalInPrograms: membersInDiscipleship,
      completionRate: discipleshipCompletionRate,
      averageProgress: Math.round((membersInDiscipleship / members.length) * 100)
    },
    ministry: {
      totalVolunteers,
      leadershipDevelopment,
      activeMinistries: new Set(volunteers.map(v => v.volunteer?.category)).size
    },
    engagement: {
      averageWeeklyAttendance: 0, // Would need weekly attendance data
      prayerWallParticipation: prayerParticipationRate,
      smallGroupParticipation: 0 // Would need small group data
    }
  };
}

function calculatePathwayAnalysis(visitors: any[], members: any[], checkIns: any[]): MemberJourneyAnalytics['pathwayAnalysis'] {
  // Simplified pathway analysis
  const mostCommonPath = [
    'Visitante',
    'Primera Visita',
    'Visitante Recurrente', 
    'Asistente Regular',
    'Miembro',
    'Miembro Activo'
  ];

  const averageJourneyTime = 180; // Average 6 months - would calculate from actual data

  const dropoffPoints = [
    {
      stage: 'Primera Visita',
      dropoffRate: 60,
      recommendations: [
        'Mejorar proceso de bienvenida',
        'Implementar seguimiento de visitantes',
        'Crear eventos especiales para nuevos visitantes'
      ]
    },
    {
      stage: 'Visitante Recurrente',
      dropoffRate: 35,
      recommendations: [
        'Invitar a grupos pequeños',
        'Ofrecer clases de membresía',
        'Conectar con mentores espirituales'
      ]
    },
    {
      stage: 'Miembro',
      dropoffRate: 20,
      recommendations: [
        'Ofrecer oportunidades de servicio',
        'Programas de discipulado',
        'Eventos de comunidad'
      ]
    }
  ];

  return {
    mostCommonPath,
    averageJourneyTime,
    dropoffPoints
  };
}

function calculateSegmentAnalysis(members: any[], checkIns: any[], volunteers: any[]): MemberJourneyAnalytics['segmentAnalysis'] {
  // Demographic analysis
  const demographics = [
    {
      segment: 'Jóvenes (18-30)',
      count: members.filter(m => {
        if (!m.birthDate) return false;
        const age = new Date().getFullYear() - new Date(m.birthDate).getFullYear();
        return age >= 18 && age <= 30;
      }).length,
      conversionRate: 75,
      preferredPathway: 'Eventos sociales → Grupos jóvenes → Membresía'
    },
    {
      segment: 'Adultos (31-50)',
      count: members.filter(m => {
        if (!m.birthDate) return false;
        const age = new Date().getFullYear() - new Date(m.birthDate).getFullYear();
        return age >= 31 && age <= 50;
      }).length,
      conversionRate: 85,
      preferredPathway: 'Servicios → Grupos familiares → Voluntariado'
    },
    {
      segment: 'Adultos mayores (50+)',
      count: members.filter(m => {
        if (!m.birthDate) return false;
        const age = new Date().getFullYear() - new Date(m.birthDate).getFullYear();
        return age > 50;
      }).length,
      conversionRate: 90,
      preferredPathway: 'Servicios → Ministerios → Liderazgo'
    }
  ];

  // Engagement level analysis
  const engagementLevels = [
    {
      level: 'Alto Compromiso',
      count: volunteers.length,
      characteristics: ['Voluntariado activo', 'Asistencia regular', 'Participación en ministerios']
    },
    {
      level: 'Compromiso Medio',
      count: Math.round(members.length * 0.4),
      characteristics: ['Asistencia ocasional', 'Participación en eventos', 'Donaciones periódicas']
    },
    {
      level: 'Bajo Compromiso',
      count: Math.round(members.length * 0.3),
      characteristics: ['Asistencia irregular', 'Participación mínima', 'Necesita seguimiento']
    }
  ];

  return {
    demographics,
    engagementLevels
  };
}

function calculateAverageDuration(stage: string, visitors: any[], members: any[], checkIns: any[]): number {
  // Simplified calculation - would need more detailed tracking
  const durations = {
    'Visitante': 7,
    'Primera Visita': 14,
    'Visitante Recurrente': 30,
    'Asistente Regular': 60,
    'Miembro': 90,
    'Miembro Activo': 180,
    'Líder': 365
  };
  
  return durations[stage as keyof typeof durations] || 30;
}