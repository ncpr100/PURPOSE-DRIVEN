-- 🔒 SUPABASE SECURITY & PERFORMANCE FIX SCRIPT
-- This script resolves RLS policy issues and performance problems
-- Run this in Supabase SQL Editor with service_role privileges

-- =====================================================
-- PART 1: ENABLE RLS ON ALL PUBLIC TABLES
-- =====================================================

-- Core application tables that need RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_media_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministry_pathway_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_behavioral_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_prediction_records ENABLE ROW LEVEL SECURITY;

-- Analytics and reporting tables
ALTER TABLE public.analytics_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_executions ENABLE ROW LEVEL SECURITY;

-- Supporting tables
ALTER TABLE public.ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spiritual_gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_themes ENABLE ROW LEVEL SECURITY;

-- Log tables that should NOT have RLS (service access only)
-- These are typically accessed by service role only
-- ALTER TABLE public.resend_logs ENABLE ROW LEVEL SECURITY; -- Skip - service only
-- ALTER TABLE public._test_vault ENABLE ROW LEVEL SECURITY; -- Skip - test table

-- =====================================================
-- PART 2: CREATE RLS POLICIES FOR MULTI-TENANT ACCESS
-- =====================================================

-- USERS TABLE POLICIES
-- Super admins can access all users, regular users only their own church
CREATE POLICY "users_select_policy" ON public.users
    FOR SELECT USING (
        auth.role() = 'service_role' OR
        (auth.jwt() ->> 'role' = 'SUPER_ADMIN') OR 
        ("churchId" = auth.jwt() ->> 'churchId')
    );

CREATE POLICY "users_insert_policy" ON public.users
    FOR INSERT WITH CHECK (
        auth.role() = 'service_role' OR
        (auth.jwt() ->> 'role' IN ('SUPER_ADMIN', 'PASTOR', 'ADMINISTRADOR'))
    );

CREATE POLICY "users_update_policy" ON public.users
    FOR UPDATE USING (
        auth.role() = 'service_role' OR
        (auth.jwt() ->> 'role' = 'SUPER_ADMIN') OR 
        (id = auth.jwt() ->> 'sub') OR
        ("churchId" = auth.jwt() ->> 'churchId' AND auth.jwt() ->> 'role' IN ('PASTOR', 'ADMINISTRADOR'))
    );

-- CHURCHES TABLE POLICIES
CREATE POLICY "churches_select_policy" ON public.churches
    FOR SELECT USING (
        auth.role() = 'service_role' OR
        (auth.jwt() ->> 'role' = 'SUPER_ADMIN') OR 
        (id = auth.jwt() ->> 'churchId')
    );

CREATE POLICY "churches_update_policy" ON public.churches
    FOR UPDATE USING (
        auth.role() = 'service_role' OR
        (auth.jwt() ->> 'role' = 'SUPER_ADMIN') OR 
        (id = auth.jwt() ->> 'churchId' AND auth.jwt() ->> 'role' IN ('PASTOR', 'ADMINISTRADOR'))
    );

-- MEMBERS TABLE POLICIES
CREATE POLICY "members_church_access_policy" ON public.members
    FOR ALL USING (
        auth.role() = 'service_role' OR
        (auth.jwt() ->> 'role' = 'SUPER_ADMIN') OR 
        ("churchId" = auth.jwt() ->> 'churchId')
    );

-- EVENTS TABLE POLICIES  
CREATE POLICY "events_church_access_policy" ON public.events
    FOR ALL USING (
        auth.role() = 'service_role' OR
        (auth.jwt() ->> 'role' = 'SUPER_ADMIN') OR 
        ("churchId" = auth.jwt() ->> 'churchId')
    );

-- DONATIONS TABLE POLICIES
CREATE POLICY "donations_church_access_policy" ON public.donations
    FOR ALL USING (
        auth.role() = 'service_role' OR
        (auth.jwt() ->> 'role' = 'SUPER_ADMIN') OR 
        ("churchId" = auth.jwt() ->> 'churchId')
    );

-- VOLUNTEERS TABLE POLICIES
CREATE POLICY "volunteers_church_access_policy" ON public.volunteers
    FOR ALL USING (
        auth.role() = 'service_role' OR
        (auth.jwt() ->> 'role' = 'SUPER_ADMIN') OR 
        ("churchId" = auth.jwt() ->> 'churchId')
    );

-- CHECK_INS TABLE POLICIES
CREATE POLICY "check_ins_church_access_policy" ON public.check_ins
    FOR ALL USING (
        auth.role() = 'service_role' OR
        (auth.jwt() ->> 'role' = 'SUPER_ADMIN') OR 
        ("churchId" = auth.jwt() ->> 'churchId')
    );

-- COMMUNICATIONS TABLE POLICIES
CREATE POLICY "communications_church_access_policy" ON public.communications
    FOR ALL USING (
        auth.role() = 'service_role' OR
        (auth.jwt() ->> 'role' = 'SUPER_ADMIN') OR 
        ("churchId" = auth.jwt() ->> 'churchId')
    );

-- SOCIAL MEDIA POLICIES
CREATE POLICY "social_media_accounts_church_access_policy" ON public.social_media_accounts
    FOR ALL USING (
        auth.role() = 'service_role' OR
        (auth.jwt() ->> 'role' = 'SUPER_ADMIN') OR 
        ("church_id" = auth.jwt() ->> 'churchId')
    );

CREATE POLICY "social_media_posts_church_access_policy" ON public.social_media_posts
    FOR ALL USING (
        auth.role() = 'service_role' OR
        (auth.jwt() ->> 'role' = 'SUPER_ADMIN') OR 
        ("church_id" = auth.jwt() ->> 'churchId')
    );

