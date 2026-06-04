export enum MemberLifecycleStage {
  VISITOR = "VISITOR",
  FIRST_TIME_GUEST = "FIRST_TIME_GUEST",
  RETURNING_VISITOR = "RETURNING_VISITOR",
  REGULAR_ATTENDEE = "REGULAR_ATTENDEE",
  NEW_MEMBER = "NEW_MEMBER",
  ESTABLISHED_MEMBER = "ESTABLISHED_MEMBER",
  SERVING_MEMBER = "SERVING_MEMBER",
  LEADING_MEMBER = "LEADING_MEMBER",
  INACTIVE_MEMBER = "INACTIVE_MEMBER",
}
export enum EngagementLevel {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}
export enum RetentionRisk {
  VERY_LOW = "VERY_LOW",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  VERY_HIGH = "VERY_HIGH",
}
export interface CachedAnalyticsOptions {
  period?: number;
  forceRefresh?: boolean;
}
export function createCachedAnalyticsService(churchId: string) {
  return {
    churchId,
    async getExecutiveReport(o?: CachedAnalyticsOptions) {
      return {};
    },
    async getMemberJourney(mid: string) {
      return {};
    },
  };
}
