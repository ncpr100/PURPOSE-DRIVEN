-- KHESED-TEK CMS: Conditional Social Media Automation Triggers Migration
-- This migration adds social media automation trigger types safely

-- Check if we should apply this migration based on environment
DO $$
BEGIN
    -- Only proceed if social media automation is enabled
    IF current_setting('application_name', true) LIKE '%social_media_enabled%' THEN
        -- Add new enum values for social media automation
        ALTER TYPE "AutomationTriggerType" ADD VALUE IF NOT EXISTS 'SOCIAL_MEDIA_POST_CREATED';
        ALTER TYPE "AutomationTriggerType" ADD VALUE IF NOT EXISTS 'SOCIAL_MEDIA_POST_PUBLISHED';
        ALTER TYPE "AutomationTriggerType" ADD VALUE IF NOT EXISTS 'SOCIAL_MEDIA_CAMPAIGN_LAUNCHED';
        ALTER TYPE "AutomationTriggerType" ADD VALUE IF NOT EXISTS 'SOCIAL_MEDIA_ACCOUNT_CONNECTED';
        ALTER TYPE "AutomationTriggerType" ADD VALUE IF NOT EXISTS 'SOCIAL_MEDIA_ENGAGEMENT_THRESHOLD';
        ALTER TYPE "AutomationTriggerType" ADD VALUE IF NOT EXISTS 'SOCIAL_MEDIA_SCHEDULED_POST_READY';
        ALTER TYPE "AutomationTriggerType" ADD VALUE IF NOT EXISTS 'SOCIAL_MEDIA_CAMPAIGN_COMPLETED';
        ALTER TYPE "AutomationTriggerType" ADD VALUE IF NOT EXISTS 'SOCIAL_MEDIA_ANALYTICS_REPORT';
        
        RAISE NOTICE 'Social media automation triggers added successfully';
    ELSE
        RAISE NOTICE 'Social media automation disabled - skipping trigger types addition';
    END IF;
END
$$;