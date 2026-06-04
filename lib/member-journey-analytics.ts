import {
  MemberLifecycleStage,
  EngagementLevel,
  RetentionRisk,
} from "@/lib/services/cached-analytics";

export { MemberLifecycleStage, EngagementLevel, RetentionRisk };

export class MemberJourneyAnalytics {
  constructor(private churchId: string) {}
  async determineMemberLifecycleStage(memberId: string) {
    return MemberLifecycleStage.VISITOR;
  }
  async calculateEngagementScore(memberId: string) {
    return 50;
  }
  async calculateRetentionRisk(memberId: string) {
    return { risk: RetentionRisk.MEDIUM, score: 50, factors: [] };
  }
}

export function createMemberJourneyAnalytics(churchId: string) {
  return new MemberJourneyAnalytics(churchId);
}
