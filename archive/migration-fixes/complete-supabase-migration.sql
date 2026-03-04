g-- CreateEnum
CREATE TYPE "AutomationActionType" AS ENUM ('SEND_NOTIFICATION', 'SEND_EMAIL', 'SEND_PUSH', 'SEND_SMS', 'SEND_WHATSAPP', 'CREATE_FOLLOW_UP', 'ASSIGN_VOLUNTEER', 'ASSIGN_STAFF', 'UPDATE_MEMBER', 'CREATE_EVENT', 'CREATE_PRAYER_RESPONSE', 'ADD_TO_CRM', 'CATEGORIZE_VISITOR', 'ESCALATE_TO_SUPERVISOR', 'CREATE_MANUAL_TASK', 'FIND_BACKUP_VOLUNTEER', 'CUSTOM_WEBHOOK');

-- CreateEnum
CREATE TYPE "AutomationConditionType" AS ENUM ('EQUALS', 'NOT_EQUALS', 'GREATER_THAN', 'LESS_THAN', 'CONTAINS', 'NOT_CONTAINS', 'IN', 'NOT_IN', 'EXISTS', 'NOT_EXISTS', 'DATE_BEFORE', 'DATE_AFTER', 'DATE_BETWEEN', 'TIME_BEFORE', 'TIME_AFTER', 'CUSTOM');

-- CreateEnum
CREATE TYPE "AutomationTriggerType" AS ENUM ('MEMBER_JOINED', 'DONATION_RECEIVED', 'EVENT_CREATED', 'EVENT_UPDATED', 'ATTENDANCE_RECORDED', 'VOLUNTEER_ASSIGNED', 'BIRTHDAY', 'ANNIVERSARY', 'SERMON_PUBLISHED', 'COMMUNICATION_SENT', 'FOLLOW_UP_DUE', 'PRAYER_REQUEST_SUBMITTED', 'PRAYER_REQUEST_APPROVED', 'VISITOR_CHECKED_IN', 'VISITOR_RETURNED', 'VISITOR_FIRST_TIME', 'CUSTOM_EVENT', 'SOCIAL_MEDIA_POST_CREATED', 'SOCIAL_MEDIA_POST_PUBLISHED', 'SOCIAL_MEDIA_CAMPAIGN_LAUNCHED', 'SOCIAL_MEDIA_ACCOUNT_CONNECTED', 'SOCIAL_MEDIA_ENGAGEMENT_THRESHOLD', 'SOCIAL_MEDIA_SCHEDULED_POST_READY', 'SOCIAL_MEDIA_CAMPAIGN_COMPLETED', 'SOCIAL_MEDIA_ANALYTICS_REPORT', 'FORM_SUBMITTED', 'QR_CODE_SCANNED', 'VISITOR_FORM_SUBMITTED', 'PRAYER_FORM_SUBMITTED');

-- CreateEnum
CREATE TYPE "EngagementLevel" AS ENUM ('HIGH', 'MEDIUM_HIGH', 'MEDIUM', 'MEDIUM_LOW', 'LOW');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('NOVATO', 'INTERMEDIO', 'AVANZADO');

-- CreateEnum
CREATE TYPE "FunnelStepType" AS ENUM ('LANDING_PAGE', 'OPT_IN', 'THANK_YOU', 'SALES_PAGE', 'CHECKOUT', 'CONFIRMATION', 'CUSTOM');

-- CreateEnum
CREATE TYPE "FunnelType" AS ENUM ('LEAD_GENERATION', 'EVENT_REGISTRATION', 'DONATION', 'NEWSLETTER', 'CUSTOM');

-- CreateEnum
CREATE TYPE "LeadershipStage" AS ENUM ('VOLUNTEER', 'TEAM_COORDINATOR', 'MINISTRY_LEADER', 'SENIOR_LEADER', 'PASTOR');

-- CreateEnum
CREATE TYPE "MemberLifecycleStage" AS ENUM ('VISITOR', 'FIRST_TIME_GUEST', 'RETURNING_VISITOR', 'REGULAR_ATTENDEE', 'MEMBERSHIP_CANDIDATE', 'NEW_MEMBER', 'ESTABLISHED_MEMBER', 'GROWING_MEMBER', 'SERVING_MEMBER', 'LEADING_MEMBER', 'MATURE_LEADER', 'INACTIVE_MEMBER', 'DISCONNECTED_MEMBER');

-- CreateEnum
CREATE TYPE "RetentionRisk" AS ENUM ('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER', 'MIEMBRO');

