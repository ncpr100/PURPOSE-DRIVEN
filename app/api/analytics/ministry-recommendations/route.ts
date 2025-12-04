import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { memberAnalyticsCache } from '@/lib/member-analytics-cache';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.churchId) {
      return NextResponse.json(
        { error: 'No autorizado - Se requiere membresía de iglesia' },
        { status: 401 }
      );
    }

    const churchId = session.user.churchId;

    // Try to get from cache first
    const cached = await memberAnalyticsCache.getMinistryRecommendations(churchId);
    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true,
        timestamp: new Date().toISOString()
      });
    }

    // Get existing ministry recommendations
    const existingRecommendations = await db.ministry_pathway_recommendations.findMany({
      where: {
        churchId,
        status: 'pending'
      },
      include: {
        memberJourney: {
          include: {
            member: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                spiritualGiftsStructured: true
              }
            }
          }
        }
      },
      orderBy: [
        { matchScore: 'desc' },
        { priority: 'asc' }
      ]
    });

    // Get ministry information from ministries table
    const ministries = await db.ministries.findMany({
      where: {
        churchId,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        description: true
      }
    });

    // Get volunteer information to calculate current capacity
    const activeVolunteers = await db.volunteers.findMany({
      where: {
        churchId,
        isActive: true,
        ministryId: { not: null }
      },
      select: {
        ministryId: true
      }
    });

    const volunteerCounts = activeVolunteers.reduce((acc, vol) => {
      if (vol.ministryId) {
        acc[vol.ministryId] = (acc[vol.ministryId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Get members ready for ministry involvement
    const readyMembers = await db.member_journeys.findMany({
      where: {
        churchId,
        currentStage: { in: ['ESTABLISHED_MEMBER', 'LEADING_MEMBER', 'SERVING_MEMBER'] },
        engagementScore: { gte: 60 },
        member: { isActive: true }
      },
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            spiritualGiftsStructured: true,
            experienceLevelEnum: true,
            leadershipStage: true
          }
        },
        behavioralPatterns: {
          orderBy: { analyzedAt: 'desc' },
          take: 1
        }
      }
    });

    // Calculate AI-powered recommendations based on spiritual gifts and behavioral patterns
    const generateRecommendations = (member: any) => {
      const memberData = member.member;
      const spiritualGifts = memberData.spiritualGiftsStructured ? 
        JSON.parse(memberData.spiritualGiftsStructured as string) : { primary: [], secondary: [] };
      const behavioral = member.behavioralPatterns[0];

      const recommendations: any[] = [];

      // Leadership Development Track
      if (memberData.leadershipStage === 'VOLUNTEER' && 
          member.engagementScore >= 80 && 
          behavioral?.leadershipPotential > 0.7) {
        recommendations.push({
          type: 'leadership',
          title: 'Desarrollo de Liderazgo',
          description: 'Programa de formación para líderes emergentes',
          matchScore: 90 + Math.round(behavioral.leadershipPotential * 10),
          priority: 'high',
          timeCommitment: '6-8 horas semanales',
          requiredSkills: ['Liderazgo', 'Comunicación', 'Trabajo en equipo'],
          basedOnFactors: ['Alto potencial de liderazgo', 'Excelente engagement', 'Experiencia como voluntario']
        });
      }

      // Teaching Ministry
      if (spiritualGifts.primary?.includes('ENSEÑANZA') || 
          spiritualGifts.secondary?.includes('ENSEÑANZA')) {
        recommendations.push({
          type: 'ministry',
          title: 'Ministerio de Enseñanza',
          description: 'Enseñanza en clases bíblicas y grupos pequeños',
          matchScore: 85 + (behavioral?.communicationEngagement > 0.8 ? 10 : 0),
          priority: 'high',
          timeCommitment: '4-6 horas semanales',
          requiredSkills: ['Conocimiento bíblico', 'Comunicación efectiva', 'Paciencia'],
          basedOnFactors: ['Don de enseñanza identificado', 'Buena comunicación']
        });
      }

      // Hospitality Ministry
      if (spiritualGifts.primary?.includes('HOSPITALIDAD') || 
          behavioral?.socialInteraction > 0.7) {
        recommendations.push({
          type: 'service',
          title: 'Equipo de Hospitalidad',
          description: 'Dar la bienvenida y crear ambiente acogedor',
          matchScore: 80 + Math.round(behavioral?.socialInteraction * 10),
          priority: 'medium',
          timeCommitment: '2-3 horas semanales',
          requiredSkills: ['Amabilidad', 'Organización', 'Comunicación'],
          basedOnFactors: ['Fuerte interacción social', 'Don de hospitalidad']
        });
      }

      // Children/Youth Ministry
      if (spiritualGifts.primary?.includes('PASTOR') || 
          memberData.experienceLevelEnum === 'AVANZADO') {
        recommendations.push({
          type: 'ministry',
          title: 'Ministerio Juvenil',
          description: 'Trabajo con jóvenes y adolescentes',
          matchScore: 75 + (behavioral?.spiritualGrowthActivity > 0.6 ? 15 : 0),
          priority: 'medium',
          timeCommitment: '4-5 horas semanales',
          requiredSkills: ['Paciencia', 'Creatividad', 'Energía', 'Liderazgo'],
          basedOnFactors: ['Experiencia avanzada', 'Actividad de crecimiento espiritual']
        });
      }

      // Music/Worship Ministry
      if (spiritualGifts.primary?.includes('MUSICA') || 
          spiritualGifts.secondary?.includes('MUSICA')) {
        recommendations.push({
          type: 'ministry',
          title: 'Ministerio de Alabanza',
          description: 'Participación en el equipo de alabanza y adoración',
          matchScore: 85,
          priority: 'high',
          timeCommitment: '3-4 horas semanales',
          requiredSkills: ['Habilidad musical', 'Compromiso', 'Trabajo en equipo'],
          basedOnFactors: ['Don musical identificado']
        });
      }

      // Growth/Discipleship Programs
      if (member.engagementScore >= 70 && behavioral?.spiritualGrowthActivity > 0.5) {
        recommendations.push({
          type: 'growth',
          title: 'Programa de Discipulado',
          description: 'Crecimiento espiritual a través de mentoring',
          matchScore: 70 + Math.round(behavioral.spiritualGrowthActivity * 20),
          priority: 'medium',
          timeCommitment: '2-3 horas semanales',
          requiredSkills: ['Compromiso', 'Deseo de crecimiento', 'Disponibilidad'],
          basedOnFactors: ['Alta actividad de crecimiento espiritual', 'Buen engagement']
        });
      }

      return recommendations.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
    };

    // Generate recommendations for ready members who don't have existing recommendations
    const membersWithRecommendations = new Set(
      existingRecommendations.map(rec => rec.member_journeys.member?.id)
    );

    const newRecommendations: any[] = [];
    readyMembers.forEach(member => {
      if (!membersWithRecommendations.has(member.member?.id)) {
        const memberRecs = generateRecommendations(member);
        memberRecs.forEach(rec => {
          newRecommendations.push({
            ...rec,
            memberId: member.member?.id,
            memberName: `${member.member?.firstName} ${member.member?.lastName}`,
            currentStage: member.currentStage,
            engagementScore: member.engagementScore
          });
        });
      }
    });

    // Format existing recommendations
    const formattedExisting = existingRecommendations.map(rec => ({
      id: rec.id,
      type: rec.recommendationType,
      title: rec.title,
      description: rec.description,
      matchScore: rec.matchScore,
      priority: rec.priority,
      timeCommitment: rec.timeCommitment,
      requiredSkills: rec.requiredSkills ? JSON.parse(rec.requiredSkills as string) : [],
      basedOnFactors: rec.basedOnFactors ? JSON.parse(rec.basedOnFactors as string) : [],
      status: rec.status,
      memberId: rec.member_journeys.member?.id,
      memberName: `${rec.member_journeys.member?.firstName} ${rec.member_journeys.member?.lastName}`,
      memberEmail: rec.member_journeys.member?.email,
      currentStage: rec.member_journeys.currentStage,
      spiritualGiftsMatch: rec.spiritualGiftsMatch,
      experienceMatch: rec.experienceMatch,
      createdAt: rec.createdAt
    }));

    // Calculate ministry statistics
    const ministryStats = {
      totalOpenings: ministries.length * 3, // Assume average 3 positions per ministry
      totalVolunteers: Object.values(volunteerCounts).reduce((sum, count) => sum + count, 0),
      urgentNeeds: ministries.filter(ministry => 
        (volunteerCounts[ministry.id] || 0) < 2
      ).length,
      recentMatches: existingRecommendations.filter(rec => 
        rec.createdAt >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length
    };

    // Get member recommendations grouped by member
    const memberRecommendations = readyMembers.slice(0, 10).map(member => {
      const memberRecs = existingRecommendations.filter(rec => 
        rec.member_journeys.member?.id === member.member?.id
      );
      
      if (memberRecs.length === 0) {
        // Generate new recommendations
        const generated = generateRecommendations(member).slice(0, 2);
        return {
          id: member.member?.id,
          name: `${member.member?.firstName} ${member.member?.lastName}`,
          currentStage: member.currentStage,
          engagementScore: member.engagementScore,
          spiritualGifts: member.member?.spiritualGiftsStructured ? 
            JSON.parse(member.member.spiritualGiftsStructured as string).primary || [] : [],
          recommendations: generated
        };
      }

      return {
        id: member.member?.id,
        name: `${member.member?.firstName} ${member.member?.lastName}`,
        currentStage: member.currentStage,
        engagementScore: member.engagementScore,
        spiritualGifts: member.member?.spiritualGiftsStructured ? 
          JSON.parse(member.member.spiritualGiftsStructured as string).primary || [] : [],
        recommendations: memberRecs.slice(0, 2).map(rec => ({
          id: rec.id,
          type: rec.recommendationType,
          title: rec.title,
          matchScore: rec.matchScore,
          priority: rec.priority
        }))
      };
    });

    // Compile final data structure
    const recommendationsData = {
      topRecommendations: [
        ...formattedExisting.slice(0, 5),
        ...newRecommendations.slice(0, 5)
      ].sort((a, b) => b.matchScore - a.matchScore).slice(0, 8),
      
      memberRecommendations,
      
      ministryStats,
      
      urgentNeeds: ministries
        .filter(ministry => (volunteerCounts[ministry.id] || 0) < 2)
        .map(ministry => ({
          id: ministry.id,
          title: ministry.name,
          description: ministry.description || 'Descripción no disponible',
          currentVolunteers: volunteerCounts[ministry.id] || 0,
          neededVolunteers: 3 - (volunteerCounts[ministry.id] || 0),
          category: 'general', // Default category
          timeCommitment: 'Por determinar', // Default time commitment
          requiredSkills: ['Compromiso', 'Disponibilidad'] // Default skills
        })),
      
      recentActivity: {
        newRecommendations: newRecommendations.length,
        pendingApplications: existingRecommendations.length,
        recentMatches: ministryStats.recentMatches
      },
      
      lastUpdated: new Date().toISOString()
    };

    // Cache the results
    await memberAnalyticsCache.cacheMinistryRecommendations(churchId, recommendationsData);

    return NextResponse.json(recommendationsData);

  } catch (error) {
    console.error('Error fetching ministry recommendations:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al obtener recomendaciones de ministerio' },
      { status: 500 }
    );
  }
}