-- PRAYER REQUESTS POLICIES
CREATE POLICY "prayer_requests_church_access_policy" ON public.prayer_requests
    FOR ALL USING (
        auth.role() = 'service_role' OR
        (auth.jwt() ->> 'role' = 'SUPER_ADMIN') OR 
        ("church_id" = auth.jwt() ->> 'churchId')
    );

-- CUSTOM FORMS POLICIES
CREATE POLICY "custom_forms_church_access_policy" ON public.custom_forms
    FOR ALL USING (
        auth.role() = 'service_role' OR
        (auth.jwt() ->> 'role' = 'SUPER_ADMIN') OR 
        ("churchId" = auth.jwt() ->> 'churchId')
    );

CREATE POLICY "custom_form_submissions_church_access_policy" ON public.custom_form_submissions
    FOR ALL USING (
        auth.role() = 'service_role' OR
        (auth.jwt() ->> 'role' = 'SUPER_ADMIN') OR 
        ("churchId" = auth.jwt() ->> 'churchId')
    );

-- ANALYTICS TABLES POLICIES
CREATE POLICY "analytics_cache_church_access_policy" ON public.analytics_cache
    FOR ALL USING (
        auth.role() = 'service_role' OR
        (auth.jwt() ->> 'role' = 'SUPER_ADMIN') OR 
        ("church_id" = auth.jwt() ->> 'churchId')
    );

CREATE POLICY "member_journeys_church_access_policy" ON public.member_journeys
    FOR ALL USING (
        auth.role() = 'service_role' OR
        (auth.jwt() ->> 'role' = 'SUPER_ADMIN') OR 
        ("church_id" = auth.jwt() ->> 'churchId')
    );

-- AUTOMATION RULES POLICIES
CREATE POLICY "automation_rules_church_access_policy" ON public.automation_rules
    FOR ALL USING (
        auth.role() = 'service_role' OR
        (auth.jwt() ->> 'role' = 'SUPER_ADMIN') OR 
        ("church_id" = auth.jwt() ->> 'churchId')
    );

-- VISITOR FOLLOW UPS POLICIES
CREATE POLICY "visitor_follow_ups_church_access_policy" ON public.visitor_follow_ups
    FOR ALL USING (
        auth.role() = 'service_role' OR
        (auth.jwt() ->> 'role' = 'SUPER_ADMIN') OR 
        ("churchId" = auth.jwt() ->> 'churchId')
    );

-- =====================================================
-- PART 3: PUBLIC ACCESS POLICIES FOR EXTERNAL FORMS
-- =====================================================

-- Allow public access to specific tables for external form submissions
-- But only for INSERT operations

-- Public visitor form submissions
CREATE POLICY "check_ins_public_insert_policy" ON public.check_ins
    FOR INSERT WITH CHECK (
        "visitorType" = 'custom_form' OR
        "visitorType" = 'public_form'
    );

-- Public custom form submissions
CREATE POLICY "custom_form_submissions_public_insert_policy" ON public.custom_form_submissions
    FOR INSERT WITH CHECK (true); -- Allow all public form submissions

-- Public prayer request submissions
CREATE POLICY "prayer_requests_public_insert_policy" ON public.prayer_requests
    FOR INSERT WITH CHECK (true); -- Allow public prayer submissions

-- =====================================================
-- PART 4: SHARED/REFERENCE DATA POLICIES
-- =====================================================

-- Allow all authenticated users to read shared reference data
CREATE POLICY "spiritual_gifts_public_read_policy" ON public.spiritual_gifts
    FOR SELECT USING (true);

CREATE POLICY "ministries_church_access_policy" ON public.ministries
    FOR ALL USING (
        auth.role() = 'service_role' OR
        (auth.jwt() ->> 'role' = 'SUPER_ADMIN') OR 
        ("church_id" = auth.jwt() ->> 'churchId')
    );

-- =====================================================
-- PART 5: PERFORMANCE OPTIMIZATIONS - INDEX CREATION
-- =====================================================

-- Add indexes to improve query performance for church-scoped queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_members_church_id ON public.members("churchId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_events_church_id ON public.events("churchId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_donations_church_id ON public.donations("churchId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_volunteers_church_id ON public.volunteers("churchId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_check_ins_church_id ON public.check_ins("churchId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_communications_church_id ON public.communications("churchId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_custom_forms_church_id ON public.custom_forms("churchId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_custom_form_submissions_church_id ON public.custom_form_submissions("churchId");

-- Indexes for common query patterns  
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_members_email ON public.members(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_donations_created_at ON public.donations("createdAt");
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_check_ins_created_at ON public.check_ins("createdAt");

-- Composite indexes for frequent multi-column queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_members_church_lifecycle ON public.members("churchId", lifecycle);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_events_church_date ON public.events("churchId", date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_donations_church_month ON public.donations("churchId", DATE_TRUNC('month', "createdAt"));

-- =====================================================
-- PART 6: FUNCTION SECURITY FIXES
-- =====================================================

-- Fix function security by setting search_path
-- This addresses the "role mutable search_path" warnings

-- Note: These would need to be recreated with proper search_path settings
-- The actual functions need to be examined and recreated with:
-- SECURITY DEFINER + SET search_path = public, pg_temp

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check RLS status after running this script
SELECT schemaname, tablename, rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('users', 'churches', 'members', 'events', 'donations')
ORDER BY tablename;

-- Check created policies  
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Test query performance
EXPLAIN (ANALYZE, BUFFERS) 
SELECT COUNT(*) FROM members WHERE "churchId" = 'test-church-id';

-- =====================================================
-- COMPLETED: This should resolve most security issues
-- Run this script in Supabase SQL Editor
-- =====================================================