-- CreateEnum
CREATE TYPE "VisitorCategory" AS ENUM ('FIRST_TIME', 'RETURNING', 'REGULAR', 'NON_MEMBER', 'MEMBER_CANDIDATE');

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_model_ab_tests" (
    "id" TEXT NOT NULL,
    "testName" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "controlModel" TEXT NOT NULL,
    "testModel" TEXT NOT NULL,
    "trafficSplit" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ai_model_ab_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_model_performance" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "metricType" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "sampleSize" INTEGER NOT NULL,
    "timeframe" TEXT NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_model_performance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_prediction_records" (
    "id" TEXT NOT NULL,
    "predictionType" TEXT NOT NULL,
    "memberId" TEXT,
    "churchId" TEXT NOT NULL,
    "predictedValue" JSONB NOT NULL,
    "actualValue" JSONB,
    "confidence" INTEGER NOT NULL,
    "accuracy" DOUBLE PRECISION,
    "contributingFactors" JSONB NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "predictionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validationDate" TIMESTAMP(3),
    "abTestId" TEXT,

    CONSTRAINT "ai_prediction_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_cache" (
    "id" TEXT NOT NULL,
    "cacheKey" TEXT NOT NULL,
    "dataType" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "parameters" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_dashboards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "layout" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "userRole" TEXT,
    "createdBy" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_dashboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_actions" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "type" "AutomationActionType" NOT NULL,
    "configuration" JSONB NOT NULL DEFAULT '{}',
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "delay" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_conditions" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "type" "AutomationConditionType" NOT NULL,
    "field" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "logicalOperator" TEXT NOT NULL DEFAULT 'AND',
    "groupId" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_executions" (
    "id" TEXT NOT NULL,
    "automationId" TEXT NOT NULL,
    "triggerData" TEXT,
    "status" TEXT NOT NULL DEFAULT 'EJECUTANDO',
    "results" TEXT,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "churchId" TEXT NOT NULL,

    CONSTRAINT "automation_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_rule_executions" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "triggerData" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "result" JSONB,
    "error" TEXT,
    "executedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_rule_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_rule_template_installations" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "automationRuleId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "customizations" JSONB,
    "installedBy" TEXT NOT NULL,
    "installedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_rule_template_installations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_rule_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "isSystemTemplate" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "triggerConfig" JSONB NOT NULL,
    "conditionsConfig" JSONB NOT NULL,
    "actionsConfig" JSONB NOT NULL,
    "priorityLevel" TEXT NOT NULL DEFAULT 'NORMAL',
    "escalationConfig" JSONB,
    "businessHoursOnly" BOOLEAN NOT NULL DEFAULT false,
    "businessHoursConfig" JSONB,
    "urgentMode24x7" BOOLEAN NOT NULL DEFAULT false,
    "retryConfig" JSONB,
    "fallbackChannels" JSONB,
    "createManualTaskOnFail" BOOLEAN NOT NULL DEFAULT true,
    "installCount" INTEGER NOT NULL DEFAULT 0,
    "lastUsedAt" TIMESTAMP(3),
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_rule_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_rules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "churchId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "executeOnce" BOOLEAN NOT NULL DEFAULT false,
    "maxExecutions" INTEGER,
    "executionCount" INTEGER NOT NULL DEFAULT 0,
    "lastExecuted" TIMESTAMP(3),
    "metadata" JSONB,
    "priorityLevel" TEXT NOT NULL DEFAULT 'NORMAL',
    "escalationConfig" JSONB,
    "businessHoursOnly" BOOLEAN NOT NULL DEFAULT false,
    "businessHoursConfig" JSONB,
    "urgentMode24x7" BOOLEAN NOT NULL DEFAULT false,
    "retryConfig" JSONB,
    "fallbackChannels" JSONB,
    "createManualTaskOnFail" BOOLEAN NOT NULL DEFAULT true,
    "bypassApproval" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "template" JSONB NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "automation_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_triggers" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "type" "AutomationTriggerType" NOT NULL,
    "eventSource" TEXT,
    "configuration" JSONB NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_triggers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "trigger" TEXT NOT NULL,
    "actions" TEXT NOT NULL,
    "conditions" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availability_matrices" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "recurringAvailability" JSONB NOT NULL,
    "blackoutDates" JSONB NOT NULL,
    "preferredMinistries" JSONB NOT NULL,
    "maxCommitmentsPerMonth" INTEGER NOT NULL DEFAULT 4,
    "preferredTimeSlots" JSONB NOT NULL,
    "travelWillingness" INTEGER NOT NULL DEFAULT 1,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "availability_matrices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "check_ins" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "isFirstTime" BOOLEAN NOT NULL DEFAULT false,
    "visitReason" TEXT,
    "prayerRequest" TEXT,
    "qrCode" TEXT,
    "eventId" TEXT,
    "churchId" TEXT NOT NULL,
    "checkedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visitorType" TEXT,
    "ministryInterest" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ageGroup" TEXT,
    "familyStatus" TEXT,
    "referredBy" TEXT,
    "followUpFormId" TEXT,
    "automationTriggered" BOOLEAN NOT NULL DEFAULT false,
    "lastContactDate" TIMESTAMP(3),
    "engagementScore" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "check_ins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "children_check_ins" (
    "id" TEXT NOT NULL,
    "childName" TEXT NOT NULL,
    "childAge" INTEGER,
    "parentName" TEXT NOT NULL,
    "parentPhone" TEXT NOT NULL,
    "parentEmail" TEXT,
    "emergencyContact" TEXT,
    "emergencyPhone" TEXT,
    "allergies" TEXT,
    "specialNeeds" TEXT,
    "qrCode" TEXT NOT NULL,
    "checkedIn" BOOLEAN NOT NULL DEFAULT true,
    "checkedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkedOut" BOOLEAN NOT NULL DEFAULT false,
    "checkedOutAt" TIMESTAMP(3),
    "checkedOutBy" TEXT,
    "eventId" TEXT,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "childPhotoUrl" TEXT,
    "parentPhotoUrl" TEXT,
    "securityPin" TEXT NOT NULL DEFAULT '000000',
    "biometricHash" TEXT,
    "photoTakenAt" TIMESTAMP(3),
    "backupAuthCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "pickupAttempts" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "requiresBothAuth" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "children_check_ins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "church_qualification_settings" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "volunteerMinMembershipDays" INTEGER NOT NULL DEFAULT 0,
    "volunteerRequireActiveStatus" BOOLEAN NOT NULL DEFAULT true,
    "volunteerRequireSpiritualAssessment" BOOLEAN NOT NULL DEFAULT false,
    "volunteerMinSpiritualScore" INTEGER NOT NULL DEFAULT 0,
    "leadershipMinMembershipDays" INTEGER NOT NULL DEFAULT 365,
    "leadershipRequireVolunteerExp" BOOLEAN NOT NULL DEFAULT false,
    "leadershipMinVolunteerDays" INTEGER NOT NULL DEFAULT 0,
    "leadershipRequireTraining" BOOLEAN NOT NULL DEFAULT false,
    "leadershipMinSpiritualScore" INTEGER NOT NULL DEFAULT 70,
    "leadershipMinLeadershipScore" INTEGER NOT NULL DEFAULT 60,
    "enableSpiritualMaturityScoring" BOOLEAN NOT NULL DEFAULT true,
    "enableLeadershipAptitudeScoring" BOOLEAN NOT NULL DEFAULT true,
    "enableMinistryPassionMatching" BOOLEAN NOT NULL DEFAULT true,
    "spiritualGiftsWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.4,
    "availabilityWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.25,
    "experienceWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.15,
    "ministryPassionWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "activityWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "church_qualification_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "church_subscription_addons" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "addonId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "church_subscription_addons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "church_subscriptions" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "billingCycle" TEXT NOT NULL DEFAULT 'MONTHLY',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "trialEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "cancelledAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "church_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "church_themes" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "themeName" TEXT NOT NULL DEFAULT 'church-default',
    "themeConfig" TEXT NOT NULL,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "bannerUrl" TEXT,
    "brandColors" TEXT,
    "primaryFont" TEXT DEFAULT 'Inter',
    "headingFont" TEXT DEFAULT 'Inter',
    "layoutStyle" TEXT DEFAULT 'default',
    "allowMemberThemes" BOOLEAN NOT NULL DEFAULT true,
    "allowColorChanges" BOOLEAN NOT NULL DEFAULT true,
    "allowFontChanges" BOOLEAN NOT NULL DEFAULT true,
    "allowLayoutChanges" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "church_themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "churches" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "founded" TIMESTAMP(3),
    "logo" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "churches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communication_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "variables" TEXT,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "communication_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "targetGroup" TEXT,
    "recipients" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'BORRADOR',
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "sentBy" TEXT NOT NULL,
    "templateId" TEXT,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "communications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_form_submissions" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "churchId" TEXT NOT NULL,

    CONSTRAINT "custom_form_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_forms" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "fields" JSONB NOT NULL,
    "config" JSONB NOT NULL,
    "qrConfig" JSONB NOT NULL,
    "qrCodeUrl" TEXT,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "churchId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "custom_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_reports" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "reportType" TEXT NOT NULL,
    "config" TEXT NOT NULL,
    "filters" TEXT,
    "columns" TEXT NOT NULL,
    "groupBy" TEXT,
    "sortBy" TEXT,
    "chartType" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "lastRunAt" TIMESTAMP(3),
    "runCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "custom_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboard_widgets" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "chartType" TEXT,
    "dataSource" TEXT NOT NULL,
    "filters" TEXT,
    "position" TEXT NOT NULL,
    "refreshInterval" INTEGER NOT NULL DEFAULT 300,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "config" TEXT,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dashboard_widgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donation_campaigns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "goal" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'COP',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ACTIVA',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "churchId" TEXT NOT NULL,
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donation_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donation_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "churchId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donation_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donations" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'COP',
    "donorName" TEXT,
    "donorEmail" TEXT,
    "donorPhone" TEXT,
    "memberId" TEXT,
    "categoryId" TEXT NOT NULL,
    "paymentMethodId" TEXT NOT NULL,
    "reference" TEXT,
    "notes" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'COMPLETADA',
    "donationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaignId" TEXT,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_resource_reservations" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'CONFIRMADA',
    "reservedBy" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_resource_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_resources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "capacity" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "location" TEXT,
    "capacity" INTEGER,
    "budget" DOUBLE PRECISION,
    "category" TEXT NOT NULL DEFAULT 'GENERAL',
    "status" TEXT NOT NULL DEFAULT 'PLANIFICANDO',
    "churchId" TEXT NOT NULL,
    "createdBy" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funnel_conversions" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "data" JSONB,
    "source" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "funnelId" TEXT NOT NULL,
    "stepId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "funnel_conversions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funnel_steps" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "type" "FunnelStepType" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "settings" JSONB NOT NULL,
    "funnelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "funnel_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funnels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type" "FunnelType" NOT NULL,
    "config" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "websiteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "funnels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_configs" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "config" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integration_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_communications" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "sentBy" TEXT,
    "sentTo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SENT',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_communications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_line_items" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_line_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_payments" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "paymentMethod" TEXT NOT NULL,
    "reference" TEXT,
    "notes" TEXT,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "type" TEXT NOT NULL DEFAULT 'SUBSCRIPTION',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "subtotal" DOUBLE PRECISION NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "isRecurrent" BOOLEAN NOT NULL DEFAULT false,
    "recurrentConfig" JSONB,
    "notes" TEXT,
    "pdfPath" TEXT,
    "sentAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpi_metrics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "metricType" TEXT NOT NULL,
    "dataSource" TEXT NOT NULL,
    "target" DOUBLE PRECISION,
    "currentValue" DOUBLE PRECISION NOT NULL,
    "previousValue" DOUBLE PRECISION,
    "changePercent" DOUBLE PRECISION,
    "trendDirection" TEXT,
    "color" TEXT NOT NULL DEFAULT 'blue',
    "icon" TEXT,
    "unit" TEXT,
    "period" TEXT NOT NULL DEFAULT 'MONTHLY',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "churchId" TEXT NOT NULL,
    "lastCalculated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kpi_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing_campaign_posts" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "scheduledAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "metrics" TEXT,
    "notes" TEXT,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marketing_campaign_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing_campaigns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "objectives" TEXT,
    "targetAudience" TEXT,
    "budget" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "platforms" TEXT NOT NULL,
    "metrics" TEXT,
    "tags" TEXT,
    "managerId" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marketing_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_behavioral_patterns" (
    "id" TEXT NOT NULL,
    "memberJourneyId" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "averageWeeklyAttendance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "attendanceConsistency" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "preferredEventTypes" JSONB NOT NULL,
    "attendanceTrend" TEXT NOT NULL DEFAULT 'stable',
    "communicationEngagement" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "eventParticipation" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "ministryParticipation" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "socialInteraction" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "givingFrequency" TEXT,
    "givingTrend" TEXT NOT NULL DEFAULT 'none',
    "averageDonationAmount" DOUBLE PRECISION DEFAULT 0.0,
    "givingConsistency" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "spiritualGrowthActivity" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "leadershipPotential" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "mentorshipEngagement" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "communityBuilding" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "readinessForNextStage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "stagnationRisk" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "dropoutRisk" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "analyzedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_behavioral_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_journeys" (
    "id" TEXT NOT NULL,
    "memberId" TEXT,
    "visitorId" TEXT,
    "churchId" TEXT NOT NULL,
    "currentStage" "MemberLifecycleStage" NOT NULL DEFAULT 'VISITOR',
    "previousStage" "MemberLifecycleStage",
    "stageStartDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalDaysInCurrentStage" INTEGER NOT NULL DEFAULT 0,
    "stageHistory" JSONB NOT NULL,
    "conversionMilestones" JSONB NOT NULL,
    "engagementTimeline" JSONB NOT NULL,
    "engagementScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "engagementLevel" "EngagementLevel" NOT NULL DEFAULT 'LOW',
    "retentionScore" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    "retentionRisk" "RetentionRisk" NOT NULL DEFAULT 'MEDIUM',
    "attendancePattern" JSONB NOT NULL,
    "ministryInvolvement" JSONB NOT NULL,
    "givingPattern" JSONB NOT NULL,
    "communicationResponse" JSONB NOT NULL,
    "nextStageRecommendation" "MemberLifecycleStage",
    "nextStageProbability" DOUBLE PRECISION,
    "recommendedActions" JSONB NOT NULL,
    "pathwayRecommendations" JSONB NOT NULL,
    "behavioralProfile" JSONB NOT NULL,
    "growthPredictions" JSONB NOT NULL,
    "riskFactors" JSONB NOT NULL,
    "strengthFactors" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAnalysisDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_journeys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_spiritual_profiles" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "primaryGifts" JSONB NOT NULL,
    "secondaryGifts" JSONB NOT NULL,
    "spiritualCalling" TEXT,
    "ministryPassions" JSONB NOT NULL,
    "experienceLevel" INTEGER NOT NULL DEFAULT 1,
    "leadershipScore" INTEGER NOT NULL DEFAULT 1,
    "servingMotivation" TEXT,
    "previousExperience" JSONB,
    "trainingCompleted" JSONB,
    "spiritualMaturityScore" INTEGER NOT NULL DEFAULT 50,
    "leadershipAptitudeScore" INTEGER NOT NULL DEFAULT 50,
    "ministryPassionScore" INTEGER NOT NULL DEFAULT 50,
    "availabilityScore" INTEGER NOT NULL DEFAULT 50,
    "teachingAbility" INTEGER NOT NULL DEFAULT 50,
    "pastoralHeart" INTEGER NOT NULL DEFAULT 50,
    "organizationalSkills" INTEGER NOT NULL DEFAULT 50,
    "communicationSkills" INTEGER NOT NULL DEFAULT 50,
    "leadershipTrainingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "leadershipTrainingDate" TIMESTAMP(3),
    "mentoringExperience" BOOLEAN NOT NULL DEFAULT false,
    "discipleshipTraining" BOOLEAN NOT NULL DEFAULT false,
    "volunteerReadinessScore" INTEGER NOT NULL DEFAULT 0,
    "leadershipReadinessScore" INTEGER NOT NULL DEFAULT 0,
    "assessmentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_spiritual_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "birthDate" TIMESTAMP(3),
    "baptismDate" TIMESTAMP(3),
    "membershipDate" TIMESTAMP(3),
    "maritalStatus" TEXT,
    "gender" TEXT,
    "occupation" TEXT,
    "photo" TEXT,
    "notes" TEXT,
    "churchId" TEXT NOT NULL,
    "userId" TEXT,
    "ministryId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "spiritualGifts" JSONB,
    "secondaryGifts" JSONB,
    "spiritualCalling" TEXT,
    "ministryPassion" JSONB,
    "experienceLevel" INTEGER DEFAULT 1,
    "availabilityScore" DOUBLE PRECISION DEFAULT 0.0,
    "leadershipReadiness" INTEGER DEFAULT 1,
    "skillsMatrix" JSONB,
    "personalityType" TEXT,
    "transportationOwned" BOOLEAN DEFAULT false,
    "childcareAvailable" BOOLEAN DEFAULT false,
    "backgroundCheckDate" TIMESTAMP(3),
    "emergencyContact" TEXT,
    "spiritualGiftsStructured" JSONB,
    "experienceLevelEnum" "ExperienceLevel",
    "leadershipStage" "LeadershipStage" DEFAULT 'VOLUNTEER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ministries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "churchId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ministries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ministry_gap_analyses" (
    "id" TEXT NOT NULL,
    "ministryId" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "analysisDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gapsIdentified" JSONB NOT NULL,
    "urgencyScore" INTEGER NOT NULL,
    "recommendedActions" JSONB NOT NULL,
    "currentStaffing" INTEGER NOT NULL,
    "optimalStaffing" INTEGER NOT NULL,
    "gapPercentage" DOUBLE PRECISION NOT NULL,
    "seasonalFactor" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ministry_gap_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ministry_pathway_recommendations" (
    "id" TEXT NOT NULL,
    "memberJourneyId" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "recommendationType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "basedOnFactors" JSONB NOT NULL,
    "spiritualGiftsMatch" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "availabilityMatch" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "experienceMatch" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "ministryCategory" TEXT,
    "requiredSkills" JSONB NOT NULL,
    "timeCommitment" TEXT,
    "difficultyLevel" TEXT NOT NULL DEFAULT 'beginner',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "presentedAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ministry_pathway_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_deliveries" (
    "id" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "deliveryMethod" TEXT,
    "deliveryStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emailEvents" BOOLEAN NOT NULL DEFAULT true,
    "emailDonations" BOOLEAN NOT NULL DEFAULT true,
    "emailCommunications" BOOLEAN NOT NULL DEFAULT true,
    "emailSystemUpdates" BOOLEAN NOT NULL DEFAULT true,
    "inAppEnabled" BOOLEAN NOT NULL DEFAULT true,
    "inAppEvents" BOOLEAN NOT NULL DEFAULT true,
    "inAppDonations" BOOLEAN NOT NULL DEFAULT true,
    "inAppCommunications" BOOLEAN NOT NULL DEFAULT true,
    "inAppSystemUpdates" BOOLEAN NOT NULL DEFAULT true,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT false,
    "pushEvents" BOOLEAN NOT NULL DEFAULT true,
    "pushDonations" BOOLEAN NOT NULL DEFAULT false,
    "pushCommunications" BOOLEAN NOT NULL DEFAULT true,
    "pushSystemUpdates" BOOLEAN NOT NULL DEFAULT true,
    "quietHoursEnabled" BOOLEAN NOT NULL DEFAULT false,
    "quietHoursStart" TEXT,
    "quietHoursEnd" TEXT,
    "weekendNotifications" BOOLEAN NOT NULL DEFAULT true,
    "digestEnabled" BOOLEAN NOT NULL DEFAULT false,
    "digestFrequency" TEXT NOT NULL DEFAULT 'DAILY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INFO',
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "titleTemplate" TEXT NOT NULL,
    "messageTemplate" TEXT NOT NULL,
    "actionLabel" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "defaultTargetRole" TEXT,
    "churchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "targetRole" TEXT,
    "targetUser" TEXT,
    "isGlobal" BOOLEAN NOT NULL DEFAULT false,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "actionUrl" TEXT,
    "actionLabel" TEXT,
    "expiresAt" TIMESTAMP(3),
    "churchId" TEXT NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "online_payments" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'COP',
    "gatewayType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "donorName" TEXT,
    "donorEmail" TEXT,
    "donorPhone" TEXT,
    "donationId" TEXT,
    "churchId" TEXT NOT NULL,
    "categoryId" TEXT,
    "reference" TEXT,
    "gatewayReference" TEXT,
    "redirectUrl" TEXT,
    "returnUrl" TEXT,
    "notes" TEXT,
    "metadata" JSONB,
    "webhookReceived" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "online_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_gateway_configs" (
    "id" TEXT NOT NULL,
    "gatewayType" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "isTestMode" BOOLEAN NOT NULL DEFAULT true,
    "merchantId" TEXT,
    "apiKey" TEXT,
    "clientId" TEXT,
    "clientSecret" TEXT,
    "webhookSecret" TEXT,
    "configuration" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_gateway_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isDigital" BOOLEAN NOT NULL DEFAULT false,
    "churchId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "conditions" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_features" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plan_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "freeTrialDays" INTEGER NOT NULL DEFAULT 14,
    "gracePeriodDays" INTEGER NOT NULL DEFAULT 7,
    "platformName" TEXT NOT NULL DEFAULT 'Kḥesed-tek Church Management Systems',
    "supportEmail" TEXT NOT NULL DEFAULT 'soporte@khesedtek.com',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "allowRegistrations" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prayer_approvals" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "approvedBy" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "approvedAt" TIMESTAMP(3),
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prayer_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prayer_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prayer_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prayer_contacts" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "preferredContact" TEXT NOT NULL DEFAULT 'sms',
    "churchId" TEXT NOT NULL,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prayer_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prayer_forms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "fields" JSONB NOT NULL,
    "style" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "slug" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prayer_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prayer_qr_codes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "formId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "design" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "scanCount" INTEGER NOT NULL DEFAULT 0,
    "lastScan" TIMESTAMP(3),
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prayer_qr_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prayer_requests" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "source" TEXT,
    "formId" TEXT,
    "qrCodeId" TEXT,
    "automationTriggered" BOOLEAN NOT NULL DEFAULT false,
    "triggeredRuleIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lastAutomationRun" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prayer_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prayer_response_templates" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "smsMessage" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prayer_response_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prayer_testimonies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "contactId" TEXT,
    "prayerRequestId" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "tags" JSONB,
    "churchId" TEXT NOT NULL,
    "formId" TEXT,
    "qrCodeId" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prayer_testimonies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "push_notification_logs" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "payload" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "deliveryAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastAttempt" TIMESTAMP(3),
    "error" TEXT,
    "clickedAt" TIMESTAMP(3),
    "dismissedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "push_notification_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "push_subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userAgent" TEXT,
    "platform" TEXT,
    "language" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "push_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_executions" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "fileUrl" TEXT,
    "parameters" TEXT,
    "rowCount" INTEGER,
    "executionTime" INTEGER,
    "errorMessage" TEXT,
    "executedBy" TEXT,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "report_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_schedules" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "dayOfWeek" INTEGER,
    "dayOfMonth" INTEGER,
    "time" TEXT NOT NULL,
    "recipients" TEXT NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'PDF',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSent" TIMESTAMP(3),
    "nextScheduled" TIMESTAMP(3),
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "conditions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "churchId" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sermons" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "outline" TEXT,
    "scripture" TEXT,
    "date" TIMESTAMP(3),
    "speaker" TEXT,
    "churchId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sermons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_media_accounts" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "username" TEXT,
    "displayName" TEXT,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSync" TIMESTAMP(3),
    "accountData" TEXT,
    "churchId" TEXT NOT NULL,
    "connectedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_media_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_media_metrics" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "postId" TEXT,
    "campaignId" TEXT,
    "platform" TEXT NOT NULL,
    "metricType" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "periodType" TEXT NOT NULL DEFAULT 'DAILY',
    "metadata" TEXT,
    "churchId" TEXT NOT NULL,
    "collectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_media_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_media_posts" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "mediaUrls" TEXT,
    "platforms" TEXT NOT NULL,
    "accountIds" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "scheduledAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "postIds" TEXT,
    "engagement" TEXT,
    "hashtags" TEXT,
    "mentions" TEXT,
    "campaignId" TEXT,
    "authorId" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_media_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spiritual_gifts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spiritual_gifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_addons" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceMonthly" TEXT NOT NULL,
    "priceYearly" TEXT,
    "billingType" TEXT NOT NULL DEFAULT 'MONTHLY',
    "pricePerUnit" TEXT,
    "unit" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_addons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "priceMonthly" TEXT NOT NULL,
    "priceYearly" TEXT,
    "maxChurches" INTEGER NOT NULL DEFAULT 1,
    "maxMembers" INTEGER NOT NULL DEFAULT 100,
    "maxUsers" INTEGER NOT NULL DEFAULT 5,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "features" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_contact_info" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "whatsappNumber" TEXT NOT NULL DEFAULT '+57 300 KHESED (543733)',
    "whatsappUrl" TEXT NOT NULL DEFAULT 'https://wa.me/573003435733',
    "email" TEXT NOT NULL DEFAULT 'soporte@khesedtek.com',
    "schedule" TEXT NOT NULL DEFAULT 'Lun-Vie 8AM-8PM (Colombia)',
    "companyName" TEXT NOT NULL DEFAULT 'Khesed-tek Systems',
    "location" TEXT NOT NULL DEFAULT 'Bogotá, Colombia',
    "website" TEXT NOT NULL DEFAULT 'https://khesedtek.com',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_contact_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_credentials" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "loginEmail" TEXT NOT NULL,
    "tempPassword" TEXT,
    "isFirstLogin" BOOLEAN NOT NULL DEFAULT true,
    "sentAt" TIMESTAMP(3),
    "lastSentAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenant_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimony_forms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "fields" JSONB NOT NULL,
    "style" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "slug" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "testimony_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimony_qr_codes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "formId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "design" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "scanCount" INTEGER NOT NULL DEFAULT 0,
    "lastScan" TIMESTAMP(3),
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "testimony_qr_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_permissions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL DEFAULT true,
    "conditions" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles_advanced" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_advanced_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_theme_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "churchId" TEXT,
    "themeName" TEXT NOT NULL DEFAULT 'default',
    "themeMode" TEXT NOT NULL DEFAULT 'light',
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "accentColor" TEXT,
    "destructiveColor" TEXT,
    "backgroundColor" TEXT,
    "foregroundColor" TEXT,
    "cardColor" TEXT,
    "cardForegroundColor" TEXT,
    "borderColor" TEXT,
    "mutedColor" TEXT,
    "mutedForegroundColor" TEXT,
    "fontFamily" TEXT DEFAULT 'Inter',
    "fontSize" TEXT DEFAULT 'medium',
    "borderRadius" TEXT DEFAULT '0.5rem',
    "compactMode" BOOLEAN NOT NULL DEFAULT false,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "brandName" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_theme_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'MIEMBRO',
    "churchId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFirstLogin" BOOLEAN NOT NULL DEFAULT false,
    "lastPasswordChange" TIMESTAMP(3),
    "phone" TEXT,
    "location" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "visitor_follow_ups" (
    "id" TEXT NOT NULL,
    "checkInId" TEXT NOT NULL,
    "visitorProfileId" TEXT,
    "followUpType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "scheduledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "assignedTo" TEXT,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "automationRuleId" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "category" TEXT,
    "touchSequence" INTEGER,
    "responseReceived" BOOLEAN NOT NULL DEFAULT false,
    "responseData" JSONB,
    "nextActionDue" TIMESTAMP(3),
    "ministryMatch" TEXT,

    CONSTRAINT "visitor_follow_ups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_forms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "fields" JSONB NOT NULL,
    "style" JSONB,
    "settings" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "slug" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitor_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_profiles" (
    "id" TEXT NOT NULL,
    "checkInId" TEXT,
    "memberId" TEXT,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "preferredContact" TEXT NOT NULL DEFAULT 'email',
    "category" "VisitorCategory" NOT NULL DEFAULT 'FIRST_TIME',
    "visitCount" INTEGER NOT NULL DEFAULT 1,
    "lastVisitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstVisitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "followUpsSent" INTEGER NOT NULL DEFAULT 0,
    "followUpsResponded" INTEGER NOT NULL DEFAULT 0,
    "interestAreas" TEXT[],
    "prayerRequestsMade" INTEGER NOT NULL DEFAULT 0,
    "eventAttendance" INTEGER NOT NULL DEFAULT 0,
    "autoAddedToCRM" BOOLEAN NOT NULL DEFAULT false,
    "crmAddedAt" TIMESTAMP(3),
    "assignedStaffId" TEXT,
    "source" TEXT,
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitor_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_qr_codes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "formId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "design" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "scanCount" INTEGER NOT NULL DEFAULT 0,
    "lastScan" TIMESTAMP(3),
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitor_qr_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_submissions" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "churchId" TEXT NOT NULL,
    "automationTriggered" BOOLEAN NOT NULL DEFAULT false,
    "triggeredRuleIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lastAutomationRun" TIMESTAMP(3),

    CONSTRAINT "visitor_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volunteer_assignments" (
    "id" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "eventId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ASIGNADO',
    "notes" TEXT,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "volunteer_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volunteer_engagement_scores" (
    "id" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "currentScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "participationRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "feedbackScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "growthTrend" TEXT NOT NULL DEFAULT 'STABLE',
    "lastActivityDate" TIMESTAMP(3),
    "burnoutRisk" TEXT NOT NULL DEFAULT 'LOW',
    "recommendedActions" JSONB,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "volunteer_engagement_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volunteer_recommendations" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "ministryId" TEXT NOT NULL,
    "eventId" TEXT,
    "recommendationType" TEXT NOT NULL,
    "matchScore" DOUBLE PRECISION NOT NULL,
    "reasoning" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "validUntil" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "volunteer_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volunteers" (
    "id" TEXT NOT NULL,
    "memberId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "skills" TEXT,
    "availability" TEXT,
    "ministryId" TEXT,
    "churchId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "volunteers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "web_page_sections" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "pageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "web_page_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "web_pages" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaImage" TEXT,
    "isHomePage" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "websiteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "web_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_analytics" (
    "id" TEXT NOT NULL,
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "uniqueVisitors" INTEGER NOT NULL DEFAULT 0,
    "bounceRate" DOUBLE PRECISION,
    "avgSessionDuration" INTEGER,
    "referrer" TEXT,
    "page" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "websiteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "website_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_requests" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "requestType" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "contactEmail" TEXT NOT NULL,
    "phone" TEXT,
    "estimatedPrice" INTEGER,
    "finalPrice" INTEGER,
    "estimatedCompletion" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "adminNotes" TEXT,
    "metadata" TEXT,
    "existingWebsiteId" TEXT,
    "resultingWebsiteId" TEXT,
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "website_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "websites" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "domain" TEXT,
    "description" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'default',
    "primaryColor" TEXT NOT NULL DEFAULT '#3B82F6',
    "secondaryColor" TEXT NOT NULL DEFAULT '#64748B',
    "accentColor" TEXT,
    "fontFamily" TEXT NOT NULL DEFAULT 'Inter',
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaImage" TEXT,
    "metadata" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "websites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformForm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "fields" JSONB NOT NULL,
    "style" JSONB NOT NULL,
    "settings" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "campaignTag" TEXT,
    "leadScore" INTEGER NOT NULL DEFAULT 50,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,

    CONSTRAINT "PlatformForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformFormSubmission" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "leadScore" INTEGER NOT NULL DEFAULT 0,
    "source" TEXT NOT NULL DEFAULT 'direct',
    "referrer" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "campaignTag" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "notes" TEXT,
    "followUpDate" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "processedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformFormSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformQRCode" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "trackingParams" JSONB NOT NULL,
    "placementContext" TEXT,
    "qrUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "scanCount" INTEGER NOT NULL DEFAULT 0,
    "lastScannedAt" TIMESTAMP(3),
    "generatedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformQRCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformQRScan" (
    "id" TEXT NOT NULL,
    "qrCodeId" TEXT NOT NULL,
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "location" JSONB,
    "referrer" TEXT,
    "conversionData" JSONB,

    CONSTRAINT "PlatformQRScan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qr_codes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "formId" TEXT,
    "config" JSONB NOT NULL,
    "preview" TEXT,
    "churchId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qr_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qr_scans" (
    "id" TEXT NOT NULL,
    "qrCodeId" TEXT NOT NULL,
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "location" JSONB,

    CONSTRAINT "qr_scans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE INDEX "ai_model_ab_tests_churchId_isActive_idx" ON "ai_model_ab_tests"("churchId", "isActive");

-- CreateIndex
CREATE INDEX "ai_model_ab_tests_startDate_endDate_idx" ON "ai_model_ab_tests"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "ai_model_performance_churchId_modelVersion_idx" ON "ai_model_performance"("churchId", "modelVersion");

-- CreateIndex
CREATE INDEX "ai_model_performance_metricType_calculatedAt_idx" ON "ai_model_performance"("metricType", "calculatedAt");

-- CreateIndex
CREATE INDEX "ai_prediction_records_accuracy_idx" ON "ai_prediction_records"("accuracy");

-- CreateIndex
CREATE INDEX "ai_prediction_records_churchId_predictionType_idx" ON "ai_prediction_records"("churchId", "predictionType");

-- CreateIndex
CREATE INDEX "ai_prediction_records_predictionDate_idx" ON "ai_prediction_records"("predictionDate");

-- CreateIndex
CREATE INDEX "ai_prediction_records_validationDate_idx" ON "ai_prediction_records"("validationDate");

-- CreateIndex
CREATE UNIQUE INDEX "analytics_cache_cacheKey_churchId_key" ON "analytics_cache"("cacheKey", "churchId");

-- CreateIndex
CREATE INDEX "automation_actions_orderIndex_idx" ON "automation_actions"("orderIndex");

-- CreateIndex
CREATE INDEX "automation_actions_ruleId_idx" ON "automation_actions"("ruleId");

-- CreateIndex
CREATE INDEX "automation_actions_type_idx" ON "automation_actions"("type");

-- CreateIndex
CREATE INDEX "automation_conditions_groupId_idx" ON "automation_conditions"("groupId");

-- CreateIndex
CREATE INDEX "automation_conditions_ruleId_idx" ON "automation_conditions"("ruleId");

-- CreateIndex
CREATE INDEX "automation_conditions_type_idx" ON "automation_conditions"("type");

-- CreateIndex
CREATE INDEX "automation_rule_executions_createdAt_idx" ON "automation_rule_executions"("createdAt");

-- CreateIndex
CREATE INDEX "automation_rule_executions_ruleId_idx" ON "automation_rule_executions"("ruleId");

-- CreateIndex
CREATE INDEX "automation_rule_executions_status_idx" ON "automation_rule_executions"("status");

-- CreateIndex
CREATE INDEX "automation_rule_template_installations_churchId_idx" ON "automation_rule_template_installations"("churchId");

-- CreateIndex
CREATE INDEX "automation_rule_template_installations_isActive_idx" ON "automation_rule_template_installations"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "automation_rule_template_installations_templateId_churchId_key" ON "automation_rule_template_installations"("templateId", "churchId");

-- CreateIndex
CREATE INDEX "automation_rule_templates_category_idx" ON "automation_rule_templates"("category");

-- CreateIndex
CREATE INDEX "automation_rule_templates_isActive_idx" ON "automation_rule_templates"("isActive");

-- CreateIndex
CREATE INDEX "automation_rule_templates_isPublic_idx" ON "automation_rule_templates"("isPublic");

-- CreateIndex
CREATE INDEX "automation_rules_bypassApproval_idx" ON "automation_rules"("bypassApproval");

-- CreateIndex
CREATE INDEX "automation_rules_churchId_idx" ON "automation_rules"("churchId");

-- CreateIndex
CREATE INDEX "automation_rules_isActive_idx" ON "automation_rules"("isActive");

-- CreateIndex
CREATE INDEX "automation_rules_priorityLevel_idx" ON "automation_rules"("priorityLevel");

-- CreateIndex
CREATE INDEX "automation_rules_priority_idx" ON "automation_rules"("priority");

-- CreateIndex
CREATE INDEX "automation_templates_category_idx" ON "automation_templates"("category");

-- CreateIndex
CREATE INDEX "automation_templates_isActive_idx" ON "automation_templates"("isActive");

-- CreateIndex
CREATE INDEX "automation_triggers_isActive_idx" ON "automation_triggers"("isActive");

-- CreateIndex
CREATE INDEX "automation_triggers_ruleId_idx" ON "automation_triggers"("ruleId");

-- CreateIndex
CREATE INDEX "automation_triggers_type_idx" ON "automation_triggers"("type");

-- CreateIndex
CREATE UNIQUE INDEX "availability_matrices_memberId_key" ON "availability_matrices"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "check_ins_qrCode_key" ON "check_ins"("qrCode");

-- CreateIndex
CREATE INDEX "check_ins_checkedInAt_idx" ON "check_ins"("checkedInAt");

-- CreateIndex
CREATE INDEX "check_ins_churchId_checkedInAt_eventId_idx" ON "check_ins"("churchId", "checkedInAt", "eventId");

-- CreateIndex
CREATE INDEX "check_ins_churchId_email_checkedInAt_idx" ON "check_ins"("churchId", "email", "checkedInAt");

-- CreateIndex
CREATE INDEX "check_ins_churchId_firstName_lastName_checkedInAt_idx" ON "check_ins"("churchId", "firstName", "lastName", "checkedInAt");

-- CreateIndex
CREATE INDEX "check_ins_isFirstTime_churchId_checkedInAt_idx" ON "check_ins"("isFirstTime", "churchId", "checkedInAt");

-- CreateIndex
CREATE UNIQUE INDEX "children_check_ins_qrCode_key" ON "children_check_ins"("qrCode");

-- CreateIndex
CREATE INDEX "children_check_ins_parentPhone_idx" ON "children_check_ins"("parentPhone");

-- CreateIndex
CREATE UNIQUE INDEX "church_qualification_settings_churchId_key" ON "church_qualification_settings"("churchId");

-- CreateIndex
CREATE UNIQUE INDEX "church_subscription_addons_subscriptionId_addonId_key" ON "church_subscription_addons"("subscriptionId", "addonId");

-- CreateIndex
CREATE UNIQUE INDEX "church_subscriptions_churchId_key" ON "church_subscriptions"("churchId");

-- CreateIndex
CREATE INDEX "church_subscriptions_churchId_idx" ON "church_subscriptions"("churchId");

-- CreateIndex
CREATE INDEX "church_subscriptions_planId_idx" ON "church_subscriptions"("planId");

-- CreateIndex
CREATE INDEX "church_subscriptions_status_idx" ON "church_subscriptions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "church_themes_churchId_key" ON "church_themes"("churchId");

-- CreateIndex
CREATE INDEX "communications_churchId_createdAt_type_idx" ON "communications"("churchId", "createdAt", "type");

-- CreateIndex
CREATE INDEX "communications_churchId_sentAt_type_status_idx" ON "communications"("churchId", "sentAt", "type", "status");

-- CreateIndex
CREATE INDEX "communications_sentAt_status_idx" ON "communications"("sentAt", "status");

-- CreateIndex
CREATE INDEX "custom_form_submissions_churchId_submittedAt_idx" ON "custom_form_submissions"("churchId", "submittedAt");

-- CreateIndex
CREATE INDEX "custom_form_submissions_formId_idx" ON "custom_form_submissions"("formId");

-- CreateIndex
CREATE UNIQUE INDEX "custom_forms_slug_key" ON "custom_forms"("slug");

-- CreateIndex
CREATE INDEX "custom_forms_churchId_isActive_idx" ON "custom_forms"("churchId", "isActive");

-- CreateIndex
CREATE INDEX "custom_forms_slug_idx" ON "custom_forms"("slug");

-- CreateIndex
CREATE INDEX "donations_campaignId_createdAt_idx" ON "donations"("campaignId", "createdAt");

-- CreateIndex
CREATE INDEX "donations_churchId_categoryId_createdAt_idx" ON "donations"("churchId", "categoryId", "createdAt");

-- CreateIndex
CREATE INDEX "donations_churchId_donationDate_status_idx" ON "donations"("churchId", "donationDate", "status");

-- CreateIndex
CREATE INDEX "donations_churchId_memberId_createdAt_amount_idx" ON "donations"("churchId", "memberId", "createdAt", "amount");

-- CreateIndex
CREATE INDEX "events_churchId_startDate_endDate_idx" ON "events"("churchId", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "events_churchId_status_startDate_category_idx" ON "events"("churchId", "status", "startDate", "category");

-- CreateIndex
CREATE INDEX "events_createdBy_churchId_startDate_idx" ON "events"("createdBy", "churchId", "startDate");

-- CreateIndex
CREATE UNIQUE INDEX "funnel_steps_funnelId_slug_key" ON "funnel_steps"("funnelId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "funnels_websiteId_slug_key" ON "funnels"("websiteId", "slug");

-- CreateIndex
CREATE INDEX "invoice_communications_invoiceId_idx" ON "invoice_communications"("invoiceId");

-- CreateIndex
CREATE INDEX "invoice_communications_type_idx" ON "invoice_communications"("type");

-- CreateIndex
CREATE INDEX "invoice_payments_invoiceId_idx" ON "invoice_payments"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "invoices_churchId_idx" ON "invoices"("churchId");

-- CreateIndex
CREATE INDEX "invoices_dueDate_idx" ON "invoices"("dueDate");

-- CreateIndex
CREATE INDEX "invoices_invoiceNumber_idx" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "invoices"("status");

-- CreateIndex
CREATE UNIQUE INDEX "marketing_campaign_posts_campaignId_postId_accountId_key" ON "marketing_campaign_posts"("campaignId", "postId", "accountId");

-- CreateIndex
CREATE INDEX "member_behavioral_patterns_churchId_idx" ON "member_behavioral_patterns"("churchId");

-- CreateIndex
CREATE INDEX "member_behavioral_patterns_dropoutRisk_idx" ON "member_behavioral_patterns"("dropoutRisk");

-- CreateIndex
CREATE INDEX "member_behavioral_patterns_memberJourneyId_idx" ON "member_behavioral_patterns"("memberJourneyId");

-- CreateIndex
CREATE INDEX "member_behavioral_patterns_readinessForNextStage_idx" ON "member_behavioral_patterns"("readinessForNextStage");

-- CreateIndex
CREATE UNIQUE INDEX "member_journeys_memberId_key" ON "member_journeys"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "member_journeys_visitorId_key" ON "member_journeys"("visitorId");

-- CreateIndex
CREATE INDEX "member_journeys_churchId_currentStage_idx" ON "member_journeys"("churchId", "currentStage");

-- CreateIndex
CREATE INDEX "member_journeys_currentStage_idx" ON "member_journeys"("currentStage");

-- CreateIndex
CREATE INDEX "member_journeys_engagementLevel_idx" ON "member_journeys"("engagementLevel");

-- CreateIndex
CREATE INDEX "member_journeys_lastAnalysisDate_idx" ON "member_journeys"("lastAnalysisDate");

-- CreateIndex
CREATE INDEX "member_journeys_retentionRisk_idx" ON "member_journeys"("retentionRisk");

-- CreateIndex
CREATE UNIQUE INDEX "member_spiritual_profiles_memberId_key" ON "member_spiritual_profiles"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "members_userId_key" ON "members"("userId");

-- CreateIndex
CREATE INDEX "members_churchId_email_idx" ON "members"("churchId", "email");

-- CreateIndex
CREATE INDEX "members_churchId_firstName_lastName_idx" ON "members"("churchId", "firstName", "lastName");

-- CreateIndex
CREATE INDEX "members_churchId_isActive_createdAt_idx" ON "members"("churchId", "isActive", "createdAt");

-- CreateIndex
CREATE INDEX "members_membershipDate_isActive_idx" ON "members"("membershipDate", "isActive");

-- CreateIndex
CREATE INDEX "ministry_pathway_recommendations_churchId_idx" ON "ministry_pathway_recommendations"("churchId");

-- CreateIndex
CREATE INDEX "ministry_pathway_recommendations_memberJourneyId_idx" ON "ministry_pathway_recommendations"("memberJourneyId");

-- CreateIndex
CREATE INDEX "ministry_pathway_recommendations_priority_idx" ON "ministry_pathway_recommendations"("priority");

-- CreateIndex
CREATE INDEX "ministry_pathway_recommendations_status_idx" ON "ministry_pathway_recommendations"("status");

-- CreateIndex
CREATE INDEX "notification_deliveries_notificationId_idx" ON "notification_deliveries"("notificationId");

-- CreateIndex
CREATE INDEX "notification_deliveries_userId_isRead_idx" ON "notification_deliveries"("userId", "isRead");

-- CreateIndex
CREATE UNIQUE INDEX "notification_deliveries_notificationId_userId_deliveryMetho_key" ON "notification_deliveries"("notificationId", "userId", "deliveryMethod");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_userId_key" ON "notification_preferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_templates_name_churchId_key" ON "notification_templates"("name", "churchId");

-- CreateIndex
CREATE UNIQUE INDEX "online_payments_paymentId_key" ON "online_payments"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "online_payments_donationId_key" ON "online_payments"("donationId");

-- CreateIndex
CREATE INDEX "online_payments_churchId_idx" ON "online_payments"("churchId");

-- CreateIndex
CREATE INDEX "online_payments_paymentId_idx" ON "online_payments"("paymentId");

-- CreateIndex
CREATE INDEX "online_payments_status_idx" ON "online_payments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "payment_gateway_configs_churchId_gatewayType_key" ON "payment_gateway_configs"("churchId", "gatewayType");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_resource_action_key" ON "permissions"("resource", "action");

-- CreateIndex
CREATE UNIQUE INDEX "plan_features_key_key" ON "plan_features"("key");

-- CreateIndex
CREATE UNIQUE INDEX "prayer_approvals_requestId_key" ON "prayer_approvals"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "prayer_categories_churchId_name_key" ON "prayer_categories"("churchId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "prayer_contacts_churchId_phone_email_key" ON "prayer_contacts"("churchId", "phone", "email");

-- CreateIndex
CREATE UNIQUE INDEX "prayer_forms_slug_key" ON "prayer_forms"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "prayer_qr_codes_code_key" ON "prayer_qr_codes"("code");

-- CreateIndex
CREATE INDEX "prayer_requests_automationTriggered_idx" ON "prayer_requests"("automationTriggered");

-- CreateIndex
CREATE INDEX "push_notification_logs_churchId_idx" ON "push_notification_logs"("churchId");

-- CreateIndex
CREATE INDEX "push_notification_logs_createdAt_idx" ON "push_notification_logs"("createdAt");

-- CreateIndex
CREATE INDEX "push_notification_logs_status_idx" ON "push_notification_logs"("status");

-- CreateIndex
CREATE INDEX "push_notification_logs_userId_idx" ON "push_notification_logs"("userId");

-- CreateIndex
CREATE INDEX "push_subscriptions_churchId_idx" ON "push_subscriptions"("churchId");

-- CreateIndex
CREATE INDEX "push_subscriptions_isActive_idx" ON "push_subscriptions"("isActive");

-- CreateIndex
CREATE INDEX "push_subscriptions_userId_idx" ON "push_subscriptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "push_subscriptions_userId_endpoint_key" ON "push_subscriptions"("userId", "endpoint");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_churchId_key" ON "roles"("name", "churchId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "social_media_accounts_platform_accountId_churchId_key" ON "social_media_accounts"("platform", "accountId", "churchId");

-- CreateIndex
CREATE UNIQUE INDEX "social_media_metrics_accountId_postId_metricType_date_perio_key" ON "social_media_metrics"("accountId", "postId", "metricType", "date", "periodType");

-- CreateIndex
CREATE UNIQUE INDEX "spiritual_gifts_name_key" ON "spiritual_gifts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_addons_key_key" ON "subscription_addons"("key");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_name_key" ON "subscription_plans"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_credentials_churchId_key" ON "tenant_credentials"("churchId");

-- CreateIndex
CREATE UNIQUE INDEX "testimony_forms_slug_key" ON "testimony_forms"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "testimony_qr_codes_code_key" ON "testimony_qr_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_userId_permissionId_key" ON "user_permissions"("userId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_advanced_userId_roleId_key" ON "user_roles_advanced"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "user_theme_preferences_userId_key" ON "user_theme_preferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE INDEX "visitor_follow_ups_followUpType_idx" ON "visitor_follow_ups"("followUpType");

-- CreateIndex
CREATE INDEX "visitor_follow_ups_status_idx" ON "visitor_follow_ups"("status");

-- CreateIndex
CREATE INDEX "visitor_follow_ups_visitorProfileId_idx" ON "visitor_follow_ups"("visitorProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "visitor_forms_slug_key" ON "visitor_forms"("slug");

-- CreateIndex
CREATE INDEX "visitor_profiles_category_idx" ON "visitor_profiles"("category");

-- CreateIndex
CREATE INDEX "visitor_profiles_email_idx" ON "visitor_profiles"("email");

-- CreateIndex
CREATE INDEX "visitor_profiles_lastVisitDate_idx" ON "visitor_profiles"("lastVisitDate");

-- CreateIndex
CREATE INDEX "visitor_profiles_phone_idx" ON "visitor_profiles"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "visitor_qr_codes_code_key" ON "visitor_qr_codes"("code");

-- CreateIndex
CREATE INDEX "visitor_submissions_churchId_submittedAt_idx" ON "visitor_submissions"("churchId", "submittedAt");

-- CreateIndex
CREATE INDEX "visitor_submissions_formId_status_idx" ON "visitor_submissions"("formId", "status");

-- CreateIndex
CREATE INDEX "visitor_submissions_automationTriggered_idx" ON "visitor_submissions"("automationTriggered");

-- CreateIndex
CREATE UNIQUE INDEX "volunteer_engagement_scores_volunteerId_key" ON "volunteer_engagement_scores"("volunteerId");

-- CreateIndex
CREATE INDEX "volunteers_churchId_memberId_isActive_createdAt_idx" ON "volunteers"("churchId", "memberId", "isActive", "createdAt");

-- CreateIndex
CREATE INDEX "volunteers_churchId_ministryId_isActive_idx" ON "volunteers"("churchId", "ministryId", "isActive");

-- CreateIndex
CREATE INDEX "volunteers_email_churchId_idx" ON "volunteers"("email", "churchId");

-- CreateIndex
CREATE UNIQUE INDEX "web_pages_websiteId_slug_key" ON "web_pages"("websiteId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "websites_slug_key" ON "websites"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformForm_slug_key" ON "PlatformForm"("slug");

-- CreateIndex
CREATE INDEX "PlatformForm_slug_idx" ON "PlatformForm"("slug");

-- CreateIndex
CREATE INDEX "PlatformForm_campaignTag_idx" ON "PlatformForm"("campaignTag");

-- CreateIndex
CREATE INDEX "PlatformForm_isActive_isPublic_idx" ON "PlatformForm"("isActive", "isPublic");

-- CreateIndex
CREATE INDEX "PlatformForm_createdAt_idx" ON "PlatformForm"("createdAt");

-- CreateIndex
CREATE INDEX "PlatformFormSubmission_formId_idx" ON "PlatformFormSubmission"("formId");

-- CreateIndex
CREATE INDEX "PlatformFormSubmission_status_idx" ON "PlatformFormSubmission"("status");

-- CreateIndex
CREATE INDEX "PlatformFormSubmission_campaignTag_idx" ON "PlatformFormSubmission"("campaignTag");

-- CreateIndex
CREATE INDEX "PlatformFormSubmission_leadScore_idx" ON "PlatformFormSubmission"("leadScore");

-- CreateIndex
CREATE INDEX "PlatformFormSubmission_createdAt_idx" ON "PlatformFormSubmission"("createdAt");

-- CreateIndex
CREATE INDEX "PlatformFormSubmission_followUpDate_idx" ON "PlatformFormSubmission"("followUpDate");

-- CreateIndex
CREATE INDEX "PlatformQRCode_formId_idx" ON "PlatformQRCode"("formId");

-- CreateIndex
CREATE INDEX "PlatformQRCode_placementContext_idx" ON "PlatformQRCode"("placementContext");

-- CreateIndex
CREATE INDEX "PlatformQRCode_scanCount_idx" ON "PlatformQRCode"("scanCount");

-- CreateIndex
CREATE INDEX "PlatformQRCode_createdAt_idx" ON "PlatformQRCode"("createdAt");

-- CreateIndex
CREATE INDEX "PlatformQRScan_qrCodeId_idx" ON "PlatformQRScan"("qrCodeId");

-- CreateIndex
CREATE INDEX "PlatformQRScan_scannedAt_idx" ON "PlatformQRScan"("scannedAt");

-- CreateIndex
CREATE INDEX "PlatformQRScan_ipAddress_idx" ON "PlatformQRScan"("ipAddress");

-- CreateIndex
CREATE INDEX "qr_codes_churchId_idx" ON "qr_codes"("churchId");

-- CreateIndex
CREATE INDEX "qr_codes_type_idx" ON "qr_codes"("type");

-- CreateIndex
CREATE INDEX "qr_codes_formId_idx" ON "qr_codes"("formId");

-- CreateIndex
CREATE INDEX "qr_codes_createdAt_idx" ON "qr_codes"("createdAt");

-- CreateIndex
CREATE INDEX "qr_scans_qrCodeId_idx" ON "qr_scans"("qrCodeId");

-- CreateIndex
CREATE INDEX "qr_scans_scannedAt_idx" ON "qr_scans"("scannedAt");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_model_ab_tests" ADD CONSTRAINT "ai_model_ab_tests_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_model_performance" ADD CONSTRAINT "ai_model_performance_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_prediction_records" ADD CONSTRAINT "ai_prediction_records_abTestId_fkey" FOREIGN KEY ("abTestId") REFERENCES "ai_model_ab_tests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_prediction_records" ADD CONSTRAINT "ai_prediction_records_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_prediction_records" ADD CONSTRAINT "ai_prediction_records_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_cache" ADD CONSTRAINT "analytics_cache_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_dashboards" ADD CONSTRAINT "analytics_dashboards_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_actions" ADD CONSTRAINT "automation_actions_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "automation_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_conditions" ADD CONSTRAINT "automation_conditions_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "automation_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_executions" ADD CONSTRAINT "automation_executions_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "automations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_executions" ADD CONSTRAINT "automation_executions_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_rule_executions" ADD CONSTRAINT "automation_rule_executions_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "automation_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_rule_template_installations" ADD CONSTRAINT "automation_rule_template_installations_automationRuleId_fkey" FOREIGN KEY ("automationRuleId") REFERENCES "automation_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_rule_template_installations" ADD CONSTRAINT "automation_rule_template_installations_installedBy_fkey" FOREIGN KEY ("installedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_rule_template_installations" ADD CONSTRAINT "automation_rule_template_installations_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "automation_rule_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_rule_templates" ADD CONSTRAINT "automation_rule_templates_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_rules" ADD CONSTRAINT "automation_rules_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_rules" ADD CONSTRAINT "automation_rules_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_templates" ADD CONSTRAINT "automation_templates_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_triggers" ADD CONSTRAINT "automation_triggers_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "automation_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automations" ADD CONSTRAINT "automations_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability_matrices" ADD CONSTRAINT "availability_matrices_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "children_check_ins" ADD CONSTRAINT "children_check_ins_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "children_check_ins" ADD CONSTRAINT "children_check_ins_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "church_qualification_settings" ADD CONSTRAINT "church_qualification_settings_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "church_subscription_addons" ADD CONSTRAINT "church_subscription_addons_addonId_fkey" FOREIGN KEY ("addonId") REFERENCES "subscription_addons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "church_subscription_addons" ADD CONSTRAINT "church_subscription_addons_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "church_subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "church_subscriptions" ADD CONSTRAINT "church_subscriptions_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "church_subscriptions" ADD CONSTRAINT "church_subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "church_themes" ADD CONSTRAINT "church_themes_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communication_templates" ADD CONSTRAINT "communication_templates_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "communication_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_form_submissions" ADD CONSTRAINT "custom_form_submissions_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_form_submissions" ADD CONSTRAINT "custom_form_submissions_formId_fkey" FOREIGN KEY ("formId") REFERENCES "custom_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_forms" ADD CONSTRAINT "custom_forms_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_forms" ADD CONSTRAINT "custom_forms_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_reports" ADD CONSTRAINT "custom_reports_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashboard_widgets" ADD CONSTRAINT "dashboard_widgets_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashboard_widgets" ADD CONSTRAINT "dashboard_widgets_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "analytics_dashboards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_campaigns" ADD CONSTRAINT "donation_campaigns_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "donation_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_campaigns" ADD CONSTRAINT "donation_campaigns_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_categories" ADD CONSTRAINT "donation_categories_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "donation_campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "donation_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_resource_reservations" ADD CONSTRAINT "event_resource_reservations_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_resource_reservations" ADD CONSTRAINT "event_resource_reservations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_resource_reservations" ADD CONSTRAINT "event_resource_reservations_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "event_resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_resources" ADD CONSTRAINT "event_resources_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funnel_conversions" ADD CONSTRAINT "funnel_conversions_funnelId_fkey" FOREIGN KEY ("funnelId") REFERENCES "funnels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funnel_conversions" ADD CONSTRAINT "funnel_conversions_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "funnel_steps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funnel_steps" ADD CONSTRAINT "funnel_steps_funnelId_fkey" FOREIGN KEY ("funnelId") REFERENCES "funnels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funnels" ADD CONSTRAINT "funnels_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_configs" ADD CONSTRAINT "integration_configs_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_communications" ADD CONSTRAINT "invoice_communications_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_communications" ADD CONSTRAINT "invoice_communications_sentBy_fkey" FOREIGN KEY ("sentBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_line_items" ADD CONSTRAINT "invoice_line_items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_payments" ADD CONSTRAINT "invoice_payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_payments" ADD CONSTRAINT "invoice_payments_verifiedBy_fkey" FOREIGN KEY ("verifiedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "church_subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpi_metrics" ADD CONSTRAINT "kpi_metrics_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing_campaign_posts" ADD CONSTRAINT "marketing_campaign_posts_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "social_media_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing_campaign_posts" ADD CONSTRAINT "marketing_campaign_posts_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "marketing_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing_campaign_posts" ADD CONSTRAINT "marketing_campaign_posts_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing_campaign_posts" ADD CONSTRAINT "marketing_campaign_posts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "social_media_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing_campaigns" ADD CONSTRAINT "marketing_campaigns_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_behavioral_patterns" ADD CONSTRAINT "member_behavioral_patterns_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_behavioral_patterns" ADD CONSTRAINT "member_behavioral_patterns_memberJourneyId_fkey" FOREIGN KEY ("memberJourneyId") REFERENCES "member_journeys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_journeys" ADD CONSTRAINT "member_journeys_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_journeys" ADD CONSTRAINT "member_journeys_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_spiritual_profiles" ADD CONSTRAINT "member_spiritual_profiles_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_ministryId_fkey" FOREIGN KEY ("ministryId") REFERENCES "ministries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ministries" ADD CONSTRAINT "ministries_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ministry_gap_analyses" ADD CONSTRAINT "ministry_gap_analyses_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ministry_gap_analyses" ADD CONSTRAINT "ministry_gap_analyses_ministryId_fkey" FOREIGN KEY ("ministryId") REFERENCES "ministries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ministry_pathway_recommendations" ADD CONSTRAINT "ministry_pathway_recommendations_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ministry_pathway_recommendations" ADD CONSTRAINT "ministry_pathway_recommendations_memberJourneyId_fkey" FOREIGN KEY ("memberJourneyId") REFERENCES "member_journeys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_deliveries" ADD CONSTRAINT "notification_deliveries_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_deliveries" ADD CONSTRAINT "notification_deliveries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_templates" ADD CONSTRAINT "notification_templates_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_payments" ADD CONSTRAINT "online_payments_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "donation_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_payments" ADD CONSTRAINT "online_payments_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_payments" ADD CONSTRAINT "online_payments_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "donations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_gateway_configs" ADD CONSTRAINT "payment_gateway_configs_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_approvals" ADD CONSTRAINT "prayer_approvals_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_approvals" ADD CONSTRAINT "prayer_approvals_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_approvals" ADD CONSTRAINT "prayer_approvals_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "prayer_contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_approvals" ADD CONSTRAINT "prayer_approvals_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "prayer_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_categories" ADD CONSTRAINT "prayer_categories_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_contacts" ADD CONSTRAINT "prayer_contacts_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_forms" ADD CONSTRAINT "prayer_forms_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_qr_codes" ADD CONSTRAINT "prayer_qr_codes_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_qr_codes" ADD CONSTRAINT "prayer_qr_codes_formId_fkey" FOREIGN KEY ("formId") REFERENCES "prayer_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_requests" ADD CONSTRAINT "prayer_requests_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "prayer_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_requests" ADD CONSTRAINT "prayer_requests_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_requests" ADD CONSTRAINT "prayer_requests_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "prayer_contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_response_templates" ADD CONSTRAINT "prayer_response_templates_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "prayer_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_response_templates" ADD CONSTRAINT "prayer_response_templates_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_testimonies" ADD CONSTRAINT "prayer_testimonies_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_testimonies" ADD CONSTRAINT "prayer_testimonies_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_testimonies" ADD CONSTRAINT "prayer_testimonies_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "prayer_contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_testimonies" ADD CONSTRAINT "prayer_testimonies_prayerRequestId_fkey" FOREIGN KEY ("prayerRequestId") REFERENCES "prayer_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "push_notification_logs" ADD CONSTRAINT "push_notification_logs_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "push_notification_logs" ADD CONSTRAINT "push_notification_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_executions" ADD CONSTRAINT "report_executions_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_executions" ADD CONSTRAINT "report_executions_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "custom_reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_schedules" ADD CONSTRAINT "report_schedules_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_schedules" ADD CONSTRAINT "report_schedules_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "custom_reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sermons" ADD CONSTRAINT "sermons_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_media_accounts" ADD CONSTRAINT "social_media_accounts_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_media_metrics" ADD CONSTRAINT "social_media_metrics_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "social_media_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_media_metrics" ADD CONSTRAINT "social_media_metrics_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_media_posts" ADD CONSTRAINT "social_media_posts_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "marketing_campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_media_posts" ADD CONSTRAINT "social_media_posts_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_credentials" ADD CONSTRAINT "tenant_credentials_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_credentials" ADD CONSTRAINT "tenant_credentials_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimony_forms" ADD CONSTRAINT "testimony_forms_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimony_qr_codes" ADD CONSTRAINT "testimony_qr_codes_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimony_qr_codes" ADD CONSTRAINT "testimony_qr_codes_formId_fkey" FOREIGN KEY ("formId") REFERENCES "testimony_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles_advanced" ADD CONSTRAINT "user_roles_advanced_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles_advanced" ADD CONSTRAINT "user_roles_advanced_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_theme_preferences" ADD CONSTRAINT "user_theme_preferences_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_theme_preferences" ADD CONSTRAINT "user_theme_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_follow_ups" ADD CONSTRAINT "visitor_follow_ups_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_follow_ups" ADD CONSTRAINT "visitor_follow_ups_checkInId_fkey" FOREIGN KEY ("checkInId") REFERENCES "check_ins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_follow_ups" ADD CONSTRAINT "visitor_follow_ups_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_follow_ups" ADD CONSTRAINT "visitor_follow_ups_visitorProfileId_fkey" FOREIGN KEY ("visitorProfileId") REFERENCES "visitor_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_forms" ADD CONSTRAINT "visitor_forms_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_profiles" ADD CONSTRAINT "visitor_profiles_assignedStaffId_fkey" FOREIGN KEY ("assignedStaffId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_profiles" ADD CONSTRAINT "visitor_profiles_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_qr_codes" ADD CONSTRAINT "visitor_qr_codes_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_qr_codes" ADD CONSTRAINT "visitor_qr_codes_formId_fkey" FOREIGN KEY ("formId") REFERENCES "visitor_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_submissions" ADD CONSTRAINT "visitor_submissions_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_submissions" ADD CONSTRAINT "visitor_submissions_formId_fkey" FOREIGN KEY ("formId") REFERENCES "visitor_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_assignments" ADD CONSTRAINT "volunteer_assignments_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_assignments" ADD CONSTRAINT "volunteer_assignments_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "volunteers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_engagement_scores" ADD CONSTRAINT "volunteer_engagement_scores_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "volunteers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_recommendations" ADD CONSTRAINT "volunteer_recommendations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_recommendations" ADD CONSTRAINT "volunteer_recommendations_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_recommendations" ADD CONSTRAINT "volunteer_recommendations_ministryId_fkey" FOREIGN KEY ("ministryId") REFERENCES "ministries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteers" ADD CONSTRAINT "volunteers_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteers" ADD CONSTRAINT "volunteers_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteers" ADD CONSTRAINT "volunteers_ministryId_fkey" FOREIGN KEY ("ministryId") REFERENCES "ministries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "web_page_sections" ADD CONSTRAINT "web_page_sections_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "web_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "web_pages" ADD CONSTRAINT "web_pages_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_analytics" ADD CONSTRAINT "website_analytics_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_requests" ADD CONSTRAINT "website_requests_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_requests" ADD CONSTRAINT "website_requests_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_requests" ADD CONSTRAINT "website_requests_existingWebsiteId_fkey" FOREIGN KEY ("existingWebsiteId") REFERENCES "websites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_requests" ADD CONSTRAINT "website_requests_resultingWebsiteId_fkey" FOREIGN KEY ("resultingWebsiteId") REFERENCES "websites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "websites" ADD CONSTRAINT "websites_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformForm" ADD CONSTRAINT "PlatformForm_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformFormSubmission" ADD CONSTRAINT "PlatformFormSubmission_formId_fkey" FOREIGN KEY ("formId") REFERENCES "PlatformForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformFormSubmission" ADD CONSTRAINT "PlatformFormSubmission_processedById_fkey" FOREIGN KEY ("processedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformQRCode" ADD CONSTRAINT "PlatformQRCode_formId_fkey" FOREIGN KEY ("formId") REFERENCES "PlatformForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformQRCode" ADD CONSTRAINT "PlatformQRCode_generatedById_fkey" FOREIGN KEY ("generatedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformQRScan" ADD CONSTRAINT "PlatformQRScan_qrCodeId_fkey" FOREIGN KEY ("qrCodeId") REFERENCES "PlatformQRCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_formId_fkey" FOREIGN KEY ("formId") REFERENCES "custom_forms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_scans" ADD CONSTRAINT "qr_scans_qrCodeId_fkey" FOREIGN KEY ("qrCodeId") REFERENCES "qr_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

