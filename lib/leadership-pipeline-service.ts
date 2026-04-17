// lib/leadership-pipeline-service.ts
// Agent 6: Leadership Pipeline Identifier
// Finds members whose behavioral data suggests leadership readiness.
// Never contacts members directly — only surfaces candidates to the pastor.

import { db } from "@/lib/db";

export interface LeadershipCandidate {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  lifecycleStage: string;
  engagementScore: number;
  spiritualGifts: string[];
  ministryPassions: string[];
  attendanceConsistency: number;
  volunteerMonths: number;
  readinessScore: number; // 0-100 composite
  readinessReasons: string[];
}

export async function identifyLeadershipCandidates(
  churchId: string
): Promise<LeadershipCandidate[]> {
  if (process.env.ENABLE_LEADERSHIP_PIPELINE !== "true") {
    return [];
  }

  // Step 1: Get members in mature/leading stages with high engagement
  // Lifecycle stages from schema: MATURE_LEADER, LEADING_MEMBER, SERVING_MEMBER
  const matureMembersRaw = await db.$queryRaw<
    Array<{
      id: string;
      firstName: string;
      lastName: string;
      phone: string | null;
      email: string | null;
      lifecycle: string;
      engagementScore: number;
      retentionScore: number;
      totalDaysInCurrentStage: number;
      attendanceConsistency: number | null;
      ministryParticipation: number | null;
    }>
  >`
    SELECT
      m.id, m."firstName", m."lastName", m.phone, m.email,
      mj."currentStage"            AS lifecycle,
      mj."engagementScore",
      mj."retentionScore",
      mj."totalDaysInCurrentStage",
      mbp."attendanceConsistency",
      mbp."ministryParticipation"
    FROM members m
    JOIN member_journeys mj ON mj."memberId" = m.id
    LEFT JOIN member_behavioral_patterns mbp ON mbp."memberJourneyId" = mj.id
    WHERE m."churchId" = ${churchId}
      AND m."isActive" = true
      AND mj."currentStage" IN ('MATURE_LEADER', 'LEADING_MEMBER', 'SERVING_MEMBER')
      AND mj."engagementScore" >= 60
      AND mj."totalDaysInCurrentStage" >= 180
    ORDER BY mj."engagementScore" DESC
    LIMIT 20
  `;

  if (matureMembersRaw.length === 0) return [];

  // Step 2: Get spiritual profiles for these members
  const memberIds = matureMembersRaw.map((m) => m.id);

  const spiritualProfiles = await db.member_spiritual_profiles.findMany({
    where: { memberId: { in: memberIds } },
    select: {
      memberId: true,
      primaryGifts: true,
      ministryPassions: true,
      experienceLevel: true,
      spiritualCalling: true,
    },
  });

  const profileMap = new Map(spiritualProfiles.map((p) => [p.memberId, p]));

  // Step 3: Get volunteer history (months active in last 12 months)
  const volunteerHistory = await db.$queryRaw<
    Array<{ memberId: string; activeMonths: number }>
  >`
    SELECT v."memberId", COUNT(DISTINCT DATE_TRUNC('month', va."createdAt")) AS "activeMonths"
    FROM volunteers v
    JOIN volunteer_assignments va ON va."volunteerId" = v.id
    WHERE v."churchId" = ${churchId}
      AND v."memberId" = ANY(${memberIds}::text[])
      AND va."createdAt" >= NOW() - INTERVAL '12 months'
      AND va.status = 'COMPLETED'
    GROUP BY v."memberId"
  `;

  const volunteerMap = new Map(
    volunteerHistory.map((v) => [v.memberId, Number(v.activeMonths)])
  );

  // Step 4: Exclude members who already have an active invitation
  const existingInvitations = await db.leadership_invitations.findMany({
    where: {
      churchId,
      memberId: { in: memberIds },
      status: { in: ["PENDING", "ACCEPTED"] },
    },
    select: { memberId: true },
  });

  const alreadyInvited = new Set(existingInvitations.map((i) => i.memberId));

  // Step 5: Score each candidate
  const candidates: LeadershipCandidate[] = [];

  for (const member of matureMembersRaw) {
    if (alreadyInvited.has(member.id)) continue;

    const profile = profileMap.get(member.id);
    const volunteerMonths = volunteerMap.get(member.id) || 0;

    const reasons: string[] = [];
    let score = 0;

    // Scoring dimensions (each max 20 points = 100 total)

    // 1. Engagement score (20 pts max)
    const engagementPts = Math.min(20, (member.engagementScore / 100) * 20);
    score += engagementPts;
    if (member.engagementScore >= 80)
      reasons.push(`Puntuación de compromiso alta: ${member.engagementScore}/100`);

    // 2. Lifecycle maturity (20 pts)
    const lifecyclePts = member.lifecycle === "MATURE_LEADER" ? 20 : 12;
    score += lifecyclePts;
    if (member.lifecycle === "MATURE_LEADER") reasons.push("Etapa Líder Maduro alcanzada");
    else if (member.lifecycle === "LEADING_MEMBER") reasons.push("Etapa Miembro Líder activa");

    // 3. Time in stage (20 pts)
    const timePts = Math.min(20, (member.totalDaysInCurrentStage / 365) * 20);
    score += timePts;
    if (member.totalDaysInCurrentStage >= 365)
      reasons.push(`${Math.round(member.totalDaysInCurrentStage / 30)} meses en etapa actual`);

    // 4. Volunteer consistency (20 pts)
    const volunteerPts = Math.min(20, (volunteerMonths / 12) * 20);
    score += volunteerPts;
    if (volunteerMonths >= 6)
      reasons.push(`${volunteerMonths} meses de servicio voluntario activo`);

    // 5. Spiritual profile completeness (20 pts)
    if (profile) {
      const gifts = profile.primaryGifts as string[] | null;
      const passions = profile.ministryPassions as string[] | null;
      const profilePts =
        (gifts?.length ? 7 : 0) +
        (passions?.length ? 7 : 0) +
        (profile.spiritualCalling ? 6 : 0);
      score += profilePts;
      if (gifts?.length)
        reasons.push(`Dones espirituales identificados: ${gifts.join(", ")}`);
    }

    // Only include if score is meaningful (>= 55)
    if (score >= 55) {
      const gifts = profile?.primaryGifts as string[] | null;
      const passions = profile?.ministryPassions as string[] | null;
      candidates.push({
        id: member.id,
        name: `${member.firstName} ${member.lastName}`,
        phone: member.phone,
        email: member.email,
        lifecycleStage: member.lifecycle,
        engagementScore: member.engagementScore,
        spiritualGifts: gifts || [],
        ministryPassions: passions || [],
        attendanceConsistency: member.attendanceConsistency || 0,
        volunteerMonths,
        readinessScore: Math.round(score),
        readinessReasons: reasons,
      });
    }
  }

  // Sort by readiness score, return top 5
  return candidates.sort((a, b) => b.readinessScore - a.readinessScore).slice(0, 5);
}

export async function refreshLeadershipPipeline(churchId: string) {
  const candidates = await identifyLeadershipCandidates(churchId);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await db.leadership_pipeline_cache.upsert({
    where: { churchId },
    update: {
      candidates: JSON.stringify(candidates),
      generatedAt: new Date(),
      expiresAt,
    },
    create: {
      churchId,
      candidates: JSON.stringify(candidates),
      generatedAt: new Date(),
      expiresAt,
    },
  });

  return candidates;
}
