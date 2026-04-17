-- CreateEnum
CREATE TYPE "LeadershipInviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'DEFERRED');

-- CreateEnum
CREATE TYPE "BurnoutAlertType" AS ENUM ('OVER_ASSIGNMENT', 'DECLINING_ENGAGEMENT', 'CONSECUTIVE_SERVICE', 'NO_REST_ROTATION');

-- CreateEnum
CREATE TYPE "GenerosityAlertType" AS ENUM ('FIRST_GIFT', 'LAPSED_GIVER', 'CAMPAIGN_ONLY_DONOR', 'INCONSISTENT_GIVER', 'RECURRING_MILESTONE');

-- CreateTable
CREATE TABLE "leadership_pipeline_cache" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "candidates" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leadership_pipeline_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leadership_invitations" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "invitedBy" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "notes" TEXT,
    "status" "LeadershipInviteStatus" NOT NULL DEFAULT 'PENDING',
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "leadership_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "burnout_alerts" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "alertType" "BurnoutAlertType" NOT NULL,
    "severity" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "burnout_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_conversion_reports" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "totalVisitors" INTEGER NOT NULL,
    "followedUp" INTEGER NOT NULL,
    "returned" INTEGER NOT NULL,
    "conversionRate" DOUBLE PRECISION NOT NULL,
    "patterns" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitor_conversion_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generosity_journey_alerts" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "alertType" "GenerosityAlertType" NOT NULL,
    "message" TEXT NOT NULL,
    "isActioned" BOOLEAN NOT NULL DEFAULT false,
    "actionedBy" TEXT,
    "actionedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generosity_journey_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "small_group_health_scores" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "sizeTrend" TEXT NOT NULL,
    "attendanceScore" DOUBLE PRECISION NOT NULL,
    "leaderScore" DOUBLE PRECISION NOT NULL,
    "integrationScore" DOUBLE PRECISION NOT NULL,
    "overallStatus" TEXT NOT NULL,
    "recommendations" JSONB NOT NULL,
    "scoredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "small_group_health_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "church_board_reports" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "reportMonth" TEXT NOT NULL,
    "narrative" TEXT NOT NULL,
    "attendanceDelta" DOUBLE PRECISION NOT NULL,
    "giversDelta" DOUBLE PRECISION NOT NULL,
    "visitorRetention" DOUBLE PRECISION NOT NULL,
    "smallGroupScore" DOUBLE PRECISION NOT NULL,
    "actionItems" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "church_board_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "leadership_pipeline_cache_churchId_key" ON "leadership_pipeline_cache"("churchId");

-- CreateIndex
CREATE UNIQUE INDEX "small_group_health_scores_churchId_groupId_key" ON "small_group_health_scores"("churchId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "church_board_reports_churchId_reportMonth_key" ON "church_board_reports"("churchId", "reportMonth");

-- AddForeignKey
ALTER TABLE "leadership_pipeline_cache" ADD CONSTRAINT "leadership_pipeline_cache_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leadership_invitations" ADD CONSTRAINT "leadership_invitations_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "burnout_alerts" ADD CONSTRAINT "burnout_alerts_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_conversion_reports" ADD CONSTRAINT "visitor_conversion_reports_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generosity_journey_alerts" ADD CONSTRAINT "generosity_journey_alerts_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "small_group_health_scores" ADD CONSTRAINT "small_group_health_scores_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "church_board_reports" ADD CONSTRAINT "church_board_reports_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
